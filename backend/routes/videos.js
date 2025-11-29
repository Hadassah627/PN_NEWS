const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const logActivity = require('../utils/logger');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @route   GET /api/videos
// @desc    Get all approved videos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, location, page = 1, limit = 10 } = req.query;
    
    const query = { approvalStatus: 'Approved' };
    
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');

    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Video.countDocuments(query);

    res.json({
      videos,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/videos/:id
// @desc    Get video by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/videos
// @desc    Upload video (Admin or Reporter)
// @access  Private (Admin, Reporter)
router.post('/', [authMiddleware, roleCheck('admin', 'reporter'), upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
])], async (req, res) => {
  try {
    const { title, description, category, location, duration } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: 'Video file is required' });
    }

    let videoUrl = '';
    let thumbnailUrl = '';

    // Upload video
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      videoUrl = await uploadToCloudinary(req.files.video[0].path, 'video');
    } else {
      videoUrl = `/uploads/${req.files.video[0].filename}`;
    }

    // Upload thumbnail if provided
    if (req.files.thumbnail) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        thumbnailUrl = await uploadToCloudinary(req.files.thumbnail[0].path, 'image');
      } else {
        thumbnailUrl = `/uploads/${req.files.thumbnail[0].filename}`;
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

    const video = new Video({
      title,
      description,
      category,
      location,
      videoUrl,
      thumbnailUrl,
      duration: duration || '',
      uploadedBy: uploaderDetails,
      approvalStatus
    });

    await video.save();

    await logActivity(
      'Video Uploaded',
      uploaderDetails,
      {
        resourceType: 'Video',
        resourceId: video._id,
        resourceTitle: video.title
      },
      `Video uploaded: ${video.title}`,
      req.ip
    );

    res.status(201).json({
      message: req.user.role === 'admin' ? 'Video published successfully' : 'Video submitted for approval',
      video
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/videos/:id
// @desc    Update video
// @access  Private (Admin, Reporter)
router.put('/:id', [authMiddleware, roleCheck('admin', 'reporter'), upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
])], async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (req.user.role === 'reporter') {
      if (video.uploadedBy.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You can only edit your own videos' });
      }
      if (video.approvalStatus === 'Approved') {
        return res.status(403).json({ message: 'Cannot edit approved videos' });
      }
    }

    const { title, description, category, location, duration } = req.body;

    if (title) video.title = title;
    if (description) video.description = description;
    if (category) video.category = category;
    if (location) video.location = location;
    if (duration) video.duration = duration;

    if (req.files) {
      if (req.files.video) {
        if (process.env.CLOUDINARY_CLOUD_NAME) {
          video.videoUrl = await uploadToCloudinary(req.files.video[0].path, 'video');
        } else {
          video.videoUrl = `/uploads/${req.files.video[0].filename}`;
        }
      }

      if (req.files.thumbnail) {
        if (process.env.CLOUDINARY_CLOUD_NAME) {
          video.thumbnailUrl = await uploadToCloudinary(req.files.thumbnail[0].path, 'image');
        } else {
          video.thumbnailUrl = `/uploads/${req.files.thumbnail[0].filename}`;
        }
      }
    }

    if (req.user.role === 'reporter' && video.approvalStatus === 'Rejected') {
      video.approvalStatus = 'Pending';
      video.rejectionReason = '';
    }

    video.updatedAt = Date.now();
    await video.save();

    await logActivity(
      'Video Updated',
      {
        userId: req.user.id,
        userType: req.user.role === 'admin' ? 'Admin' : 'Reporter',
        reporterId: req.user.reporterId
      },
      {
        resourceType: 'Video',
        resourceId: video._id,
        resourceTitle: video.title
      },
      `Video updated: ${video.title}`,
      req.ip
    );

    res.json({ message: 'Video updated successfully', video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/videos/:id
// @desc    Delete video
// @access  Private (Admin, Reporter)
router.delete('/:id', [authMiddleware, roleCheck('admin', 'reporter')], async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (req.user.role === 'reporter' && video.uploadedBy.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own videos' });
    }

    await Video.findByIdAndDelete(req.params.id);

    await logActivity(
      'Video Deleted',
      {
        userId: req.user.id,
        userType: req.user.role === 'admin' ? 'Admin' : 'Reporter',
        reporterId: req.user.reporterId
      },
      {
        resourceType: 'Video',
        resourceId: video._id,
        resourceTitle: video.title
      },
      `Video deleted: ${video.title}`,
      req.ip
    );

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/videos/reporter/my-videos
// @desc    Get reporter's own videos
// @access  Private (Reporter)
router.get('/reporter/my-videos', [authMiddleware, roleCheck('reporter')], async (req, res) => {
  try {
    const videos = await Video.find({ 'uploadedBy.userId': req.user.id })
      .sort({ createdAt: -1 });

    res.json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
