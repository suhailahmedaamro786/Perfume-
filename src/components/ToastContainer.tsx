import React from 'react';
import { Check, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PageRoute } from '../types/store';

interface ToastContainerProps {
  onNavigate: (page: PageRoute) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ onNavigate }) => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed right-4 bottom-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 border border-[#D4AF37]/60 bg-[#141414]/95 px-4 py-3 text-xs text-[#F9F6F0] shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[#D4AF37] text-[#0B0B0B]">
              <Check className="h-3 w-3" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-[#F1D27A]">{toast.title}</p>
              {toast.message && <p className="text-[#D6D0C4]">{toast.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {toast.title.includes('Bag') && (
              <button
                type="button"
                onClick={() => onNavigate('cart')}
                className="underline decoration-[#D4AF37] underline-offset-4 text-[#F1D27A] hover:text-white whitespace-nowrap"
              >
                View Bag
              </button>
            )}
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Close notification"
              className="p-1 text-[#A39E93] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
