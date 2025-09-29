import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Camera, Image, FileText } from 'lucide-react';
import { scanQRImageApi } from '@/api/analysis'; // 실제 API (더미 로직 포함) 호출

/**
 * QRScanPanel 컴포넌트
 * QR 스캔 전 초기 UI를 표시하고, 파일 선택 및 분석 요청을 시작합니다.
 * @param {function} onAnalysisStart - 분석 시작 시 호출될 콜백 함수
 * @param {function} onAnalysisResult - 분석 결과 수신 시 호출될 콜백 함수
 */
export function QRScanPanel({ onAnalysisStart, onAnalysisResult }) {
  const fileInputRef = useRef(null);
  
  // 파일 선택을 처리하는 함수
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    // 파일이 선택되지 않았으면(취소했으면) 함수 종료
    if (!file) return; 

    // 1. 분석 시작 콜백 호출 (Analysis.jsx에 로딩 시작을 알림)
    onAnalysisStart(); 

    try {
      // 2. API 호출 (실제로는 analysis.js의 더미 함수가 실행됨)
      const result = await scanQRImageApi(file);
      
      // 3. 분석 결과 콜백 호출
      onAnalysisResult(result);
    } catch (error) {
      console.error("QR 분석 실패:", error);
      // 실패 시에도 부모 컴포넌트에 실패 상태를 알림
      onAnalysisResult(null, error); 
    }
    // 파일 인풋 초기화 (같은 파일을 다시 선택 가능하도록)
    event.target.value = null; 
  };

  // Dropdown 메뉴 항목 클릭 시 실제 파일 입력창을 클릭하도록 연결
  const triggerFileInput = (accept) => {
    if (fileInputRef.current) {
      // 파일 탐색기 실행
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  // '사진 찍기' 기능은 웹 환경의 제약으로 인해 파일 선택기로 대체합니다.
  const handleCameraClick = () => {
    console.log("사진 찍기 기능을 파일 선택으로 대체합니다.");
    triggerFileInput("image/*"); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] ">
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        
        <p className="text-2xl font-semibold text-gray-700">QR 코드를 스캔하세요</p>
        
        {/* 1. 실제 파일 입력 필드 (숨김) */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
        />

        {/* 2. QR 스캔 아이콘 탭 (Dropdown Menu로 구현) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* 중앙에 배치될 아이콘 버튼 */}
            <Button 
              className="w-24 h-24 rounded-full shadow-xl text-white bg-green-500 hover:bg-green-600 transition-transform transform hover:scale-105"
              size="icon"
            >
              <Camera className="!w-10 !h-10" /> 
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-48 p-2 rounded-lg shadow-xl">
            {/* 사진 보관함 */}
            <DropdownMenuItem 
              onClick={() => triggerFileInput("image/*")}
              className="cursor-pointer p-3 flex items-center space-x-2 text-base"
            >
              <Image className="w-4 h-4" />
              <span>사진 보관함</span>
            </DropdownMenuItem>
            
            {/* 사진 찍기 */}
            <DropdownMenuItem 
              onClick={handleCameraClick}
              className="cursor-pointer p-3 flex items-center space-x-2 text-base"
            >
              <Camera className="w-4 h-4" />
              <span>사진 찍기</span>
            </DropdownMenuItem>

            {/* 파일 선택 (모든 파일) */}
            <DropdownMenuItem 
              onClick={() => triggerFileInput("*/*")}
              className="cursor-pointer p-3 flex items-center space-x-2 text-base"
            >
              <FileText className="w-4 h-4" />
              <span>파일 선택</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </div>
  );
}
