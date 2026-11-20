import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, Activity, Trash2, UserCheck, 
  RefreshCw, Crown, AlertCircle, Search, ChevronDown 
} from 'lucide-react';
import axios from 'axios';

export default function AdminView({ user }) {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const loadAll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [usersRes, reportsRes, approvalsRes] = await Promise.allSettled([
        axios.get('/api/auth/users', { headers }),
        axios.get('/api/reports/'),
        axios.get('/api/approvals/all')
      ]);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data);
      if (reportsRes.status === 'fulfilled') setReports(reportsRes.value.data);
      if (approvalsRes.status === 'fulfilled') setApprovals(approvalsRes.value.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalReports = reports.length;
  const pendingApprovals = approvals.filter(a => a.status === 'PENDING').length;
  const approvedCount = approvals.filter(a => a.status === 'APPROVED').length;

  const roleColor = (role) => {
    if (!role) return 'bg-slate-100 text-slate-600';
    const r = role.toLowerCase();
    if (r.includes('admin')) return 'bg-purple-100 text-purple-800';
    if (r.includes('chief') || r.includes('cro')) return 'bg-blue-100 text-blue-800';
    if (r.includes('analyst')) return 'bg-emerald-100 text-emerald-800';
    if (r.includes('audit') || r.includes('compliance')) return 'bg-amber-100 text-amber-800';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-base p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              System Administration
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Admin Access Only
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            User Management &amp; Platform Administration
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            View all registered officers, their roles, analysis activity history, and governance audit trails across the Decision Intelligence Platform.
          </p>
        </div>
        <button
          onClick={loadAll}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-lg border border-slate-200 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Officers</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Users className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{users.length}</div>
          <div className="text-xs text-slate-500 mt-1">Active user accounts</div>
        </div>

        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Intelligence Reports</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><Activity className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalReports}</div>
          <div className="text-xs text-slate-500 mt-1">AI-generated audit dossiers</div>
        </div>

        <div className="card-base p-5 border-amber-200 bg-amber-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Pending Governance</span>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700"><AlertCircle className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-amber-800">{pendingApprovals}</div>
          <div className="text-xs text-amber-700 mt-1">Awaiting officer sign-off</div>
        </div>

        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved Actions</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><UserCheck className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{approvedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Consequential actions authorized</div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="card-base overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Officer Registry — All Platform Users ({filteredUsers.length})
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Role-based access control overview</p>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              {loading ? 'Loading officer registry...' : 'No registered officers found. The admin API endpoint may require additional configuration.'}
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/70 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="px-5 py-3 font-bold">#</th>
                  <th className="px-5 py-3 font-bold">Officer Name</th>
                  <th className="px-5 py-3 font-bold">Email</th>
                  <th className="px-5 py-3 font-bold">Role &amp; Authority</th>
                  <th className="px-5 py-3 font-bold">Organization</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUsers.map((u, idx) => (
                  <tr key={u.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3 font-mono text-[11px] text-slate-400">{u.id || idx + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {u.full_name?.slice(0, 2).toUpperCase() || '??'}
                        </div>
                        <span className="font-semibold text-slate-900">{u.full_name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px] text-slate-600">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${roleColor(u.role)}`}>
                        {u.role || 'Officer'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{u.company_name || 'Apex Commercial Bank'}</td>
                    <td className="px-5 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="card-base p-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Recent Analysis Reports ({reports.slice(0, 5).length})
          </h3>
          {reports.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No reports generated yet.</p>
          ) : (
            <div className="space-y-2">
              {reports.slice(0, 5).map(rep => (
                <div key={rep.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                  <div>
                    <span className="font-bold text-blue-700">Dossier #{rep.id}</span>
                    <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">{rep.title}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                    {new Date(rep.generated_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Governance Audit Log */}
        <div className="card-base p-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Governance Decisions Log ({approvals.length})
          </h3>
          {approvals.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No governance actions logged.</p>
          ) : (
            <div className="space-y-2">
              {approvals.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                  <div className="overflow-hidden">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>{item.status}</span>
                    <p className="font-semibold text-slate-900 text-[11px] mt-0.5 truncate">{item.action_title}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                    #{item.id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
