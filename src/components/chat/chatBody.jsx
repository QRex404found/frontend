// src/components/chat/ChatBody.jsx
import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import qrexProfile from "@/assets/qrex_profile.png";

export default function ChatBody() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "안녕하세요! 어떤 도움이 필요하신가요?",
    },
  ]);

  const [input, setInput] = useState("");

  const viewportRef = useRef(null);

  const scrollToBottom = () => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  };

  //메시지 배열이 변할 때 마다 맨 아래로 가도록.
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //컴포넌트가 처음 렌더링될 때 실행.
  useEffect(() => {
    const viewport = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (viewport) {
      viewportRef.current = viewport;
      scrollToBottom();
    }
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return; //아무 내용이 없다면(공백) 메시지 전송없이 함수 종료

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    const mockReply = {
      id: Date.now() + 1,
      role: "assistant",
      text: "아직은 UI만 연결된 상태예요. 곧 QRex 에이전트와 연결됩니다!",
    };

    setMessages((prev) => [...prev, userMessage, mockReply]);
    setInput("");
    scrollToBottom();
  };

  const handleEnter = (e) => { //엔터키 누르면 전송 가능
    if (e.key === "Enter" && !e.shiftKey) { //shift+ender는 줄바꿈
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-hidden px-4">
        <ScrollArea className="h-full pr-2">
          <div className="flex flex-col justify-end min-h-full gap-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <img
                    src={qrexProfile}
                    alt="Q-Rex"
                    className="w-10 h-10 rounded-full mr-2 object-contain bg-white shadow-sm"
                  />
                )}

                <div
                  className={`
                    max-w-[75%] px-4 py-2 text-sm rounded-2xl
                    ${
                      msg.role === "user"
                        ? "bg-lime-500 text-white rounded-br-none"
                        : "bg-[#E2E8F0] text-black rounded-bl-none"
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 입력창 */}
      <div className="border-t px-4 py-3 bg-white">
        <div className="flex items-center w-full bg-[#F1F5F9] rounded-full px-4 py-[6px] shadow-sm">
          <input
            className="flex-grow bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
            placeholder="Write a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleEnter}
          />
          <button
            onClick={handleSend}
            className="ml-2 h-9 w-9 rounded-full bg-lime-500 hover:bg-lime-600 flex items-center justify-center transition-colors"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
