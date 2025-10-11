"use client";
export default function AdminModal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold">{title}</h3>
          <button onClick={onClose} className="px-2 py-1 text-slate-600">✕</button>
        </div>
        <div className="mt-3">
          {children}
        </div>
      </div>
    </div>
  );
}