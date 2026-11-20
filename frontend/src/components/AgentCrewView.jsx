import React, { useState } from 'react';
import { 
  Bot, 
  TrendingUp, 
  DollarSign, 
  Cpu, 
  Compass, 
  ShieldCheck, 
  Play, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { runAgentCrew } from '../api/client';

export default function AgentCrewView({ latestReport, onReportGenerated }) {
  const [loading, setLoading] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState('strategy');
  const [errorMsg, setErrorMsg] = useState('');

  const agents = [
    {
      id: 'data_analyst',
      name: 'Agent 1: Data Analyst Agent',
      title: 'Senior Banking Portfolio Analyst',
      role: 'Statistical trend calculation, KPI extraction, and delinquency anomaly detection.',
      icon: Cpu,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: 'Analytical Core',
      output: latestReport?.data_analyst_output || 'Awaiting multi-agent crew execution. Trigger crew to generate report.'
    },
    {
      id: 'marketing',
      name: 'Agent 2: Marketing Agent',
      title: 'Client Segment & Growth Strategist',
      role: 'High-net-worth customer retention, deposit mobilization, and client churn modeling.',
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'Growth & Retention',
      output: latestReport?.marketing_output || 'Awaiting multi-agent crew execution. Trigger crew to generate report.'
    },
    {
      id: 'finance',
      name: 'Agent 3: Finance Agent',
      title: 'Chief Financial Risk Officer',
      role: 'Interest margin sustainability, expected credit loss provisioning, and capital adequacy.',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'Capital Adequacy',
      output: latestReport?.finance_output || 'Awaiting multi-agent crew execution. Trigger crew to generate report.'
    },
    {
      id: 'operations',
      name: 'Agent 4: Operations Agent',
      title: 'Head of Banking Operations & AML Compliance',
      role: 'Channel latency audit, high-velocity digital friction, and AML surveillance bottlenecks.',
      icon: Bot,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'Operational Throughput',
      output: latestReport?.operations_output || 'Awaiting multi-agent crew execution. Trigger crew to generate report.'
    },
    {
      id: 'strategy',
      name: 'Agent 5: Strategy Agent',
      title: 'Executive Banking Strategy Director',
      role: 'Consolidated institutional improvement roadmap and human-in-the-loop governance proposals.',
      icon: Compass,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      badge: 'Executive Synthesis',
      output: latestReport?.strategy_output || 'Awaiting multi-agent crew execution. Trigger crew to generate report.'
    },
    {
      id: 'verification',
      name: 'Agent 6: Verification Agent',
      title: 'Senior Model Risk & Audit Specialist',
      role: 'Mathematical cross-validation against core ledgers, anti-hallucination verification, and audit seal.',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      badge: 'Audit & Anti-Hallucination',
      output: latestReport?.verification_output || 'Awaiting multi-agent crew execution. Trigger crew to generate report.'
    },
  ];

  const handleRunCrew = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await runAgentCrew();
      if (onReportGenerated) {
        onReportGenerated(res.data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Agent execution failed. Please verify database connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Execution Control Header */}
      <div className="card-base p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              CrewAI Architecture
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Gemini 3.5 Flash Connected
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Autonomous Multi-Agent Intelligence Boardroom
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Six autonomous AI agents independently analyze core database records, exchange domain insights, audit statistical claims against source ledgers, and formulate board-level policy proposals.
          </p>
        </div>

        <button
          onClick={handleRunCrew}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-5 py-3 rounded-lg shadow-sm transition-all disabled:opacity-50 whitespace-nowrap self-stretch md:self-auto justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Orchestrating 6 Autonomous Agents...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Execute Multi-Agent Analysis</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Sequential Process Map */}
      <div className="card-base p-4 bg-slate-50 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5 text-blue-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Data Ingestion</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
            <span>Customer Segmentation</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
            <span>Credit Risk & ECL</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 text-amber-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">4</span>
            <span>Operations & AML</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 text-purple-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">5</span>
            <span>Strategy Synthesis</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 text-teal-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">6</span>
            <span>Audit Verification</span>
          </div>
        </div>
      </div>

      {/* 6 Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isExpanded = expandedAgent === agent.id;
          return (
            <div
              key={agent.id}
              className="card-base p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg border ${agent.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {agent.name}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {agent.title}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {agent.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {agent.role}
                </p>

                {/* Agent Finding / Reasoning Output */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-700 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                    {isExpanded ? agent.output : agent.output.slice(0, 160) + '...'}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Grounded in SQL
                </span>
                <button
                  onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                >
                  {isExpanded ? (
                    <>Collapse <ChevronUp className="w-3.5 h-3.5" /></>
                  ) : (
                    <>Expand Output <ChevronDown className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
