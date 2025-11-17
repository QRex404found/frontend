// src/components/profile/EditProfileTab.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { updateProfileApi } from "@/api/auth";
import { removeToken } from "@/utils/tokenUtils";
import { useNavigate } from "react-router-dom";

export default function EditProfileTab() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.username ?? "");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const handleSave = async () => {
    if (!name.trim()) return;

    if (password !== verifyPassword) return;

    try {
      await updateProfileApi({
        newName: name,
        newPassword: password,
        verifyPassword,
      });

      removeToken();
      logout?.();
      setUser(null);

      navigate("/login", {
        replace: true,
        state: {
          toast: { type: "success", message: "Profile updated. Please sign in again." }
        }
      });
    } catch (error) {
      navigate("/login", {
        replace: true,
        state: {
          toast: { type: "error", message: error.message || "Profile update failed." }
        }
      });
    }
  };

  const getPasswordStateClass = () => {
    if (!password && !verifyPassword) return "";
    return password === verifyPassword ? "border-green-500" : "border-red-500";
  };

  return (
    <div className="p-3 space-y-4 text-sm bg-white border rounded-md">
      <div className="flex flex-col gap-1">
        <label className="font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`border rounded-md px-3 py-2 ${getPasswordStateClass()}`}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">Verify Password</label>
        <input
          type="password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
          className={`border rounded-md px-3 py-2 ${getPasswordStateClass()}`}
        />
      </div>

      <Button onClick={handleSave} className="w-full font-medium text-white bg-lime-500 hover:bg-lime-600">
        Save changes
      </Button>
    </div>
  );
}
