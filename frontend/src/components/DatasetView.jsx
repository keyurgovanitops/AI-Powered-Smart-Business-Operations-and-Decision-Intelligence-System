import React, { useState, useEffect } from 'react';
import { Database, UploadCloud, CheckCircle2, FileSpreadsheet, RefreshCw, Layers, Table } from 'lucide-react';
import axios from 'axios';

export default function DatasetView() {
  const [selectedTable, setSelectedTable] = useState('customers');
  const [tableData, setTableData] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  const tables = [
    { id: 'customers', label: 'Customers Ledger', count: status?.customers_count },
    { id: 'accounts', label: 'Accounts Ledger', count: status?.accounts_count },
    { id: 'loans', label: 'Loan Applications', count: status?.loans_count },
    { id: 'repayments', label: 'Loan Repayments', count: status?.repayments_count },
    { id: 'transactions', label: 'Transaction Audit', count: status?.transactions_count },
    { id: 'risk_events', label: 'Risk & Fraud Alerts', count: status?.risk_events_count }
  ];

  const loadStatus = async () => {
    try {
      const res = await axios.get('/api/dataset/status');
      setStatus(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadTablePreview = async (tableName) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/dataset/preview/${tableName}?limit=12`);
      setTableData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    loadTablePreview(selectedTable);
  }, [selectedTable]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploadMsg('Uploading and ingesting dataset...');

    try {
      const res = await axios.post('/api/dataset/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadMsg(`Success: ${res.data.message}`);
      loadStatus();
      loadTablePreview(selectedTable);
    } catch (err) {
      setUploadMsg('Upload failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-base p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Data Management Layer
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              PostgreSQL / MySQL / SQLite Relational Schema
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Banking Relational Dataset Explorer
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Synthetic banking data (May 1, 2026 – October 31, 2026) normalized and ingested into relational database entities with referential integrity.
          </p>
        </div>

        {/* Upload Button */}
        <label className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm cursor-pointer transition-all">
          <UploadCloud className="w-4 h-4" />
          <span>Upload Custom Excel (.xlsx)</span>
          <input 
            type="file" 
            accept=".xlsx,.xls" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </label>
      </div>

      {uploadMsg && (
        <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium">
          {uploadMsg}
        </div>
      )}

      {/* Relational Table Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tables.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTable(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTable === t.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                selectedTable === t.id ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {t.count.toLocaleString()}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table Data Preview */}
      <div className="card-base overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Entity Preview: {tableData?.table?.toUpperCase()} ({tableData?.total_in_db} Total Records in DB)
            </h3>
            <p className="text-[11px] text-slate-500">
              Showing first {tableData?.rows?.length || 0} rows of relational schema
            </p>
          </div>
          <button
            onClick={() => loadTablePreview(selectedTable)}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-md text-xs font-semibold flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/70 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
              <tr>
                {tableData?.columns?.map((col) => (
                  <th key={col} className="px-5 py-3 font-bold whitespace-nowrap">
                    {col.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {tableData?.rows?.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  {tableData?.columns?.map((col) => (
                    <td key={col} className="px-5 py-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      {typeof row[col] === 'number'
                        ? row[col].toLocaleString()
                        : String(row[col] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
