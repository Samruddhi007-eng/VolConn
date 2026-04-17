import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-volconn-navy/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div 
        className={`bg-white w-full ${maxWidth} max-h-[85vh] overflow-y-auto p-8 rounded-[2.5rem] shadow-2xl relative`}
        style={{ animation: 'modalIn 0.3s ease-out' }}
      >
        <button 
          onClick={onClose} 
          className="absolute right-6 top-6 text-slate-300 hover:text-red-500 transition-colors"
        >
          <X/>
        </button>
        {title && (
          <h2 className="text-2xl font-black text-volconn-navy mb-1 tracking-tighter pr-8">{title}</h2>
        )}
        {subtitle && (
          <p className="text-slate-400 text-sm mb-6 font-medium">{subtitle}</p>
        )}
        {children}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Modal;
