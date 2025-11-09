// src/pages/OAuthCallback.jsx

import React, { useEffect } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export function OAuthCallback() {
    // ✅ 1. user 객체도 함께 가져옵니다.
    const { login, isLoggedIn, user } = useAuth(); 
    const location = useLocation();
    const navigate = useNavigate();

    // Effect 1: 토큰 처리용 (변경 없음)
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            login(token);
        } else {
            alert('소셜 로그인에 실패했습니다.');
            navigate('/login', { replace: true });
        }
    }, [location.search, login, navigate]);

    // Effect 2: 로그인 상태 감지 및 리디렉션용 (수정됨)
    useEffect(() => {
        // ⭐️ (핵심) 로그인이 되었고, user.userId 값도 실제로 들어왔는지 "둘 다" 확인합니다.
        if (isLoggedIn && user?.userId) {
            navigate('/', { replace: true });
        }
    }, [isLoggedIn, user, navigate]); // ✅ 2. user를 의존성 배열에 추가합니다.

    // 처리 중 로딩 스피너 표시
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
        </div>
    );
}