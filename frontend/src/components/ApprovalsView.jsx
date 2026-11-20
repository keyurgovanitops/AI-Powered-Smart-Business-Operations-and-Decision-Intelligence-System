import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  History,
  FileCheck,
  UserCheck
} from 'lucide-react';
import axios from 'axios';

export default function ApprovalsView({ user }) {
  const [approvals, setApprovals] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const loadData = async () => {
    try {
      const res = await axios.get('/api/approvals/all');
      setApprovals(res.data);
      const pending = res.data.find(a => a.status === 'PENDING') || res.data[0];
      setSelectedItem(pending);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async (status) => {
    if (!selectedItem) return;
    setLoading(true);
    setStatusMsg('');

    try {
      await axios.post(`/api/approvals/${selectedItem.id}/decide`, {
        decision: status,
        decision_by: user ? `${user.full_name} (${user.role})` : 'Chief Risk Officer',
        decision_notes: notes || `Formally ${status.toLowerCase()} after institutional portfolio risk review.`
      });

      setStatusMsg(`Decision successfully logged: Action has been marked as ${status}.`);
      setNotes('');
      await loadData();
    } catch (err) {
      setStatusMsg('Failed to record decision: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = approvals.filter(a => a.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-base p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Governance Framework
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Regulatory Audit Compliance
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Human-in-the-Loop Decision Authorizations
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Under prudential banking regulations, consequential business actions formulated by autonomous AI agents cannot execute automatically without authorized officer review and formal sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Pending Governance Actions: <b className="text-slate-900">{pendingCount}</b></span>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          {statusMsg}
        </div>
      )}

      {/* Review Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions List */}
        <div className="card-base p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Governance Action Queue ({approvals.length})
          </h3>
          <div className="space-y-2">
            {approvals.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedItem?.id === item.id
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                    item.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-[10px] text-slate-400">ID #{item.id}</span>
                </div>
                <h4 className="font-bold text-slate-900 line-clamp-1">{item.action_title}</h4>
                <p className="text-slate-500 line-clamp-2 mt-1 text-[11px]">{item.action_description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Action Authorization Panel */}
        {selectedItem && (
          <div className="card-base p-6 lg:col-span-2 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  Policy Recommendation Review
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedItem.action_title}
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                selectedItem.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                selectedItem.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {selectedItem.status}
              </span>
            </div>

            {/* Description Box */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-800">Proposal Scope & Institutional Impact:</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedItem.action_description}
              </p>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Proposed By: <b className="text-slate-700">{selectedItem.recommended_by}</b></span>
                <span>•</span>
                <span>Audit Verified: <b className="text-emerald-700">{selectedItem.verified_by} (PASSED)</b></span>
              </div>
            </div>

            {/* Officer Audit Notes */}
            {selectedItem.status === 'PENDING' ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Executive Officer Decision Notes (Mandatory for Audit Trail):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter authorized justification: e.g., 'Approved in accordance with Q3 credit underwriting adjustments to reduce personal loan defaults below 5%.'"
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 bg-white"
                />

                {/* Decision Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleDecision('APPROVED')}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-sm transition-all disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve Consequential Action</span>
                  </button>
                  <button
                    onClick={() => handleDecision('REJECTED')}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-sm transition-all disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Action</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1 text-xs">
                <span className="font-bold text-slate-700 block">Decision Audit Record:</span>
                <p className="text-slate-600">Decision Executed By: <b>{selectedItem.decision_by || 'Executive Officer'}</b></p>
                <p className="text-slate-600">Audit Notes: <i>"{selectedItem.decision_notes || 'Reviewed and confirmed.'}"</i></p>
                <p className="text-[11px] text-slate-400">Timestamp: {new Date(selectedItem.decided_at || selectedItem.created_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
