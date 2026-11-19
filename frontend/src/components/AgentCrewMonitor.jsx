import React, { useState } from 'react';
import { 
  Bot, 
  TrendingUp, 
  DollarSign, 
  Cpu, 
  Compass, 
  CheckCircle, 
  Play, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { runAgentCrew } from '../api/client';

export default function AgentCrewMonitor({ latestReport, onReportGenerated }) {
  const [loading, setLoading] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState('strategy');
  const [errorMsg, setErrorMsg] = useState('');

  const agents = [
    {
      id: 'data_analyst',
      name: 'Data Analyst Agent',
      hinglish: 'Hisab-Kitab Master',
      role: 'Statistical Analysis & KPI Extraction',
      icon: Cpu,
      color: 'from-blue-500/20 to-cyan-500/10',
      border: 'border-blue-500/40',
      badgeColor: 'text-blue-400 border-blue-400/30 bg-blue-500/10',
      output: latestReport?.data_analyst_output || 'Run the crew to see data analysis metrics.'
    },
    {
      id: 'marketing',
      name: 'Marketing & Growth Agent',
      hinglish: 'Customer Charcha Specialist',
      role: 'Retention & Deposit Mobilization',
      icon: TrendingUp,
      color: 'from-purple-500/20 to-indigo-500/10',
      border: 'border-purple-500/40',
      badgeColor: 'text-purple-400 border-purple-400/30 bg-purple-500/10',
      output: latestReport?.marketing_output || 'Run the crew to view marketing recommendations.'
    },
    {
      id: 'finance',
      name: 'Finance & Risk Officer',
      hinglish: 'Risk & Kharcha Controller',
      role: 'NPA Provisioning & Margin Audit',
      icon: DollarSign,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/40',
      badgeColor: 'text-emerald-400 border-emerald-400/30 bg-emerald-500/10',
      output: latestReport?.finance_output || 'Run the crew to inspect credit provisions.'
    },
    {
      id: 'operations',
      name: 'Operations Agent',
      hinglish: 'Bank Ki Chaal Ka Inspector',
      role: 'Channel Load & AML Bottlenecks',
      icon: Bot,
      color: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/40',
      badgeColor: 'text-amber-400 border-amber-400/30 bg-amber-500/10',
      output: latestReport?.operations_output || 'Run the crew to check AML & channel latency.'
    },
    {
      id: 'strategy',
      name: 'Strategy Agent',
      hinglish: 'Mastermind Masterplan Director',
      role: 'Actionable Improvement Plan & Governance',
      icon: Compass,
      color: 'from-indigo-500/20 to-violet-500/10',
      border: 'border-indigo-500/40',
      badgeColor: 'text-indigo-400 border-indigo-400/30 bg-indigo-500/10',
      output: latestReport?.strategy_output || 'Run the crew to formulate the board improvement plan.'
    },
    {
      id: 'verification',
      name: 'Verification & Audit Agent',
      hinglish: 'Satya-Nishtha Anti-Hallucination Guard',
      role: 'Source Grounding & Report Sign-Off',
      icon: ShieldCheck,
      color: 'from-teal-500/20 to-emerald-500/10',
      border: 'border-teal-500/40',
      badgeColor: 'text-emerald-400 border-emerald-400/30 bg-emerald-500/10',
      output: latestReport?.verification_output || 'Run the crew to verify calculation audit integrity.'
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
      setErrorMsg(err.response?.data?.detail || 'Agent execution failed. Make sure dataset is loaded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">
              AI Baithak — 6 Autonomous Specialized Agents (CrewAI)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Ye 6 agents aapas me collaborate karke data analyze karte hain, numbers check karte hain, 
            aur report ko verify karte hain so that koi jhootha stat report me na ghuse.
          </p>
        </div>

        <button
          id="agent-trigger-btn"
          onClick={handleRunCrew}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 whitespace-nowrap self-stretch md:self-auto justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Baithak Chalu Hai... (Thinking & Verifying)</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Saare Agents Ko Trigger Karo (Run Crew)</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
          <b>Error:</b> {errorMsg}
        </div>
      )}

      {/* 6 Agent Cards - Clean Grid */}
      <div id="agents-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isExpanded = expandedAgent === agent.id;
          return (
            <div
              key={agent.id}
              className={`glass-card rounded-2xl border ${agent.border} bg-gradient-to-br ${agent.color} p-5 flex flex-col justify-between shadow-lg transition-all duration-300`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5 text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{agent.name}</h3>
                      <span className="text-[11px] font-semibold text-slate-300">
                        {agent.hinglish}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${agent.badgeColor}`}>
                    Active
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 font-medium">
                  {agent.role}
                </p>

                {/* Agent Thought / Output Section */}
                <div className="mt-4 pt-3 border-t border-slate-700/50">
                  <div className="text-xs font-mono text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line">
                    {isExpanded ? agent.output : agent.output.slice(0, 140) + '...'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                className="mt-3 flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 pt-2 transition-colors"
              >
                {isExpanded ? (
                  <>Chhota Karo <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>Poora Padho <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
