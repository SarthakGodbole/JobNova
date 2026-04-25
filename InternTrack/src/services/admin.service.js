import api from '../lib/axios';

export const getAdminApplications = async () => {
  const { data } = await api.get('/admin/applications');
  return Array.isArray(data?.data) ? data.data : [];
};

export const getAdminUsers = async () => {
  const { data } = await api.get('/admin/users');
  return Array.isArray(data?.data) ? data.data : [];
};

export const getAdminStats = async () => {
  const { data } = await api.get('/admin/stats');
  const payload = data?.data || {};
  return {
    totalUsers: payload.totalUsers || 0,
    totalApplications: payload.totalApplications || 0,
    activeInterviews: payload.activeInterviews || 0,
    offersSecured: payload.offersSecured || 0,
    statusBreakdown: payload.statusBreakdown || []
  };
};