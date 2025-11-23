import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import jsQR from 'jsqr';

/* ---------------- QR 이미지에서 URL 추출 (기존 로직 유지) ---------------- */
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

  // 1차 시도: 밝기 조절 후 이진화
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

  // 2차 시도: 실패 시 색상 반전 후 재시도
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
  const isMobile =
    typeof navigator !== "undefined" &&
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

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

  const handleDesktopClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.accept = "image/*"; 
    fileInputRef.current.removeAttribute("capture");
    fileInputRef.current.click();
  };

  const handleSelectFile = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.accept = "*/*";
    fileInputRef.current.removeAttribute("capture");
    fileInputRef.current.click();
  };

  return (
    // [수정됨]
    // 1. w-full: 가로 공간 확보
    // 2. flex-1: 부모(Card 등)가 flex 컨테이너일 경우 남은 공간을 모두 차지하도록 함
    // 3. min-h-[300px]: 모바일에서 부모 높이가 잡히지 않을 경우를 대비해 최소 높이 강제 지정 (필요에 따라 조절)
    <div className="flex flex-col items-center justify-center w-full h-full flex-1 min-h-[300px]">
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        <p className="mb-4 text-2xl font-medium text-gray-700">Scan your QR</p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />

        {!isMobile && (
          <Button
            className="w-24 h-24 rounded-full shadow-xl text-white bg-lime-500 hover:bg-lime-600"
            size="icon"
            onClick={handleDesktopClick}
          >
            <Camera className="!w-10 !h-10" />
          </Button>
        )}

        {isMobile && (
          <Button
            className="w-24 h-24 rounded-full shadow-xl text-white bg-lime-500 hover:bg-lime-600"
            size="icon"
            onClick={handleSelectFile}  
          >
            <Camera className="!w-10 !h-10" />
          </Button>
        )}
      </div>
    </div>
  );
}