import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ResidentDashboard from './pages/ResidentDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints from './pages/MyComplaints';
import CommitteeDashboard from './pages/CommitteeDashboard';
import ComplaintDetails from './pages/ComplaintDetails';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Default redirects to Committee Dashboard */}
              <Route path="/" element={<CommitteeDashboard />} />
              <Route path="/committee" element={<CommitteeDashboard />} />
              <Route path="/resident" element={<ResidentDashboard />} />
              <Route path="/submit" element={<SubmitComplaint />} />
              <Route path="/my-complaints" element={<MyComplaints />} />
              <Route path="/complaints/:id" element={<ComplaintDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Simple Clean Footer */}
          <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
            <p>
              Society Complaint Triage &bull; Built with React, Vite, Tailwind CSS, Express & Supabase
            </p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
