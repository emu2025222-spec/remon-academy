
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071535]/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#e8e3d8] bg-[#f8f7f4] p-6 shadow-2xl"
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <h3
                  id="confirm-dialog-title"
                  className="text-lg font-bold text-[#0b1f4d]"
                >
                  {title}
                </h3>

                <p
                  id="confirm-dialog-message"
                  className="mt-2 text-sm leading-6 text-slate-600"
                >
                  {message}
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="ghost"
                onClick={onCancel}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={onConfirm}
                loading={loading}
                className="w-full sm:w-auto"
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
