import { useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { 
  Bell, 
  BookOpen, 
  ChevronsUpDown, 
  LogOut, 
  Settings, 
  Shield 
} from "lucide-react";

import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AlertDropdown from "@/alerts/alertDropDown";
import ThemeButtons from "@/components/core/appHeaderComponent/components/ThemeButtons";
import { useLogout } from "@/controllers/API/queries/auth";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import useAlertStore from "@/stores/alertStore";
import { AuthContext } from "@/contexts/authContext";
import { useDarkStore } from "@/stores/darkStore";
import useAuthStore from "@/stores/authStore";
import { ForwardedIconComponent } from "@/components/common/genericIconComponent";
import { stripReleaseStageFromVersion } from "@/utils/utils";
import { DOCS_URL, DATASTAX_DOCS_URL } from "@/constants/constants";
import { ENABLE_DATASTAX_LANGFLOW } from "@/customization/feature-flags";

const navigationItems = [
  {
    id: "explorer",
    icon: "Home",
    label: "Explorer",
    path: "/dashboard",
  },
  {
    id: "playground",
    icon: "MessageSquare",
    label: "Playground",
    path: "/chat",
  },
  {
    id: "components",
    icon: "Bot",
    label: "Components",
    path: "/agents",
  },
  {
    id: "workspace",
    icon: "Workflow",
    label: "Workspace",
    path: "/flows",
  },
];

const NavigationSidebar = () => {
  const location = useLocation();
  const navigate = useCustomNavigate();
  const { userData } = useContext(AuthContext);
  const { mutate: mutationLogout } = useLogout();
  const version = useDarkStore((state) => state.version);
  const latestVersion = useDarkStore((state) => state.latestVersion);
  
  const { isAdmin, autoLogin } = useAuthStore((state) => ({
    isAdmin: state.isAdmin,
    autoLogin: state.autoLogin,
  }));
  
  // Alert/notification state
  const notificationCenter = useAlertStore((state) => state.notificationCenter);
  const notificationContentRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    mutationLogout();
  };

  const isLatestVersion = (() => {
    if (!version || !latestVersion) return false;
    const currentBaseVersion = stripReleaseStageFromVersion(version);
    const latestBaseVersion = stripReleaseStageFromVersion(latestVersion);
    return currentBaseVersion === latestBaseVersion;
  })();

  const getIsActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const profileImage = userData?.profile_image?.startsWith('data:') 
    ? userData.profile_image 
    : null;
  const userName = userData?.username || "User";

  return (
    <Sidebar collapsible="icon" variant="floating" className="border-sidebar-border">
      <SidebarHeader>
        {/* Team Switcher */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <ForwardedIconComponent name="Workflow" className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Langflow</span>
                <span className="truncate text-xs">Flow Builder</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarMenu>
          {navigationItems.map((item) => {
            const isActive = getIsActive(item.path);
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                >
                  <button onClick={() => navigate(item.path)}>
                    <ForwardedIconComponent name={item.icon} />
                    <span>{item.label}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        {/* Notifications */}
        <SidebarMenu>
          <SidebarMenuItem>
            <AlertDropdown notificationRef={notificationContentRef}>
              <SidebarMenuButton tooltip="Notifications">
                <div className="relative">
                  <Bell className="size-4" />
                  {notificationCenter && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
                  )}
                </div>
                <span>Notifications</span>
              </SidebarMenuButton>
            </AlertDropdown>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        {/* User Menu */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    {profileImage ? (
                      <img src={profileImage} alt={userName} className="size-6 rounded-lg" />
                    ) : (
                      <span className="text-xs font-bold">
                        {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userName}</span>
                    <span className="truncate text-xs">User Account</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      {profileImage ? (
                        <img src={profileImage} alt={userName} className="size-6 rounded-lg" />
                      ) : (
                        <span className="text-xs font-bold">
                          {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userName}</span>
                      <span className="truncate text-xs">User Account</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                {/* Version Info */}
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-muted-foreground">Version</span>
                  <span className={`text-xs ${
                    isLatestVersion 
                      ? "text-emerald-600 dark:text-emerald-400" 
                      : "text-amber-600 dark:text-amber-400"
                  }`}>
                    {version} {isLatestVersion ? "(latest)" : "(update available)"}
                  </span>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings />
                    Settings
                  </DropdownMenuItem>
                  
                  {isAdmin && !autoLogin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield />
                      Admin Page
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem asChild>
                    <a
                      href={ENABLE_DATASTAX_LANGFLOW ? DATASTAX_DOCS_URL : DOCS_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="cursor-pointer"
                    >
                      <BookOpen />
                      Documentation
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                {/* Theme */}
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeButtons />
                </div>
                
                {!autoLogin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default NavigationSidebar;
