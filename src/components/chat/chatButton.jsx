// src/components/chat/chatButton.jsx
//모든 페이지에서 보이는 챗봇 버튼
import React from "react";
import { Bot } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent, } from "@/components/ui/tooltip";

export default function ChatButton({ onClick }) { //버튼이므로 onClick 함수를 props로 받음
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" onClick={onClick} //버튼 누르면 부모가 넘겨준 onClick 실행
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-lime-500 text-white flex items-center justify-center
              shadow-lg shadow-gray-500/70 hover:bg-lime-600 transition-colors">
            <Bot className="h-7 w-7" />
          </button>
        </TooltipTrigger>

        <TooltipContent //마우스 올리면 왼쪽에 tooltip 뜸
          side="left"
          className="text-sm"
        >
          Chat with Q-Rex
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
