import React, { useState } from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  PieChart as PieIcon,
  Activity
} from 'lucide-react';
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

const PALETTE = ['#2563eb', '#6366f1', '#059669', '#d97706', '#dc2626'];

export default function DashboardView({ kpis }) {
  const [chartView, setChartView] = useState('monthly');

  if (!kpis) return null;

  const depCr = (kpis.total_deposits / 10000000).toFixed(2);
  const loanCr = (kpis.total_approved_loan_amount / 10000000).toFixed(2);
  const overdueCr = (kpis.total_overdue_amount / 10000000).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Executive Summary Bar */}
      <div className="card-base p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Autonomous Intelligence Engine Active
            </span>
          </div>
          <h2 className="text-lg font-bold">
            EVA — Portfolio Operations & Surveillance Engine
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Audit coverage encompasses May 1, 2026 to October 31, 2026. Data ingested from verified core banking records comprising 1,200 clients and 1,600 accounts.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs shrink-0 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Core Capital</span>
            <span className="text-sm font-bold text-white">Rs. {depCr} Cr</span>
          </div>
          <div className="h-6 w-px bg-slate-700"></div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Active Borrowers</span>
            <span className="text-sm font-bold text-white">{kpis.approved_loans_count} Files</span>
          </div>
        </div>
      </div>

      {/* 4 Professional KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Deposits */}
        <div className="card-base p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Core Deposit Base</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            Rs. {depCr} <span className="text-sm font-medium text-slate-500">Cr</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-emerald-700 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +12.4% MoM
            </span>
            <span className="text-slate-500 font-medium">{kpis.active_accounts} Active Accounts</span>
          </div>
        </div>

        {/* Loan Commitments */}
        <div className="card-base p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved Credit Facilities</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            Rs. {loanCr} <span className="text-sm font-medium text-slate-500">Cr</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-600 font-medium">Yield: 10.5% - 15.6%</span>
            <span className="text-slate-500 font-medium">{kpis.approved_loans_count} Approved Files</span>
          </div>
        </div>

        {/* Delinquency / Default Rate */}
        <div className="card-base p-5 border-rose-200 bg-rose-50/20">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">Delinquency Ratio</span>
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-700">
            {kpis.default_rate_pct}%
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-rose-100 text-xs">
            <span className="text-rose-700 font-semibold">
              Rs. {overdueCr} Cr At-Risk
            </span>
            <span className="text-slate-600 font-medium">{kpis.overdue_loans_count} In Arrears</span>
          </div>
        </div>

        {/* AML Suspicious Activity */}
        <div className="card-base p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">AML Flagged Transactions</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {kpis.flagged_transactions_count} <span className="text-sm font-medium text-slate-500">Alerts</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-amber-700 font-semibold">
              {kpis.flagged_transaction_pct}% Transaction Ratio
            </span>
            <span className="text-slate-500 font-medium">{kpis.high_critical_risk_events} Critical Cases</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Monthly Cash Flow Chart */}
        <div className="card-base p-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Monthly Credit Disbursement vs Repayment Velocity
              </h3>
              <p className="text-xs text-slate-500">Tracking aggregate cash inflows and outlays (May 2026 – Oct 2026 in Millions INR)</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpis.monthly_trends}>
                <defs>
                  <linearGradient id="areaDisbursed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="areaRepayments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Area 
                  type="monotone" 
                  dataKey="loans_disbursed_millions" 
                  name="Loan Outlay (Millions)" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#areaDisbursed)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="repayments_millions" 
                  name="Collections (Millions)" 
                  stroke="#059669" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#areaRepayments)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loan Allocation Breakdown */}
        <div className="card-base p-6">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              Loan Portfolio Distribution
            </h3>
            <p className="text-xs text-slate-500">Asset exposure classified by borrowing product</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={kpis.loan_distribution}
                  dataKey="amount_millions"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {kpis.loan_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2">
            {kpis.loan_distribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}></span>
                  <span className="font-medium text-slate-700">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">Rs. {item.amount_millions}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AML Suspicious Flags by Channel */}
        <div className="card-base p-6">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Surveillance Flag Density by Channel
            </h3>
            <p className="text-xs text-slate-500">Distribution of anti-money laundering threshold triggers</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpis.risk_by_channel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="channel" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="flagged_count" name="Flagged Events" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="card-base p-6">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Client Segment Demographics
            </h3>
            <p className="text-xs text-slate-500">Breakdown of monitored customer relationships</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpis.customer_segment_distribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="segment" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Client Count" fill="#059669" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
