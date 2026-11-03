"use client";

import { useEffect, useRef } from "react";

// Custom confirmation dialog (used instead of the browser's confirm()).
export default function ConfirmModal({
  open,
  title,
  text,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  busy = false,
  onConfirm,
  onClose,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      onClose={onClose}
      onCancel={(e) => {
        // Esc must not dismiss the dialog while a request is in flight.
        if (busy) e.preventDefault();
      }}
    >
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="py-3 text-sm leading-relaxed text-base-content/70">{text}</p>
        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${danger ? "btn-error" : "btn-primary"}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy && <span className="loading loading-spinner loading-sm" />}
            {confirmLabel}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button aria-label="Close dialog">close</button>
      </form>
    </dialog>
  );
}
