import React from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  Bot, 
  MessageSquare, 
  ShieldCheck, 
  Database, 
  FileText, 
  Settings, 
  LogOut, 
  LogIn,
  User,
  Shield,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  pendingCount = 0, 
  user, 
  onOpenAuth, 
  onLogout 
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'agents', label: 'Multi-Agent Crew', icon: Bot },
    { id: 'chat', label: 'Decision Assistant', icon: MessageSquare },
    { id: 'approval', label: 'Governance & HITL', icon: ShieldCheck, badge: pendingCount },
    { id: 'dataset', label: 'Dataset Explorer', icon: Database },
    { id: 'reports', label: 'Audit Reports & PDF', icon: FileText },
    { id: 'admin', label: 'Platform Administration', icon: Shield },
    { id: 'settings', label: 'Organization Profile', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand & Organization */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight leading-none">
            Apex Commercial Bank
          </h1>
          <span className="text-[11px] text-slate-400 font-medium">Decision Intelligence Platform</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Core Operations
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Session & Status */}
      <div className="p-3 border-t border-slate-800">
        <div className="bg-slate-800/60 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
              {user ? user.full_name?.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-xs font-semibold text-white truncate">
                {user ? user.full_name : 'Guest Officer'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user ? user.role : 'Read Only'}
              </p>
            </div>
          </div>
          {user ? (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-2.5 py-1 rounded text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
