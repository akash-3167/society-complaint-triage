import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ResidentDashboard from './pages/ResidentDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints from './pages/MyComplaints';
import CommitteeDashboard from './pages/CommitteeDashboard';
import ComplaintDetails from './pages/ComplaintDetails';

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />
      <div className="flex-1">
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
      </div>

      {/* Simple Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Society Complaint Triage &bull; Built with React, Vite, Tailwind CSS, Express & Supabase
        </p>
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
