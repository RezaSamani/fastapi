import * as React from "react";

export default function Modal({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={() => onClose?.()} />
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
        {children}
      </div>
    </div>
  );
}
