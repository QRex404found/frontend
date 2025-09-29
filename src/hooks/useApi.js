// API 호출 로직을 위한 훅 (선택적)

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth'; 

/**
 * 비동기 API 호출을 처리하고 로딩/데이터/에러 상태를 관리하는 커스텀 훅입니다.
 * * @param {function} apiFunction - 실행할 비동기 API 함수 (예: loginApi)
 * @param {boolean} shouldAuth - 인증이 필요한 API 호출인지 여부 (기본값: true)
 * @returns {object} { data, isLoading, error, execute }
 */
const useApi = (apiFunction, shouldAuth = true) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // JWT 토큰 만료 등 인증 관련 처리를 위해 useAuth 훅 사용
    const { logout } = useAuth(); 

    // API를 실행하는 함수 (Execute)
    // useCallback을 사용하여 의존성 배열(deps)이 변경되지 않는 한 함수를 캐싱합니다.
    const execute = useCallback(async (...args) => {
        setIsLoading(true);
        setError(null);
        
        try {
            // API 함수 실행
            const response = await apiFunction(...args);
            
            // 데이터 저장
            setData(response);
            
            return response;
        } catch (err) {
            console.error("API 호출 실패:", err);
            
            // 401 Unauthorized 등 인증 오류 처리
            if (shouldAuth && err.status === 401) {
                alert("세션이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.");
                logout(); // 로그아웃 처리 및 로그인 페이지로 리다이렉션
            }

            // 에러 상태 업데이트
            setError(err);
            
            // 오류를 다시 던져서 컴포넌트에서도 처리할 수 있도록 합니다.
            throw err; 
        } finally {
            setIsLoading(false);
        }
    }, [apiFunction, shouldAuth, logout]);

    // 상태와 실행 함수 반환
    return { data, isLoading, error, execute };
};

export default useApi;

// 사용 예시:
// const { data, isLoading, error, execute: login } = useApi(loginApi, false); 
// // 버튼 클릭 시: login(id, password);