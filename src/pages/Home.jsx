import React, { useRef } from 'react';
import videoBg from '@/assets/background.mp4';
import { ChevronDown } from 'lucide-react'; // 화살표 아이콘
import { motion } from 'framer-motion'; // 애니메이션용

// Shadcn UI Tooltip 컴포넌트 경로에 맞춰 import 해주세요
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// [애니메이션 컴포넌트] React Bits 스타일의 등장 효과
const AnimatedContent = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }} // 시작: 투명, 아래쪽, 블러 처리
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} // 등장: 불투명, 원위치, 블러 해제
      transition={{ duration: 0.8, ease: "easeOut", delay: delay }} // 부드러운 감속
      viewport={{ once: true, amount: 0.3 }} // 한 번만 실행, 30% 보일 때 트리거
    >
      {children}
    </motion.div>
  );
};

export function Home() {
  // 스크롤 이동을 위한 Ref 생성
  const infoSectionRef = useRef(null);

  // 클릭 시 부드럽게 아래로 이동하는 함수
  const scrollToInfo = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='w-full'>
      {/* ------------------------------------------ */}
      {/* 섹션 1: 비디오 배경 (기존 코드 유지 + 화살표 추가) */}
      {/* ------------------------------------------ */}
      <div className="relative w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] -ml-4 -mr-4 -mt-4 md:-ml-8 md:-mr-8 md:-mt-8 h-[calc(100vh-80px)] overflow-hidden">
        
        {/* 🎥 배경 비디오 */}
        <video
          src={videoBg}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 object-cover w-full h-full"
        />

        {/* ⬇️ 하단 화살표 버튼 & 툴팁 */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={scrollToInfo}
                  className="p-3 rounded-full bg-lime-500/20 backdrop-blur-sm border border-white/20 hover:bg-lime-600/20 transition-all duration-300 animate-bounce cursor-pointer text-white"
                >
                  <ChevronDown size={32} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black/80 text-white border-white/10 backdrop-blur-md">
                <p>Discover QRex</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* ------------------------------------------ */}
      {/* 섹션 2: 소개글 (스크롤 시 보여질 화면) */}
      {/* ------------------------------------------ */}
      {/* min-h-[calc(100vh-80px)]로 설정하여 윗 화면과 동일한 높이 확보 */}
      <div 
        ref={infoSectionRef} 
        className="relative w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] -ml-4 -mr-4 md:-ml-8 md:-mr-8 min-h-[calc(100vh-80px)] flex items-center justify-center bg-white text-slate-900 py-20"
      >
        <div className="container mx-auto px-4 text-center max-w-4xl">
          
          {/* 애니메이션 제목 */}
          <AnimatedContent>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              ABOUT QRex
            </h2>
          </AnimatedContent>

          {/* 애니메이션 본문 (약간의 딜레이 추가) */}
          <AnimatedContent delay={0.2}>
            <p className="text-lg md:text-xl text-gray-500 mb-8 leading-relaxed">
              우리는 단순한 서비스를 넘어 새로운 경험을 창조합니다.<br />
              아래 버튼을 눌러 QRex의 놀라운 기능들을 더 자세히 살펴보세요.
            </p>
          </AnimatedContent>

        </div>
      </div>
    </div>
  );
}