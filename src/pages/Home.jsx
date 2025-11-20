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
      {/* SECTION 2 — ABOUT (Hybrid Modern SaaS + Detail Sections) */}
      {/* ====================================================== */}
      <div ref={infoSectionRef} className="w-full bg-white text-slate-900 py-40 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-32">
            <h2 className="text-5xl font-semibold tracking-tight mb-6">
              QR 보안을 <span className="text-lime-600">더 스마트하게.</span>
            </h2>
            <p className="text-slate-500 text-xl max-w-3xl mx-auto">
              QRex는 QR 분석, 위험 탐지, 커뮤니티, 이력 관리까지
              한 번에 제공하는 지능형 QR 보안 플랫폼입니다.
            </p>
          </div>


          {/* What is QRex */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-40 items-center">

            <div>
              <h3 className="text-3xl font-semibold mb-6">QRex란?</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                QRex는 URL 패턴 분석, 도메인 신뢰도 검증, 파라미터 분석을 통해
                안전한 QR 경험을 제공합니다.
                커뮤니티와 개인 기록 기능으로 지속적인 활용이 가능합니다.
              </p>
              <button className="px-8 py-4 bg-lime-500 text-white rounded-xl font-semibold hover:bg-lime-600 transition">
                시작하기
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-14 flex justify-center">
              <QrCode className="w-36 h-36 text-lime-600" />
            </div>
          </div>


          {/* Feature Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-40">
            {features.map((item) => (
              <div
                key={item.id}
                className="
            bg-white border border-slate-200 rounded-2xl p-10
            hover:border-lime-500 hover:shadow-md hover:-translate-y-1
            transition-all cursor-pointer
          "
              >
                <div className="p-4 bg-slate-100 text-lime-600 rounded-xl inline-block mb-6">
                  <item.icon size={36} />
                </div>

                <h4 className="text-xl font-semibold mb-3">{item.title}</h4>
                <p className="text-slate-500 mb-6">{item.desc}</p>

                <button className="text-lime-600 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                  {item.button}
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>


          {/* Detailed Section — Analysis */}
          <div className="mb-40">
            <h3 className="text-4xl font-semibold mb-6">Analysis</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-12 max-w-3xl">
              QR 코드를 기반으로 URL 위험도, 도메인 신뢰도, 파라미터 구조 등을 분석하여
              보안 위협을 정확하게 판단합니다.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-16 flex justify-center mb-12">
              <QrCode size={80} className="text-lime-600" />
            </div>

            <ul className="list-disc text-lg pl-6 text-slate-700 space-y-3">
              <li>악성 사이트/피싱 탐지</li>
              <li>URL 파라미터 자동 분석</li>
              <li>도메인 안전 체크</li>
              <li>위험도 레벨 제공</li>
            </ul>
          </div>


          {/* Detailed Section — Community */}
          <div className="mb-40">
            <h3 className="text-4xl font-semibold mb-6">Community</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-12 max-w-3xl">
              질문, 정보 공유, 사례 분석을 통해 커뮤니티 기반의 지식 교류가 이루어지는 공간입니다.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-16 flex justify-center mb-12">
              <Users size={80} className="text-lime-600" />
            </div>

            <ul className="list-disc text-lg pl-6 text-slate-700 space-y-3">
              <li>보안 이슈 토론</li>
              <li>QR 관련 질문/답변</li>
              <li>실제 사례 기반 학습</li>
            </ul>
          </div>


          {/* Detailed Section — MyPost */}
          <div className="mb-40">
            <h3 className="text-4xl font-semibold mb-6">MyPost</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-12 max-w-3xl">
              사용자가 분석한 QR 결과를 모아 관리하고, 필요 시 제목 수정이나 삭제가 가능합니다.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-16 flex justify-center mb-12">
              <FileText size={80} className="text-lime-600" />
            </div>

            <ul className="list-disc text-lg pl-6 text-slate-700 space-y-3">
              <li>QR 분석 히스토리 관리</li>
              <li>제목 수정 및 삭제</li>
              <li>QR 분석 결과 상세 확인</li>
            </ul>
          </div>


          {/* CTA */}
          <div className="border border-slate-200 rounded-3xl p-20 text-center hover:border-lime-500 transition">
            <h3 className="text-3xl font-semibold mb-6">QR 분석을 더 쉽게, 더 안전하게.</h3>
            <p className="text-slate-500 mb-10">지금 QRex를 사용해보세요.</p>

            <button className="px-10 py-4 bg-lime-500 text-white font-semibold rounded-xl hover:bg-lime-600 transition">
              지금 시작하기
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
