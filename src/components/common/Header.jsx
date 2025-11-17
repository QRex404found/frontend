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

  const fallbackLetter = (user?.username?.charAt(0) ?? "U").toUpperCase();
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
      <div className="flex items-center h-full px-4 gap-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* --------------------------- Logo --------------------------- */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src={logoSrc}
            alt="QREX Logo"
            className="object-contain w-auto h-9 md:h-14 select-none"
          />
        </Link>

        {/* --------------------------- Desktop Navigation --------------------------- */}
        <NavigationMenu className="hidden md:flex absolute left-1/2 -translate-x-1/2">
          <NavigationMenuList className="flex items-center justify-center gap-10">

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/analysis" className="text-sm md:text-lg font-medium hover:text-primary">
                  Analysis
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/community" className="text-sm md:text-lg font-medium hover:text-primary">
                  Community
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/mypost" className="text-sm md:text-lg font-medium hover:text-primary">
                  My post
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        {/* --------------------------- Right Section --------------------------- */}
        <div className="flex items-center gap-3 ml-auto md:gap-4">

          {/* ---------------------- Profile Popover (Mobile + Desktop) ---------------------- */}
          {isLoggedIn ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <CircleUser
                  className="w-7 h-7 md:w-6 md:h-6 text-gray-700 hover:text-black cursor-pointer"
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
                <Tabs defaultValue="edit" className="w-full">

                  <TabsList className="inline-flex bg-gray-200 rounded-md p-1.5 gap-1 max-w-max">
                    <TabsTrigger value="edit" className="px-3 py-2 rounded text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Edit Profile
                    </TabsTrigger>
                    <TabsTrigger value="delete" className="px-3 py-2 rounded text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Delete Account
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="edit" className="pt-4 text-sm max-h-[330px] overflow-y-auto">
                    <EditProfileTab onClose={() => setOpen(false)} />
                  </TabsContent>

                  <TabsContent value="delete" className="pt-4 text-sm max-h-[330px] overflow-y-auto">
                    <DeleteAccountTab onClose={() => setOpen(false)} />
                  </TabsContent>

                </Tabs>
              </PopoverContent>
            </Popover>
          ) : (
            <Link to="/login">
              <CircleUser className="w-7 h-7 text-gray-700 hover:text-black md:w-6 md:h-6" />
            </Link>
          )}

          {/* ---------------------- Desktop logout button ---------------------- */}
          {isLoggedIn && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="hidden md:flex text-base hover:text-primary"
            >
              <LogOut className="w-6 h-6" />
            </Button>
          )}

          {/* ---------------------- Mobile Hamburger Menu ---------------------- */}
          <Sheet>
            <SheetTrigger className="md:hidden p-2 rounded hover:bg-gray-100">
              <Menu className="w-7 h-7 text-gray-800" />
            </SheetTrigger>

            <SheetContent side="right" className="p-6 w-[260px] bg-white shadow-lg">

              <nav className="flex flex-col gap-6 text-lg font-medium mt-4">

                <Link to="/analysis" className="hover:text-primary">
                  Analysis
                </Link>

                <Link to="/community" className="hover:text-primary">
                  Community
                </Link>

                <Link to="/mypost" className="hover:text-primary">
                  My post
                </Link>

                {isLoggedIn && (
                  <>
                    <div className="border-t pt-4"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 text-left hover:text-primary"
                    >
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
