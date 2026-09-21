import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-3xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto shadow-xl">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-white">404</h1>
        <h2 className="text-lg font-bold text-slate-300">Lost in Another World?</h2>
        <p className="text-xs text-slate-400">
          The page you are looking for has been isekai'd to another dimension.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/discover"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-purple-300 border border-slate-800 text-xs font-bold transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Try Discovery</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
