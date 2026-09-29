import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEFAULT_COMMITTEE_USER = {
  id: 'u-comm-01',
  name: 'Sunil Mehta',
  designation: 'Committee Member',
  email: 'secretary@greensociety.org',
  role: 'COMMITTEE',
  flat: 'Secretary Office',
  token: 'demo-token-committee-sunil'
};

export const DEFAULT_RESIDENT_USER = {
  id: 'u-res-01',
  name: 'Akash',
  designation: 'Resident',
  email: 'akash.b402@gmail.com',
  role: 'RESIDENT',
  flat: 'B-402',
  token: 'demo-token-resident-akash'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('society_triage_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Normalize role to uppercase
        if (parsed.role) parsed.role = parsed.role.toUpperCase();
        return parsed;
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

  const loginAsResident = (flat = 'B-402', name = 'Akash') => {
    setUser({
      ...DEFAULT_RESIDENT_USER,
      flat,
      name
    });
  };

  const logout = () => {
    setUser(null);
  };

  const isCommittee = user?.role?.toUpperCase() === 'COMMITTEE';
  const isResident = user?.role?.toUpperCase() === 'RESIDENT';

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      isCommittee, 
      isResident, 
      loginAsCommittee, 
      loginAsResident, 
      logout 
    }}>
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
