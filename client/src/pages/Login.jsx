import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, UserCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { loginAsCommittee, loginAsResident } = useAuth();

  const handleResidentLogin = () => {
    loginAsResident('B-402', 'Akash');
    navigate('/resident');
  };

  const handleCommitteeLogin = () => {
    loginAsCommittee();
    navigate('/committee');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-9 space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 text-white items-center justify-center shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Society Complaint Triage
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Green Meadows Co-operative Housing Society
              </p>
            </div>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>AI-Powered Maintenance Triage</span>
              </span>
            </div>
          </div>

          {/* Role Selection Box */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              <span>Select Access Role</span>
              <span className="text-[10px] lowercase text-slate-400 font-normal">Click to continue</span>
            </div>

            {/* Resident Card Button */}
            <button
              type="button"
              onClick={handleResidentLogin}
              className="w-full p-4.5 rounded-xl border border-slate-200 hover:border-emerald-500/60 bg-slate-50/50 hover:bg-emerald-50/20 text-left transition-all duration-150 group flex items-center justify-between shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                      Resident Portal
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      Flat B-402
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    Akash &bull; Lodge issues, view AI triage & track status
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-300 group-hover:translate-x-0.5 transition">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Committee Member Card Button */}
            <button
              type="button"
              onClick={handleCommitteeLogin}
              className="w-full p-4.5 rounded-xl border border-slate-200 hover:border-indigo-500/60 bg-slate-50/50 hover:bg-indigo-50/20 text-left transition-all duration-150 group flex items-center justify-between shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition">
                      Managing Committee
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-800">
                      Admin
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    Sunil Mehta &bull; Review triage, assign staff, link clusters
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-300 group-hover:translate-x-0.5 transition">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* Key Features Pill Bar */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Multilingual AI Triage</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Systemic Issue Clustering</span>
            </div>
          </div>
        </div>

        {/* Security & RBAC Footer */}
        <p className="text-center text-xs text-slate-400">
          Role-Based Access Control Demo &bull; Enforced via authenticated session tokens
        </p>
      </div>
    </div>
  );
};

export default Login;
