import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { BarChart3, PieChart as PieIcon, ShieldAlert, Users2 } from 'lucide-react';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export default function ChartsSection({ kpis }) {
  const [activeChart, setActiveChart] = useState('monthly');

  if (!kpis) return null;

  return (
    <div id="charts-gallery" className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6 transition-all duration-300">
      {/* Chart Selector - Progressive Disclosure so user is not overwhelmed */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Visual Graph Gallery (Bina Confuse Huye Ek-Ek Graph Dekho)
          </h3>
          <p className="text-xs text-slate-400">
            Ek saath saare charts dekh ke sar mat ghumao — select your preference below:
          </p>
        </div>

        {/* Toggle Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveChart('monthly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeChart === 'monthly'
                ? 'bg-blue-600 text-white shadow font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Monthly Paisa Flow
          </button>
          <button
            onClick={() => setActiveChart('loans')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeChart === 'loans'
                ? 'bg-purple-600 text-white shadow font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" /> Karz Portfolio
          </button>
          <button
            onClick={() => setActiveChart('risk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeChart === 'risk'
                ? 'bg-amber-600 text-white shadow font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Channel Lafde
          </button>
          <button
            onClick={() => setActiveChart('segments')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeChart === 'segments'
                ? 'bg-emerald-600 text-white shadow font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" /> Customer Segments
          </button>
        </div>
      </div>

      {/* Render Active Chart View */}
      <div className="h-80 w-full pt-2">
        {activeChart === 'monthly' && (
          <div className="h-full flex flex-col justify-between">
            <div className="text-xs text-slate-300 font-medium mb-2 flex items-center justify-between">
              <span>May 2026 – Oct 2026: Disbursed Loan Volume vs Repayments Collected (in Millions)</span>
              <span className="text-emerald-400 font-bold">● Healthy Monthly Inflow</span>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={kpis.monthly_trends}>
                <defs>
                  <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRepayments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="loans_disbursed_millions" 
                  name="Loans Disbursed (M)" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorDisbursed)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="repayments_millions" 
                  name="Repayments Collected (M)" 
                  stroke="#10B981" 
                  fillOpacity={1} 
                  fill="url(#colorRepayments)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChart === 'loans' && (
          <div className="h-full flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kpis.loan_distribution}
                    dataKey="amount_millions"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    label
                  >
                    {kpis.loan_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Karz Portfolio Summary:
              </h4>
              {kpis.loan_distribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="font-semibold text-slate-200">{item.name} Loan</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white">Rs. {item.amount_millions} M</span>
                    <span className="text-[10px] text-slate-400 block">({item.count} files)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeChart === 'risk' && (
          <div className="h-full flex flex-col justify-between">
            <div className="text-xs text-slate-300 font-medium mb-2">
              Suspicious Transactions by Banking Channel (UPI, NetBanking, ATM, Branch)
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={kpis.risk_by_channel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="channel" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="flagged_count" name="Flagged Suspicious Activity" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChart === 'segments' && (
          <div className="h-full flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpis.customer_segment_distribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="segment" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Bar dataKey="count" name="Customers" fill="#10B981" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-2 p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs">
              <h4 className="font-bold text-white text-sm">💡 Quick Insight For Manager Sahab:</h4>
              <p className="text-slate-300 leading-relaxed">
                Retail aur Priority customers milkar bank ke <b>70%+ deposit volume</b> ko power kar rahe hain. 
                SME segment me loans fast grow ho rahe hain lekin unhi me repayment delay ka risk sabse jyada hai!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
