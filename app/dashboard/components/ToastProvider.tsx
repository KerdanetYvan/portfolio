'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { X } from 'lucide-react';

type ToastType = 'success' | 'error';
type Toast = { id: number; message: string; type: ToastType };

const ToastContext = createContext<{
  showToast: (message: string, type?: ToastType) => void;
}>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg
              ${toast.type === 'success'
                ? 'border-[#00D26A]/20 bg-[#0f1f13] text-[#00D26A]'
                : 'border-red-500/20 bg-[#1f0f0f] text-red-400'
              }`}
          >
            <span>{toast.message}</span>
            <button onClick={() => dismiss(toast.id)} className="ml-auto opacity-60 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
