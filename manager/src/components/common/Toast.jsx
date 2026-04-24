import { createContext, useCallback, useMemo, useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-500',
  error: 'bg-red-50 text-red-700 border-red-500',
  warning: 'bg-amber-50 text-amber-700 border-amber-500',
  info: 'bg-blue-50 text-blue-700 border-blue-500',
};

const TOAST_ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      toasts,
      showToast,
      hideToast,
      clearAllToasts,
    }),
    [toasts, showToast, hideToast, clearAllToasts]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <Toastr toasts={toasts} onClose={hideToast} />,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const Toastr = ({ toasts = [], onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[800] flex flex-col gap-2 max-w-sm sm:max-w-full sm:left-5">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const Icon = TOAST_ICONS[toast.type] || Info;
  const styleClass = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

  return (
    <div className={`${styleClass} rounded-xl py-3 px-4 flex items-start gap-3 shadow-xl animate-slide-down border`}>
      <span className="flex-shrink-0"><Icon size={20} /></span>
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="bg-transparent border-0 p-0.5 cursor-pointer opacity-70 transition-opacity duration-150 hover:opacity-100"
      >
        <X size={16} />
      </button>
    </div>
  );
};
