import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading complaints...', type = 'spinner' }) => {
  if (type === 'skeleton') {
    return (
      <div className="space-y-4 w-full animate-pulse" aria-busy="true" aria-label="Loading content">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-5 bg-slate-200 rounded-full w-20"></div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
            <div className="pt-2 flex gap-2">
              <div className="h-6 bg-slate-100 rounded w-24"></div>
              <div className="h-6 bg-slate-100 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4" aria-busy="true">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
};

export default LoadingState;
