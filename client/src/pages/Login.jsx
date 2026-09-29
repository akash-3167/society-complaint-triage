import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, UserCheck, ArrowRight, Lock, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { loginAsCommittee, loginAsResident } = useAuth();
  
  const [role, setRole] = useState('committee'); // 'committee' or 'resident'
  const [flatNumber, setFlatNumber] = useState('B-402');
  const [residentName, setResidentName] = useState('Rajesh Sharma');
  const [password, setPassword] = useState('demo1234');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'committee') {
      loginAsCommittee();
      navigate('/committee');
    } else {
      loginAsResident(flatNumber, residentName);
      navigate('/resident');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 text-white items-center justify-center shadow mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Society Complaint Triage
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Green Meadows Co-operative Housing Society
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole('committee')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition ${
              role === 'committee'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Committee Member</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('resident')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition ${
              role === 'resident'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Resident</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'committee' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="email">
                  Official Email / Designation
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue="secretary@greenmeadows.org"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="password">
                  Security Passcode
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="flatNumber">
                  Flat Number (Wing & Flat)
                </label>
                <input
                  id="flatNumber"
                  type="text"
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. B-402, A-101"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="residentName">
                  Resident Full Name
                </label>
                <input
                  id="residentName"
                  type="text"
                  value={residentName}
                  onChange={(e) => setResidentName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span>Enter {role === 'committee' ? 'Committee Portal' : 'Resident Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 mb-2 font-medium">Quick Demo One-Click Access:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { loginAsCommittee(); navigate('/committee'); }}
              className="flex-1 text-xs py-2 px-2.5 rounded-lg border border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 font-medium"
            >
              Demo Committee
            </button>
            <button
              type="button"
              onClick={() => { loginAsResident('B-402', 'Rajesh Sharma'); navigate('/resident'); }}
              className="flex-1 text-xs py-2 px-2.5 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 font-medium"
            >
              Demo Resident
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
