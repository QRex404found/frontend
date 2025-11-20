import React, { useState, useRef } from 'react';
import videoBg from '@/assets/background.mp4'; // 로컬 영상 경로 유지
import { ChevronDown, BarChart3, Users, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Shadcn UI Tooltip
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ----------------------------------------------------------------------
// [1] 데이터 정의 (탭 메뉴 및 설명 카드 내용)
// ----------------------------------------------------------------------
const tabs = [
  {
    id: 'analysis',
    label: 'Analysis',
    icon: BarChart3,
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
// [2] PillNav 컴포넌트 (알약 탭 애니메이션)
// ----------------------------------------------------------------------
const PillNav = ({ items, activeTabId, onTabChange }) => {
  return (
    <div className="inline-flex bg-slate-100 p-1.5 rounded-full shadow-inner relative mb-12">
      {items.map((item) => {
        const isActive = activeTabId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`
              relative px-6 py-2.5 rounded-full text-sm md:text-base font-bold transition-colors duration-300 z-10
              ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-900'}
            `}
          >
            {/* 활성 탭 배경 애니메이션 */}
            {isActive && (
              <motion.div
                layoutId="activePillBackground"
                className="absolute inset-0 bg-lime-500 rounded-full -z-10 shadow-lg shadow-lime-500/30"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ----------------------------------------------------------------------
// [3] 등장 애니메이션 컴포넌트 (기존 유지)
// ----------------------------------------------------------------------
const AnimatedContent = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: "easeOut", delay: delay }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// [4] 메인 Home 컴포넌트
// ----------------------------------------------------------------------
export function Home() {
  const infoSectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState(tabs[0].id); // 탭 상태 관리

  const scrollToInfo = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='w-full'>
      {/* 섹션 1: 비디오 배경 (기존 코드 유지) */}
      <div className="relative w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] -ml-4 -mr-4 -mt-4 md:-ml-8 md:-mr-8 md:-mt-8 h-[calc(100vh-80px)] overflow-hidden">
        <video
          src={videoBg}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 object-cover w-full h-full"
        />

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

      {/* 섹션 2: 소개글 + 탭 기능 추가 */}
      <div 
        ref={infoSectionRef} 
        className="relative w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] -ml-4 -mr-4 md:-ml-8 md:-mr-8 min-h-[calc(100vh-80px)] flex items-center justify-center bg-white text-slate-900 py-20"
      >
        <div className="container mx-auto px-4 text-center max-w-5xl">
          
          {/* 기존 헤더 문구 유지 */}
          <AnimatedContent>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              ABOUT QRex
            </h2>
          </AnimatedContent>

          <AnimatedContent delay={0.2}>
            <p className="text-lg md:text-xl text-gray-500 mb-12 leading-relaxed">
              Let's Learn About QRex!
            </p>
          </AnimatedContent>

          {/* [추가됨] Pill Navigation (탭 메뉴) */}
          <AnimatedContent delay={0.3}>
            <div className="flex justify-center">
              <PillNav 
                items={tabs} 
                activeTabId={activeTab} 
                onTabChange={setActiveTab} 
              />
            </div>
          </AnimatedContent>

          {/* [추가됨] 카드 컨텐츠 (탭 클릭 시 변경) */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-200/50 text-left">
                      
                      {/* 왼쪽: 텍스트 설명 */}
                      <div className="order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 text-lime-700 text-xs font-bold mb-4 uppercase tracking-wider">
                          <Sparkles size={14} />
                          {tab.label} Feature
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                          {tab.title}
                        </h3>
                        <p className="text-slate-500 text-lg leading-relaxed mb-6">
                          {tab.desc}
                        </p>
                        <button className="group inline-flex items-center gap-2 font-bold text-slate-900 border-b-2 border-lime-500 pb-1 hover:text-lime-600 transition-colors">
                          {tab.buttonText}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      {/* 오른쪽: 아이콘/이미지 영역 */}
                      <div className={`order-1 md:order-2 h-64 rounded-2xl ${tab.imageColor} flex items-center justify-center relative overflow-hidden`}>
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                          className="relative z-10 p-6 bg-white rounded-3xl shadow-lg text-lime-500"
                        >
                          <tab.icon size={64} strokeWidth={1.5} />
                        </motion.div>
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