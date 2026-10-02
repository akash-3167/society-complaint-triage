import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading complaints...', type = 'spinner' }) => {
  if (type === 'skeleton') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full animate-pulse" aria-busy="true" aria-label="Loading content">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="h-3.5 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-100 rounded-full w-16"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-4 bg-slate-100 rounded w-20"></div>
              <div className="h-4 bg-slate-100 rounded w-14"></div>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-3.5 bg-slate-100 rounded w-full"></div>
              <div className="h-3.5 bg-slate-100 rounded w-4/5"></div>
            </div>
            <div className="h-6 bg-slate-50 rounded-lg w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4" aria-busy="true">
      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" aria-hidden="true" />
      <p className="mt-2.5 text-xs font-medium text-slate-500">{message}</p>
    </div>
  );
};

export default LoadingState;

