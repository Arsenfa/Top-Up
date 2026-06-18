"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return {
    toast: (message: string, options?: { type?: ToastType; title?: string; duration?: number }) => {
      context.addToast(options?.type || "info", message, options?.title, options?.duration);
    },
    success: (message: string, title?: string) => context.addToast("success", message, title),
    error: (message: string, title?: string) => context.addToast("error", message, title),
    warning: (message: string, title?: string) => context.addToast("warning", message, title),
    info: (message: string, title?: string) => context.addToast("info", message, title),
  };
}

function ToastContainer({ toasts, removeToast }: { toasts: ToastMessage[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    error: <XCircle className="w-5 h-5 text-danger" />,
    info: <Info className="w-5 h-5 text-info" />,
  };

  const borderColors = {
    success: "border-success/30",
    warning: "border-warning/30",
    error: "border-danger/30",
    info: "border-info/30",
  };

  return (
    <div
      className={`flex gap-3 p-4 rounded-xl border pointer-events-auto shadow-lg bg-bg-secondary ${borderColors[toast.type]}`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-grow">
        {toast.title && <h4 className="font-semibold text-sm text-text-primary mb-0.5">{toast.title}</h4>}
        <p className="text-xs text-text-secondary leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors h-fit p-0.5 rounded-md hover:bg-bg-tertiary"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
