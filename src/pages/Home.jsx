// src/pages/Home.jsx

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

import videoBg from '@/assets/background.mp4';

// ★ 이미지 import
import holdingQR from '@/assets/holding_QR.png';
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

  const scrollToInfo = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStart = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/analysis");
    }
  };

  return (
    <div className="w-full">

      {/* ====================================================== */}
      {/* 1) HERO SECTION */}
      {/* ====================================================== */}
      <div
        className="
          relative w-[calc(100%+2rem)] md:w-[calc(100%+4rem)]
          -ml-4 -mr-4 -mt-4 md:-ml-8 md:-mr-8 md:-mt-8
          h-[calc(100vh-80px)] overflow-hidden
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



      {/* ====================================================== */}
      {/* 2) ABOUT HEADER */}
      {/* ====================================================== */}
      <div ref={infoSectionRef} className="bg-white text-slate-900 py-28 px-6">
        <div className="max-w-6xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
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



          {/* ====================================================== */}
          {/* 3) WHAT IS QREX */}
          {/* ====================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-16 items-center">

            {/* LEFT: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-medium mb-6">QRex란?</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                QRex는 도메인 신뢰도, URL 특성 분석,<br/>
                AI 기반 위험 해석을 결합해<br/>
                QR 링크의 안전성을 종합적으로 평가하는 보안 플랫폼입니다.
                <br /><br />
                또한 커뮤니티와 분석 기록 기능으로
                지속적이고 확장 가능한 보안 경험을 제공합니다.
              </p>

              <button
                onClick={handleStart}
                className="px-8 py-4 bg-lime-500 text-white rounded-xl font-medium hover:bg-lime-600 transition"
              >
                Explore QRex
              </button>
            </motion.div>

            {/* RIGHT IMAGE BOX — 옵션 A */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="
                bg-slate-50 border border-slate-200 rounded-3xl 
                flex items-center justify-center
                w-[320px] h-[320px]
                mx-auto
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





          {/* ====================================================== */}
          {/* 4) CTA SECTION */}
          {/* ====================================================== */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-3xl p-14 my-24 overflow-hidden">

            {/* Brush Stroke */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.12]">
              <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 800 200"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M0 120 C 150 20, 300 180, 450 60 C 600 -20, 750 150, 800 80"
                  stroke="#7CCF00"
                  strokeWidth="45"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.8,
                    ease: "easeInOut",
                  }}
                />
              </motion.svg>
            </div>

            <h3 className="text-3xl font-medium text-center mb-8 relative z-10">
              QRex는 당신의 안전한 QR 사용을 돕습니다
            </h3>

            {/* CTA 3개는 원래 아이콘 유지 그대로 → 수정 X */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-4 relative z-10">

              {/* 정확한 URL 분석 */}
              <div className="text-center p-6">
                <QrCode size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">정확한 URL 분석</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  URL 구조, IP, 도메인 신뢰도를 기반으로 <br />위험도를 판단합니다.
                </p>
              </div>

              {/* 보안 경험 공유 */}
              <div className="text-center p-6">
                <Users size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">보안 경험 공유</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  QR 관련 정보와 사례를 함께 나눌 수 있습니다.
                </p>
              </div>

              {/* 분석 이력 관리 */}
              <div className="text-center p-6">
                <FileText size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">분석 이력 관리</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  스캔한 QR 분석 결과를 한곳에서 <br />쉽게 관리하세요.
                </p>
              </div>

            </div>
          </div>




          {/* ====================================================== */}
          {/* 5) FEATURE 3-COLUMN */}
          {/* ====================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">


            {/* =============================== */}
            {/* Analysis */}
            {/* =============================== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="
                p-10 rounded-3xl border shadow-sm hover:shadow-md transition
                flex flex-col items-center text-center
              "
            >
              {/* ✔ 아이콘 박스 → 이미지 꽉 채우기 */}
              <div className="p-4 bg-lime-100 rounded-xl inline-block mb-6 overflow-hidden flex items-center justify-center">
                <img src={analysisImg} alt="Analysis" className="w-full h-full object-contain" />
              </div>

              <h4 className="text-2xl font-medium mb-3">Analysis</h4>

              <p className="text-slate-600 mb-6 leading-relaxed">
                URL 위험도·도메인 신뢰도·URL 패턴을 종합 분석해
                보안 위협 여부를 판단합니다.
              </p>

              <div className="grid grid-cols-1 gap-3 w-full max-w-[260px] mx-auto">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <ShieldCheck className="w-5 h-5 text-lime-600/80" />
                  <span className="text-slate-700 text-sm font-medium">URL 위험도 분석</span>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <Globe className="w-5 h-5 text-lime-600/80" />
                  <span className="text-slate-700 text-sm font-medium">도메인 신뢰도 검증</span>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <AlertTriangle className="w-5 h-5 text-lime-600/80" />
                  <span className="text-slate-700 text-sm font-medium">URL 리스크 설명 제공</span>
                </div>
              </div>
            </motion.div>




            {/* =============================== */}
            {/* Community */}
            {/* =============================== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="
                p-10 rounded-3xl border shadow-sm hover:shadow-md transition
                flex flex-col items-center text-center
              "
            >
              {/* ✔ 아이콘 박스 → 이미지 꽉 채우기 */}
              <div className="p-4 bg-lime-100 rounded-xl inline-block mb-6 overflow-hidden flex items-center justify-center">
                <img src={heartImg} alt="Community" className="w-full h-full object-contain" />
              </div>

              <h4 className="text-2xl font-medium mb-3">Community</h4>

              <p className="text-slate-600 mb-6 leading-relaxed">
                사용자 경험 기반 사례로
                실질적인 보안 인사이트를 제공합니다.
              </p>

              <div className="grid grid-cols-1 gap-3 w-full max-w-[260px] mx-auto">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <MessageSquare className="w-5 h-5 text-lime-600/80" />
                  <span className="text-slate-700 text-sm font-medium">사용자 사례 공유</span>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <Lightbulb className="w-5 h-5 text-lime-600/80" />
                  <span className="text-slate-700 text-sm font-medium">보안 인사이트 교류</span>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <Flag className="w-5 h-5 text-lime-600/80" />
                  <span className="text-slate-700 text-sm font-medium">신고 & 위험 URL 제보</span>
                </div>
              </div>
            </motion.div>




            {/* =============================== */}
            {/* MyPost */}
            {/* =============================== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="
                p-10 rounded-3xl border shadow-sm hover:shadow-md transition
                flex flex-col items-center text-center
              "
            >
              {/* ✔ 아이콘 박스 → 이미지 꽉 채우기 */}
              <div className="p-4 bg-lime-100 rounded-xl inline-block mb-6 overflow-hidden flex items-center justify-center">
                <img src={mypostImg} alt="MyPost" className="w-full h-full object-contain" />
              </div>

              <h4 className="text-2xl font-medium mb-3">MyPost</h4>

              <p className="text-slate-600 mb-6 leading-relaxed">
                분석한 QR 기록을 저장하고
                언제든 빠르게 다시 확인할 수 있습니다.
              </p>

              <div className="grid grid-cols-1 gap-3 w-full max-w-[260px] mx-auto">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <Save className="w-5 h-5 text-lime-600/80" />
                  <span className="text-slate-700 text-sm font-medium">분석 기록 자동 저장</span>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <Edit3 className="w-5 h-5 text-lime-600/80" />
                  <span className="text-slate-700 text-sm font-medium">제목 & 내용 관리</span>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50/70 border border-lime-200/40 hover:bg-lime-100/80 transition-all">
                  <Search className="w-5 h-5 text-lime-600/80" />
                  <span className="text-slate-700 text-sm font-medium">상세 분석 보기</span>
                </div>
              </div>
            </motion.div>




          </div>

        </div>
      </div>
    </div>
  );
}
