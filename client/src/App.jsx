import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ResidentDashboard from './pages/ResidentDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints from './pages/MyComplaints';
import CommitteeDashboard from './pages/CommitteeDashboard';
import ComplaintDetails from './pages/ComplaintDetails';

// Automatically scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// Protect Committee routes: Residents cannot access committee dashboard
const ProtectedCommitteeRoute = ({ children }) => {
  const { user, isCommittee } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isCommittee) return <Navigate to="/resident" replace />;
  return children;
};

// Protect Resident routes: requires authenticated session
const ProtectedResidentRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Role-based root redirect
const DefaultRedirect = () => {
  const { user, isCommittee } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return isCommittee ? <Navigate to="/committee" replace /> : <Navigate to="/resident" replace />;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pb-12">
        <Routes>
          <Route path="/" element={<DefaultRedirect />} />
          <Route 
            path="/committee" 
            element={
              <ProtectedCommitteeRoute>
                <CommitteeDashboard />
              </ProtectedCommitteeRoute>
            } 
          />
          <Route 
            path="/resident" 
            element={
              <ProtectedResidentRoute>
                <ResidentDashboard />
              </ProtectedResidentRoute>
            } 
          />
          <Route 
            path="/submit" 
            element={
              <ProtectedResidentRoute>
                <SubmitComplaint />
              </ProtectedResidentRoute>
            } 
          />
          <Route 
            path="/my-complaints" 
            element={
              <ProtectedResidentRoute>
                <MyComplaints />
              </ProtectedResidentRoute>
            } 
          />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<DefaultRedirect />} />
        </Routes>
      </main>

      {/* Clean Modern SaaS Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Society Complaint Triage</span>
            <span className="text-slate-300">&bull;</span>
            <span>Green Meadows Co-operative Housing Society</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>AI Triage Powered by Gemini</span>
            <span className="text-slate-300">&bull;</span>
            <span>Production RBAC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
