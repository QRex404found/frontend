// 헤더 (로그인 상태 관리 및 네비게이션)
import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger, // NavigationMenuTrigger 추가
  NavigationMenuContent, // NavigationMenuContent 추가
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils.js";
import { Link, useNavigate } from 'react-router-dom';
import logoSrc from '@/assets/qrex_logo.png';

// 로고 컴포넌트 (실제 이미지 경로와 스타일을 적용하세요)
const Logo = () => (
  <Link to="/" className="mr-6">
    <img 
      src={logoSrc} 
      alt="QREX Logo" 
      className="h-14 w-auto"
    />
  </Link>
);

// 로그인 버튼 컴포넌트
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

export function Header() {
  const navigate = useNavigate();

  // Analysis 링크를 클릭했을 때 호출될 함수
  const handleAnalysisClick = (e) => {
    e.preventDefault(); // 기본 Link 동작을 막고
    navigate('/analysis', { replace: true }); // 현재 경로로 다시 이동하면서 상태 리셋
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm h-24"> 
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-10">
          <Logo />
          
          <NavigationMenu>
            <NavigationMenuList className="space-x-10">
              
              {/* Analysis - 이제 링크가 작동합니다. */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a href="/analysis" onClick={handleAnalysisClick} className={cn("text-xl font-semibold transition-colors hover:text-primary ", "bg-transparent hover:bg-transparent focus:bg-transparent data-[active=true]:bg-transparent")}>
                    Analysis
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* community */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/community" className={cn("text-xl font-semibold transition-colors hover:text-primary ", "bg-transparent hover:bg-transparent focus:bg-transparent data-[active=true]:bg-transparent")}>
                    community
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              {/* My post */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/mypost" className={cn("text-xl font-semibold transition-colors hover:text-primary ", "bg-transparent hover:bg-transparent focus:bg-transparent data-[active=true]:bg-transparent")}>
                    My post
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <LoginButton />
      </div>
    </header>
  );
}