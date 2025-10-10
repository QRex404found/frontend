// src/components/common/LoadingBar.jsx (React Router Dom 버전)

import * as React from "react";
// ⭐ Next.js 대신 React Router Dom의 useNavigate를 가져옵니다.
import { useNavigate } from 'react-router-dom'; 

import { Progress } from "@/components/ui/progress"; 
// axios 라이브러리는 Mocking 버전에서는 필요 없습니다.

// 로딩 단계를 정의합니다.
const LOADING_STAGES = {
  UPLOAD: 'UPLOAD',     // 파일 업로드 (진행률 표시)
  PROCESS: 'PROCESS',   // 서버 처리 중 (무한 대기 로딩)
  COMPLETE: 'COMPLETE', // 완료
  ERROR: 'ERROR',       // 오류
};

// Promise를 사용하여 일정 시간(ms) 동안 기다리게 하는 헬퍼 함수
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 파일 업로드 및 서버 분석 과정을 표시하고 완료 후 결과 페이지로 이동시키는 로딩 컴포넌트입니다.
 * (React Router Dom 환경의 Mocking 버전)
 * @param {object} props - { file: File 객체, extractedUrl: 추출된 URL }
 */
export function LoadingBar({ file, extractedUrl }) { 
  // ⭐ useNavigate를 사용합니다.
  const navigate = useNavigate(); 
  const [stage, setStage] = React.useState(LOADING_STAGES.UPLOAD); // 현재 단계
  const [uploadProgress, setUploadProgress] = React.useState(0);   // 업로드 진행률 (0-100)
  const [statusMessage, setStatusMessage] = React.useState('파일 업로드를 준비 중입니다...');

  const processFile = async () => {
    if (!file) {
        setStatusMessage('오류: 업로드할 파일이 없습니다.');
        setStage(LOADING_STAGES.ERROR);
        return;
    }
    
    // 이 시점에서는 실제 API 호출 대신 Mocking 로직을 실행합니다.
    try {
      // 1. 🚀 업로드 단계 Mocking (3초 동안 0%에서 100%까지 시뮬레이션)
      setStatusMessage('파일 업로드를 시뮬레이션 중...');
      setStage(LOADING_STAGES.UPLOAD);
      
      // 100까지 10%씩 증가시키며 0.3초(300ms)씩 대기합니다.
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await sleep(300); 
      }
      
      // 2. ⏳ 서버 처리 단계로 전환 (2초 동안 무한 대기 로딩)
      setStage(LOADING_STAGES.PROCESS);
      setStatusMessage('서버 분석을 시뮬레이션 중... (2초 대기)');
      
      // 2초 동안 무한 대기 로딩바를 보여줍니다.
      await sleep(2000); 
      
      // 3. ✅ 완료 단계: 분석 결과 페이지로 이동
      setStage(LOADING_STAGES.COMPLETE);
      setStatusMessage('분석 완료 (Mock)! 결과 화면으로 이동합니다.');
      
      // ⭐ 핵심: useNavigate를 사용하여 분석 메인 페이지('/analysis')로 돌아가 결과 패널을 표시합니다.
      // (혹은 결과 전용 페이지('/analysis-result')가 있다면 그곳으로 이동합니다.)
      // 저희는 Analysis.jsx에서 이미 라우팅 관리를 하고 있으므로 '/analysis'로 돌아갑니다.
      navigate('/analysis', {
        // 결과 화면이 Analysis.jsx에 표시될 수 있도록 상태를 전달할 수도 있습니다.
        // 예시: state: { analysisCompleted: true, mockResult: { status: '안전', url: extractedUrl } }
      }); 

    } catch (error) {
      console.error('로딩 중 오류 발생:', error);
      setStatusMessage(`오류 발생: ${error.message || '알 수 없는 오류'}`);
      setStage(LOADING_STAGES.ERROR);
    }
  };

  React.useEffect(() => {
    processFile();
    // 컴포넌트 마운트 시 한 번만 실행되도록 의존성 배열을 비웁니다.
  }, []); 

  // 단계별 로딩바 및 메시지 표시
  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-center">QR 코드 분석 과정</h3>

      {(stage === LOADING_STAGES.UPLOAD || stage === LOADING_STAGES.PROCESS) && (
        <div className="mb-4">
          {/* 업로드 단계: value가 있어 진행률 표시 */}
          {stage === LOADING_STAGES.UPLOAD && (
            <Progress value={uploadProgress} className="h-3" />
          )}

          {/* 서버 처리 단계: value가 없어 무한 대기 로딩 표시 */}
          {stage === LOADING_STAGES.PROCESS && (
            <Progress className="h-3" />
          )}
        </div>
      )}

      {/* 상태 메시지 */}
      <p className={`mt-3 text-sm text-center font-medium 
          ${stage === LOADING_STAGES.COMPLETE ? 'text-green-600 font-bold' : 
            stage === LOADING_STAGES.ERROR ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
          {stage === LOADING_STAGES.UPLOAD && `${uploadProgress}% `}
          {statusMessage}
      </p>
    </div>
  );
}

export default LoadingBar;