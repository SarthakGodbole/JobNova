import Application from '../models/application.model.js';
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
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
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
