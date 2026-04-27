import Application from '../models/application.model.js';
import { sendNotificationEmail } from '../utils/emailNotifications.js';

const getEmailTemplate = (app, message) => `
  <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
    <h2 style="color: #6366f1;">JobNova Tracker</h2>
    <p style="font-size: 16px;">${message}</p>
    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 15px;">
      <p style="margin: 8px 0;"><strong>Company:</strong> ${app.company}</p>
      <p style="margin: 8px 0;"><strong>Role:</strong> ${app.role}</p>
      <p style="margin: 8px 0;"><strong>Status:</strong> <span style="background: #e0e7ff; color: #4338ca; padding: 4px 8px; border-radius: 6px; font-size: 14px; font-weight: 600;">${app.status || 'Applied'}</span></p>
      <p style="margin: 8px 0;"><strong>Applied:</strong> ${app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}</p>
      ${app.jobLink ? `<p style="margin: 8px 0;"><strong>Link:</strong> <a href="${app.jobLink}" style="color: #3b82f6;">View Job Listing</a></p>` : ''}
    </div>
    <p style="margin-top: 24px; font-size: 12px; color: #94a3b8;">Log in to JobNova to manage your applications and reminders.</p>
  </div>
`;

export const createApplication = async (req, res) => {
  try {
    const { company, role, status, appliedDate, deadline, jobLink, notes, location, salary } = req.body;

    if (!company || !role) {
      return res.status(400).json({ success: false, message: 'Company and role are required' });
    }

    const application = await Application.create({
      user: req.user.id,
      company,
      role,
      status,
      appliedDate,
      deadline,
      jobLink,
      notes,
      location,
      salary,
    });

    // Email notification logic
    if (req.user.email) {
      sendNotificationEmail(
        req.user.email,
        'New Application Added - JobNova',
        getEmailTemplate(application, `You successfully added an application for <strong>${application.role}</strong> at <strong>${application.company}</strong>.`)
      );
    }

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all applications for the logged-in user
// @route  GET /api/applications
// @access Private
export const getApplications = async (req, res) => {
  try {
    const { status, search, sort } = req.query;
    const filter = { user: req.user.id };

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = sort === 'oldest' ? { appliedDate: 1 } : { appliedDate: -1 };

    const applications = await Application.find(filter).sort(sortOrder);
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get a single application
// @route  GET /api/applications/:id
// @access Private
export const getApplication = async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.user.id });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update an application
// @route  PUT /api/applications/:id
// @access Private
export const updateApplication = async (req, res) => {
  try {
    const oldApplication = await Application.findOne({ _id: req.params.id, user: req.user.id });
    if (!oldApplication) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    // Email logic: Check if status actually changed
    if (req.body.status && oldApplication.status !== req.body.status && req.user.email) {
      const interviewStages = ['Online Assessment', 'Technical Interview', 'HR Interview'];
      let subject = 'Application Status Updated - JobNova';
      let msg = `Your application status for <strong>${application.company}</strong> has been updated successfully.`;

      if (interviewStages.includes(req.body.status)) {
        subject = 'Interview Reminder - JobNova';
        msg = `Congratulations! You've been moved to the <strong>${req.body.status}</strong> stage at <strong>${application.company}</strong>. Please ensure you track any upcoming dates!`;
      }

      sendNotificationEmail(req.user.email, subject, getEmailTemplate(application, msg));
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete an application
// @route  DELETE /api/applications/:id
// @access Private
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.status(200).json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
