import React from "react";
import { Button } from "@/components/ui/button";
import { deleteAccountApi } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { removeToken } from "@/utils/tokenUtils";

export default function DeleteAccountTab({ onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDelete = async () => {
    try {
      await deleteAccountApi();
      removeToken();
      logout?.();
      onClose?.();

      navigate("/login", {
        replace: true,
        state: {
          toast: { type: "success", message: "Your account has been successfully deleted." }
        }
      });

    } catch (error) {
      navigate("/login", {
        replace: true,
        state: {
          toast: { type: "error", message: "An error occurred while deleting your account." }
        }
      });
    }
  };

  return (
    <div className="p-3 border rounded-md bg-white space-y-4 text-sm">

      <p className="text-red-600 font-medium text-base">
        ⚠ Warning
      </p>

      <p className="text-red-600 leading-relaxed">
        This action is irreversible.
        <br />
        Your account and associated data will be permanently deleted.
      </p>

      <Button
        onClick={handleDelete}
        variant="destructive"
        className="w-full text-sm font-medium"
      >
        Delete Account
      </Button>
    </div>
  );
}
