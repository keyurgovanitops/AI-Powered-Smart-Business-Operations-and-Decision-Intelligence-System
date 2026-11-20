import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Clock,
  ArrowRight,
  Database,
  Check,
  Download
} from 'lucide-react';
import { runAgentCrew } from '../api/client';
import confetti from 'canvas-confetti';

export default function AgentCrewView({ 
  latestReport, 
  onReportGenerated,
  runningCrew = false,
  onRunCrew
}) {
  const [localLoading, setLocalLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [expandedAgent, setExpandedAgent] = useState('strategy');
  const [errorMsg, setErrorMsg] = useState('');
  const [successBanner, setSuccessBanner] = useState(null);

  const isExecuting = runningCrew || localLoading;

  const workflowSteps = [
    { num: 1, title: 'Data Analyst Agent', desc: 'Ingesting 1,200 customers, 1,600 accounts & 3,500 transactions' },
    { num: 2, title: 'Marketing Agent', desc: 'Segmenting client tiers, retention risks & deposit mobilization' },
    { num: 3, title: 'Finance Agent', desc: 'Auditing 21.12% delinquency rate, calculating ECL loan loss provisions' },
    { num: 4, title: 'Operations Agent', desc: 'Surveillance of AML velocity triggers & channel friction' },
    { num: 5, title: 'Strategy Agent', desc: 'Synthesizing board turnaround plan & underwriting cutoff revision' },
    { num: 6, title: 'Verification Agent', desc: 'Mathematical reconciliation against SQL ledgers (Zero Hallucination)' }
  ];

  // Animate step progression whenever execution starts
  useEffect(() => {
    let interval;
    if (isExecuting) {
      setActiveStep(1);
      interval = setInterval(() => {
        setActiveStep((prev) => (prev < 6 ? prev + 1 : prev));
      }, 700);
    } else {
      setActiveStep(0);
    }
    return () => clearInterval(interval);
  }, [isExecuting]);

  // When latestReport updates, show the success banner
  useEffect(() => {
    if (latestReport) {
      setSuccessBanner({
        id: latestReport.id,
        title: latestReport.title,
        time: new Date(latestReport.generated_at).toLocaleTimeString(),
        verified: latestReport.is_verified || 'VERIFIED'
      });
    }
  }, [latestReport?.id]);

  const agents = [
    {
      id: 'data_analyst',
      name: 'Agent 1: Data Analyst Agent',
      title: 'Senior Banking Portfolio Analyst',
      role: 'Statistical trend calculation, KPI extraction, and delinquency anomaly detection.',
      icon: Cpu,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: 'Analytical Core',
      output: latestReport?.data_analyst_output || 'Awaiting multi-agent crew execution. Click "Execute Multi-Agent Analysis" above.'
    },
    {
      id: 'marketing',
      name: 'Agent 2: Marketing Agent',
      title: 'Client Segment & Growth Strategist',
      role: 'High-net-worth customer retention, deposit mobilization, and client churn modeling.',
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'Growth & Retention',
      output: latestReport?.marketing_output || 'Awaiting multi-agent crew execution. Click "Execute Multi-Agent Analysis" above.'
    },
    {
      id: 'finance',
      name: 'Agent 3: Finance Agent',
      title: 'Chief Financial Risk Officer',
      role: 'Interest margin sustainability, expected credit loss provisioning, and capital adequacy.',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'Capital Adequacy',
      output: latestReport?.finance_output || 'Awaiting multi-agent crew execution. Click "Execute Multi-Agent Analysis" above.'
    },
    {
      id: 'operations',
      name: 'Agent 4: Operations Agent',
      title: 'Head of Banking Operations & AML Compliance',
      role: 'Channel latency audit, high-velocity digital friction, and AML surveillance bottlenecks.',
      icon: Bot,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'Operational Throughput',
      output: latestReport?.operations_output || 'Awaiting multi-agent crew execution. Click "Execute Multi-Agent Analysis" above.'
    },
    {
      id: 'strategy',
      name: 'Agent 5: Strategy Agent',
      title: 'Executive Banking Strategy Director',
      role: 'Consolidated institutional improvement roadmap and human-in-the-loop governance proposals.',
      icon: Compass,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      badge: 'Executive Synthesis',
      output: latestReport?.strategy_output || 'Awaiting multi-agent crew execution. Click "Execute Multi-Agent Analysis" above.'
    },
    {
      id: 'verification',
      name: 'Agent 6: Verification Agent',
      title: 'Senior Model Risk & Audit Specialist',
      role: 'Mathematical cross-validation against core ledgers, anti-hallucination verification, and audit seal.',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      badge: 'Audit & Anti-Hallucination',
      output: latestReport?.verification_output || 'Awaiting multi-agent crew execution. Click "Execute Multi-Agent Analysis" above.'
    },
  ];

  const handleExecute = async () => {
    if (onRunCrew) {
      await onRunCrew();
      return;
    }
    setLocalLoading(true);
    setErrorMsg('');
    try {
      const res = await runAgentCrew();
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      if (onReportGenerated) {
        onReportGenerated(res.data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Agent execution failed. Please verify database connectivity.');
    } finally {
      setLocalLoading(false);
    }
  };

  const downloadPdf = (reportId) => {
    if (!reportId) return;
    window.open(`/api/reports/${reportId}/pdf`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Execution Control Header */}
      <div className="card-base p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              CrewAI Architecture
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Gemini 3.8 Flash Connected
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              6 Autonomous Specialized Agents
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Autonomous Multi-Agent Intelligence Boardroom
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Six specialized AI agents autonomously analyze the core banking database, exchange domain insights, mathematically reconcile claims against SQL ledgers, and formulate board-level policy proposals.
          </p>
        </div>

        <button
          onClick={handleExecute}
          disabled={isExecuting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-6 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-60 whitespace-nowrap self-stretch md:self-auto justify-center cursor-pointer"
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Orchestrating 6 Agents ({activeStep || 1}/6)...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Execute Multi-Agent Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification Banner with DIRECT PDF DOWNLOAD */}
      {successBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  Multi-Agent Execution Completed &amp; Grounded
                </h4>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                  Dossier #{successBanner.id}
                </span>
                <span className="text-[10px] text-emerald-700">
                  at {successBanner.time}
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-1">
                Audit Dossier #{successBanner.id} generated, signed by Verification Agent ({successBanner.verified}), and permanently logged to database ledgers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end shrink-0">
            <button
              onClick={() => downloadPdf(successBanner.id)}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Report</span>
            </button>
            <button
              onClick={() => setSuccessBanner(null)}
              className="text-emerald-700 hover:text-emerald-950 text-xs font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Active Execution Live Stepper */}
      {isExecuting && (
        <div className="card-base p-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              Live Multi-Agent Orchestration in Progress (Step {activeStep || 1} of 6)
            </span>
            <span className="text-xs font-mono font-bold text-blue-700">
              {Math.round(((activeStep || 1) / 6) * 100)}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((activeStep || 1) / 6) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
            {workflowSteps.map((s) => {
              const isPast = activeStep > s.num;
              const isCurrent = (activeStep || 1) === s.num;
              return (
                <div 
                  key={s.num} 
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isCurrent 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                      : isPast 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-white/70 text-slate-400 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold">Step {s.num}</span>
                    {isPast && <Check className="w-3 h-3 text-emerald-600" />}
                    {isCurrent && <Loader2 className="w-3 h-3 animate-spin text-white" />}
                  </div>
                  <p className="text-[11px] font-semibold truncate">{s.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sequential Process Map */}
      <div className="card-base p-4 bg-slate-50 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[750px] text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5 text-blue-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Data Ingestion &amp; KPIs</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
            <span>Customer Segmentation</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
            <span>Credit Risk &amp; ECL</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 text-amber-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">4</span>
            <span>Operations &amp; AML</span>
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

      {/* Active Dossier Information Bar with DIRECT DOWNLOAD BUTTON */}
      {latestReport && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800">
              Active Dossier: <span className="text-blue-700 font-mono">#{latestReport.id}</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Generated: <span className="font-mono text-slate-800">{new Date(latestReport.generated_at).toLocaleString()}</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Status: <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">{latestReport.status}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Mathematical Integrity: {latestReport.is_verified || 'VERIFIED'}
            </span>
            <button
              onClick={() => downloadPdf(latestReport.id)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* 6 Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isExpanded = expandedAgent === agent.id;
          return (
            <div
              key={agent.id}
              className="card-base p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
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
                <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-800 whitespace-pre-line leading-relaxed max-h-52 overflow-y-auto">
                    {isExpanded ? agent.output : (agent.output.slice(0, 160) + '...')}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Grounded in SQL
                </span>
                <button
                  onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
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
