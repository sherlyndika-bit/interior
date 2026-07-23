import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
    info: <Sparkles className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-200 dark:border-emerald-500/30 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white',
    error: 'border-rose-200 dark:border-rose-500/30 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white',
    info: 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 font-sans">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md ${borderColors[toastMessage.type]}`}>
        {icons[toastMessage.type]}
        <span className="text-xs font-semibold tracking-wide pr-2">{toastMessage.text}</span>
      </div>
    </div>
  );
};
