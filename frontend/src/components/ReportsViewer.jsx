import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { fetchReports } from '../api/client';

export default function ReportsViewer() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetchReports();
      setReports(res.data);
      if (res.data.length > 0) {
        setSelectedReport(res.data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleDownload = (reportId) => {
    window.open(`/api/reports/${reportId}/pdf`, '_blank');
  };

  return (
    <div id="reports-container" className="space-y-6 transition-all duration-300">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Pakka Reports & Audit History
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            CrewAI Multi-Agent baithak se generate huye formal Business Intelligence reports yahan 
            archive hote hain. Har report ReportLab engine se formal PDF me download ho sakti hai.
          </p>
        </div>
        {selectedReport && (
          <button
            onClick={() => handleDownload(selectedReport.id)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-3 px-5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap self-stretch md:self-auto justify-center"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report (Pakka Hisab)</span>
          </button>
        )}
      </div>

      {reports.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 space-y-3">
          <FileText className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Koi Report Available Nahi Hai</h3>
          <p className="text-xs text-slate-400">
            "AI Baithak" tab me jaakar "Saare Agents Ko Trigger Karo" button dabao taaki pehli formal report ban sake.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Generated Reports ({reports.length}):
            </h3>
            {reports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedReport?.id === rep.id
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-blue-400">REPORT #{rep.id}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {rep.is_verified}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white mt-1.5 leading-snug">
                  {rep.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {new Date(rep.generated_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Report Detailed View */}
          {selectedReport && (
            <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      Audit Status: 100% VERIFIED
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Period: {selectedReport.dataset_period}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1.5">
                    {selectedReport.title}
                  </h3>
                </div>
                <button
                  onClick={() => handleDownload(selectedReport.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-400/20"
                >
                  <Download className="w-3.5 h-3.5" /> PDF File
                </button>
              </div>

              {/* Verified Findings Preview */}
              <div className="space-y-4">
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                    1. Data Analyst Agent Findings:
                  </h4>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {selectedReport.data_analyst_output}
                  </p>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                    2. Strategic Improvement Roadmap:
                  </h4>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {selectedReport.strategy_output}
                  </p>
                </div>

                <div className="bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/30">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> 3. Verification & Anti-Hallucination Audit:
                  </h4>
                  <p className="text-xs text-emerald-200/90 whitespace-pre-line leading-relaxed font-mono">
                    {selectedReport.verification_output}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
