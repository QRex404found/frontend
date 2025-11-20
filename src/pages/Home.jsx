import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, QrCode, Users, FileText, ArrowRight, Sparkles } from 'lucide-react';

// [수정 사항] 로컬 환경에서는 아래 주석을 풀고, 온라인 URL 줄을 지우시면 됩니다.
import videoBg from '@/assets/background.mp4'; 
//const videoBg = "https://cdn.pixabay.com/video/2020/05/25/40104-424929345_large.mp4";

// Shadcn UI Tooltip
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ----------------------------------------------------------------------
// [1] 데이터 정의
// ----------------------------------------------------------------------
const tabs = [
  {
    id: 'analysis',
    label: 'Analysis',
    icon: QrCode,
    title: '데이터가 들려주는 이야기',
    desc: '단순한 조회수를 넘어, 사용자들의 행동 패턴과 유입 경로를 시각화된 차트로 제공합니다.',
    buttonText: '분석 기능 체험하기',
    imageColor: 'bg-blue-50'
  },
  {
    id: 'community',
    label: 'Community',
    icon: Users,
    title: '함께 성장하는 네트워크',
    desc: 'QRex 사용자들과 인사이트를 공유하고 질문하세요. 집단지성의 힘으로 문제를 해결할 수 있습니다.',
    buttonText: '커뮤니티 둘러보기',
    imageColor: 'bg-purple-50'
  },
  {
    id: 'mypost',
    label: 'My Post',
    icon: FileText,
    title: '나만의 기록, 완벽한 관리',
    desc: '내가 생성한 모든 QR 코드와 게시물을 한눈에 관리하세요. 수정, 삭제, 성과 확인까지 가능합니다.',
    buttonText: '내 게시물 관리',
    imageColor: 'bg-lime-50'
  }
];

// ----------------------------------------------------------------------
// [2] PillNav Item (React Bits 스타일 - Gooey Animation)
// ----------------------------------------------------------------------
const PillNavItem = ({ item, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);
  const [circleSize, setCircleSize] = useState(0);

  // 버튼 크기에 맞춰 내부에서 커질 원의 지름 계산
  useEffect(() => {
    if (buttonRef.current) {
      const { width, height } = buttonRef.current.getBoundingClientRect();
      const R = Math.sqrt((width / 2) ** 2 + height ** 2);
      const D = Math.ceil(2 * R) + 10;
      setCircleSize(D);
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={() => onClick(item.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative px-8 py-3 rounded-full text-base font-bold overflow-hidden
        transition-colors duration-300 z-10 cursor-pointer select-none outline-none
        ${isActive ? 'text-white' : 'text-slate-500'}
      `}
    >
      {/* 1. 호버 애니메이션 (비활성 상태일 때 아래에서 원이 올라옴) */}
      {!isActive && (
        <motion.div
          initial={{ y: "100%", x: "-50%" }}
          animate={{ 
            y: isHovered ? "5%" : "100%", 
            opacity: isHovered ? 1 : 0 
          }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="absolute left-1/2 bottom-0 bg-slate-200 rounded-full pointer-events-none -z-20"
          style={{ 
            width: circleSize, 
            height: circleSize,
            transformOrigin: "center bottom"
          }}
        />
      )}

      {/* 2. 활성 상태 배경 (클릭 시 따라오는 효과) */}
      {isActive && (
        <motion.div
          layoutId="activePillBackground"
          className="absolute inset-0 bg-slate-900 rounded-full -z-10 shadow-lg"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* 텍스트 라벨 */}
      <span className={`relative z-10 block whitespace-nowrap transition-colors duration-300 ${isHovered && !isActive ? 'text-slate-900' : ''}`}>
        {item.label}
      </span>
    </button>
  );
};

// ----------------------------------------------------------------------
// [3] PillNav Container
// ----------------------------------------------------------------------
const PillNav = ({ items, activeTabId, onTabChange }) => {
  return (
    <div className="inline-flex bg-slate-100 p-1.5 rounded-full shadow-inner relative mb-8 transform scale-90 md:scale-75 origin-top">
      {items.map((item) => (
        <PillNavItem 
          key={item.id} 
          item={item} 
          isActive={activeTabId === item.id} 
          onClick={onTabChange} 
        />
      ))}
    </div>
  );
};

// ----------------------------------------------------------------------
// [4] 등장 애니메이션 컴포넌트
// ----------------------------------------------------------------------
const AnimatedContent = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: "easeOut", delay: delay }}
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// [5] 메인 Home 컴포넌트
// ----------------------------------------------------------------------
export function Home() {
  const infoSectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const scrollToInfo = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='w-full'>
      
      {/* ------------------------------------------ */}
      {/* 섹션 1: 비디오 배경 */}
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
                  className="p-3 rounded-full bg-lime-500/60 backdrop-blur-sm border border-white/20 hover:bg-lime-600/60 transition-all duration-300 animate-bounce cursor-pointer text-white"
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
      {/* 섹션 2: 소개 및 탭 컨텐츠 */}
      {/* ------------------------------------------ */}
      <div 
        ref={infoSectionRef} 
        className="relative w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] -ml-4 -mr-4 md:-ml-8 md:-mr-8 min-h-[calc(100vh-80px)] flex items-center justify-center bg-white text-slate-900 py-24"
      >
        <div className="container mx-auto px-4 text-center max-w-5xl">
          
          {/* 헤더 문구 */}
          <AnimatedContent className="mt-12 md:mt-24">
            <h2 className="text-4xl md:text-6xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              ABOUT QRex
            </h2>
          </AnimatedContent>

          {/* 부제목 */}
          <AnimatedContent delay={0.1}>
            <p className="text-lg md:text-xl text-slate-400 font-medium mb-2 tracking-wide">
              Let's Learn About QRex!
            </p>
          </AnimatedContent>

          {/* Pill Navigation */}
          <AnimatedContent delay={0.2}>
            <div className="flex justify-center">
              <PillNav 
                items={tabs} 
                activeTabId={activeTab} 
                onTabChange={setActiveTab} 
              />
            </div>
          </AnimatedContent>

          {/* 카드 컨텐츠 */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {tabs.map((tab) => (
                tab.id === activeTab && (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-white border border-slate-100 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-slate-200/60 hover:shadow-lime-500/10 transition-shadow duration-500 text-left">
                      
                      {/* 왼쪽 설명 */}
                      <div className="order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 text-lime-700 text-xs font-bold mb-5 uppercase tracking-wider">
                          <Sparkles size={14} />
                          {tab.label} Feature
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                          {tab.title}
                        </h3>
                        <p className="text-slate-500 text-lg leading-relaxed mb-8">
                          {tab.desc}
                        </p>
                        <button className="group inline-flex items-center gap-2 font-bold text-slate-900 border-b-2 border-lime-500 pb-1 hover:text-lime-600 transition-colors">
                          {tab.buttonText}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      {/* 오른쪽 아이콘 */}
                      <div className={`order-1 md:order-2 h-64 md:h-72 rounded-2xl ${tab.imageColor} flex items-center justify-center relative overflow-hidden group`}>
                         <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]" />
                         
                        <motion.div
                          animate={{ y: [0, -12, 0] }}
                          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                          className="relative z-10 p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/40 text-lime-600"
                        >
                          <tab.icon size={72} strokeWidth={1.5} />
                        </motion.div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/50 rounded-full blur-3xl" />
                      </div>

                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}