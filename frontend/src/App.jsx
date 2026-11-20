import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import DashboardView from './components/DashboardView';
import AgentCrewView from './components/AgentCrewView';
import ChatView from './components/ChatView';
import ApprovalsView from './components/ApprovalsView';
import DatasetView from './components/DatasetView';
import ReportsView from './components/ReportsView';
import AdminView from './components/AdminView';
import SettingsView from './components/SettingsView';
import { fetchKPIs, fetchPendingApprovals, fetchLatestReport, runAgentCrew } from './api/client';
import { Loader2, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import axios from 'axios';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [kpis, setKpis] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [latestReport, setLatestReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningCrew, setRunningCrew] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState({
    id: 1,
    full_name: 'Vikramaditya Singhania',
    role: 'Chief Risk Officer',
    email: 'cro@evabank.ai',
    company_name: 'EVA Commercial Bank'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [kpiRes, appRes, repRes] = await Promise.allSettled([
        fetchKPIs(),
        fetchPendingApprovals(),
        fetchLatestReport()
      ]);

      if (kpiRes.status === 'fulfilled') setKpis(kpiRes.value.data);
      if (appRes.status === 'fulfilled') setPendingApprovals(appRes.value.data);
      if (repRes.status === 'fulfilled') setLatestReport(repRes.value.data);

      // Check user session
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userRes = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(userRes.data);
        } catch {
          // keep default officer
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunCrew = async () => {
    if (runningCrew) return;
    setRunningCrew(true);
    setActiveTab('agents');
    try {
      const res = await runAgentCrew();
      setLatestReport(res.data);
      await loadData();
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      showToast(`Multi-Agent Crew Analysis completed! Generated Audit Dossier #${res.data.id}.`, 'success');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Multi-Agent crew execution timed out or failed.', 'error');
    } finally {
      setRunningCrew(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    showToast('Signed out of executive session.', 'info');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border animate-fade-in bg-white border-slate-200">
          {toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span className="text-xs font-semibold text-slate-800">{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingApprovals.length}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Navbar */}
        <Navbar
          activeTab={activeTab}
          onRunCrew={handleRunCrew}
          runningCrew={runningCrew}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* Dynamic Body Content */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
          {loading && !kpis ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-xs font-semibold">Connecting to Core Banking Database Ledgers...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardView kpis={kpis} />}
              {activeTab === 'agents' && (
                <AgentCrewView 
                  latestReport={latestReport} 
                  runningCrew={runningCrew}
                  onRunCrew={handleRunCrew}
                  onReportGenerated={(newRep) => {
                    setLatestReport(newRep);
                    loadData();
                    showToast(`Audit Dossier #${newRep.id} successfully recorded!`, 'success');
                  }}
                />
              )}
              {activeTab === 'chat' && <ChatView />}
              {activeTab === 'approval' && (
                <ApprovalsView 
                  user={user} 
                  onDecisionMade={() => {
                    loadData();
                    showToast('Governance decision recorded in audit log.', 'success');
                  }} 
                />
              )}
              {activeTab === 'dataset' && <DatasetView />}
              {activeTab === 'reports' && <ReportsView />}
              {activeTab === 'admin' && <AdminView user={user} />}
              {activeTab === 'settings' && <SettingsView user={user} />}
            </>
          )}
        </main>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => {
          setUser(u);
          showToast(`Authenticated as ${u.full_name} (${u.role})`, 'success');
        }}
      />
    </div>
  );
}
