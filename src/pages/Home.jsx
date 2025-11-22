// src/pages/Home.jsx

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import videoBg from '@/assets/background.mp4';

// 이미지 import
import holdingQR from '@/assets/holding_QR.jpg';
import analysisImg from '@/assets/Analysis.jpg';
import heartImg from '@/assets/Heart.png';
import mypostImg from '@/assets/mypost.png';
import {
  ChevronDown,
  QrCode,
  Users,
  FileText,
  ShieldCheck,
  Globe,
  AlertTriangle,
  MessageSquare,
  Lightbulb,
  Flag,
  Save,
  Edit3,
  Search,
} from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function Home() {
  const infoSectionRef = useRef(null);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // 🧲 [핵심 수정 1] 뷰포트 설정
  // 모바일에서 무조건 1280px 너비로 인식하게 하여 "데스크탑 화면을 축소해서" 보여줌
  // user-scalable=no 로 설정하여 확대/축소 차단 (요청사항 반영)
  useEffect(() => {
    const meta = document.querySelector('meta[name=viewport]');
    if (meta) {
      meta.setAttribute(
        "content",
        "width=1280, initial-scale=0.1, maximum-scale=1.0, user-scalable=no" 
      );
    }
    return () => {
      if (meta) {
        // 페이지 나갈 때 원래대로 복구
        meta.setAttribute("content", "width=device-width, initial-scale=1.0");
      }
    };
  }, []);

  const scrollToInfo = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStart = () => {
    if (!isLoggedIn) navigate("/login");
    else navigate("/analysis");
  };

  return (
    // 🧲 [핵심 수정 2] min-w 제거, w-full 유지
    // 창을 줄이면 스크롤바 없이 내용물 자체가 좁아지도록 함
    <div className="w-full overflow-x-hidden">

      {/* HERO SECTION */}
      <div
        className="
          relative w-full
          /* 🧲 [핵심 수정 3] 높이 설정 변경 */
          /* 기존 h-[100vh] 대신 aspect-video (16:9 비율) 사용 */
          /* 창이 줄어들면 가로에 맞춰 높이도 같이 줄어들어 영상이 거대해지지 않음 */
          aspect-video md:h-auto
          overflow-hidden
        "
        // 만약 데스크탑에서 너무 높이가 낮아지는게 싫으면 아래 style로 최소 높이 지정 가능
        style={{ minHeight: '600px' }} 
      >
        <video
          src={videoBg}
          autoPlay
          loop
          muted
          playsInline
          // object-cover: 빈공간 없이 채움. aspect-video 덕분에 비율 유지되며 같이 줄어듦
          className="absolute top-0 left-0 object-cover w-full h-full"
        />

        {/* Scroll Arrow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={scrollToInfo}
                  className="p-2 text-white opacity-90 hover:opacity-100 transition"
                >
                  <ChevronDown
                    size={42}
                    strokeWidth={1.5}
                    className="filter drop-shadow-[0_3px_3px_rgba(0,0,0,0.6)]"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black/80 text-white border-white/10 backdrop-blur-md"
              >
                Learn More
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>


      {/* ABOUT SECTION */}
      <div ref={infoSectionRef} className="bg-white text-slate-900 py-28 px-6">
        <div className="max-w-6xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-5xl font-medium tracking-tight mb-6 break-keep">
              QR 보안을 <span className="text-lime-600">더 스마트하게.</span>
            </h2>

            <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed break-keep">
              QRex는 QR 분석, 위험 탐지, 커뮤니티, 이력 관리까지<br />
              한 번에 제공하는 지능형 QR 보안 플랫폼입니다.
            </p>
          </motion.div>

          {/* WHAT IS QREX */}
          {/* 무조건 flex-row (가로 배치) 유지 */}
          <div className="flex flex-row justify-between items-start gap-10 mb-20">

            {/* LEFT: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex-1 pl-4 min-w-0" // min-w-0: flex 자식 줄어듦 방지
            >
              <h3 className="text-3xl font-medium mb-6 whitespace-nowrap">QRex란?</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-10 break-keep">
                QRex는 URL 구조 분석, 도메인 신뢰도 판단, AI 기반 위험 해석을 결합해
                QR 링크의 안전성을 종합적으로 평가하는 지능형 보안 플랫폼입니다.<br /><br />

                URL 위험 요소 탐지뿐 아니라,
                사용자 경험 기반 보안 인사이트 공유, 분석 기록의 지속 관리를 지원하여
                일상 속 QR 사용을 더 안전하고 스마트하게 만들어줍니다.
              </p>

              <button
                onClick={handleStart}
                className="px-8 py-4 bg-lime-500 text-lg text-white rounded-xl font-medium hover:bg-lime-600 transition whitespace-nowrap"
              >
                Explore QRex
              </button>
            </motion.div>

            {/* RIGHT IMAGE BOX */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="
                flex-1
                flex items-center justify-center
                bg-white border border-slate-200 rounded-3xl
                w-full h-auto
                aspect-square
                overflow-hidden
                max-w-[420px]
              "
            >
              <img
                src={holdingQR}
                alt="QRex Illustration"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </motion.div>

          </div>


          {/* CTA SECTION */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-3xl p-14 my-24 overflow-hidden">

            <div className="absolute inset-0 pointer-events-none opacity-[0.12]">
              <motion.svg width="100%" height="100%" viewBox="0 0 800 200">
                <motion.path
                  d="M0 120 C 150 20, 300 180, 450 60 C 600 -20, 750 150, 800 80"
                  stroke="#7CCF00"
                  strokeWidth="45"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />
              </motion.svg>
            </div>

            <h3 className="text-3xl font-medium text-center mb-8 relative z-10 break-keep">
              QRex는 당신의 안전한 QR 사용을 돕습니다
            </h3>

            {/* 무조건 3단 컬럼 (grid-cols-3) 유지 */}
            <div className="grid grid-cols-3 gap-6 mb-4 relative z-10">

              <div className="text-center p-4">
                <QrCode size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2 whitespace-nowrap">정확한 URL 분석</h4>
                <p className="text-slate-500 text-sm leading-relaxed break-keep">
                  URL 구조, IP, 도메인 신뢰도를 기반으로 위험도를 판단합니다.
                </p>
              </div>

              <div className="text-center p-4">
                <Users size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2 whitespace-nowrap">보안 경험 공유</h4>
                <p className="text-slate-500 text-sm leading-relaxed break-keep">
                  QR 관련 정보와 사례를 함께 나눌 수 있습니다.
                </p>
              </div>

              <div className="text-center p-4">
                <FileText size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2 whitespace-nowrap">분석 이력 관리</h4>
                <p className="text-slate-500 text-sm leading-relaxed break-keep">
                  스캔한 QR 분석 결과를 한곳에서 쉽게 관리하세요.
                </p>
              </div>

            </div>
          </div>
          
          {/* FEATURE 3-COLUMN */}
          <div className="grid grid-cols-3 gap-6">

            {/* Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="
                p-8 rounded-3xl border shadow-sm hover:shadow-md transition
                flex flex-col items-center text-center
              "
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl inline-block mb-6 overflow-hidden">
                <img
                  src={analysisImg}
                  alt="Analysis"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              <h4 className="text-2xl font-medium mb-3">Analysis</h4>

              <p className="text-slate-600 mb-6 leading-relaxed flex-grow break-keep text-sm md:text-base">
                URL 위험도·도메인 신뢰도·URL 패턴을 종합 분석해
                보안 위협 여부를 판단합니다.
              </p>

              <div className="grid grid-cols-1 gap-2 w-full">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-lime-600/80 shrink-0" />
                  <span className="text-slate-700 text-xs md:text-sm font-medium truncate">URL 위험도 분석</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <Globe className="w-4 h-4 md:w-5 md:h-5 text-lime-600/80 shrink-0" />
                  <span className="text-slate-700 text-xs md:text-sm font-medium truncate">도메인 신뢰도 검증</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-lime-600/80 shrink-0" />
                  <span className="text-slate-700 text-xs md:text-sm font-medium truncate">URL 리스크 설명</span>
                </div>
              </div>
            </motion.div>

            {/* Community */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="
                p-8 rounded-3xl border shadow-sm hover:shadow-md transition
                flex flex-col items-center text-center
              "
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl inline-block mb-6 overflow-hidden">
                <img
                  src={heartImg}
                  alt="Community"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              <h4 className="text-2xl font-medium mb-3">Community</h4>

              <p className="text-slate-600 mb-6 leading-relaxed flex-grow break-keep text-sm md:text-base">
                사용자 경험 기반 사례로
                실질적인 보안 인사이트를 제공합니다.
              </p>

              <div className="grid grid-cols-1 gap-2 w-full">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-lime-600/80 shrink-0" />
                  <span className="text-slate-700 text-xs md:text-sm font-medium truncate">사용자 사례 공유</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-lime-600/80 shrink-0" />
                  <span className="text-slate-700 text-xs md:text-sm font-medium truncate">보안 인사이트 교류</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <Flag className="w-4 h-4 md:w-5 md:h-5 text-lime-600/80 shrink-0" />
                  <span className="text-slate-700 text-xs md:text-sm font-medium truncate">신고 & 제보</span>
                </div>
              </div>
            </motion.div>

            {/* MyPost */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="
                p-8 rounded-3xl border shadow-sm hover:shadow-md transition
                flex flex-col items-center text-center
              "
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl inline-block mb-6 overflow-hidden">
                <img
                  src={mypostImg}
                  alt="MyPost"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              <h4 className="text-2xl font-medium mb-3">My post</h4>

              <p className="text-slate-600 mb-6 leading-relaxed flex-grow break-keep text-sm md:text-base">
                분석한 QR 기록을 저장하고
                언제든 빠르게 다시 확인할 수 있습니다.
              </p>

              <div className="grid grid-cols-1 gap-2 w-full">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <Save className="w-4 h-4 md:w-5 md:h-5 text-lime-600/80 shrink-0" />
                  <span className="text-slate-700 text-xs md:text-sm font-medium truncate">분석 기록 저장</span>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <Edit3 className="w-4 h-4 md:w-5 md:h-5 text-lime-600/80 shrink-0" />
                  <span className="text-slate-700 text-xs md:text-sm font-medium truncate">제목 & 내용 관리</span>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-lime-600/80 shrink-0" />
                  <span className="text-slate-700 text-xs md:text-sm font-medium truncate">상세 분석 보기</span>
                </div>
              </div>

            </motion.div>

          </div>
        </div>
      </div>

    </div>
  );
}