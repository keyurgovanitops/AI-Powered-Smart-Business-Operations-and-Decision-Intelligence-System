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
import SettingsView from './components/SettingsView';
import { fetchKPIs, fetchPendingApprovals, fetchLatestReport, runAgentCrew } from './api/client';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [kpis, setKpis] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [latestReport, setLatestReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningCrew, setRunningCrew] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState({
    id: 1,
    full_name: 'Vikramaditya Singhania',
    role: 'Chief Risk Officer',
    email: 'manager@apexbank.com',
    company_name: 'Apex Commercial Bank'
  });

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
    setRunningCrew(true);
    try {
      const res = await runAgentCrew();
      setLatestReport(res.data);
      await loadData();
      setActiveTab('agents');
    } catch (err) {
      alert(err.response?.data?.detail || 'Multi-Agent crew execution failed.');
    } finally {
      setRunningCrew(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
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
                  onReportGenerated={(newRep) => {
                    setLatestReport(newRep);
                    loadData();
                  }}
                />
              )}
              {activeTab === 'chat' && <ChatView />}
              {activeTab === 'approval' && <ApprovalsView user={user} />}
              {activeTab === 'dataset' && <DatasetView />}
              {activeTab === 'reports' && <ReportsView />}
              {activeTab === 'settings' && <SettingsView user={user} />}
            </>
          )}
        </main>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />
    </div>
  );
}
