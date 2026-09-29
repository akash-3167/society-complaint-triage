import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 text-white items-center justify-center shadow-sm mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Society Triage
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Green Meadows Co-operative Housing Society
          </p>
        </div>

        {/* Demo Role Selection Box (Phase 5A) */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">
            Continue as:
          </p>

          {/* Resident Button */}
          <button
            type="button"
            onClick={handleResidentLogin}
            className="w-full p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-left transition group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  Resident
                </span>
                <span className="block text-xs text-slate-500">
                  Akash &bull; Flat B-402
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition" />
          </button>

          {/* Committee Member Button */}
          <button
            type="button"
            onClick={handleCommitteeLogin}
            className="w-full p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-left transition group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition">
                  Committee Member
                </span>
                <span className="block text-xs text-slate-500">
                  Sunil Mehta &bull; Committee Member
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Demo Hint */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Hackathon Role-Based Access Demo &bull; RBAC is enforced server-side via session tokens.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
