// src/components/chat/QrexChatWidget.jsx

import React, { useState } from "react";
import ChatFloatingButton from "./chatButton";
import ChatSheet from "./chatSheet";
import ChatBody from "./chatBody";

export default function QrexChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 우측 하단 버튼 */}
      <ChatFloatingButton onClick={() => setOpen(true)} />

      {/* Sheet (채팅 UI 포함) */}
      <ChatSheet open={open} onOpenChange={setOpen}>
        <ChatBody />
      </ChatSheet>
    </>
  );
}
