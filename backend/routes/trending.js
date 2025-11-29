const express = require('express');
const router = express.Router();
const TrendingNews = require('../models/TrendingNews');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const logActivity = require('../utils/logger');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @route   GET /api/trending
// @desc    Get all approved trending news
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, location, page = 1, limit = 10 } = req.query;
    
    const query = { approvalStatus: 'Approved' };
    
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');

    const trending = await TrendingNews.find(query)
      .sort({ trendingScore: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await TrendingNews.countDocuments(query);

    res.json({
      trending,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trending/:id
// @desc    Get trending news by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const trending = await TrendingNews.findById(req.params.id);
    
    if (!trending) {
      return res.status(404).json({ message: 'Trending news not found' });
    }

    res.json(trending);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/trending
// @desc    Create trending news (Admin or Reporter)
// @access  Private (Admin, Reporter)
router.post('/', [authMiddleware, roleCheck('admin', 'reporter'), upload.single('thumbnail')], async (req, res) => {
  try {
    const { title, content, category, location, trendingScore } = req.body;

    if (!title || !content || !category || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let thumbnailUrl = '';
    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        thumbnailUrl = await uploadToCloudinary(req.file.path, 'image');
      } else {
        thumbnailUrl = `/uploads/${req.file.filename}`;
      }
    }

    const approvalStatus = req.user.role === 'admin' ? 'Approved' : 'Pending';

    let uploaderDetails = {
      userId: req.user.id,
      userType: req.user.role === 'admin' ? 'Admin' : 'Reporter'
    };

    if (req.user.role === 'reporter') {
      const Reporter = require('../models/Reporter');
      const reporter = await Reporter.findById(req.user.id);
      uploaderDetails.name = reporter.name;
      uploaderDetails.reporterId = reporter.reporterId;
    } else {
      uploaderDetails.name = 'Administrator';
    }

    const trending = new TrendingNews({
      title,
      content,
      category,
      location,
      thumbnailUrl,
      uploadedBy: uploaderDetails,
      approvalStatus,
      trendingScore: trendingScore || 0
    });

    await trending.save();

    await logActivity(
      'Trending News Created',
      uploaderDetails,
      {
        resourceType: 'TrendingNews',
        resourceId: trending._id,
        resourceTitle: trending.title
      },
      `Trending news created: ${trending.title}`,
      req.ip
    );

    res.status(201).json({
      message: req.user.role === 'admin' ? 'Trending news published successfully' : 'Trending news submitted for approval',
      trending
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/trending/:id
// @desc    Update trending news
// @access  Private (Admin, Reporter)
router.put('/:id', [authMiddleware, roleCheck('admin', 'reporter'), upload.single('thumbnail')], async (req, res) => {
  try {
    const trending = await TrendingNews.findById(req.params.id);

    if (!trending) {
      return res.status(404).json({ message: 'Trending news not found' });
    }

    if (req.user.role === 'reporter') {
      if (trending.uploadedBy.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You can only edit your own trending news' });
      }
      if (trending.approvalStatus === 'Approved') {
        return res.status(403).json({ message: 'Cannot edit approved trending news' });
      }
    }

    const { title, content, category, location, trendingScore } = req.body;

    if (title) trending.title = title;
    if (content) trending.content = content;
    if (category) trending.category = category;
    if (location) trending.location = location;
    if (trendingScore !== undefined && req.user.role === 'admin') trending.trendingScore = trendingScore;

    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        trending.thumbnailUrl = await uploadToCloudinary(req.file.path, 'image');
      } else {
        trending.thumbnailUrl = `/uploads/${req.file.filename}`;
      }
    }

    if (req.user.role === 'reporter' && trending.approvalStatus === 'Rejected') {
      trending.approvalStatus = 'Pending';
      trending.rejectionReason = '';
    }

    trending.updatedAt = Date.now();
    await trending.save();

    await logActivity(
      'Trending News Updated',
      {
        userId: req.user.id,
        userType: req.user.role === 'admin' ? 'Admin' : 'Reporter',
        reporterId: req.user.reporterId
      },
      {
        resourceType: 'TrendingNews',
        resourceId: trending._id,
        resourceTitle: trending.title
      },
      `Trending news updated: ${trending.title}`,
      req.ip
    );

    res.json({ message: 'Trending news updated successfully', trending });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/trending/:id
// @desc    Delete trending news
// @access  Private (Admin, Reporter)
router.delete('/:id', [authMiddleware, roleCheck('admin', 'reporter')], async (req, res) => {
  try {
    const trending = await TrendingNews.findById(req.params.id);

    if (!trending) {
      return res.status(404).json({ message: 'Trending news not found' });
    }

    if (req.user.role === 'reporter' && trending.uploadedBy.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own trending news' });
    }

    await TrendingNews.findByIdAndDelete(req.params.id);

    await logActivity(
      'Trending News Deleted',
      {
        userId: req.user.id,
        userType: req.user.role === 'admin' ? 'Admin' : 'Reporter',
        reporterId: req.user.reporterId
      },
      {
        resourceType: 'TrendingNews',
        resourceId: trending._id,
        resourceTitle: trending.title
      },
      `Trending news deleted: ${trending.title}`,
      req.ip
    );

    res.json({ message: 'Trending news deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trending/reporter/my-trending
// @desc    Get reporter's own trending news
// @access  Private (Reporter)
router.get('/reporter/my-trending', [authMiddleware, roleCheck('reporter')], async (req, res) => {
  try {
    const trending = await TrendingNews.find({ 'uploadedBy.userId': req.user.id })
      .sort({ createdAt: -1 });

    res.json({ trending });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
