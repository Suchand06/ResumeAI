"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import LatexPreview from '@/components/LatexPreview';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExportPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login');
      return;
    }

    const storedData = sessionStorage.getItem('optimizationResult');
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      router.push('/upload');
    }
  }, [session, loading, router]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center flex-grow">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => router.push('/optimize')}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-extrabold text-white">LaTeX Export</h2>
          <p className="text-slate-400">Copy your optimized resume and compile it in a LaTeX editor</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <LatexPreview latexCode={data.latexCode} />
      </motion.div>
    </div>
  );
}
