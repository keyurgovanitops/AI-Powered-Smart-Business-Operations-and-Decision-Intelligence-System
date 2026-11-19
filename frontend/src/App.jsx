import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KPICards from './components/KPICards';
import ChartsSection from './components/ChartsSection';
import AgentCrewMonitor from './components/AgentCrewMonitor';
import ApprovalDesk from './components/ApprovalDesk';
import ChatBot from './components/ChatBot';
import ReportsViewer from './components/ReportsViewer';
import ToyFeaturesZone from './components/ToyFeaturesZone';
import TourGuide from './components/TourGuide';
import { fetchKPIs, fetchPendingApprovals, fetchLatestReport } from './api/client';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [kpis, setKpis] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [latestReport, setLatestReport] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white relative">
      {/* Interactive Animated Hinglish Tour Guide (Bunty AI) */}
      <TourGuide activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Sticky Header with Non-Production Pin */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pendingCount={pendingApprovals.length} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        {loading && !kpis ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-xs font-semibold">Bank Data Load Ho Raha Hai... Kripya Wait Karein</p>
          </div>
        ) : (
          <>
            {/* View: Dashboard (Paiso Ka Hisab) */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                <KPICards kpis={kpis} />
                <ChartsSection kpis={kpis} />
              </div>
            )}

            {/* View: 6 Multi-Agents Crew */}
            {activeTab === 'agents' && (
              <div className="animate-fade-in">
                <AgentCrewMonitor 
                  latestReport={latestReport} 
                  onReportGenerated={(newRep) => {
                    setLatestReport(newRep);
                    loadData();
                  }} 
                />
              </div>
            )}

            {/* View: AI Chat (Charcha AI) */}
            {activeTab === 'chat' && (
              <div className="animate-fade-in">
                <ChatBot />
              </div>
            )}

            {/* View: Approval Desk (Human-in-the-Loop) */}
            {activeTab === 'approval' && (
              <div className="animate-fade-in">
                <ApprovalDesk onDecisionMade={loadData} />
              </div>
            )}

            {/* View: Reports & Audit */}
            {activeTab === 'reports' && (
              <div className="animate-fade-in">
                <ReportsViewer />
              </div>
            )}

            {/* View: Toy Features Zone */}
            {activeTab === 'toys' && (
              <div className="animate-fade-in">
                <ToyFeaturesZone />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Apex Commercial Bank Decision Intelligence System • React 19 + FastAPI + CrewAI + Gemini 3.5 Flash
        </p>
        <p className="text-[10px] text-slate-600 mt-1">
          Synthetic Dataset Period: May 1, 2026 – October 31, 2026 • Academic & Evaluation Prototype
        </p>
      </footer>
    </div>
  );
}
