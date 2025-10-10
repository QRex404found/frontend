import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Camera, Image, FileText } from 'lucide-react';
import { BrowserQRCodeReader } from '@zxing/browser';
import jsQR from 'jsqr';

// 참고: 백엔드 API 호출을 완전히 제거했으므로, 이 파일에서 import { scanQRImageApi } from '@/api/analysis'; 는 필요 없습니다.

const zxingReader = new BrowserQRCodeReader();

// --- 강화된 전처리 + ZXing + jsQR fallback ---
async function decodeQrWithFallback(file) {
    // 이미지 로드 및 전처리 (크기 조정, 그레이스케일, 대비 조정)
    const imageElement = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let { width, height } = imageElement;

    // 최대 크기 제한 및 크기 조정
    const maxSize = 800;
    if (width > maxSize || height > maxSize) {
        const scale = Math.min(maxSize / width, maxSize / height);
        width *= scale;
        height *= scale;
    }
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imageElement, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // 그레이스케일 및 대비 자동 조정 (인식률 향상 시도)
    let min = 255, max = 0;
    for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
        data[i] = data[i + 1] = data[i + 2] = gray;
        if (gray < min) min = gray;
        if (gray > max) max = gray;
    }
    const contrastScale = 255 / (max - min + 1e-5);
    for (let i = 0; i < data.length; i += 4) {
        let val = (data[i] - min) * contrastScale;
        val = Math.max(0, Math.min(255, val));
        data[i] = data[i + 1] = data[i + 2] = val;
    }
    ctx.putImageData(imageData, 0, 0); // 처리된 이미지를 캔버스에 다시 적용

    try {
        // --- 1차: ZXing 시도 (가장 강력한 라이브러리) ---
        const result = await zxingReader.decodeFromCanvas(canvas);
        return result.getText();
    } catch (err) {
        console.warn("zxing 실패 (NotFoundException). jsQR fallback 시도:", err.message);

        // --- 2차: jsQR fallback ---
        const jsqrResult = jsQR(imageData.data, imageData.width, imageData.height);
        if (jsqrResult) {
            return jsqrResult.data;
        } else {
            // 두 라이브러리 모두 실패했을 때 에러 발생
            throw new Error("QR 코드 인식 실패 (zxing + jsQR)");
        }
    }
}

/**
 * QRScanPanel 컴포넌트
 * 파일 선택과 QR 디코딩을 담당하며, 성공 시 로딩을 시작하도록 부모에게 알립니다.
 * @param {object} props - { onAnalysisStart: 로딩을 시작할 때 호출할 함수 }
 */
// onAnalysisResult를 제거하고 onAnalysisStart만 남깁니다.
export function QRScanPanel({ onAnalysisStart }) { 
    const fileInputRef = useRef(null);
    // extractedUrl 상태는 로딩 화면으로 전환되면서 사라질 것이므로 제거하거나 주석 처리합니다.
    const [extractedUrl, setExtractedUrl] = useState(null); 
    const [statusMessage, setStatusMessage] = useState('QR 코드를 스캔하세요');

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setExtractedUrl(null); 
        setStatusMessage('QR 코드를 분석 중...'); // 디코딩 시작 메시지

        try {
            // 1. 이미지에서 QR 코드를 디코딩하여 URL을 추출합니다. (기존 로직 유지)
            const url = await decodeQrWithFallback(file);

            if (!url) {
                // 이 경로는 decodeQrWithFallback 내부에서 throw하는 에러를 잡는 예외 처리로 대체됨
                return; 
            }

            // 2. 디코딩 성공 후, 화면에 표시하는 로직은 그대로 유지 (잠시 URL을 보여줄 수 있음)
            setExtractedUrl(url); 
            setStatusMessage('✅ URL 추출 성공! 서버 분석을 시작합니다.');
            console.log("[QR CODE TEST SUCCESS] 추출된 URL:", url);

            // 3. ⭐ 핵심 로직: 디코딩 성공 후, 로딩을 시작하도록 부모에게 알립니다.
            // onAnalysisStart 함수는 부모 컴포넌트에서 <LoadingBar>를 렌더링하는 역할을 맡게 됩니다.
            // onAnalysisStart 함수에 'file' 객체를 전달하여 LoadingBar가 업로드를 진행하도록 합니다.
            if (onAnalysisStart) {
                onAnalysisStart(file, url); // 원본 파일과 추출된 URL 모두 전달
            }

        } catch (error) {
            setExtractedUrl(null);
            setStatusMessage('🚨 인식 실패: QR 코드를 찾을 수 없습니다.');
            console.error("QR Code Test Result: FAIL - 최종 인식 실패.", error);
        }

        event.target.value = null; // 파일 input 리셋
    };
    
    // ... (triggerFileInput, handleCameraClick 함수는 그대로 둡니다.)

    const triggerFileInput = (accept) => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = accept;
            fileInputRef.current.click();
        }
    };

    const handleCameraClick = () => {
        console.log("사진 찍기 기능: 웹 환경에서는 파일 선택으로 대체됩니다.");
        triggerFileInput("image/*");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
            <div className="flex flex-col items-center justify-center p-6 space-y-6">

                <p className="text-2xl font-semibold text-gray-700 text-center min-h-[50px]">
                    {statusMessage}
                </p>

                {/* 추출된 URL을 시각적으로 표시 */}
                {extractedUrl && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg w-full max-w-sm text-center">
                        <p className="text-sm text-gray-600 mb-1">추출된 데이터 (URL):</p>
                        <p className="text-sm font-medium text-green-700 break-words">{extractedUrl}</p>
                    </div>
                )}
                
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
                        <Button
                            className="w-24 h-24 rounded-full shadow-xl text-white transition-transform transform hover:scale-105" // 클래스 제거
                            style={{ backgroundColor: '#7ac70c', transition: 'background-color 0.3s' }} // 인라인 style 추가
                            size="icon"
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#7ac70c'} // 호버 색상
                            onMouseOut={e => e.currentTarget.style.backgroundColor = '#8ee000'} // 기본 색상 복구
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

// 이 컴포넌트가 default export가 아니라면 아래는 필요 없습니다. 
// export default QRScanPanel;