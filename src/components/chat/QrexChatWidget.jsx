import React, { useEffect, useState } from "react";
import ChatFloatingButton from "./chatButton";
import ChatSheet from "./chatSheet";
import ChatBody from "./chatBody";
import useAuth from "@/hooks/useAuth";

export default function QrexChatWidget() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();

  // 🔥 토큰 만료 → 챗봇 자동 닫기
  useEffect(() => {
    const closeHandler = () => setOpen(false);
    window.addEventListener("qrex-chat-close", closeHandler);
    return () => window.removeEventListener("qrex-chat-close", closeHandler);
  }, []);

  return (
    <>
      <ChatFloatingButton onClick={() => setOpen(true)} />

      <ChatSheet open={open} onOpenChange={setOpen}>
        <ChatBody isOpen={open} user={isLoggedIn ? user : null} />
      </ChatSheet>
    </>
  );
}
