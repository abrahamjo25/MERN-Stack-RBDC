"use client";

import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { apiService } from "@/lib/apiService";

export function DeletePermission({ permissionId }: { permissionId: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await apiService.delete(`/api/admin/permission/${permissionId}`);
      toast.success(res?.data.message || "Permission deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete permission");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setTimeout(() => setConfirmOpen(true), 0);
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleDelete}
        title="Delete Permission?"
        description="This will permanently delete the permission. Are you sure?"
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
}
