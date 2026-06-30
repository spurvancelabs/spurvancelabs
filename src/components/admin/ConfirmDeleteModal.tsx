'use client';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDeleteModal({ isOpen, title, message, onConfirm, onCancel, isLoading }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 max-w-md w-full">
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        <p className="text-gray-400 mt-2 text-sm">{message}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
