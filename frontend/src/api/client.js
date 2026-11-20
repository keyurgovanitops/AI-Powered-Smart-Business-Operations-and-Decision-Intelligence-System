import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchKPIs = () => api.get('/analytics/kpis', { timeout: 8000 });
export const sendChatMessage = (question) => api.post('/analytics/chat', { question }, { timeout: 10000 });
export const runAgentCrew = () => api.post('/agents/run', {}, { timeout: 12000 });
export const fetchPendingApprovals = () => api.get('/approvals/pending');
export const submitApproval = (id, decision, decision_by, decision_notes) => 
  api.post(`/approvals/${id}/decide`, { decision, decision_by, decision_notes });
export const fetchReports = () => api.get('/reports/');
export const fetchLatestReport = () => api.get('/reports/latest');
export const getDatasetStatus = () => api.get('/dataset/status');
export const seedDataset = () => api.post('/dataset/seed');

export const downloadPdfFile = async (reportId) => {
  if (!reportId) return;
  try {
    const res = await fetch(`/api/reports/${reportId}/pdf`);
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EVA_Audit_Report_${reportId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => window.URL.revokeObjectURL(url), 2000);
  } catch (e) {
    // Fallback: direct anchor trigger
    const a = document.createElement('a');
    a.href = `/api/reports/${reportId}/pdf`;
    a.download = `EVA_Audit_Report_${reportId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

export default api;
