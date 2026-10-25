"use client";

import { CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OptimizationView({ data, onExport }) {
  if (!data) return null;

  const { atsScore, weakPoints, optimizedBulletPoints } = data;

  // Determine score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 stroke-green-400';
    if (score >= 60) return 'text-yellow-400 stroke-yellow-400';
    return 'text-red-400 stroke-red-400';
  };

  const scoreColor = getScoreColor(atsScore);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Top Section: Score and Weak Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ATS Score Circular Progress */}
        <div className="col-span-1 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center shadow-xl">
          <h3 className="text-lg font-medium text-slate-300 mb-4">ATS Match Score</h3>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-700"
              />
              <motion.circle
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="64"
                cy="64"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                className={scoreColor.split(' ')[1]}
                strokeLinecap="round"
              />
            </svg>
            <span className={`absolute text-3xl font-bold ${scoreColor.split(' ')[0]}`}>
              {atsScore}%
            </span>
          </div>
        </div>

        {/* Weak Points identified */}
        <div className="col-span-1 md:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl overflow-hidden">
          <h3 className="text-lg font-medium text-slate-300 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-yellow-400 w-5 h-5" />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {weakPoints.map((point, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700"
              >
                <div className="mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                </div>
                <p className="text-sm text-slate-300">{point}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested Bullet Points */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <CheckCircle className="text-green-400 w-6 h-6" />
          Optimized Bullet Points
        </h3>
        <div className="space-y-4">
          {optimizedBulletPoints.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-slate-900/60 rounded-xl border border-slate-700 space-y-3"
            >
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Original Context</div>
              <p className="text-sm text-slate-400 italic line-clamp-2">{item.original}</p>
              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Optimized Suggestion</div>
                <p className="text-base text-slate-200 font-medium">{item.optimized}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onExport}
          className="flex items-center gap-2 py-3 px-8 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          View LaTeX Export
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
