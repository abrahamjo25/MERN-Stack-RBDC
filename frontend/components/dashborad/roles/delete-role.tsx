"use client";

import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { apiService } from "@/lib/apiService";

export function DeleteRole({ roleId }: { roleId: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await apiService.delete(`/api/admin/role/${roleId}`);
      toast.success(res?.data.message || "Role deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete role");
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
        title="Delete Role?"
        description="This will permanently delete the role. Are you sure?"
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
}
