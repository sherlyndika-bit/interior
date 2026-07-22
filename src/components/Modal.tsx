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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto font-sans">
      <div
        className={`relative w-full ${maxWidth} bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-8 transform transition-all animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button if hideHeader is true */}
        {hideHeader ? (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-950/80 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-700 transition-colors shadow-lg"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          /* Standard Modal Header */
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2 tracking-wide">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[85vh] overflow-y-auto text-stone-200">
          {children}
        </div>
      </div>
    </div>
  );
};
