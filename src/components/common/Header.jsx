import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoSrc from "@/assets/qrex_logo.png";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { removeToken } from "@/utils/tokenUtils";
import { LogOut, CircleUser, Menu } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import EditProfileTab from "@/components/profile/EditProfileTab"; 
import DeleteAccountTab from "@/components/profile/DeleteAccountTab";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();

  const [open, setOpen] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const currentUserId = user?.id || user?.userId;

  const isSocialUser = currentUserId && (
    currentUserId.startsWith('kakao_') || 
    currentUserId.startsWith('google_')
  );

  React.useEffect(() => {
    setIsSheetOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    removeToken();
    logout?.();

    // ⭐⭐⭐ [추가된 핵심 기능: 로그아웃 시 채팅 기록 초기화] ⭐⭐⭐
    Object.keys(sessionStorage)
      .filter(key => key.startsWith("qrex_chat_"))
      .forEach(key => sessionStorage.removeItem(key));
    // ----------------------------------------------------------------------

    setIsSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 h-20 bg-white shadow-sm">
      <div className="flex items-center h-full gap-4 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* 로고 */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src={logoSrc}
            alt="QREX Logo"
            className="object-contain w-auto select-none h-9 md:h-14"
          />
        </Link>

        {/* 데스크탑 메뉴 */}
        <NavigationMenu className="absolute hidden -translate-x-1/2 md:flex left-1/2">
          <NavigationMenuList className="flex items-center justify-center gap-10">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/analysis"
                  onClick={(e) => { 
                    e.preventDefault();
                    navigate(`/analysis?refresh=${Date.now()}`);
                  }}
                  className="text-sm font-regular md:text-lg hover:text-primary"
                >
                  Analysis
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/community" className="text-sm font-regular md:text-lg hover:text-primary">
                  Community
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/mypost" className="text-sm font-regular md:text-lg hover:text-primary">
                  My post
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* 오른쪽 영역 */}
        <div className="flex items-center gap-3 ml-auto md:gap-4">

          {/* 프로필 팝업 */}
          {isLoggedIn ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <CircleUser
                  className="text-gray-700 cursor-pointer w-7 h-7 md:w-6 md:h-6 hover:text-black"
                  strokeWidth={1.6}
                />
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="end"
                sideOffset={35}
                alignOffset={-200}
                className="w-[420px] p-4 rounded-xl bg-white shadow-lg border max-w-[100vw]"
              >
                <Tabs defaultValue={isSocialUser ? "delete" : "edit"} className="w-full">
                  <TabsList className="inline-flex bg-gray-200 rounded-md p-1.5 gap-1 max-w-max">
                    {!isSocialUser && (
                      <TabsTrigger value="edit" className="px-3 py-2 rounded text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Edit Profile
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="delete" className="px-3 py-2 rounded text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Delete Account
                    </TabsTrigger>
                  </TabsList>

                  {!isSocialUser && (
                    <TabsContent value="edit" className="pt-4 text-sm max-h-[330px] overflow-y-auto">
                      <EditProfileTab onClose={() => setOpen(false)} />
                    </TabsContent>
                  )}

                  <TabsContent value="delete" className="pt-4 text-sm max-h-[330px] overflow-y-auto">
                    <DeleteAccountTab onClose={() => setOpen(false)} />
                  </TabsContent>
                </Tabs>
              </PopoverContent>
            </Popover>
          ) : (
            <Link to="/login">
              <CircleUser className="text-gray-700 w-7 h-7 hover:text-black md:w-6 md:h-6" />
            </Link>
          )}

          {/* 로그아웃 버튼 */}
          {isLoggedIn && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="hidden text-base md:flex hover:text-primary"
            >
              <LogOut className="w-6 h-6" />
            </Button>
          )}

          {/* 모바일 메뉴 */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger className="p-2 rounded md:hidden hover:bg-gray-100">
              <Menu className="text-gray-800 w-7 h-7" />
            </SheetTrigger>

            <SheetContent side="right" className="p-6 w-[260px] bg-white shadow-lg">
              <nav className="flex flex-col gap-6 mt-4 text-lg font-medium">
                <Link to="/analysis" className="hover:text-primary" onClick={() => setIsSheetOpen(false)}>Analysis</Link>
                <Link to="/community" className="hover:text-primary" onClick={() => setIsSheetOpen(false)}>Community</Link>
                <Link to="/mypost" className="hover:text-primary" onClick={() => setIsSheetOpen(false)}>My post</Link>

                {isLoggedIn && (
                  <>
                    <div className="pt-4 border-t"></div>
                    <button onClick={handleLogout} className="flex items-center gap-3 text-left hover:text-primary">
                      <LogOut className="w-6 h-6" />
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  );
}
