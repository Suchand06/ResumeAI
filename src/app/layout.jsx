import { AuthProvider } from '@/components/AuthProvider';
import './globals.css';

export const metadata = {
  title: 'AI Resume Optimizer',
  description: 'Optimize your resume for ATS with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <header className="w-full p-6 flex items-center justify-between border-b border-white/5 bg-slate-900/20 backdrop-blur-md sticky top-0 z-50">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              ResumeAI
            </h1>
          </header>
          <main className="flex-grow p-6 md:p-12 flex flex-col">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
