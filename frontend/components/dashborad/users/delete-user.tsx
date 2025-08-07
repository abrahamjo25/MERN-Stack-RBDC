"use client";

import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { apiService } from "@/lib/apiService";

export function DeleteUser({ userId }: { userId: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      let res = await apiService.delete(`/api/admin/user/${userId}`);
      toast.success(`${res?.data.message}`);
    } catch (error: any) {
      toast.error(`${error.response.data.message}`);
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
        title="Delete User?"
        description="This will permanently delete the user. Are you sure?"
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
}
