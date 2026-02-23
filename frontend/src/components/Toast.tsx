'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, type, message, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => onRemove(toast.id), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  const config = {
    success: { icon: '✓', bg: 'bg-green-500', border: 'border-green-600' },
    error: { icon: '✕', bg: 'bg-red-500', border: 'border-red-600' },
    warning: { icon: '⚠', bg: 'bg-yellow-500', border: 'border-yellow-600' },
    info: { icon: 'ℹ', bg: 'bg-blue-500', border: 'border-blue-600' },
  };

  const { icon, bg } = config[toast.type];

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white ${bg} animate-in slide-in-from-right duration-300`}>
      <span className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-full text-sm">
        {icon}
      </span>
      <span className="font-medium">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}

// Standalone toast function for simple usage
let toastFn: ((type: ToastType, message: string) => void) | null = null;

export function setToastFunction(fn: typeof toastFn) {
  toastFn = fn;
}

export const toast = {
  success: (message: string) => toastFn?.('success', message),
  error: (message: string) => toastFn?.('error', message),
  warning: (message: string) => toastFn?.('warning', message),
  info: (message: string) => toastFn?.('info', message),
};
