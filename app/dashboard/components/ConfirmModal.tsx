'use client';

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Supprimer',
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-lg border border-[#262626] bg-[#111] p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 font-semibold text-on-surface">{title}</h3>
        <p className="mb-6 text-sm text-muted">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-[#262626] px-4 py-2 text-sm text-muted transition-colors hover:text-on-surface"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
