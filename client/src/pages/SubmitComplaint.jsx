import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  X
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CategoryBadge from '../components/CategoryBadge';
import UrgencyBadge from '../components/UrgencyBadge';

export const SubmitComplaint = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [residentName, setResidentName] = useState(user?.name || 'Akash');
  const [flatNumber, setFlatNumber] = useState(user?.flat || 'B-402');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  // Quick preset samples for fast demo
  const demoSamples = [
    {
      title: 'Water Supply Issue (Hinglish)',
      text: 'B wing main water pump trip ho gaya hai. Subah se taps are completely dry, please electrician bhejkar jaldi theek karwayein.'
    },
    {
      title: 'Lift Jerking / Noise',
      text: 'Tower A lift 2 floor 4 pe jerk le rahi hai and squeaking noise bohot zyada hai. Bacche dar rahe hain enter karne me.'
    },
    {
      title: 'Ramp Blocked (Parking)',
      text: 'White Swift MH-12-AB-3421 is parked right in front of Tower C ramp, blocking wheelchair and stretcher access.'
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!residentName.trim() || !flatNumber.trim() || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        resident_name: residentName.trim(),
        flat_number: flatNumber.trim().toUpperCase(),
        description: description.trim()
      };

      const result = await api.createComplaint(payload);
      setSuccessData(result);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please check your backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back</span>
      </button>

      {/* Main Form Container */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 sm:p-7 space-y-5">
        {/* Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
              Resident Service Desk
            </span>
            <span className="text-xs text-slate-400">Green Meadows CHS</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Log a Maintenance Complaint
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Describe the issue clearly. English, Hindi, or Hinglish are all supported.
          </p>
        </div>

        {/* AI Triage Banner: Subtle and elegant */}
        <div className="py-2.5 px-3.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-800">Automated AI Triage:</span> No need to select category or urgency manually. Our triage engine detects the issue domain, priority, and links duplicates automatically.
          </div>
        </div>

        {/* Success Confirmation Card */}
        {successData && (
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-emerald-950">
                    Complaint Registered Successfully
                  </h3>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Ticket #{successData.id}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Flat <strong className="font-semibold">{successData.flat_number}</strong> • The managing committee has been alerted.
                </p>

                {/* Structured AI Analysis Box */}
                <div className="mt-3 p-3 rounded-lg bg-white border border-emerald-200/80 space-y-2.5 text-xs text-slate-700 shadow-2xs">
                  <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-100 font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>AI Automated Assessment</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <CategoryBadge category={successData.category} size="sm" />
                    <UrgencyBadge urgency={successData.urgency} size="sm" />
                    {successData.language && (
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {successData.language}
                      </span>
                    )}
                  </div>

                  {(successData.summary || successData.ai_summary) && (
                    <div className="text-[11px] bg-slate-50 p-2 rounded border border-slate-100 text-slate-600 italic">
                      <strong className="not-italic text-slate-700 font-semibold">Summary:</strong> "{successData.summary || successData.ai_summary}"
                    </div>
                  )}

                  {successData.suggested_action && (
                    <div className="text-[11px] text-slate-700 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold">Suggested Action:</strong> {successData.suggested_action}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/complaints/${successData.id}`)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition"
                  >
                    View Ticket Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessData(null);
                      setDescription('');
                      removeFile();
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition"
                  >
                    Log Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="residentName" className="block font-semibold text-slate-700 mb-1">
                Resident Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="residentName"
                type="text"
                required
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
                placeholder="e.g. Akash Prajapati"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label htmlFor="flatNumber" className="block font-semibold text-slate-700 mb-1">
                Flat Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="flatNumber"
                type="text"
                required
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value.toUpperCase())}
                placeholder="e.g. B-402, A-101"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="complaintDescription" className="block font-semibold text-slate-700">
                Complaint Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">English, Hindi or Hinglish</span>
            </div>
            <textarea
              id="complaintDescription"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue in detail. E.g. '5th floor corridor light fuse ho gayi hai' or 'Water pressure is very low in kitchen taps'..."
              className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white leading-relaxed resize-y placeholder:text-slate-400"
            />
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Try a demo issue template:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {demoSamples.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDescription(sample.text)}
                  className="px-2.5 py-1 text-[11px] rounded-md bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition shadow-2xs"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Image Upload */}
          <div>
            <label className="block font-semibold text-slate-700 mb-0.5">
              Photo / Evidence (Optional)
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Attach a photo of the leakage, parking obstruction, or damaged fixture.
            </p>

            {previewUrl ? (
              <div className="relative inline-block border border-slate-200 rounded-lg p-1.5 bg-slate-50">
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="h-28 w-auto object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2.5 right-2.5 p-1 rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
                  aria-label="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="mt-1 text-[10px] text-slate-500 truncate max-w-xs">
                  {selectedFile?.name}
                </div>
              </div>
            ) : (
              <label
                htmlFor="photoUpload"
                className="border border-dashed border-slate-300 hover:border-blue-400 rounded-lg p-5 text-center cursor-pointer transition flex flex-col items-center justify-center bg-slate-50/40 hover:bg-slate-50"
              >
                <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700">
                  Click to choose a photo or drag & drop
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  PNG, JPG up to 5MB
                </span>
                <input
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing with AI triage...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;

