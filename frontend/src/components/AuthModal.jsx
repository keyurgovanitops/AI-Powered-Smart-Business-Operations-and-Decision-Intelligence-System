import React, { useState } from 'react';
import { 
  X, Lock, Mail, User, ShieldCheck, ArrowRight, Loader2, 
  Sparkles, CheckCircle2, TrendingUp, Cpu, Landmark, Settings 
} from 'lucide-react';
import axios from 'axios';

const DEMO_PERSONAS = [
  {
    id: 'cro',
    role: 'Chief Risk Officer',
    name: 'Vikramaditya Singhania',
    email: 'cro@evabank.ai',
    password: 'admin123',
    authority: 'Executive Approval Authority & Board Governance',
    badge: 'Executive',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    icon: ShieldCheck,
    avatarColor: 'bg-rose-600 text-white'
  },
  {
    id: 'analyst',
    role: 'Senior Credit Risk Analyst',
    name: 'Ananya Deshmukh',
    email: 'credit.analyst@evabank.ai',
    password: 'admin123',
    authority: 'Portfolio Credit Risk, Delinquency & ECL Surveillance',
    badge: 'Credit Risk',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: TrendingUp,
    avatarColor: 'bg-blue-600 text-white'
  },
  {
    id: 'operations',
    role: 'Head of Banking Operations & AML',
    name: 'Rajesh Kulkarni',
    email: 'operations@evabank.ai',
    password: 'admin123',
    authority: 'Transaction Velocity Spikes & Digital Channel Fraud',
    badge: 'Operations',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Cpu,
    avatarColor: 'bg-amber-600 text-white'
  },
  {
    id: 'cfo',
    role: 'Chief Financial Officer',
    name: 'Meera Nambiar',
    email: 'cfo@evabank.ai',
    password: 'admin123',
    authority: 'Capital Adequacy (CAR), Net Interest Margin & Deposits',
    badge: 'Finance',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: Landmark,
    avatarColor: 'bg-emerald-600 text-white'
  },
  {
    id: 'auditor',
    role: 'Lead Compliance & Model Auditor',
    name: 'Devendra Sharma',
    email: 'auditor@evabank.ai',
    password: 'admin123',
    authority: 'Model Anti-Hallucination Audit & Ledger Verification',
    badge: 'Audit Seal',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    icon: CheckCircle2,
    avatarColor: 'bg-teal-600 text-white'
  },
  {
    id: 'admin',
    role: 'Platform System Administrator',
    name: 'Arunabh Sen',
    email: 'admin@evabank.ai',
    password: 'admin123',
    authority: 'Platform Administration, Officer Ledgers & System Health',
    badge: 'System Admin',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Settings,
    avatarColor: 'bg-purple-600 text-white'
  }
];

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('EVA Commercial Bank');
  const [role, setRole] = useState('Chief Risk Officer');
  const [loading, setLoading] = useState(false);
  const [activePersonaLoading, setActivePersonaLoading] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectPersona = async (persona) => {
    setActivePersonaLoading(persona.id);
    setErrorMsg('');
    try {
      const loginRes = await axios.post('/api/auth/login', {
        email: persona.email,
        password: persona.password
      });

      localStorage.setItem('token', loginRes.data.access_token);
      if (onAuthSuccess) {
        onAuthSuccess(loginRes.data.user);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Persona switch failed. Please verify network connection.');
    } finally {
      setActivePersonaLoading(null);
    }
  };

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
        email: email || 'cro@evabank.ai',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fade-in my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Multi-User Intelligence Demo
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">Role-Based Access Control</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {isRegister ? 'Register Custom Bank Officer' : 'Switch Officer Persona / Demo Sign-In'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {!isRegister && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  1-Click Instant Persona Switch (Demo All User Sides)
                </span>
                <span className="text-[11px] text-slate-400">Click any officer to enter their view</span>
              </div>

              {/* 6 Officer Personas Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_PERSONAS.map((p) => {
                  const Icon = p.icon;
                  const isCurrentLoading = activePersonaLoading === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPersona(p)}
                      disabled={activePersonaLoading !== null}
                      className="flex items-start gap-3 p-3 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all group bg-white shadow-xs cursor-pointer disabled:opacity-60"
                    >
                      <div className={`w-9 h-9 rounded-lg ${p.avatarColor} flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}>
                        {isCurrentLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <Icon className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                            {p.name}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${p.badgeColor}`}>
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-600 truncate">
                          {p.role}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {p.authority}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative flex items-center justify-center pt-1">
            <hr className="w-full border-slate-200" />
            <span className="absolute bg-white px-3 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              {isRegister ? 'New Officer Registration' : 'Or Manual Custom Sign-In'}
            </span>
          </div>

          {/* Custom Login / Register Form */}
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
                    Role & Authority Level
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Chief Risk Officer">Chief Risk Officer (Executive Approval Authority)</option>
                    <option value="Senior Credit Risk Analyst">Senior Credit Risk Analyst (Portfolio Surveillance)</option>
                    <option value="Head of Banking Operations & AML">Head of Banking Operations & AML (Channel Velocity)</option>
                    <option value="Chief Financial Officer">Chief Financial Officer (Capital Adequacy & Margins)</option>
                    <option value="Lead Compliance & Model Auditor">Lead Compliance & Model Auditor (Audit Verification)</option>
                    <option value="Platform System Administrator">Platform System Administrator (Full System Operations)</option>
                  </select>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cro@evabank.ai"
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
                    placeholder="admin123"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs py-2.5 rounded-lg transition-all shadow-xs disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Create Officer Account' : 'Sign In With Credentials'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="text-center pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              {isRegister
                ? 'Already registered? Switch to 1-Click Demo & Sign In'
                : 'Need a custom credentials account? Register New Officer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
