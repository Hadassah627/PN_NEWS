const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const News = require('../models/News');
const TrendingNews = require('../models/TrendingNews');
const Video = require('../models/Video');
const Reporter = require('../models/Reporter');
const ActivityLog = require('../models/ActivityLog');
const logActivity = require('../utils/logger');

// @route   GET /api/admin/pending-approvals
// @desc    Get all pending content for approval
// @access  Private (Admin only)
router.get('/pending-approvals', [authMiddleware, roleCheck('admin')], async (req, res) => {
  try {
    const pendingNews = await News.find({ approvalStatus: 'Pending' })
      .sort({ createdAt: -1 });
    
    const pendingTrending = await TrendingNews.find({ approvalStatus: 'Pending' })
      .sort({ createdAt: -1 });
    
    const pendingVideos = await Video.find({ approvalStatus: 'Pending' })
      .sort({ createdAt: -1 });

    res.json({
      news: pendingNews,
      trending: pendingTrending,
      videos: pendingVideos,
      total: pendingNews.length + pendingTrending.length + pendingVideos.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/approve/news/:id
// @desc    Approve news
// @access  Private (Admin only)
router.put('/approve/news/:id', [authMiddleware, roleCheck('admin')], async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    news.approvalStatus = 'Approved';
    news.rejectionReason = '';
    await news.save();

    await logActivity(
      'News Approved',
      {
        userId: req.user.id,
        userType: 'Admin',
        email: req.user.email
      },
      {
        resourceType: 'News',
        resourceId: news._id,
        resourceTitle: news.title
      },
      `Admin approved news: ${news.title}`,
      req.ip
    );

    res.json({ message: 'News approved successfully', news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/reject/news/:id
// @desc    Reject news
// @access  Private (Admin only)
router.put('/reject/news/:id', [authMiddleware, roleCheck('admin')], async (req, res) => {
  try {
    const { reason } = req.body;
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    news.approvalStatus = 'Rejected';
    news.rejectionReason = reason || 'Content does not meet guidelines';
    await news.save();

    await logActivity(
      'News Rejected',
      {
        userId: req.user.id,
        userType: 'Admin',
        email: req.user.email
      },
      {
        resourceType: 'News',
        resourceId: news._id,
        resourceTitle: news.title
      },
      `Admin rejected news: ${news.title}. Reason: ${news.rejectionReason}`,
      req.ip
    );

    res.json({ message: 'News rejected', news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/approve/trending/:id
// @desc    Approve trending news
// @access  Private (Admin only)
router.put('/approve/trending/:id', [authMiddleware, roleCheck('admin')], async (req, res) => {
  try {
    const trending = await TrendingNews.findById(req.params.id);

    if (!trending) {
      return res.status(404).json({ message: 'Trending news not found' });
    }

    trending.approvalStatus = 'Approved';
    trending.rejectionReason = '';
    await trending.save();

    await logActivity(
      'Trending News Approved',
      {
        userId: req.user.id,
        userType: 'Admin',
        email: req.user.email
      },
      {
        resourceType: 'TrendingNews',
        resourceId: trending._id,
        resourceTitle: trending.title
      },
      `Admin approved trending news: ${trending.title}`,
      req.ip
    );

    res.json({ message: 'Trending news approved successfully', trending });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/reject/trending/:id
// @desc    Reject trending news
// @access  Private (Admin only)
router.put('/reject/trending/:id', [authMiddleware, roleCheck('admin')], async (req, res) => {
  try {
    const { reason } = req.body;
    const trending = await TrendingNews.findById(req.params.id);

    if (!trending) {
      return res.status(404).json({ message: 'Trending news not found' });
    }

    trending.approvalStatus = 'Rejected';
    trending.rejectionReason = reason || 'Content does not meet guidelines';
    await trending.save();

    await logActivity(
      'Trending News Rejected',
      {
        userId: req.user.id,
        userType: 'Admin',
        email: req.user.email
      },
      {
        resourceType: 'TrendingNews',
        resourceId: trending._id,
        resourceTitle: trending.title
      },
      `Admin rejected trending news: ${trending.title}. Reason: ${trending.rejectionReason}`,
      req.ip
    );

    res.json({ message: 'Trending news rejected', trending });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/approve/video/:id
// @desc    Approve video
// @access  Private (Admin only)
router.put('/approve/video/:id', [authMiddleware, roleCheck('admin')], async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.approvalStatus = 'Approved';
    video.rejectionReason = '';
    await video.save();

    await logActivity(
      'Video Approved',
      {
        userId: req.user.id,
        userType: 'Admin',
        email: req.user.email
      },
      {
        resourceType: 'Video',
        resourceId: video._id,
        resourceTitle: video.title
      },
      `Admin approved video: ${video.title}`,
      req.ip
    );

    res.json({ message: 'Video approved successfully', video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/reject/video/:id
// @desc    Reject video
// @access  Private (Admin only)
router.put('/reject/video/:id', [authMiddleware, roleCheck('admin')], async (req, res) => {
  try {
    const { reason } = req.body;
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.approvalStatus = 'Rejected';
    video.rejectionReason = reason || 'Content does not meet guidelines';
    await video.save();

    await logActivity(
      'Video Rejected',
      {
        userId: req.user.id,
        userType: 'Admin',
        email: req.user.email
      },
      {
        resourceType: 'Video',
        resourceId: video._id,
        resourceTitle: video.title
      },
      `Admin rejected video: ${video.title}. Reason: ${video.rejectionReason}`,
      req.ip
    );

    res.json({ message: 'Video rejected', video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/reporters
// @desc    Get all reporters
// @access  Private (Admin only)
router.get('/reporters', [authMiddleware, roleCheck('admin')], async (req, res) => {
  try {
    const reporters = await Reporter.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ reporters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/reporter/:id/toggle-status
// @desc    Activate/Deactivate reporter
// @access  Private (Admin only)
router.put('/reporter/:id/toggle-status', [authMiddleware, roleCheck('admin')], async (req, res) => {
  try {
    const reporter = await Reporter.findById(req.params.id);

    if (!reporter) {
      return res.status(404).json({ message: 'Reporter not found' });
    }

    reporter.isActive = !reporter.isActive;
    await reporter.save();

    await logActivity(
      reporter.isActive ? 'Reporter Activated' : 'Reporter Deactivated',
      {
        userId: req.user.id,
        userType: 'Admin',
        email: req.user.email
      },
      {
        resourceType: 'Reporter',
        resourceId: reporter._id,
        resourceTitle: reporter.name
      },
      `Admin ${reporter.isActive ? 'activated' : 'deactivated'} reporter: ${reporter.reporterId}`,
      req.ip
    );

    res.json({ 
      message: `Reporter ${reporter.isActive ? 'activated' : 'deactivated'} successfully`,
      reporter: {
        id: reporter._id,
        reporterId: reporter.reporterId,
        name: reporter.name,
        isActive: reporter.isActive
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/activity-logs
// @desc    Get all activity logs
// @access  Private (Admin only)
router.get('/activity-logs', [authMiddleware, roleCheck('admin')], async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await ActivityLog.countDocuments();

    res.json({
      logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/stats', [authMiddleware, roleCheck('admin')], async (req, res) => {
  try {
    const totalNews = await News.countDocuments();
    const approvedNews = await News.countDocuments({ approvalStatus: 'Approved' });
    const pendingNews = await News.countDocuments({ approvalStatus: 'Pending' });
    const rejectedNews = await News.countDocuments({ approvalStatus: 'Rejected' });

    const totalTrending = await TrendingNews.countDocuments();
    const pendingTrending = await TrendingNews.countDocuments({ approvalStatus: 'Pending' });

    const totalVideos = await Video.countDocuments();
    const pendingVideos = await Video.countDocuments({ approvalStatus: 'Pending' });

    const totalReporters = await Reporter.countDocuments();
    const activeReporters = await Reporter.countDocuments({ isActive: true });

    res.json({
      news: {
        total: totalNews,
        approved: approvedNews,
        pending: pendingNews,
        rejected: rejectedNews
      },
      trending: {
        total: totalTrending,
        pending: pendingTrending
      },
      videos: {
        total: totalVideos,
        pending: pendingVideos
      },
      reporters: {
        total: totalReporters,
        active: activeReporters,
        inactive: totalReporters - activeReporters
      },
      pendingApprovals: pendingNews + pendingTrending + pendingVideos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
