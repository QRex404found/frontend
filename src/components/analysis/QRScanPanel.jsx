import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Camera, Image, FileText } from 'lucide-react';
import jsQR from 'jsqr';

/* ---------------- QR 이미지에서 URL 추출 ---------------- */
const scanFileForQrUrl = async (file) => {
  let imageBitmap;
  try {
    imageBitmap = await createImageBitmap(file);
  } catch (err) {
    console.error("createImageBitmap 실패:", err);
    throw new Error("이미지 파일을 처리할 수 없습니다.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(imageBitmap, 0, 0);

  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let total = 0;
  for (let i = 0; i < data.length; i += 4) {
    total += (data[i] + data[i + 1] + data[i + 2]) / 3;
  }
  const avgBrightness = total / (data.length / 4);
  const threshold = avgBrightness * 0.9;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const bw = avg > threshold ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = bw;
  }
  ctx.putImageData(imageData, 0, 0);

  let code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "dontInvert",
  });

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

  if (code && code.data) return code.data;
  throw new Error("이미지에서 QR 코드를 찾을 수 없습니다.");
};


/* ---------------- QRScanPanel ---------------- */
export function QRScanPanel({ onAnalysisStart, onAnalysisResult }) {
  const fileInputRef = useRef(null);
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  /* 분석 시작 */
  const startAnalysis = async (file) => {
    if (!file) return;
    try {
      const extractedUrl = await scanFileForQrUrl(file);
      onAnalysisStart?.(file, extractedUrl);
    } catch (error) {
      onAnalysisResult?.(null, error.message);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    startAnalysis(file);
    e.target.value = null;
  };

  /* ---------------- 모바일/데스크탑 공통: input click 핸들러 ---------------- */

  // 사진 촬영 → 카메라 강제 실행
  const handleTakePhoto = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.accept = "image/*";
    fileInputRef.current.setAttribute("capture", "environment");
    fileInputRef.current.click();
  };

  // 갤러리에서 선택
  const handleSelectFromGallery = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.accept = "image/*";
    fileInputRef.current.removeAttribute("capture");
    fileInputRef.current.click();
  };

  // 파일 앱에서 선택
  const handleSelectFile = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.accept = "*/*";
    fileInputRef.current.removeAttribute("capture");
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        <p className="text-2xl font-semibold text-gray-700">QR Scan</p>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* 모바일도 Dropdown 표시 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="w-24 h-24 rounded-full shadow-xl text-white bg-lime-500 hover:bg-lime-600"
              size="icon"
            >
              <Camera className="!w-10 !h-10" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 p-2 rounded-lg shadow-xl">

            {/* 사진 촬영 */}
            <DropdownMenuItem
              onClick={handleTakePhoto}
              className="cursor-pointer p-3 flex items-center space-x-2 text-base"
            >
              <Camera className="w-4 h-4" />
              <span>사진 촬영</span>
            </DropdownMenuItem>

            {/* 갤러리 선택 */}
            <DropdownMenuItem
              onClick={handleSelectFromGallery}
              className="cursor-pointer p-3 flex items-center space-x-2 text-base"
            >
              <Image className="w-4 h-4" />
              <span>사진 선택</span>
            </DropdownMenuItem>

            {/* 파일 선택 */}
            <DropdownMenuItem
              onClick={handleSelectFile}
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
