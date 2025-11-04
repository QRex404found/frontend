import React, { useState, useRef } from 'react'; // useEffect, useCallback 제거
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Camera, Image, FileText } from 'lucide-react';

// --- (Mock API Function) ---
// (이전과 동일)
const scanQRImageApi = (file) => {
    console.log("Mock API: 분석 시작...", file.name);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Mock API: 분석 성공");
            const mockResult = {
                id: `qr-${Date.now()}`,
                timestamp: new Date().toISOString(),
                type: 'URL', 
                content: 'https://www.google.com',
                riskLevel: 'safe', 
                details: '이 QR 코드는 Google 홈페이지로 연결됩니다. 안전한 링크입니다. (모의 결과)'
            };
            resolve(mockResult);
        }, 1500);
    });
};
// --- (Mock API Function End) ---

// --- (dataURLtoFile 헬퍼 함수 삭제됨) ---


/**
 * QRScanPanel 컴포넌트
 * (CameraCapture 로직이 제거되고, input 'capture' 속성을 사용하도록 수정됨)
 */
export function QRScanPanel({ onAnalysisStart, onAnalysisResult }) {
    const fileInputRef = useRef(null);
    // isCameraOpen state 제거됨

    // 파일 분석 로직 (변경 없음)
    const startAnalysis = async (file) => {
        if (!file) return;
        onAnalysisStart();
        try {
            const result = await scanQRImageApi(file);
            onAnalysisResult(result);
        } catch (error) {
            console.error("QR 분석 실패:", error);
            onAnalysisResult(null, error);
        }
    };

    // 파일 선택(사진 보관함, 파일 선택, 카메라) 공통 핸들러
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        startAnalysis(file);
        if (event.target) {
            event.target.value = null;
        }
    };

    // (수정) "사진 보관함" 클릭 시
    const handlePhotoLibraryClick = () => {
        if (!fileInputRef.current) return;
        // capture 속성 제거 (파일 탐색기 실행)
        fileInputRef.current.removeAttribute('capture');
        fileInputRef.current.accept = "image/*";
        fileInputRef.current.click();
    };

    // (수정) "사진 찍기" 클릭 시
    const handleCameraClick = () => {
        if (!fileInputRef.current) return;
        // capture="environment" (후면 카메라 앱 실행)
        fileInputRef.current.setAttribute('capture', 'environment');
        fileInputRef.current.accept = "image/*";
        fileInputRef.current.click();
    };

    // (수정) "파일 선택" 클릭 시
    const handleFileClick = () => {
        if (!fileInputRef.current) return;
        // capture 속성 제거 (파일 탐색기 실행)
        fileInputRef.current.removeAttribute('capture');
        fileInputRef.current.accept = "*/*";
        fileInputRef.current.click();
    };

    // handleCapture, handleCameraClose 함수 제거됨

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] ">
            <div className="flex flex-col items-center justify-center p-6 space-y-6">

                <p className="text-2xl font-semibold text-gray-700">QR 코드를 스캔하세요</p>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    // accept와 capture 속성은 클릭 시 동적으로 설정됨
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="w-24 h-24 rounded-full shadow-xl text-white bg-green-500 hover:bg-green-600 transition-transform transform hover:scale-105"
                            size="icon"
                        >
                            <Camera className="!w-10 !h-10" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-48 p-2 rounded-lg shadow-xl">
                        {/* 사진 보관함 - onClick 수정 */}
                        <DropdownMenuItem
                            onClick={handlePhotoLibraryClick}
                            className="cursor-pointer p-3 flex items-center space-x-2 text-base"
                        >
                            <Image className="w-4 h-4" />
                            <span>사진 보관함</span>
                        </DropdownMenuItem>
                        
                        {/* 사진 찍기 - onClick 수정 */}
                        <DropdownMenuItem
                            onClick={handleCameraClick}
                            className="cursor-pointer p-3 flex items-center space-x-2 text-base"
                        >
                            <Camera className="w-4 h-4" />
                            <span>사진 찍기</span>
                        </DropdownMenuItem>

                        {/* 파일 선택 - onClick 수정 */}
                        <DropdownMenuItem
                            onClick={handleFileClick}
                            className="cursor-pointer p-3 flex items-center space-x-2 text-base"
                        >
                            <FileText className="w-4 h-4" />
                            <span>파일 선택</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

            {/* CameraCapture 컴포넌트 렌더링 로직 제거됨 */}
        </div>
    );
}

// --- (CameraCapture 컴포넌트 전체 삭제됨) ---

