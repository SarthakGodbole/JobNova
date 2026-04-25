import api from '../lib/axios';

export const getApplications = async (params) => {
  const { data } = await api.get('/applications', { params });
  return Array.isArray(data?.data) ? data.data : [];
};

export const getApplicationById = async (id) => {
  const { data } = await api.get(`/applications/${id}`);
  return data?.data || null;
};

export const createApplication = async (applicationData) => {
  const { data } = await api.post('/applications', applicationData);
  return data?.data || null;
};

export const updateApplication = async (id, applicationData) => {
  const { data } = await api.put(`/applications/${id}`, applicationData);
  return data?.data || null;
};

export const deleteApplication = async (id) => {
  const { data } = await api.delete(`/applications/${id}`);
  return data;
};

export const getAnalytics = async () => {
  const { data } = await api.get('/analytics');
  const payload = data?.data || { total: 0, statusBreakdown: [], monthlyTrend: [] };
  
  const total = payload.total || 0;
  const breakdown = payload.statusBreakdown || [];

  const interviewStages = ['technical interview', 'hr interview', 'online assessment', 'interviewing'];
  const interviewCount = breakdown
    .filter(s => interviewStages.includes((s.name || '').toLowerCase()))
    .reduce((sum, s) => sum + (s.value || 0), 0);

  const offerCount = breakdown
    .filter(s => ['offer', 'offered'].includes((s.name || '').toLowerCase()))
    .reduce((sum, s) => sum + (s.value || 0), 0);

  return {
    summary: {
      totalApplications: total,
      interviewRate: total > 0 ? `${Math.round((interviewCount / total) * 100)}%` : '0%',
      offerRate: total > 0 ? `${Math.round((offerCount / total) * 100)}%` : '0%'
    },
    monthlyTrend: payload.monthlyTrend || [],
    statusBreakdown: breakdown
  };
};

export const getApplicationStats = async () => {
  const apps = await getApplications();
  return {
    total: apps.length,
    interviewing: apps.filter(app => {
      const s = (app.status || '').toLowerCase();
      return s.includes('interview') || s === 'online assessment';
    }).length,
    offered: apps.filter(app => {
      const s = (app.status || '').toLowerCase();
      return s === 'offer' || s === 'offered';
    }).length
  };
};