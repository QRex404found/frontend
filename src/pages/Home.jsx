// src/pages/Home.jsx

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import videoBg from '@/assets/background.mp4';
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

  // 🔍 모바일 줌 방지
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

  // 📌 스케일 적용
  useEffect(() => {
    const applyScale = () => {
      const baseWidth = 1280;
      const scale = Math.min(window.innerWidth / baseWidth, 1);
      const root = document.getElementById("home-scale-root");
      if (root) {
        root.style.transform = `scale(${scale})`;
      }
    };

    applyScale();
    window.addEventListener("resize", applyScale);
    return () => window.removeEventListener("resize", applyScale);
  }, []);

  const scrollToInfo = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStart = () => {
    if (!isLoggedIn) navigate("/login");
    else navigate("/analysis");
  };

  return (
    <div
      className="w-full h-auto overflow-x-hidden overflow-y-visible"
      style={{ position: "relative" }}
    >
      {/* 스케일 루트: 데스크탑 레이아웃 강제 */}
      <div
        id="home-scale-root"
        style={{
          width: "1280px",
          margin: "0 auto",
          transformOrigin: "top center",
        }}
      >
        {/* HERO SECTION */}
        <div className="relative w-full h-[100vh] overflow-hidden">
          <video
            src={videoBg}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 object-cover w-full h-full"
          />

          {/* Arrow */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={scrollToInfo}
                    className="p-2 text-white opacity-90 hover:opacity-100 transition"
                  >
                    <ChevronDown
                      size={48}
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

        {/* ABOUT */}
        <div ref={infoSectionRef} className="bg-white text-slate-900 py-28 px-10">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl font-medium tracking-tight mb-6"
            >
              QR 보안을 <span className="text-lime-600">더 스마트하게.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-slate-500 text-xl mb-20 leading-relaxed"
            >
              QR 분석 · 위험 탐지 · 커뮤니티 · 이력 관리<br />
              QRex는 모든 기능을 한 번에 제공하는<br />
              지능형 QR 보안 플랫폼입니다.
            </motion.p>
          </div>

          {/* WHAT IS QREX */}
          <div className="flex justify-between items-center gap-16 mb-24">
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1"
            >
              <h3 className="text-3xl font-medium mb-6 text-left">QRex란?</h3>

              <p className="text-slate-600 text-lg leading-relaxed mb-10 text-left">
                URL 구조 분석, 도메인 신뢰도 검증, AI 기반 위험 해석을 통해<br />
                QR 링크의 안전성을 종합적으로 평가합니다.<br /><br />
                사용자 경험 공유 커뮤니티와<br />
                분석 기록 관리를 지원함으로써<br />
                일상 속 QR 사용을 더 안전하게 만듭니다.
              </p>

              <button
                onClick={handleStart}
                className="px-10 py-4 bg-lime-500 text-lg text-white rounded-xl font-medium hover:bg-lime-600 transition"
              >
                Explore QRex
              </button>
            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="w-[420px] h-[420px] border border-slate-200 bg-white rounded-3xl flex items-center justify-center overflow-hidden">
                <img src={holdingQR} className="object-contain mix-blend-multiply" />
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-3xl p-16 my-24">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="text-3xl font-medium text-center mb-10 relative z-10"
            >
              QRex는 당신의 안전한 QR 사용을 돕습니다
            </motion.h3>

            <div className="grid grid-cols-3 gap-12 relative z-10">
              <div className="text-center p-6">
                <QrCode size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">정확한 URL 분석</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  URL 구조와 리스크 요소를<br />정확하게 분석합니다.
                </p>
              </div>

              <div className="text-center p-6">
                <Users size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">보안 경험 공유</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  커뮤니티에서 직접 확인하고<br />함께 대응할 수 있습니다.
                </p>
              </div>

              <div className="text-center p-6">
                <FileText size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">분석 이력 관리</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  스캔 기록을 언제든<br />다시 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* FEATURE GRID */}
          <div className="grid grid-cols-3 gap-10">
            {/* Analysis */}
            <div className="p-10 rounded-3xl border shadow-sm hover:shadow-md transition flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-xl inline-block mb-6 overflow-hidden">
                <img src={analysisImg} className="object-contain mix-blend-multiply" />
              </div>

              <h4 className="text-2xl font-medium mb-3">Analysis</h4>

              <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                URL 위험도와 도메인 신뢰도를<br />정확하게 분석합니다.
              </p>

              <div className="grid grid-cols-1 gap-3 w-full max-w-[260px] mx-auto">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <ShieldCheck className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">URL 위험도 분석</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <Globe className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">도메인 신뢰도 검증</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <AlertTriangle className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">위험 상세 분석</span>
                </div>
              </div>
            </div>

            {/* Community */}
            <div className="p-10 rounded-3xl border shadow-sm hover:shadow-md transition flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-xl inline-block mb-6 overflow-hidden">
                <img src={heartImg} className="object-contain mix-blend-multiply" />
              </div>

              <h4 className="text-2xl font-medium mb-3">Community</h4>

              <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                실사용자 경험 기반 위험 정보를<br />직접 확인할 수 있습니다.
              </p>

              <div className="grid grid-cols-1 gap-3 w-full max-w-[260px] mx-auto">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <MessageSquare className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">위험 사례 공유</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <Lightbulb className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">보안 인사이트</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <Flag className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">신고 & 제보</span>
                </div>
              </div>
            </div>

            {/* MyPost */}
            <div className="p-10 rounded-3xl border shadow-sm hover:shadow-md transition flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-xl inline-block mb-6 overflow-hidden">
                <img src={mypostImg} className="object-contain mix-blend-multiply" />
              </div>

              <h4 className="text-2xl font-medium mb-3">My Post</h4>

              <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                모든 스캔 기록을 저장하고<br />쉽게 다시 확인할 수 있습니다.
              </p>

              <div className="grid grid-cols-1 gap-3 w-full max-w-[260px] mx-auto">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <Save className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">자동 저장</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <Edit3 className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">제목 & 관리</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-lime-50 border border-lime-200">
                  <Search className="w-5 h-5 text-lime-600" />
                  <span className="text-slate-700 text-sm font-medium">분석 세부 조회</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
