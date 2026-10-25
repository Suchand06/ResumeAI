"use client";

import { useState } from 'react';
import { Copy, Check, Code, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LatexPreview({ latexCode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!latexCode) return null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Code className="text-indigo-400 w-6 h-6" />
          Optimized LaTeX Source
        </h3>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          <a
            href="https://www.overleaf.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg transition-colors border border-indigo-500/30"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Overleaf
          </a>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50 pointer-events-none rounded-xl" />
        <pre className="bg-slate-900 text-slate-300 p-6 rounded-xl overflow-x-auto overflow-y-auto max-h-[600px] text-sm font-mono border border-slate-800 shadow-inner custom-scrollbar">
          <code>{latexCode}</code>
        </pre>
      </div>
      
      <p className="text-sm text-slate-400 text-center">
        This is a complete, standard professional resume template. Copy and paste it directly into a new Overleaf project to compile your PDF.
      </p>
    </div>
  );
}
