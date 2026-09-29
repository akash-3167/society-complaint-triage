import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  PlusCircle, 
  LayoutDashboard, 
  FileText, 
  Menu, 
  X, 
  UserCircle2, 
  LogOut,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const { user, loginAsCommittee, loginAsResident, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isCommittee = user?.role === 'committee';

  const navLinks = [
    {
      to: '/committee',
      label: 'Committee Dashboard',
      icon: LayoutDashboard,
      badge: 'Admin'
    },
    {
      to: '/resident',
      label: 'Resident Portal',
      icon: Building2
    },
    {
      to: '/submit',
      label: 'Submit Complaint',
      icon: PlusCircle,
      highlight: true
    },
    {
      to: '/my-complaints',
      label: 'My Complaints',
      icon: FileText
    }
  ];

  const isActive = (path) => {
    if (path === '/committee' && (location.pathname === '/' || location.pathname === '/committee')) return true;
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight block leading-tight">
                  Society Triage
                </span>
                <span className="text-[11px] text-slate-500 font-medium block leading-tight">
                  Green Meadows CHS
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);

              if (link.highlight) {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm ml-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    active
                      ? 'bg-slate-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-normal">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Role Switcher & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-left"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCommittee ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {isCommittee ? <ShieldCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-800 leading-none">
                      {user.name}
                    </span>
                    <span className="block text-[10px] text-slate-500 leading-none mt-1">
                      {isCommittee ? 'Committee Member' : `Flat ${user.flat}`}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-slate-500 text-[11px]">{user.email}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">Role: {user.role.toUpperCase()}</p>
                    </div>

                    <div className="px-2 py-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2">
                        Switch Demo Role
                      </span>
                      <button
                        type="button"
                        onClick={() => { loginAsCommittee(); setUserMenuOpen(false); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded mt-1 flex items-center gap-2 ${
                          isCommittee ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Committee (Admin)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { loginAsResident(); setUserMenuOpen(false); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded mt-0.5 flex items-center gap-2 ${
                          !isCommittee ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Resident (B-402)</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 mt-2 pt-1 px-2">
                      <Link
                        to="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full text-left px-2.5 py-1.5 rounded text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                      >
                        <UserCircle2 className="w-3.5 h-3.5" />
                        <span>Change Account</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full text-left px-2.5 py-1.5 rounded text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/submit"
              className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              aria-label="Submit complaint"
            >
              <PlusCircle className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 mt-2">
            <div className="text-xs text-slate-500 mb-2 px-1">Switch Role:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { loginAsCommittee(); setMobileMenuOpen(false); }}
                className={`py-2 px-3 text-xs rounded-lg font-medium border text-center ${
                  isCommittee ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold' : 'border-slate-200'
                }`}
              >
                Committee
              </button>
              <button
                type="button"
                onClick={() => { loginAsResident(); setMobileMenuOpen(false); }}
                className={`py-2 px-3 text-xs rounded-lg font-medium border text-center ${
                  !isCommittee ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold' : 'border-slate-200'
                }`}
              >
                Resident (B-402)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
