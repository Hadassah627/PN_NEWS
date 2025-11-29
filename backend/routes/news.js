const express = require('express');
const router = express.Router();
const News = require('../models/News');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const logActivity = require('../utils/logger');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @route   GET /api/news
// @desc    Get all approved news (for users)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, location, reporter, search, page = 1, limit = 10 } = req.query;
    
    const query = { approvalStatus: 'Approved' };
    
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (reporter) query['uploadedBy.reporterId'] = reporter;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') }
      ];
    }

    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await News.countDocuments(query);

    res.json({
      news,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/news/:id
// @desc    Get news by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/news
// @desc    Create news (Admin or Reporter)
// @access  Private (Admin, Reporter)
router.post('/', [authMiddleware, roleCheck('admin', 'reporter'), upload.single('thumbnail')], async (req, res) => {
  try {
    const { title, content, category, location } = req.body;

    if (!title || !content || !category || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let thumbnailUrl = '';
    if (req.file) {
      // Upload to Cloudinary if configured, otherwise use local path
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        thumbnailUrl = await uploadToCloudinary(req.file.path, 'image');
      } else {
        thumbnailUrl = `/uploads/${req.file.filename}`;
      }
    }

    // Determine approval status based on role
    const approvalStatus = req.user.role === 'admin' ? 'Approved' : 'Pending';

    // Get uploader details
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

    const news = new News({
      title,
      content,
      category,
      location,
      thumbnailUrl,
      uploadedBy: uploaderDetails,
      approvalStatus
    });

    await news.save();

    // Log activity
    await logActivity(
      'News Created',
      uploaderDetails,
      {
        resourceType: 'News',
        resourceId: news._id,
        resourceTitle: news.title
      },
      `${req.user.role === 'admin' ? 'Admin' : 'Reporter'} created news: ${news.title}`,
      req.ip
    );

    res.status(201).json({
      message: req.user.role === 'admin' ? 'News published successfully' : 'News submitted for approval',
      news
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/news/:id
// @desc    Update news (Reporter can update only pending/rejected, Admin can update any)
// @access  Private (Admin, Reporter)
router.put('/:id', [authMiddleware, roleCheck('admin', 'reporter'), upload.single('thumbnail')], async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Reporter can only edit their own pending or rejected news
    if (req.user.role === 'reporter') {
      if (news.uploadedBy.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You can only edit your own news' });
      }
      if (news.approvalStatus === 'Approved') {
        return res.status(403).json({ message: 'Cannot edit approved news' });
      }
    }

    const { title, content, category, location } = req.body;

    if (title) news.title = title;
    if (content) news.content = content;
    if (category) news.category = category;
    if (location) news.location = location;

    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        news.thumbnailUrl = await uploadToCloudinary(req.file.path, 'image');
      } else {
        news.thumbnailUrl = `/uploads/${req.file.filename}`;
      }
    }

    // Reset to pending if reporter edits rejected news
    if (req.user.role === 'reporter' && news.approvalStatus === 'Rejected') {
      news.approvalStatus = 'Pending';
      news.rejectionReason = '';
    }

    news.updatedAt = Date.now();
    await news.save();

    // Log activity
    await logActivity(
      'News Updated',
      {
        userId: req.user.id,
        userType: req.user.role === 'admin' ? 'Admin' : 'Reporter',
        reporterId: req.user.reporterId
      },
      {
        resourceType: 'News',
        resourceId: news._id,
        resourceTitle: news.title
      },
      `News updated: ${news.title}`,
      req.ip
    );

    res.json({ message: 'News updated successfully', news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/news/:id
// @desc    Delete news (Admin or Reporter can delete their own)
// @access  Private (Admin, Reporter)
router.delete('/:id', [authMiddleware, roleCheck('admin', 'reporter')], async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Reporter can only delete their own news
    if (req.user.role === 'reporter' && news.uploadedBy.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own news' });
    }

    await News.findByIdAndDelete(req.params.id);

    // Log activity
    await logActivity(
      'News Deleted',
      {
        userId: req.user.id,
        userType: req.user.role === 'admin' ? 'Admin' : 'Reporter',
        reporterId: req.user.reporterId
      },
      {
        resourceType: 'News',
        resourceId: news._id,
        resourceTitle: news.title
      },
      `News deleted: ${news.title}`,
      req.ip
    );

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/news/reporter/my-news
// @desc    Get reporter's own news
// @access  Private (Reporter)
router.get('/reporter/my-news', [authMiddleware, roleCheck('reporter')], async (req, res) => {
  try {
    const news = await News.find({ 'uploadedBy.userId': req.user.id })
      .sort({ createdAt: -1 });

    res.json({ news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
