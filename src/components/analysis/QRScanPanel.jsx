import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Camera, Image, FileText } from 'lucide-react';
import jsQR from 'jsqr';

/**
 * 개선된 QR 코드 스캔 함수
 * - 흑백 대비 강화
 * - inversionAttempts: "attemptBoth"
 * - createImageBitmap 오류 처리
 */


const scanFileForQrUrl = async (file) => {
  let imageBitmap;
  try {
    imageBitmap = await createImageBitmap(file);
  } catch (err) {
    console.error("createImageBitmap 실패:", err);
    throw new Error("이미지 파일을 처리할 수 없습니다.");
  }

  // 캔버스 설정 (성능 향상 옵션 포함)
  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height);

  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // 평균 밝기 자동 계산
  let total = 0;
  for (let i = 0; i < data.length; i += 4) {
    total += (data[i] + data[i + 1] + data[i + 2]) / 3;
  }
  const avgBrightness = total / (data.length / 4);

  // 자동 임계값 설정
  const threshold = avgBrightness * 0.9;

  // 흑백 변환
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const bw = avg > threshold ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = bw;
  }
  ctx.putImageData(imageData, 0, 0);

  // 첫 번째 시도
  let code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "dontInvert",
  });

  // 실패 시 반전 재시도
  if (!code) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    ctx.putImageData(imageData, 0, 0);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
  }

  if (code && code.data) {
    console.log("✅ QR 코드 인식 성공:", code.data);
    return code.data;
  } else {
    throw new Error("이미지에서 QR 코드를 찾을 수 없습니다.");
  }
};


/**
 * QRScanPanel 컴포넌트
 */
export function QRScanPanel({ onAnalysisStart, onAnalysisResult }) {
  const fileInputRef = useRef(null);

  // 분석 시작
  const startAnalysis = async (file) => {
    if (!file) return;
    try {
      console.log("React: QR 이미지 스캔 시작...");
      const extractedUrl = await scanFileForQrUrl(file);
      console.log("React: URL 추출 성공:", extractedUrl);

      if (onAnalysisStart) {
        onAnalysisStart(file, extractedUrl);
      }
    } catch (error) {
      console.error("QR 스캔 실패:", error);
      if (onAnalysisResult) {
        onAnalysisResult(null, error.message);
      }
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    startAnalysis(file);
    if (event.target) event.target.value = null;
  };

  // 사진 보관함에서 선택
  const handlePhotoLibraryClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.removeAttribute('capture');
    fileInputRef.current.accept = "image/*";
    fileInputRef.current.click();
  };

  // 카메라로 촬영
  const handleCameraClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.setAttribute('capture', 'environment');
    fileInputRef.current.accept = "image/*";
    fileInputRef.current.click();
  };

  // 파일 선택
  const handleFileClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.removeAttribute('capture');
    fileInputRef.current.accept = "*/*";
    fileInputRef.current.click();
  };

  // --- 렌더링 ---
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        <p className="text-2xl font-semibold text-gray-700">QR 코드를 스캔하세요</p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="w-24 h-24 rounded-full shadow-xl text-white bg-lime-500 hover:bg-lime-600 transition-transform transform hover:scale-105"
              size="icon"
            >
              <Camera className="!w-10 !h-10" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 p-2 rounded-lg shadow-xl">
            <DropdownMenuItem
              onClick={handlePhotoLibraryClick}
              className="cursor-pointer p-3 flex items-center space-x-2 text-base"
            >
              <Image className="w-4 h-4" />
              <span>사진 보관함</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleCameraClick}
              className="cursor-pointer p-3 flex items-center space-x-2 text-base"
            >
              <Camera className="w-4 h-4" />
              <span>사진 찍기</span>
            </DropdownMenuItem>

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
    </div>
  );
}
