// QR 분석 관련 API

import { getToken } from '../utils/tokenUtils';

const BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = (contentType = 'application/json') => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
    };
    if (contentType) {
        headers['Content-Type'] = contentType;
    }
    return headers;
};

/**
 * 1. QR 코드 이미지 분석 (POST /api/analysis/scan)
 * - 이미지 파일을 서버로 전송해야 하므로 FormData를 사용합니다.
 */
export const scanQRImageApi = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch(`${BASE_URL}/analysis/scan`, {
    method: 'POST',
    // FormData를 사용할 때는 Content-Type 헤더를 명시적으로 설정하지 않습니다.
    // 브라우저가 자동으로 'multipart/form-data'와 boundary를 설정합니다.
    headers: {
        'Authorization': `Bearer ${getToken()}`, // 인증 헤더는 수동으로 추가
    },
    body: formData,
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'QR 코드 분석에 실패했습니다.');
  }
  // 분석 결과 (상태, URL, IP 등) 반환을 기대
  return data; 
};

/**
 * 2. 분석 이력 조회 (GET /api/analysis/history)
 */
export const getAnalysisHistoryApi = async (page = 0, size = 10) => {
  const response = await fetch(`${BASE_URL}/analysis/history?page=${page}&size=${size}`, {
    method: 'GET',
    headers: getAuthHeaders(null),
  });
  if (!response.ok) {
    throw new Error('분석 이력 로드 실패');
  }
  // PageAnalysisHistoryResponse 스키마를 따르는 데이터 반환을 기대
  return response.json(); 
};

/**
 * 3. 특정 분석 결과 상세 조회 (GET /api/analysis/history/{analysisId})
 */
export const getAnalysisResultApi = async (analysisId) => {
  const response = await fetch(`${BASE_URL}/analysis/history/${analysisId}`, {
    method: 'GET',
    headers: getAuthHeaders(null),
  });
  if (!response.ok) {
    throw new Error('특정 분석 결과 로드 실패');
  }
  // AnalysisResultResponse 스키마를 따르는 데이터 반환을 기대
  return response.json(); 
};

/**
 * 4. 분석 기록 제목 수정 (PUT /api/analysis/history/{analysisId})
 * - QR analysis result 페이지에서 제목 저장용
 */
export const updateAnalysisTitleApi = async (analysisId, newTitle) => {
  const response = await fetch(`${BASE_URL}/analysis/history/${analysisId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title: newTitle }), // 제목만 전송
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '분석 기록 제목 저장 실패');
  }
  return response.json(); // 업데이트된 기록 정보 반환
};