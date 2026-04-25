import Application from '../models/application.model.js';

// @desc   Get analytics for the logged-in user
// @route  GET /api/analytics
// @access Private
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total applications
    const total = await Application.countDocuments({ user: userId });

    // Status-wise count
    const statusBreakdown = await Application.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
    ]);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyTrend = await Application.aggregate([
      {
        $match: {
          user: userId,
          appliedDate: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$appliedDate' },
            month: { $month: '$appliedDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
        },
      },
    ]);

    // Format monthly trend with month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthly = monthlyTrend.map((item) => ({
      name: `${monthNames[item.month - 1]} ${item.year}`,
      applications: item.count,
    }));

    res.status(200).json({
      success: true,
      data: {
        total,
        statusBreakdown,
        monthlyTrend: formattedMonthly,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
