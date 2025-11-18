// src/components/chat/chatSheet.jsx
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function ChatSheet({ open, onOpenChange, children }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full flex-col p-0 w-full sm:max-w-md"
      >
        {/* ⭐ shadcn 기본 헤더 구조 (제목 왼쪽) */}
        <SheetHeader className="h-[46px] px-4 flex justify-start">
          <SheetTitle className="text-[16px] font-semibold text-gray-600">
            Chat with Q-Rex
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
