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


  /* 🔒 홈에서만 확대/축소 차단 */
  useEffect(() => {
    const meta = document.querySelector('meta[name=viewport]');
    if (meta) {
      meta.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    }
    return () => {
      if (meta) meta.setAttribute("content", "width=device-width, initial-scale=1.0");
    };
  }, []);


  /* 🎯 390px 기준 스케일 적용 */
  useEffect(() => {
    const handleScale = () => {
      const baseWidth = 1280; // 레이아웃 고정 기준
      const scale = Math.min(window.innerWidth / baseWidth, 1);
      const wrapper = document.getElementById("scale-wrapper");
      if (wrapper) wrapper.style.transform = `scale(${scale})`;
    };

    handleScale();
    window.addEventListener("resize", handleScale);
    return () => window.removeEventListener("resize", handleScale);
  }, []);


  const scrollToInfo = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStart = () => {
    if (!isLoggedIn) navigate("/login");
    else navigate("/analysis");
  };

  return (
    <div id="scale-wrapper" style={{ width: "100%", transformOrigin: "top center" }}>
      <div id="content-fixed-width">

        {/* ====================== HERO ====================== */}
        <div
          className="
          relative h-[100dvh]
          overflow-hidden
        "
        >
          <video
            src={videoBg}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 object-cover w-full h-full"
          />

          {/* Scroll Arrow */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
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
                      className="drop-shadow-[0_3px_3px_rgba(0,0,0,0.6)]"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-black/80 text-white border-white/10 backdrop-blur-md">
                  Learn More
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>


        {/* ====================== ABOUT ====================== */}
        <div ref={infoSectionRef} className="bg-white text-slate-900 py-28 px-6">
          <div className="max-w-6xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-5xl font-medium tracking-tight mb-6">
                QR 보안을 <span className="text-lime-600">더 스마트하게.</span>
              </h2>

              <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
                QRex는 QR 분석, 위험 탐지, 커뮤니티, 이력 관리까지<br />
                한 번에 제공하는 지능형 QR 보안 플랫폼입니다.
              </p>
            </motion.div>


            {/* WHAT IS QREX */}
            <div className="flex justify-between items-center gap-20 mb-20">

              {/* LEFT: TEXT */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <h3 className="text-3xl font-medium mb-6">QRex란?</h3>

                <p className="text-slate-600 text-lg leading-relaxed mb-10">
                  QRex는 URL 구조 분석, 도메인 신뢰도 판단, AI 기반 위험 해석을 결합해<br />
                  QR 링크의 안전성을 종합적으로 평가하는 지능형 보안 플랫폼입니다.<br /><br />
                  사용자 기반 보안 인사이트 공유, 분석 기록의 지속 관리를 지원하여<br />
                  일상 속 QR 사용을 더 안전하고 스마트하게 만들어줍니다.
                </p>

                <button
                  onClick={handleStart}
                  className="px-8 py-4 bg-lime-500 text-lg text-white rounded-xl font-medium hover:bg-lime-600 transition"
                >
                  Explore QRex
                </button>
              </motion.div>

              {/* RIGHT: IMAGE */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                viewport={{ once: true }}
                className="
                flex-1 flex items-center justify-center
                bg-white border border-slate-200 rounded-3xl
                max-w-[420px] aspect-square
                mx-auto md:mx-0
                overflow-hidden
              "
              >
                <img
                  src={holdingQR}
                  alt="QRex Illustration"
                  className="w-full h-full object-contain"
                />
              </motion.div>

            </div>
          </div>


          {/* ====================== FEATURES + CTA ====================== */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-3xl p-14 my-24 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.12]">
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

            <h3 className="text-3xl font-medium text-center mb-8 relative z-10">
              QRex는 당신의 안전한 QR 사용을 돕습니다
            </h3>

            <div className="grid grid-cols-3 gap-10 mb-4 relative z-10">

              <div className="text-center p-6">
                <QrCode size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">정확한 URL 분석</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  URL 구조, IP, 도메인 신뢰도를 기반으로 <br />위험 판단
                </p>
              </div>

              <div className="text-center p-6">
                <Users size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">보안 경험 공유</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  사용자 사례로 실질적 보안 인사이트 제공
                </p>
              </div>

              <div className="text-center p-6">
                <FileText size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">분석 이력 관리</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  스캔한 QR 기록을 한눈에
                </p>
              </div>

            </div>
          </div>


          {/* ====================== GRID FEATURES ====================== */}
          <div className="grid grid-cols-3 gap-10">

            {/* Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl border shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
            >
              <div className="w-32 h-32 rounded-xl inline-block mb-6 overflow-hidden">
                <img src={analysisImg} alt="Analysis" className="w-full h-full object-contain" />
              </div>
              <h4 className="text-2xl font-medium mb-3">Analysis</h4>
              <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                URL 위험 요소 종합 분석
              </p>
              <div className="grid grid-cols-1 gap-3 w-full max-w-[260px] mx-auto">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <ShieldCheck className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">위험도 분석</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <Globe className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">도메인 검증</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <AlertTriangle className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">리스크 설명</span>
                </div>
              </div>
            </motion.div>


            {/* Community */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl border shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
            >
              <div className="w-32 h-32 rounded-xl inline-block mb-6 overflow-hidden">
                <img src={heartImg} alt="Community" className="w-full h-full object-contain" />
              </div>
              <h4 className="text-2xl font-medium mb-3">Community</h4>
              <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                사용자 기반 보안 지식 확산
              </p>
              <div className="grid grid-cols-1 gap-3 w-full max-w-[260px] mx-auto">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <MessageSquare className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">사례 공유</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <Lightbulb className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">인사이트 교류</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <Flag className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">신고 / 제보</span>
                </div>
              </div>
            </motion.div>


            {/* MyPost */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl border shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
            >
              <div className="w-32 h-32 rounded-xl inline-block mb-6 overflow-hidden">
                <img src={mypostImg} alt="MyPost" className="w-full h-full object-contain" />
              </div>
              <h4 className="text-2xl font-medium mb-3">My post</h4>
              <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                분석 기록 관리 및 탐색
              </p>
              <div className="grid grid-cols-1 gap-3 w-full max-w-[260px] mx-auto">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <Save className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">자동 저장</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <Edit3 className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">제목 관리</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <Search className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">상세 분석</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
