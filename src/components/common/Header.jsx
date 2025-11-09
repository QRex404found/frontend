// src/components/common/Header.jsx

import * as React from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoSrc from '@/assets/qrex_logo.png';
import useAuth from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { removeToken } from '@/utils/tokenUtils';
import { LogOut, CircleUser } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import eggAvatar from '@/assets/QR_EGG.png';
import EditProfileTab from "@/components/profile/EditProfileTab";
import DeleteAccountTab from "@/components/profile/DeleteAccountTab";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout, user } = useAuth();

  // ⭐️⭐️⭐️ [핵심 수정] ⭐️⭐️⭐️
  // user.username이 null이나 undefined일 때 .toUpperCase()를 호출해
  // 충돌이 나던 문제를 수정합니다.
  //
  // [기존 코드]
  // const fallbackLetter = user?.username?.charAt(0).toUpperCase() ?? "U";
  //
  // [수정된 코드]
  // 1. user?.username?.charAt(0) (첫 글자)를 먼저 찾습니다.
  // 2. ?? 'U' (없으면 'U'를 사용합니다.)
  // 3. ( ... ).toUpperCase() (결과가 'U'이든 첫 글자이든, 그 후에 대문자로 바꿉니다.)
  const fallbackLetter = (user?.username?.charAt(0) ?? 'U').toUpperCase();
  // ⭐️⭐️⭐️ [수정 완료] ⭐️⭐️⭐️

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    removeToken();
    logout?.();
  };

  return (
    <header className="relative sticky top-0 z-50 h-20 bg-white shadow-sm">
      <div className="flex items-center h-full gap-4 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* 로고 */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img src={logoSrc} alt="QREX Logo" className="object-contain w-auto h-10 select-none md:h-14" />
        </Link>

        {/* 네비게이션 → 화면 절대 중앙 고정 */}
        <NavigationMenu className="absolute flex-none -translate-x-1/2 left-1/2">
          <NavigationMenuList className="flex items-center justify-center gap-8 md:gap-12">

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/analysis"
                  replace
                  className="text-sm font-medium md:text-lg hover:text-primary"
                >
                  Analysis
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/community" className="text-sm font-medium md:text-lg hover:text-primary">
                  Community
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/mypost" className="text-sm font-medium md:text-lg hover:text-primary">
                  My post
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        {/* 우측 영역 */}
        <div className="flex items-center gap-3 ml-auto md:gap-4">
          {isLoggedIn && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <CircleUser
                className="w-5 h-5 text-gray-500 transition md:w-6 md:h-6 hover:text-black"
                strokeWidth={1.6}
              />
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="end"
                sideOffset={35}
                alignOffset={-200}
                className="w-[420px] max-w-[100vw] p-4 shadow-lg border rounded-xl bg-white"
              >
                <Tabs defaultValue="edit" className="w-full">

                  <TabsList className="inline-flex items-center justify-center bg-gray-200 rounded-md p-1.5 gap-1 max-w-max">
                    <TabsTrigger value="edit" className="px-3 py-2 rounded text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Edit Profile
                    </TabsTrigger>
                    <TabsTrigger value="delete" className="px-3 py-2 rounded text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Delete Account
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="edit" className="pt-4 text-sm space-y-3 max-h-[330px] overflow-y-auto">
                    <EditProfileTab onClose={() => setOpen(false)} />
                  </TabsContent>

                  <TabsContent value="delete" className="pt-4 text-sm space-y-3 max-h-[330px] overflow-y-auto">
                    <DeleteAccountTab onClose={() => setOpen(false)} />
                  </TabsContent>

                </Tabs>
              </PopoverContent>
            </Popover>
          )}

          {isLoggedIn ? (
            <Button onClick={handleLogout} variant="ghost" className="text-base md:text-lg hover:text-primary">
              <LogOut className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          ) : (
            <Link to="/login" className="text-base md:text-lg hover:text-primary">
              <CircleUser
                className="w-5 h-5 text-gray-500 transition md:w-6 md:h-6 hover:text-black"
                strokeWidth={1.6}
              />

            </Link>
          )}
        </div>
      </div>
    </header>
  );
}