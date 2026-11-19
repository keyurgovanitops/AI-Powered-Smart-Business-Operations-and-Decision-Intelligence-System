import React from 'react';
import { 
  Building2, 
  BarChart3, 
  Bot, 
  MessageSquare, 
  CheckCircle2, 
  FileText, 
  Gamepad2, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, pendingCount = 0 }) {
  const tabs = [
    { id: 'dashboard', label: 'Paiso Ka Hisab', sub: 'KPI Dashboard', icon: BarChart3 },
    { id: 'agents', label: 'AI Baithak', sub: '6 Multi-Agents', icon: Bot },
    { id: 'chat', label: 'Charcha AI', sub: 'Ask Questions', icon: MessageSquare },
    { id: 'approval', label: 'Manager Desk', sub: 'Human-in-Loop', icon: CheckCircle2, badge: pendingCount },
    { id: 'reports', label: 'Pakka Report', sub: 'Audit & PDF', icon: FileText },
    { id: 'toys', label: 'Khilona Zone', sub: 'Toy Features', icon: Gamepad2, isToy: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* ⚠️ Mandatory Non-Production Sticky Pin Banner */}
      <div 
        id="header-pin"
        className="bg-gradient-to-r from-amber-950 via-yellow-900 to-amber-950 border-b border-amber-500/30 text-amber-200 px-4 py-1.5 text-xs flex items-center justify-between font-medium shadow-inner transition-all duration-300"
      >
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500 text-black px-1.5 py-0.5 rounded font-black text-[10px] tracking-wider animate-pulse flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> DEMO PIN
          </span>
          <span>
            <b>Bhai Dhyan De:</b> Yeh system strictly evaluation & academic demo ke liye hai — <b>Production use ke liye authorized nahi hai!</b> (Synthetic Banking Data: May – Oct 2026).
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-amber-300/80 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>FastAPI + CrewAI + Gemini 3.5 Flash Online</span>
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <nav className="glass-panel border-b border-slate-800/80 px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                Apex Commercial Bank
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.5 rounded font-semibold">
                AI Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400">Decision Intelligence & Multi-Agent Operations</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div 
          id="nav-tabs" 
          className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 overflow-x-auto max-w-full transition-all duration-300"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-bold scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.isToy ? 'text-purple-400' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="leading-tight flex items-center gap-1">
                    {tab.label}
                    {tab.isToy && (
                      <span className="text-[9px] bg-purple-500/30 text-purple-300 border border-purple-400/40 px-1 rounded-sm uppercase tracking-wider font-extrabold">
                        Toy
                      </span>
                    )}
                  </div>
                </div>
                {tab.badge > 0 && (
                  <span className="ml-1 bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Manager Profile & Quick Tag */}
        <div className="hidden lg:flex items-center space-x-3 bg-slate-800/40 border border-slate-700/50 px-3 py-1.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow">
            MS
          </div>
          <div className="text-right text-xs">
            <p className="font-semibold text-slate-200">Manager Sahab</p>
            <p className="text-[10px] text-emerald-400 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified Session
            </p>
          </div>
        </div>
      </nav>
    </header>
  );
}
