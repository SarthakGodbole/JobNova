import User from '../models/user.model.js';
import Application from '../models/application.model.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Get all applications (populate user name & email)
//  GET /api/admin/applications
//  Admin
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get platform-level stats
// @route  GET /api/admin/stats
// @access Admin
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalApplications = await Application.countDocuments();

    const statusBreakdown = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
    ]);

    res.status(200).json({
      success: true,
      data: { totalUsers, totalApplications, statusBreakdown },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
