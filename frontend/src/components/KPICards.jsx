import React from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  AlertOctagon, 
  ShieldAlert, 
  Users, 
  Sparkles 
} from 'lucide-react';

export default function KPICards({ kpis }) {
  if (!kpis) return null;

  const depCr = (kpis.total_deposits / 10000000).toFixed(2);
  const loanCr = (kpis.total_approved_loan_amount / 10000000).toFixed(2);
  const overdueCr = (kpis.total_overdue_amount / 10000000).toFixed(2);

  const cards = [
    {
      id: 'kpi-deposits',
      title: "Total Customer Deposits",
      hinglish: "Apne Bank Ka Paisa",
      value: `Rs. ${depCr} Cr`,
      subtitle: `${kpis.active_accounts?.toLocaleString()} Active Khate`,
      icon: IndianRupee,
      trend: "+12.4% MoM",
      color: "from-blue-500/20 to-cyan-500/10",
      border: "border-blue-500/30",
      iconColor: "text-blue-400",
      accentBg: "bg-blue-500/10"
    },
    {
      id: 'kpi-loans',
      title: "Loan Portfolio Disbursed",
      hinglish: "Banta Hua Karza",
      value: `Rs. ${loanCr} Cr`,
      subtitle: `${kpis.approved_loans_count?.toLocaleString()} Approved Files`,
      icon: TrendingUp,
      trend: "6 Months Disbursed",
      color: "from-indigo-500/20 to-purple-500/10",
      border: "border-indigo-500/30",
      iconColor: "text-indigo-400",
      accentBg: "bg-indigo-500/10"
    },
    {
      id: 'kpi-defaults',
      title: "Portfolio Default Rate",
      hinglish: "Loan Ka Lafda (Overdue)",
      value: `${kpis.default_rate_pct}%`,
      subtitle: `Rs. ${overdueCr} Cr At Risk (${kpis.overdue_loans_count} accounts)`,
      icon: AlertOctagon,
      trend: "Caution: High Risk Tranche",
      color: "from-rose-500/20 to-amber-500/10",
      border: "border-rose-500/40",
      iconColor: "text-rose-400",
      accentBg: "bg-rose-500/10",
      alert: true
    },
    {
      id: 'kpi-flagged',
      title: "Flagged Suspicious Activity",
      hinglish: "Kuch To Gadbad Hai Alert",
      value: `${kpis.flagged_transactions_count}`,
      subtitle: `${kpis.flagged_transaction_pct}% of ${kpis.total_transactions?.toLocaleString()} Tx`,
      icon: ShieldAlert,
      trend: "AML System Monitored",
      color: "from-amber-500/20 to-orange-500/10",
      border: "border-amber-500/30",
      iconColor: "text-amber-400",
      accentBg: "bg-amber-500/10"
    },
  ];

  return (
    <div className="space-y-4">
      {/* Friendly Conversational Intro Banner */}
      <div className="bg-gradient-to-r from-blue-900/30 via-slate-800/40 to-indigo-900/30 border border-blue-500/20 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              Namaste Manager Sahab! Bank Ka Live Overview Dekho
            </h2>
            <p className="text-xs text-slate-400">
              May 1 se Oct 31, 2026 tak ka synthetic banking data clean karke calculate kiya gaya hai.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto text-xs font-semibold text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Total Customers: <b>{kpis.total_customers?.toLocaleString()}</b></span>
        </div>
      </div>

      {/* 4 Clean Visual KPI Cards with distinct IDs for Tour Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              id={card.id}
              className={`glass-card relative overflow-hidden rounded-2xl p-5 border ${card.border} bg-gradient-to-br ${card.color} shadow-lg transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {card.title}
                  </span>
                  <span className="text-xs font-bold text-slate-300 bg-slate-900/50 px-2 py-0.5 rounded-md inline-block mt-0.5 border border-slate-700/50">
                    {card.hinglish}
                  </span>
                </div>
                <div className={`p-2.5 rounded-xl ${card.accentBg} ${card.iconColor} border border-white/5`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-2xl font-black text-white tracking-tight">
                  {card.value}
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {card.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-[11px]">
                <span className={`font-semibold ${card.alert ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {card.trend}
                </span>
                <span className="text-slate-500 font-medium">6 Months Cleaned</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
