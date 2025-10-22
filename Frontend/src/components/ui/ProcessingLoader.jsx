import React from 'react';
import { Loader2 } from 'lucide-react';

const ProcessingLoader = () => (
  <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl flex flex-col items-center border border-white/20">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-xl opacity-50"></div>
        <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mb-4 relative" />
      </div>
      <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Processing...</div>
      <div className="text-sm text-gray-600 mt-2">Please wait while we process your request</div>
    </div>
  </div>
);

export default ProcessingLoader;
