"use client";

import { Button } from "@/components/ui/button";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <AlertDialog.Content className="fixed z-50 top-[50%] left-[50%] max-w-md w-full -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg">
          <AlertDialog.Title className="text-lg font-semibold">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-muted-foreground mt-2">
            {description}
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" disabled={isLoading}>
                {cancelText}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                variant="destructive"
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : confirmText}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
