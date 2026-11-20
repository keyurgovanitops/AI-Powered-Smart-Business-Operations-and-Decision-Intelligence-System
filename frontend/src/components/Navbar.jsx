import React from 'react';
import { Play, Loader2, Sparkles, User, Shield, HelpCircle } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  onRunCrew, 
  runningCrew, 
  user, 
  onOpenAuth 
}) {
  const titles = {
    dashboard: 'Executive Banking Operations & Risk Intelligence',
    agents: 'CrewAI Autonomous Multi-Agent Boardroom',
    chat: 'Executive AI Decision Assistant (Grounded Q&A)',
    approval: 'Human-in-the-Loop Governance & Audit Authorizations',
    dataset: 'Banking Relational Dataset Explorer & Schema Preview',
    reports: 'Verified Business Intelligence Reports Archive',
    admin: 'Platform Administration & Officer Governance',
    settings: 'Organization Profile & System Configuration'
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-xs">
      {/* Title & Context */}
      <div>
        <h2 className="text-base font-bold text-slate-900 leading-tight">
          {titles[activeTab] || 'EVA Autonomous Banking Platform'}
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-blue-700">EVA Financial</span>
          <span>•</span>
          <span className="font-medium text-slate-600">Enterprise BI Architecture</span>
          <span>•</span>
          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-200">
            Synthetic Period: May 1 – Oct 31, 2026
          </span>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Run Crew Trigger Action */}
        <button
          onClick={onRunCrew}
          disabled={runningCrew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all disabled:opacity-60 cursor-pointer"
        >
          {runningCrew ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Orchestrating Agents...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Trigger Multi-Agent Crew</span>
            </>
          )}
        </button>

        {/* User Badge / Auth trigger */}
        {user ? (
          <div 
            onClick={onOpenAuth}
            className="flex items-center gap-2.5 pl-3 border-l border-slate-200 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs">
              {user.full_name?.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold text-slate-800 block leading-tight">
                {user.full_name}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium block">
                ● Active ({user.role})
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors border border-slate-200 cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
}
