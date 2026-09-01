import Button from "./Button";

function ConfirmDialog({
  cancelLabel = "취소",
  confirmLabel = "확인",
  isProcessing = false,
  message,
  onCancel,
  onConfirm,
  title,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 px-6 backdrop-blur-[1px]">
      <div
        aria-modal="true"
        className="w-full max-w-[320px] rounded-md border border-gray-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.14)]"
        role="dialog"
      >
        <p className="text-base font-semibold text-black">{title}</p>
        {message ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-500">{message}</p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            className="min-w-16"
            disabled={isProcessing}
            onClick={onCancel}
            size="sm"
          >
            {cancelLabel}
          </Button>
          <Button
            className="min-w-16"
            disabled={isProcessing}
            onClick={onConfirm}
            size="sm"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
