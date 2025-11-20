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
      {/* SECTION 2 — ABOUT (기능별 상세 안내 포함) */}
      {/* ====================================================== */}
      <div ref={infoSectionRef} className="w-full bg-white text-slate-900 py-40 px-6">
        <div className="max-w-6xl mx-auto">

          {/* ====================================================== */}
          {/* 1) 메인 메시지 */}
          {/* ====================================================== */}
          <div className="text-center mb-32">
            <h2 className="text-5xl font-semibold tracking-tight mb-6">
              QR 보안을 <span className="text-lime-600">더 스마트하게.</span>
            </h2>
            <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
              QRex는 QR 코드의 위험을 분석하고, 커뮤니티와 기록 관리 기능을 통해
              사용자가 더 안전하고 편리하게 QR을 사용할 수 있도록 돕는 지능형 보안 플랫폼입니다.
            </p>
          </div>


          {/* ====================================================== */}
          {/* 2) QRex 소개 */}
          {/* ====================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-40 items-center">

            <div>
              <h3 className="text-3xl font-semibold mb-6">QRex란 무엇인가요?</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                QRex는 단순한 QR 스캔 도구가 아닙니다.
                QR 코드를 분석하고, 위험 요소를 발견하며,
                다양한 사용자 활동을 편리하게 관리할 수 있는 통합 플랫폼입니다.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-14 flex justify-center">
              <QrCode className="w-36 h-36 text-lime-600" />
            </div>
          </div>



          {/* ====================================================== */}
          {/* 3) 기능 요약 카드 (Overview) */}
          {/* ====================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-40">
            {features.map((item) => (
              <div
                key={item.id}
                className="
            bg-white border border-slate-200 rounded-2xl p-10
            hover:border-lime-500 
            hover:-translate-y-1 hover:shadow-md
            transition-all cursor-pointer
          "
              >
                <div className="mb-6 p-4 bg-slate-100 text-lime-600 rounded-xl inline-block">
                  <item.icon size={36} />
                </div>

                <h4 className="text-xl font-semibold mb-3">{item.title}</h4>
                <p className="text-slate-500 leading-relaxed mb-6">{item.desc}</p>

                <button className="text-lime-600 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                  {item.button}
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>



          {/* ====================================================== */}
          {/* 4) 기능별 상세 안내 섹션 */}
          {/* ====================================================== */}

          {/* === Analysis Section === */}
          <div className="mb-40">
            <h3 className="text-4xl font-semibold mb-6">Analysis 기능</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-16 max-w-3xl">
              QR 코드의 실제 URL 패턴, 도메인 신뢰도, 의심스러운 파라미터 등을 기반으로
              위협을 탐지하고 분석합니다.
              단순 스캔이 아닌, **보안 레이어를 더한 지능형 분석 기능**입니다.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-14 flex justify-center mb-10">
              <QrCode size={80} className="text-lime-600" />
            </div>

            <ul className="text-slate-700 text-lg leading-relaxed space-y-3 list-disc pl-6">
              <li>URL 위험도 판단 (피싱, 악성 도메인 탐지)</li>
              <li>QR 파라미터 분석 및 구조 파악</li>
              <li>도메인 안전성 검증</li>
              <li>결과 리포트 자동 생성</li>
            </ul>
          </div>


          {/* === Community Section === */}
          <div className="mb-40">
            <h3 className="text-4xl font-semibold mb-6">Community 기능</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-16 max-w-3xl">
              QR 보안 관련 질문을 올리고, 다른 사용자들과 경험을 공유할 수 있는 공간입니다.
              커뮤니티는 사용자가 서로 정보를 교류하며 함께 성장하는 역할을 합니다.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-14 flex justify-center mb-10">
              <Users size={80} className="text-lime-600" />
            </div>

            <ul className="text-slate-700 text-lg leading-relaxed space-y-3 list-disc pl-6">
              <li>QR 관련 질문/답변 게시판</li>
              <li>보안 사례 공유</li>
              <li>인사이트 기반 문제 해결</li>
            </ul>
          </div>


          {/* === MyPost Section === */}
          <div className="mb-40">
            <h3 className="text-4xl font-semibold mb-6">MyPost 기능</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-16 max-w-3xl">
              사용자가 분석한 QR 코드 기록을 관리하는 개인 기록 공간입니다.
              이전 분석 결과를 한 번에 확인하고, 필요하면 제목 수정/삭제도 가능합니다.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-14 flex justify-center mb-10">
              <FileText size={80} className="text-lime-600" />
            </div>

            <ul className="text-slate-700 text-lg leading-relaxed space-y-3 list-disc pl-6">
              <li>내가 분석한 QR 리스트 관리</li>
              <li>각 분석 결과 상세 보기</li>
              <li>제목 수정 & 삭제 기능</li>
              <li>분석 이력 일괄 관리</li>
            </ul>
          </div>



          {/* ====================================================== */}
          {/* 5) 최종 CTA */}
          {/* ====================================================== */}
          <div className="border border-slate-200 rounded-3xl p-16 text-center hover:border-lime-500 transition-colors">
            <h3 className="text-3xl font-semibold mb-6">QR 분석을 더 쉽게, 더 안전하게.</h3>
            <p className="text-slate-500 mb-10">지금 QRex를 사용해보세요.</p>

            <button className="px-10 py-4 bg-lime-500 text-white font-semibold rounded-xl hover:bg-lime-600 transition-colors">
              지금 시작하기
            </button>
          </div>

        </div>
      </div>



    </div>
  );
}
