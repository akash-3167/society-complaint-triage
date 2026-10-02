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
  UserCheck,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const { user, loginAsCommittee, loginAsResident, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isCommittee = user?.role?.toUpperCase() === 'COMMITTEE';

  // Role-Specific Navigation
  const residentNavLinks = [
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

  const committeeNavLinks = [
    {
      to: '/committee',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Admin'
    },
    {
      to: '/committee#complaints',
      label: 'Complaints',
      icon: FileText
    },
    {
      to: '/committee#clusters',
      label: 'Clusters',
      icon: Layers
    }
  ];

  const navLinks = isCommittee ? committeeNavLinks : residentNavLinks;

  const isActive = (path) => {
    if (path === '/committee' && (location.pathname === '/' || location.pathname === '/committee') && isCommittee) return true;
    if (path === '/resident' && (location.pathname === '/' || location.pathname === '/resident') && !isCommittee) return true;
    return location.pathname === path;
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8.5 h-8.5 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition">
                <Building2 className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base text-slate-900 tracking-tight leading-tight">
                  Society Triage
                </span>
                <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                  Green Meadows CHS
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);

              if (link.highlight) {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-2xs ml-1 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    active
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60 px-1.5 py-0.2 rounded">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Role Switcher & Profile Area */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Instant Role Switcher Toggle */}
                {isCommittee ? (
                  <button
                    type="button"
                    onClick={() => loginAsResident('B-402', 'Akash')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
                    title="Switch demo role to Resident"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View as Resident</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => loginAsCommittee()}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
                    title="Switch demo role to Committee"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>View as Committee</span>
                  </button>
                )}

                {/* Profile Pill Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 transition text-left"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCommittee ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {isCommittee ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    </div>
                    <div className="hidden lg:block">
                      <span className="block text-xs font-semibold text-slate-800 leading-none">
                        {user.name}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                        {isCommittee ? 'Committee' : user.flat}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                        <span className="inline-block text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded mt-1">
                          Role: {user.role.toUpperCase()}
                        </span>
                      </div>

                      <div className="px-2 py-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                          Switch Demo Role
                        </span>
                        <button
                          type="button"
                          onClick={() => { loginAsCommittee(); setUserMenuOpen(false); }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 ${
                            isCommittee ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Sunil Mehta (Committee)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => { loginAsResident('B-402', 'Akash'); setUserMenuOpen(false); }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg mt-0.5 flex items-center gap-2 ${
                            !isCommittee ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Akash (Flat B-402)</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                        <Link
                          to="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <UserCircle2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Change Account</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/submit"
              className="p-1.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              aria-label="Submit complaint"
            >
              <PlusCircle className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                  active
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 mt-2">
            <div className="text-[11px] text-slate-400 mb-2 px-1 font-semibold uppercase tracking-wider">
              Switch Role:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { loginAsCommittee(); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2.5 text-xs rounded-lg font-medium border text-center ${
                  isCommittee ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold' : 'border-slate-200 text-slate-700'
                }`}
              >
                Committee
              </button>
              <button
                type="button"
                onClick={() => { loginAsResident(); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2.5 text-xs rounded-lg font-medium border text-center ${
                  !isCommittee ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold' : 'border-slate-200 text-slate-700'
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

