// QR 분석 관련 API

import apiClient from './index';

// ==========================================================
// 1. URL 분석 요청 (RAG)
// (POST /api/analysis/analyze?url=...)
// ==========================================================
/**
 * URL을 백엔드에 보내 QR 피싱 분석을 요청합니다.
 * @param {string} targetUrl - 분석할 URL (QR 스캔 후 추출된 URL)
 * @returns {Promise<object>} - AnalysisResultResponse DTO 객체
 */
export async function analyzeQrApi(targetUrl) {
  try {
    // 1. @RequestParam("url")에 맞게 쿼리 파라미터로 URL 전송
    const response = await apiClient.post(
      `/api/analysis/analyze?url=${encodeURIComponent(targetUrl)}`
    );
    
    // 2. 성공 시 AnalysisResultResponse DTO 반환
    return response.data;

  } catch (error) {
    console.error("URL 분석 API 오류:", error.response);
    const errorMessage = error.response?.data || "URL 분석에 실패했습니다.";
    throw new Error(errorMessage);
  }
}

// ==========================================================
// 2. 분석 기록 목록 조회
// (GET /api/analysis/history)
// ==========================================================
/**
 * 현재 사용자의 분석 기록을 페이지별로 조회합니다.
 * @param {number} page - 요청할 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지당 항목 수
 * @returns {Promise<object>} - Page<AnalysisHistoryResponse> DTO 객체
 */
export async function getAnalysisHistoryApi(page = 0, size = 10) {
  try {
    // 1. GET 요청 (params가 ?page=0&size=10 쿼리스트링으로 자동 변환)
    const response = await apiClient.get('/api/analysis/history', {
      params: { page, size }
    });
    // 2. Spring의 Page DTO 객체 반환
    return response.data;

  } catch (error) {
    console.error("분석 기록 조회 API 오류:", error.response);
    const errorMessage = error.response?.data || "기록 조회에 실패했습니다.";
    throw new Error(errorMessage);
  }
}

// ==========================================================
// 3. 특정 분석 결과 상세 조회
// (GET /api/analysis/history/{analysisId})
// ==========================================================
/**
 * 특정 분석 ID의 상세 결과를 조회합니다.
 * @param {number} analysisId - 조회할 분석 ID
 * @returns {Promise<object>} - AnalysisResultResponse DTO 객체
 */
export async function getAnalysisResultApi(analysisId) {
  try {
    const response = await apiClient.get(`/api/analysis/history/${analysisId}`);
    return response.data;

  } catch (error) {
    console.error("분석 상세 조회 API 오류:", error.response);
    const errorMessage = error.response?.data || "상세 정보 조회에 실패했습니다.";
    throw new Error(errorMessage);
  }
}

// ==========================================================
// 4. 분석 기록 제목 수정
// (PUT /api/analysis/history/{analysisId})
// ==========================================================
/**
 * 특정 분석 기록의 제목을 수정합니다.
 * @param {number} analysisId - 수정할 분석 ID
 * @param {string} newTitle - 새 제목
 * @returns {Promise<string>} - 성공 메시지 ("제목이 성공적으로 업데이트되었습니다.")
 */
export async function updateAnalysisTitleApi(analysisId, newTitle) {
  try {
    // 1. PUT 요청 (Spring: @RequestBody UpdateTitleRequest request)
    // DTO 형식 { "title": "..." } 에 맞춰 객체 전송
    const response = await apiClient.put(
      `/api/analysis/history/${analysisId}`, 
      { title: newTitle }
    );
    
    // 2. 성공 메시지(String) 반환
    return response.data;

  } catch (error) {
    console.error("분석 제목 수정 API 오류:", error.response);
    const errorMessage = error.response?.data || "제목 수정에 실패했습니다.";
    throw new Error(errorMessage);
  }
}