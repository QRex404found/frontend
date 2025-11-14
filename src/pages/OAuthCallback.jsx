// src/pages/OAuthCallback.jsx (이 코드로 덮어쓰세요)

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export function OAuthCallback() {
    const { login, isLoggedIn, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Effect 1: 토큰 처리용
    useEffect(() => {
        console.log('OAuthCallback: Effect 1 실행 (토큰 처리)');
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            login(token);
        } else {
            alert('소셜 로그인에 실패했습니다.');
            navigate('/login', { replace: true });
        }
    }, [location.search, login, navigate]);

    // Effect 2: 로그인 상태 감지 및 리디렉션용
    useEffect(() => {
        // [디버깅 2] 상태 변경을 추적합니다.
        console.log(
            `OAuthCallback: Effect 2 실행. isLoggedIn: ${isLoggedIn}, user.id: ${user?.id}`
        );

        // [수정] user.id가 0일 수도 있음을 고려
        if (isLoggedIn && user?.id != null) {
            console.log('OAuthCallback: 리디렉션 조건 충족. 홈으로 이동.');
            navigate('/', { replace: true });
        } else {
            console.log('OAuthCallback: 리디렉션 조건 미충족.');
        }
    }, [isLoggedIn, user, navigate]);

    // 처리 중 로딩 스피너 표시
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
        </div>
    );
}