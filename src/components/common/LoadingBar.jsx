// src/components/common/LoadingBar.jsx

import * as React from "react";
import { useNavigate } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";
// ⭐️ 1. axios 대신 apiClient를 import 합니다.
import apiClient from '@/api/index'; 

// 로딩 단계 정의
const LOADING_STAGES = {
  FAKING: 'FAKING',
  PROCESSING: 'PROCESSING',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
};

export function LoadingBar({ file, extractedUrl }) {
  const navigate = useNavigate();

  const [progress, setProgress] = React.useState(0);
  const [stage, setStage] = React.useState(LOADING_STAGES.FAKING);
  const [statusMessage, setStatusMessage] = React.useState('분석을 준비 중입니다...');

  const intervalRef = React.useRef(null);
  const apiCalledRef = React.useRef(false); // 중복 호출 방지

  const stopFakeProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 실제 API 호출 함수
  const callApi = async () => {
    try {
      // ⭐️ 2. apiClient를 사용하도록 수정합니다.
      // (헤더는 apiClient의 interceptor가 자동으로 처리해 줍니다)
      const response = await apiClient.post(
        '/analysis/analyze', // (apiClient에 baseURL이 이미 설정됨)
        null,
        {
          params: { url: extractedUrl },
          // (헤더의 'Authorization'은 apiClient가 자동으로 넣어줌)
        }
      );
      
      // ⭐️ (기존 코드)
      /*
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        // ... (이 로직은 apiClient의 interceptor로 이동됨) ...
        return;
      }
      const response = await axios.post(
        'http://localhost:8080/api/analysis/analyze', // ⬅️ 이 부분이 문제였습니다.
        null,
        {
          params: { url: extractedUrl },
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      */
      // ⭐️ (수정 완료)

      stopFakeProgress();
      setProgress(100);
      setStage(LOADING_STAGES.COMPLETE);
      setStatusMessage('분석 완료! 결과 화면으로 이동합니다.');

      setTimeout(() => {
        navigate('/analysis', {
          replace: true,
          state: { analysisResult: response.data }
        });
      }, 1000);

    } catch (error) {
      stopFakeProgress();
      console.error('API 호출 중 오류 발생:', error);

      let redirectPath = '/analysis';
      let redirectMessage = { analysisError: '' };
      let timeout = 3000;

      if (error.response) {
        if (error.response.status === 403 || error.response.status === 401) {
          setStatusMessage('오류: 인증 세션이 만료되었습니다. 다시 로그인해 주세요.');
          setStage(LOADING_STAGES.ERROR);
          redirectPath = '/login';
          redirectMessage = { analysisError: '세션이 만료되었거나 접근 권한이 없습니다.' };
          timeout = 2000;
        } else {
          const msg = `서버 오류 (Status ${error.response.status})`;
          setStatusMessage(`오류 발생: ${msg}`);
          redirectMessage = { analysisError: msg };
          setStage(LOADING_STAGES.ERROR);
        }
      } else if (error.request) {
        // ⭐️ 3. (수정) 이제 Network Error (ERR_CONNECTION_REFUSED)는 이쪽으로 잡힙니다.
        const msg = "서버에 연결할 수 없습니다. (IP: " + (error.config?.baseURL || 'Error') + ")";
        setStatusMessage(`오류 발생: ${msg}`);
        redirectMessage = { analysisError: msg };
        setStage(LOADING_STAGES.ERROR);
      } else {
        const msg = error.message || "알 수 없는 오류가 발생했습니다.";
        setStatusMessage(`오류 발생: ${msg}`);
        redirectMessage = { analysisError: msg };
        setStage(LOADING_STAGES.ERROR);
      }

      setTimeout(() => {
        navigate(redirectPath, {
          replace: true,
          state: redirectMessage
        });
      }, timeout);
    }
  };

  // 진행 애니메이션 + API 호출
  const processFile = () => {
    if (!extractedUrl) {
      setStatusMessage('오류: 분석할 URL이 없습니다.');
      setStage(LOADING_STAGES.ERROR);
      navigate('/analysis', {
        replace: true,
        state: { analysisError: '분석할 URL 정보가 없습니다.' }
      });
      return;
    }

    setStage(LOADING_STAGES.FAKING);
    setStatusMessage('분석 진행 중...');

    // 가짜 진행률 (0~90%)
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + 5;
        if (next >= 90) {
          stopFakeProgress();
          setStage(LOADING_STAGES.PROCESSING);
          setStatusMessage('거의 완료되었습니다. 잠시만 기다려주세요...');
          if (!apiCalledRef.current) { // 중복 방지
            apiCalledRef.current = true;
            callApi();
          }
          return 90;
        }
        return next;
      });
    }, 200);
  };

  React.useEffect(() => {
    if (apiCalledRef.current) return; // 중복 방지
    processFile();
    return () => stopFakeProgress();
  }, [extractedUrl]);

  return (
    // ... (이하 렌더링 부분은 동일) ...
    <div className="w-full max-w-xl p-6 mx-auto bg-white rounded-lg shadow-lg">
      <h3 className="mb-4 text-xl font-bold text-center">QR 코드 분석 과정</h3>

      <div className="mb-4">
        {(stage === LOADING_STAGES.FAKING || stage === LOADING_STAGES.PROCESSING) && (
          <Progress value={progress} className="h-3 transition-all duration-200 ease-linear" />
        )}
        {stage === LOADING_STAGES.COMPLETE && (
          <Progress value={100} className="h-3 transition-all duration-200 ease-linear" />
        )}
        {stage === LOADING_STAGES.ERROR && (
          <Progress value={progress} className="h-3 transition-all duration-200 ease-linear bg-red-200" />
        )}
      </div>

      <p
        className={`mt-3 text-sm text-center font-medium 
        ${stage === LOADING_STAGES.COMPLETE
          ? 'text-lime-500 font-bold'
          : stage === LOADING_STAGES.ERROR
            ? 'text-red-600 font-bold'
            : 'text-gray-700'}`}
      >
        {(stage === LOADING_STAGES.FAKING || stage === LOADING_STAGES.PROCESSING) && `${progress}% `}
        {statusMessage}
      </p>
    </div>
  );
}

export default LoadingBar;