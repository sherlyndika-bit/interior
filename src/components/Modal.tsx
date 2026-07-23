import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  hideHeader?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
  hideHeader = false
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 dark:bg-zinc-950/75 backdrop-blur-xs overflow-y-auto font-sans animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 transform transition-all animate-in zoom-in-95 duration-150`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button if hideHeader is true */}
        {hideHeader ? (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          /* Standard Clean Modal Header */
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto text-zinc-900 dark:text-zinc-100">
          {children}
        </div>
      </div>
    </div>
  );
};
