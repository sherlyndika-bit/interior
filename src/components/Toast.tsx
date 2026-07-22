import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    info: <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100',
    error: 'border-rose-500/30 bg-rose-950/90 text-rose-100',
    info: 'border-amber-500/30 bg-stone-900/90 text-amber-100'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short font-sans">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-2xl ${borderColors[toastMessage.type]}`}>
        {icons[toastMessage.type]}
        <span className="text-xs font-semibold tracking-wide pr-2">{toastMessage.text}</span>
      </div>
    </div>
  );
};
