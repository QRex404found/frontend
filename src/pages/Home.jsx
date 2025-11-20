import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, QrCode, Users, FileText, ArrowRight } from 'lucide-react';

// 로컬 영상
import videoBg from '@/assets/background.mp4';

// Tooltip
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


// ----------------------------------------------------------------------
// Feature 카드 데이터
// ----------------------------------------------------------------------
const features = [
  {
    id: 'analysis',
    icon: QrCode,
    title: '데이터 기반 분석',
    desc: 'QR 코드 스캔 결과를 기반으로 위협도 및 패턴을 시각화하여 제공합니다.',
    button: '분석 기능 체험하기'
  },
  {
    id: 'community',
    icon: Users,
    title: '함께 만드는 지식',
    desc: 'QR 보안에 대한 질문과 경험을 공유하는 커뮤니티로 함께 성장하세요.',
    button: '커뮤니티 둘러보기'
  },
  {
    id: 'mypost',
    icon: FileText,
    title: '내 기록 한눈에 보기',
    desc: '내가 생성한 모든 QR 분석 이력을 체계적으로 관리할 수 있습니다.',
    button: '내 게시물 관리'
  }
];


// ----------------------------------------------------------------------
// 메인 Home 컴포넌트
// ----------------------------------------------------------------------
export function Home() {
  const infoSectionRef = useRef(null);

  const scrollToInfo = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='w-full'>

      {/* ====================================================== */}
      {/* SECTION 1 — 비디오 히어로 */}
      {/* ====================================================== */}
      <div className="relative w-[calc(100%+2rem)] md:w-[calc(100%+4rem)]
        -ml-4 -mr-4 -mt-4 md:-ml-8 md:-mr-8 md:-mt-8 
        h-[calc(100vh-80px)] overflow-hidden"
      >
        <video
          src={videoBg}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 object-cover w-full h-full"
        />

        {/* 미니멀 화살표 */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={scrollToInfo}
                  className="
    p-2 bg-transparent 
    text-white 
    opacity-80 hover:opacity-100 
    transition-all duration-300
  "
                >
                  <ChevronDown
                    size={40}
                    strokeWidth={1.5}
                    className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                  />
                </button>

              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black/80 text-white border-white/10 backdrop-blur-md"
              >
                <p>Learn About QRex!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>



      {/* ====================================================== */}
      {/* SECTION 2 — ABOUT (Apple Style, Minimal & Typography) */}
      {/* ====================================================== */}
      <div ref={infoSectionRef} className="w-full bg-white text-slate-900 py-48 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Main Header */}
          <div className="text-center mb-40">
            <h2 className="text-6xl font-semibold tracking-tight leading-tight mb-6">
              QR 데이터를 <span className="text-lime-600">더 안전하게.</span><br />
              더 정확하게.
            </h2>
            <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
              QRex는 QR 코드에 담긴 정보를 분석하고 위험 신호를 탐지하여
              사용자에게 더 안전한 QR 환경을 제공합니다.
            </p>
          </div>


          {/* What is QRex */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-32 mb-48 items-center">
            <div>
              <h3 className="text-4xl font-semibold mb-6">QRex란 무엇인가요?</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                QRex는 단순한 QR 스캔 도구가 아닙니다.<br />
                QR 코드 분석, 위험 탐지, 사용자 보호,
                그리고 히스토리 관리까지 제공하는 통합 플랫폼입니다.
              </p>
            </div>

            <div className="flex justify-center">
              <QrCode className="w-40 h-40 text-lime-600" strokeWidth={1.1} />
            </div>
          </div>


          {/* Analysis Detail */}
          <div className="mb-44">
            <h3 className="text-5xl font-semibold mb-10">Analysis</h3>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mb-20">
              QR 코드의 URL 구조, 도메인 안전성, 위험 신호를 분석하는
              QRex의 핵심 기능입니다.
            </p>

            <div className="flex justify-center mb-16">
              <QrCode className="w-32 h-32 text-lime-600" />
            </div>

            <ul className="text-slate-700 text-lg space-y-4 list-disc pl-6">
              <li>URL 위험도 평가 (피싱, 악성 사이트 탐지)</li>
              <li>QR 파라미터 분석</li>
              <li>도메인 신뢰도 체크</li>
              <li>안전 리포트 제공</li>
            </ul>
          </div>


          {/* Community Detail */}
          <div className="mb-44">
            <h3 className="text-5xl font-semibold mb-10">Community</h3>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mb-20">
              사용자끼리 보안 경험을 공유하고 질문을 통해 함께 성장하는 공간입니다.
            </p>

            <div className="flex justify-center mb-16">
              <Users className="w-32 h-32 text-lime-600" />
            </div>

            <ul className="text-slate-700 text-lg space-y-4 list-disc pl-6">
              <li>보안 관련 Q&A 게시판</li>
              <li>실제 사례 공유</li>
              <li>커뮤니티 기반 문제 해결</li>
            </ul>
          </div>


          {/* MyPost Detail */}
          <div className="mb-44">
            <h3 className="text-5xl font-semibold mb-10">MyPost</h3>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mb-20">
              사용자가 분석한 QR 기록을 관리하고, 필요 시 수정/삭제할 수 있는 개인 공간입니다.
            </p>

            <div className="flex justify-center mb-16">
              <FileText className="w-32 h-32 text-lime-600" />
            </div>

            <ul className="text-slate-700 text-lg space-y-4 list-disc pl-6">
              <li>내가 분석한 QR 리스트 확인</li>
              <li>제목 수정/삭제</li>
              <li>전체 분석 이력 관리</li>
            </ul>
          </div>


          {/* CTA */}
          <div className="text-center mt-32">
            <h3 className="text-4xl font-semibold mb-6">더 안전한 QR 경험을 시작하세요.</h3>
            <button className="px-10 py-5 bg-lime-500 text-white font-semibold rounded-xl hover:bg-lime-600 transition">
              지금 시작하기
            </button>
          </div>

        </div>
      </div>




    </div>
  );
}
