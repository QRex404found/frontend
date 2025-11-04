// 헤더 (로그인 상태 관리 및 네비게이션)
import * as React from 'react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils.js';
import { Link, useNavigate } from 'react-router-dom';
import logoSrc from '@/assets/qrex_logo.png';
import useAuth from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

/* (A 방식)
 * 'localStorage'를 직접 삭제하는 대신,
 * 'tokenUtils.js'의 'removeToken'을 import 합니다.
 */
import { removeToken } from '@/utils/tokenUtils';

{/* 로고 컴포넌트 */}
const Logo = () => (
  <Link to="/" className="mr-6">
    <img src={logoSrc} alt="QREX Logo" className="h-14 w-auto" />
  </Link>
);

{/* 로그인 버튼 컴포넌트 */}
const LoginButton = () => (
  <div className="flex items-center">
    <Link
      to="/login"
      className="text-xl font-semibold transition-colors hover:text-primary"
    >
      Login
    </Link>
  </div>
);

{/* 로그아웃 버튼 컴포넌트 */}
const LogoutButton = ({ onLogout }) => (
  <div className="flex items-center">
    <Button
      onClick={onLogout}
      variant="ghost"
      className="text-xl font-semibold transition-colors hover:text-primary"
    >
      Logout
    </Button>
  </div>
);

export function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleAnalysisClick = (e) => {
    e.preventDefault();
    navigate('/analysis', { replace: true });
  };

  {/* (A 방식 수정) 로그아웃 핸들러 */}
  const handleLogout = () => {
    // 1. (A 방식) 'removeToken' 유틸리티를 사용해 영구 토큰을 삭제합니다.
    removeToken();

    // 2. 'useAuth' 훅의 logout 함수를 호출해 React 상태를 변경합니다.
    if (logout) {
      logout();
    }
    
    // 3. 페이지 이동은 제거합니다. (useAuth의 logout이 처리하거나,
    //    isLoggedIn=false가 되면 페이지가 알아서 반응합니다.)
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm h-24">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 왼쪽 섹션 (로고, 네비게이션) */}
        <div className="flex items-center gap-x-10">
          <Logo />

          <NavigationMenu>
            <NavigationMenuList className="space-x-10">
              {/* Analysis */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a
                    href="/analysis"
                    onClick={handleAnalysisClick}
                    className={cn(
                      'text-xl font-semibold transition-colors hover:text-primary ',
                      'bg-transparent hover:bg-transparent focus:bg-transparent data-[active=true]:bg-transparent',
                    )}
                  >
                    Analysis
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* community */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/community"
                    className={cn(
                      'text-xl font-semibold transition-colors hover:text-primary ',
                      'bg-transparent hover:bg-transparent focus:bg-transparent data-[active=true]:bg-transparent',
                    )}
                  >
                    community
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* My post */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/mypost"
                    className={cn(
                      'text-xl font-semibold transition-colors hover:text-primary ',
                      'bg-transparent hover:bg-transparent focus:bg-transparent data-[active=true]:bg-transparent',
                    )}
                  >
                    My post
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* 오른쪽 섹션 (로그인/로그아웃 버튼) */}
        {isLoggedIn ? (
          <LogoutButton onLogout={handleLogout} />
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  );
}

