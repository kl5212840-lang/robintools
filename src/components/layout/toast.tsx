"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface ToastContextValue {
  show: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ show: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<string | null>(null);

  const show = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1800);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-6 z-[100] flex items-center gap-2 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-2.5 shadow-xl"
            style={{ color: "var(--color-success)" }}
          >
            <Check className="h-4 w-4" />
            <span className="text-[14px] font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
