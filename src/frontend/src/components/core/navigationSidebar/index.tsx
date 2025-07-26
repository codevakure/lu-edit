import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AlertDropdown from "@/alerts/alertDropDown";
import { ForwardedIconComponent } from "@/components/common/genericIconComponent";
import ShadTooltip from "@/components/common/shadTooltipComponent";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Avatar from "@/components/ui/avatar";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import { AuthContext } from "@/contexts/authContext";
import useAlertStore from "@/stores/alertStore";
import useAuthStore from "@/stores/authStore";
import { useDarkStore } from "@/stores/darkStore";
import { useLogout } from "@/controllers/API/queries/auth";
import { DOCS_URL, DATASTAX_DOCS_URL } from "@/constants/constants";
import { ENABLE_DATASTAX_LANGFLOW } from "@/customization/feature-flags";
import { stripReleaseStageFromVersion } from "@/utils/utils";
import ThemeButtons from "@/components/core/appHeaderComponent/components/ThemeButtons";
import { cn } from "@/utils/utils";

interface NavigationItem {
  id: string;
  icon: string;
  label: string;
  path: string;
}

const navigationItems: NavigationItem[] = [
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
  const [isExpanded, setIsExpanded] = useState(false);
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

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const profileImage = userData?.profile_image?.startsWith('data:') 
    ? userData.profile_image 
    : null;
  const userName = userData?.username || "User";

  return (
    <div 
      className={cn(
        "flex h-full flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-300",
        isExpanded ? "w-48" : "w-12"
      )}
    >
      {/* Toggle Button */}
      <div className="p-1 border-b border-zinc-800">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleExpanded}
          className="h-10 w-10 rounded-md text-foreground hover:bg-muted"
        >
          <ForwardedIconComponent
            name={isExpanded ? "PanelLeftClose" : "PanelRightOpen"}
            className="h-5 w-5"
          />
        </Button>
      </div>

      {/* Navigation Items */}
      <div className={cn(
        "flex flex-col gap-1 py-1 flex-1",
        isExpanded ? "px-2" : "px-1"
      )}>
        {navigationItems.map((item) => {
          const isActive = getIsActive(item.path);
          
          if (isExpanded) {
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={cn(
                  "h-9 w-auto justify-start gap-3 rounded-md transition-colors text-sm font-medium px-2 text-left mx-1",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
                data-testid={`nav-sidebar-${item.id}`}
              >
                <ForwardedIconComponent
                  name={item.icon}
                  className="h-4 w-4 flex-shrink-0"
                />
                <span className="flex-1 text-left">{item.label}</span>
              </Button>
            );
          }

          return (
            <ShadTooltip
              key={item.id}
              content={item.label}
              side="right"
              delayDuration={500}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(item.path)}
                className={cn(
                  "h-10 w-10 rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
                data-testid={`nav-sidebar-${item.id}`}
              >
                <ForwardedIconComponent
                  name={item.icon}
                  className="h-5 w-5"
                />
              </Button>
            </ShadTooltip>
          );
        })}
      </div>

      {/* Bottom Section - Notifications and User */}
      <div className={cn(
        "border-t border-zinc-800 p-1 pb-3",
        isExpanded ? "px-2" : "px-1"
      )}>
        {/* Notifications */}
        <div className="mb-1">
          <AlertDropdown
            notificationRef={notificationContentRef}
          >
            {isExpanded ? (
              <Button
                variant="ghost"
                className={cn(
                  "h-9 w-full justify-start gap-3 rounded-md transition-colors text-sm font-medium px-2 text-left mx-1",
                  "text-foreground hover:bg-muted"
                )}
                data-testid="nav-sidebar-notifications"
              >
                <div className="relative">
                  <ForwardedIconComponent
                    name="Bell"
                    className="h-4 w-4 flex-shrink-0"
                  />
                  {notificationCenter && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </div>
                <span className="flex-1 text-left">Notifications</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-md transition-colors relative",
                  "text-foreground hover:bg-muted"
                )}
                data-testid="nav-sidebar-notifications"
                title="Notifications"
              >
                <ForwardedIconComponent
                  name="Bell"
                  className="h-5 w-5"
                />
                {notificationCenter && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Button>
            )}
          </AlertDropdown>
        </div>

        {/* Separator */}
        <div className="my-2">
          <Separator className="bg-zinc-700" />
        </div>

        {/* User Profile */}
        <div className="mb-1">
          {isExpanded ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-9 w-full flex items-center gap-3 rounded-md px-3 mx-1 hover:bg-muted/50 cursor-pointer transition-colors">
                  <Avatar
                    name={userName}
                    src={profileImage}
                    size={24}
                    className="flex-shrink-0"
                  />
                  <span className="flex-1 text-left truncate text-sm text-foreground">{userName}</span>
                  <ForwardedIconComponent
                    name="ChevronUp"
                    className="h-4 w-4 flex-shrink-0"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64" 
                side="right" 
                align="end"
                sideOffset={8}
              >
                {/* User Info */}
                <div className="flex items-center gap-3 p-3">
                  <Avatar
                    name={userName}
                    src={profileImage}
                    size={32}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                    <p className="text-xs text-muted-foreground truncate">User Account</p>
                  </div>
                </div>
                
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
                
                {/* Menu Items */}
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <ForwardedIconComponent name="Settings" className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                
                {isAdmin && !autoLogin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <ForwardedIconComponent name="Shield" className="mr-2 h-4 w-4" />
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
                    <ForwardedIconComponent name="BookOpen" className="mr-2 h-4 w-4" />
                    Documentation
                  </a>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Theme */}
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeButtons />
                </div>
                
                {!autoLogin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <ForwardedIconComponent name="LogOut" className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <ShadTooltip
              content={userName}
              side="right"
              delayDuration={500}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex justify-center p-1">
                    <Avatar
                      name={userName}
                      src={profileImage}
                      size={28}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-64" 
                  side="right" 
                  align="center"
                  sideOffset={8}
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-3">
                    <Avatar
                      name={userName}
                      src={profileImage}
                      size={32}
                      className="flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate">User Account</p>
                    </div>
                  </div>
                  
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
                  
                  {/* Menu Items */}
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <ForwardedIconComponent name="Settings" className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  
                  {isAdmin && !autoLogin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <ForwardedIconComponent name="Shield" className="mr-2 h-4 w-4" />
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
                      <ForwardedIconComponent name="BookOpen" className="mr-2 h-4 w-4" />
                      Documentation
                    </a>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Theme */}
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeButtons />
                  </div>
                  
                  {!autoLogin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                        <ForwardedIconComponent name="LogOut" className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </ShadTooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;
