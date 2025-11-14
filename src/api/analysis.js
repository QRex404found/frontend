// QR 분석 관련 API1

import apiClient from './index';

// ==========================================================
// 1. URL 분석 요청 (RAG)
// ==========================================================
/**
 * URL을 백엔드에 보내 QR 피싱 분석을 요청합니다.
 */
export async function analyzeQrApi(targetUrl) {
  try {
    const response = await apiClient.post(
      '/analysis/analyze', // '/api/analysis/analyze' -> '/analysis/analyze'
      null, // Body
      { params: { url: targetUrl } } // 쿼리 파라미터
    );
    
    return response.data;

  } catch (error) {
    console.error("URL 분석 API 오류:", error.response);
    const errorMessage = error.response?.data || "URL 분석에 실패했습니다.";
    throw new Error(errorMessage);
  }
}

// ==========================================================
// 2. 분석 기록 목록 조회 (★수정된 부분★)
// ==========================================================
/**
 * 현재 사용자의 분석 기록을 페이지별로 조회합니다.
 */
export async function getAnalysisHistoryApi(page = 0, size = 10) {
  try {
    const response = await apiClient.get('/analysis/history', { 
      params: { 
        page, 
        size,
        sort: 'createdAt,desc' // (★추가★) "생성일(createdAt) 기준 내림차순(desc)" 정렬
      }
    });
    return response.data;

  } catch (error) {
    console.error("분석 기록 조회 API 오류:", error.response);
    const errorMessage = error.response?.data || "기록 조회에 실패했습니다.";
    throw new Error(errorMessage);
  }
}

// ==========================================================
// 3. 특정 분석 결과 상세 조회
// ==========================================================
/**
 * 특정 분석 ID의 상세 결과를 조회합니다.
 */
export async function getAnalysisResultApi(analysisId) {
  try {
    const response = await apiClient.get(`/analysis/history/${analysisId}`);
    return response.data;

  } catch (error) {
    console.error("분석 상세 조회 API 오류:", error.response);
    const errorMessage = error.response?.data || "상세 정보 조회에 실패했습니다.";
    throw new Error(errorMessage);
  }
}

// ==========================================================
// 4. 분석 기록 제목 수정
// ==========================================================
/**
 * 특정 분석 기록의 제목을 수정합니다.
 */
export async function updateAnalysisTitleApi(analysisId, newTitle) {
  try {
    const response = await apiClient.put(
      `/analysis/history/${analysisId}`, 
      { title: newTitle }
    );
    
    return response.data;

  } catch (error) {
    console.error("분석 제목 수정 API 오류:", error.response);
    const errorMessage = error.response?.data || "제목 수정에 실패했습니다.";
    throw new Error(errorMessage);
  }
}