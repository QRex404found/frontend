// src/components/chat/QrexChatWidget.jsx
import React, { useState } from "react";
import ChatFloatingButton from "./chatButton";
import ChatSheet from "./chatSheet";
import ChatBody from "./chatBody";
import useAuth from "@/hooks/useAuth";

export default function QrexChatWidget() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();

  return (
    <>
      <ChatFloatingButton onClick={() => setOpen(true)} />

      <ChatSheet open={open} onOpenChange={setOpen}>
        <ChatBody isOpen={open} user={isLoggedIn ? user : null} />
      </ChatSheet>
    </>
  );
}
