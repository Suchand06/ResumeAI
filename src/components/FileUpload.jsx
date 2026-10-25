"use client";

import { useState, useRef } from 'react';
import { UploadCloud, File, X, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FileUpload({ onSubmit }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.pdf') || selectedFile.name.endsWith('.docx')) {
      setFile(selectedFile);
    } else {
      alert('Please upload a valid .pdf or .docx file');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a resume');
      return;
    }
    if (!jobDescription.trim()) {
      alert('Please paste a job description');
      return;
    }
    onSubmit(file, jobDescription);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <UploadCloud className="text-indigo-400" />
        Analyze Resume
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 hover:border-indigo-400 hover:bg-slate-800/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf,.docx" 
            className="hidden" 
          />
          
          {!file ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center space-y-4 cursor-pointer"
            >
              <div className="p-4 bg-indigo-500/20 rounded-full">
                <UploadCloud className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-200">Click or drag and drop to upload</p>
                <p className="text-sm text-slate-400 mt-1">Supports .PDF and .DOCX</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-between bg-slate-800/80 p-4 rounded-lg border border-slate-600"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <File className="text-indigo-400 w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setFile(null)}
                className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Job Description Area */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            Target Job Description
          </label>
          <textarea 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <button 
          type="submit"
          disabled={!file || !jobDescription.trim()}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          Analyze & Optimize Resume
        </button>
      </form>
    </div>
  );
}
