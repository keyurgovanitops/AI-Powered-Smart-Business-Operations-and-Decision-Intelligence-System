import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('EVA Commercial Bank');
  const [role, setRole] = useState('Chief Risk Officer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        await axios.post('/api/auth/register', {
          email,
          password,
          full_name: fullName,
          company_name: companyName,
          role
        });
      }
      
      const loginRes = await axios.post('/api/auth/login', {
        email: email || 'manager@apexbank.com',
        password: password || 'admin123'
      });

      localStorage.setItem('token', loginRes.data.access_token);
      if (onAuthSuccess) {
        onAuthSuccess(loginRes.data.user);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Login with default pre-seeded officer
      const loginRes = await axios.post('/api/auth/login', {
        email: 'manager@apexbank.com',
        password: 'admin123'
      });
      localStorage.setItem('token', loginRes.data.access_token);
      if (onAuthSuccess) {
        onAuthSuccess(loginRes.data.user);
      }
      onClose();
    } catch (e) {
      // If user does not exist yet, register first then login
      try {
        await axios.post('/api/auth/register', {
          email: 'manager@apexbank.com',
          password: 'admin123',
          full_name: 'Vikramaditya Singhania',
          company_name: 'Apex Commercial Bank',
          role: 'Chief Risk Officer'
        });
        const loginRes = await axios.post('/api/auth/login', {
          email: 'manager@apexbank.com',
          password: 'admin123'
        });
        localStorage.setItem('token', loginRes.data.access_token);
        if (onAuthSuccess) {
          onAuthSuccess(loginRes.data.user);
        }
        onClose();
      } catch (err) {
        setErrorMsg('Quick login failed: ' + (err.response?.data?.detail || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isRegister ? 'Create Bank Officer Account' : 'Officer Sign In'}
            </h3>
            <p className="text-xs text-slate-500">
              Access role-based decision intelligence & governance ledgers
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* 1-Click Quick Demo Sign-in Button */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>1-Click Sign In (Chief Risk Officer Demo)</span>
          </button>

          <div className="relative flex items-center justify-center">
            <hr className="w-full border-slate-200" />
            <span className="absolute bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold">
              Or Custom Sign In
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Officer Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vikramaditya Singhania"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Role & Authority
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Chief Risk Officer">Chief Risk Officer (Executive Approval Authority)</option>
                    <option value="Branch Manager">Branch Manager (Operational Review)</option>
                    <option value="Senior Credit Analyst">Senior Credit Analyst (Portfolio Surveillance)</option>
                    <option value="Audit & Compliance Officer">Audit & Compliance Officer</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@apexbank.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg transition-all shadow-xs disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Register Officer Account' : 'Authenticate Session'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              {isRegister
                ? 'Already registered? Switch to Sign In'
                : 'Need a new officer account? Create Registration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
