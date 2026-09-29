import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_COMMITTEE_USER = {
  id: 'u-comm-01',
  name: 'Sunil Mehta',
  email: 'secretary@greensociety.org',
  role: 'committee',
  flat: 'Secretary Office'
};

const DEFAULT_RESIDENT_USER = {
  id: 'u-res-01',
  name: 'Rajesh Sharma',
  email: 'rajesh.b402@gmail.com',
  role: 'resident',
  flat: 'B-402'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('society_triage_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_COMMITTEE_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('society_triage_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('society_triage_user');
    }
  }, [user]);

  const loginAsCommittee = () => {
    setUser(DEFAULT_COMMITTEE_USER);
  };

  const loginAsResident = (flat = 'B-402', name = 'Rajesh Sharma') => {
    setUser({
      ...DEFAULT_RESIDENT_USER,
      flat,
      name
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginAsCommittee, loginAsResident, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
