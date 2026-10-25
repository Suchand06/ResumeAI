"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import FileUpload from '@/components/FileUpload';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login');
    }
  }, [session, loading, router]);

  const handleFileUpload = async (file, jobDescription) => {
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Parse File
      const parseRes = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      });

      if (!parseRes.ok) {
        throw new Error('Failed to parse the file');
      }

      const { text: resumeText } = await parseRes.json();

      // Start Optimization via Server API
      const optRes = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      if (!optRes.ok) {
        throw new Error('Failed to optimize resume');
      }

      const optimizationData = await optRes.json();
      
      // Store in session storage to pass to the next page
      sessionStorage.setItem('optimizationResult', JSON.stringify(optimizationData));
      router.push('/optimize');

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center flex-grow">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4 max-w-2xl">
        <h2 className="text-4xl font-extrabold text-white">Upload Your Resume</h2>
        <p className="text-slate-400 text-lg">
          Let our AI analyze your resume against your target job description to generate an ATS-optimized professional LaTeX resume.
        </p>
      </div>

      {error && (
        <div className="w-full max-w-3xl p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center font-medium">
          {error}
        </div>
      )}

      {isProcessing ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-12 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-3xl shadow-2xl"
        >
          <div className="relative w-24 h-24 flex items-center justify-center mb-6">
            <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            <Loader2 className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Analyzing Resume...</h3>
          <p className="text-slate-400 text-center max-w-md">
            Our AI is comparing your experience against the job description and generating tailored bullet points. This usually takes 15-30 seconds.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <FileUpload onSubmit={handleFileUpload} />
        </motion.div>
      )}
    </div>
  );
}
