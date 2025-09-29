// AuthContext 사용을 위한 훅

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // 👈 AuthContext 불러오기

/**
 * 전역 인증 상태(AuthContext)를 사용하기 위한 커스텀 훅입니다.
 * * 컴포넌트가 AuthProvider 내부에 포함되지 않았을 경우 오류를 발생시켜
 * 안전하게 Context에 접근하도록 보장합니다.
 * * @returns {object} { isLoggedIn, user, login, logout, setUser, isChecked }
 */
const useAuth = () => {
    // 1. AuthContext에서 현재 Context 값을 가져옵니다.
    const context = useContext(AuthContext);

    // 2. Context 값이 없다면 (즉, Provider 내부에서 사용되지 않았다면) 오류 발생
    if (context === undefined) {
        throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
    }

    // 3. Context에서 제공하는 모든 값들을 반환합니다.
    return context;
};

export default useAuth;

// 참고: AuthContext.jsx에 포함했던 useAuth 훅을 이제 이 파일로 분리했습니다.
// AuthContext.jsx 파일에서 내보낸 useAuth는 삭제해도 됩니다.