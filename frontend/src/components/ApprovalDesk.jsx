import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  UserCheck, 
  Clock, 
  FileCheck,
  History,
  MessageSquare
} from 'lucide-react';
import { fetchPendingApprovals, submitApproval } from '../api/client';

export default function ApprovalDesk({ onDecisionMade }) {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const loadApprovals = async () => {
    try {
      const res = await fetchPendingApprovals();
      setPendingList(res.data);
      if (res.data.length > 0) {
        setSelectedDecision(res.data[0]);
      } else {
        setSelectedDecision(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const handleAction = async (status) => {
    if (!selectedDecision) return;
    setLoading(true);
    setStatusMessage('');
    try {
      await submitApproval(
        selectedDecision.id,
        status,
        "Branch Manager Sahab",
        notes || (status === 'APPROVED' ? 'Approved as per strategy' : 'Rejected after risk review')
      );
      setStatusMessage(`Decision recorded: ${status === 'APPROVED' ? 'Mubarak ho! Action Approved.' : 'Action Rejected.'}`);
      setNotes('');
      await loadApprovals();
      if (onDecisionMade) onDecisionMade();
    } catch (err) {
      setStatusMessage('Approval submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="approval-container" className="space-y-6 transition-all duration-300">
      {/* Intro Box */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            Manager Desk — Human-in-the-Loop Governance
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Bina human officer ke sign-off ke AI koi bhi bada business action execute nahi kar sakta. 
            Strategy Agent ki high-impact recommendations ko yahan approve ya reject karo.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300">
          Pending Approvals: <span className="text-amber-400 font-bold">{pendingList.length}</span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-200 text-xs font-semibold animate-pulse">
          {statusMessage}
        </div>
      )}

      {pendingList.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Sab Kuch Clear Hai Boss!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Filhal koi pending strategic decision nahi hai. Nayi report run karne ke baad Strategy Agent 
            naya action proposal yahan submit karega.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Pending Items */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Decisions ({pendingList.length}):
            </h3>
            {pendingList.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedDecision(item)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedDecision?.id === item.id
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Awaiting Sign-Off
                  </span>
                  <span className="text-[10px] text-slate-500">ID #{item.id}</span>
                </div>
                <h4 className="font-bold text-sm text-white mt-2 leading-snug">
                  {item.action_title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {item.action_description}
                </p>
              </div>
            ))}
          </div>

          {/* Decision Review Card */}
          {selectedDecision && (
            <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                    Strategy Agent Recommendation
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {selectedDecision.action_title}
                  </h3>
                </div>
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Clock className="w-5 h-5" />
                </span>
              </div>

              {/* Action Description */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300">Proposed Consequential Action:</h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedDecision.action_description}
                </p>
                <div className="flex flex-wrap gap-3 pt-2 text-[11px] border-t border-slate-800">
                  <span className="text-slate-400">
                    Proposed By: <b className="text-indigo-400">{selectedDecision.recommended_by}</b>
                  </span>
                  <span className="text-slate-400">
                    Audit Status: <b className="text-emerald-400">{selectedDecision.verified_by} (Passed)</b>
                  </span>
                </div>
              </div>

              {/* Manager Note Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  Manager Sahab Ki Remarks / Notes (Compulsory for Audit):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Apna reasoning likho: e.g. 'Approved: Default rate kam karne ke liye personal loan credit cutoff badhana zaroori hai.'"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 h-20 resize-none"
                />
              </div>

              {/* Approve / Reject Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => handleAction('APPROVED')}
                  disabled={loading}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pakka Karo (Approve Action)</span>
                </button>
                <button
                  onClick={() => handleAction('REJECTED')}
                  disabled={loading}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Nahi Jam Raha (Reject Action)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
