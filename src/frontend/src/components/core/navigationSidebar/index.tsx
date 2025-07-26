import { useContext, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import DataStaxLogo from "@/assets/DataStaxLogo.svg?react";
import LangflowLogo from "@/assets/LangflowLogo.svg?react";
import { 
  Bell, 
  BookOpen, 
  Bot,
  ChevronRight,
  ChevronsUpDown, 
  Database,
  FileText,
  Folder,
  GitBranch,
  Home,
  LogOut, 
  MessageSquare,
  Package,
  Palette,
  Settings, 
  Shield,
  Star,
  Terminal,
  Users,
  Workflow,
  Zap
} from "lucide-react";

import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
    icon: Home,
    label: "Explorer",
    path: "/dashboard",
  },
  {
    id: "playground", 
    icon: MessageSquare,
    label: "Playground",
    path: "/chat",
  },
  {
    id: "components",
    icon: Bot,
    label: "Components", 
    path: "/agents",
  },
  {
    id: "workspace",
    icon: Workflow,
    label: "Workspace",
    path: "/flows",
  },
];

const projectItems = [
  {
    id: "projects",
    icon: Folder,
    label: "Projects",
    items: [
      { id: "all-projects", label: "All Projects", path: "/projects" },
      { id: "my-projects", label: "My Projects", path: "/projects/mine" },
      { id: "shared-projects", label: "Shared", path: "/projects/shared" },
      { id: "templates", label: "Templates", path: "/projects/templates" },
    ]
  },
  {
    id: "data",
    icon: Database,
    label: "Data Sources",
    items: [
      { id: "databases", label: "Databases", path: "/data/databases" },
      { id: "apis", label: "APIs", path: "/data/apis" },
      { id: "files", label: "Files", path: "/data/files" },
      { id: "streams", label: "Streams", path: "/data/streams" },
    ]
  },
  {
    id: "tools",
    icon: Package,
    label: "Tools",
    items: [
      { id: "integrations", label: "Integrations", path: "/tools/integrations" },
      { id: "extensions", label: "Extensions", path: "/tools/extensions" },
      { id: "plugins", label: "Plugins", path: "/tools/plugins" },
    ]
  }
];

const platformItems = [
  {
    id: "analytics",
    icon: Zap,
    label: "Analytics",
    path: "/analytics",
  },
  {
    id: "monitoring",
    icon: Terminal,
    label: "Monitoring",
    path: "/monitoring",
  },
  {
    id: "users",
    icon: Users,
    label: "User Management",
    path: "/users",
  },
  {
    id: "docs",
    icon: FileText,
    label: "Documentation",
    path: "/docs",
  },
  {
    id: "themes",
    icon: Palette,
    label: "Themes",
    path: "/themes",
  },
  {
    id: "deployment",
    icon: GitBranch,
    label: "Deployment",
    path: "/deployment",
  },
  {
    id: "favorites",
    icon: Star,
    label: "Favorites",
    path: "/favorites",
  },
];

const NavigationSidebar = () => {
  const location = useLocation();
  const navigate = useCustomNavigate();
  const { userData } = useContext(AuthContext);
  const { mutate: mutationLogout } = useLogout();
  const version = useDarkStore((state) => state.version);
  const latestVersion = useDarkStore((state) => state.latestVersion);
  const { state: sidebarState, setOpenMobile } = useSidebar();
  
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
    const currentPath = location.pathname;
    
    if (path === "/dashboard") {
      return currentPath === "/" || currentPath === "/dashboard";
    }
    
    // For /flows, also check /workspace route since they might be the same
    if (path === "/flows") {
      return currentPath === "/flows" || 
             currentPath.startsWith("/flows/") ||
             currentPath === "/workspace" ||
             currentPath.startsWith("/workspace/");
    }
    
    // Check exact match first
    if (currentPath === path) return true;
    
    // Check if current path starts with the item path (for nested routes)
    return currentPath.startsWith(path + "/") || currentPath.startsWith(path);
  };

  const profileImage = userData?.profile_image?.startsWith('data:') 
    ? userData.profile_image 
    : null;
  const userName = userData?.username || "User";

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        {/* Logo and Brand */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              asChild
            >
              <Link to="/" onClick={() => setOpenMobile(false)}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {ENABLE_DATASTAX_LANGFLOW ? (
                    <DataStaxLogo className="size-5 fill-current" />
                  ) : (
                    <LangflowLogo className="size-5" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {ENABLE_DATASTAX_LANGFLOW ? "DataStax" : "Langflow"}
                  </span>
                  <span className="truncate text-xs">Flow Builder</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navigationItems.map((item) => {
              const isActive = getIsActive(item.path);
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    className={isActive ? "bg-primary text-primary-foreground" : ""}
                  >
                    <Link to={item.path} onClick={() => setOpenMobile(false)}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Project Management Group with Dropdowns */}
        <SidebarGroup>
          <SidebarGroupLabel>Project Management</SidebarGroupLabel>
          <SidebarMenu>
            {projectItems.map((item) => {
              const isActive = item.items.some(subItem => getIsActive(subItem.path));
              
              // When collapsed, show as dropdown menu
              if (sidebarState === 'collapsed') {
                return (
                  <SidebarMenuItem key={item.id}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.label}
                          className={isActive ? "bg-primary text-primary-foreground" : ""}
                        >
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                          <ChevronRight className="ml-auto size-4" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start" sideOffset={4}>
                        <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {item.items.map((subItem) => (
                          <DropdownMenuItem key={subItem.id} asChild>
                            <Link to={subItem.path} className={getIsActive(subItem.path) ? 'bg-secondary' : ''} onClick={() => setOpenMobile(false)}>
                              <span>{subItem.label}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                );
              }
              
              // When expanded, show as collapsible
              return (
                <Collapsible
                  key={item.id}
                  asChild
                  defaultOpen={isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.label} className={isActive ? "bg-primary text-primary-foreground" : ""}>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.id}>
                            <SidebarMenuSubButton asChild className={getIsActive(subItem.path) ? "bg-primary text-primary-foreground" : ""}>
                              <Link to={subItem.path} onClick={() => setOpenMobile(false)}>
                                <span>{subItem.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Platform Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {platformItems.map((item) => {
              const isActive = getIsActive(item.path);
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    className={isActive ? "bg-primary text-primary-foreground" : ""}
                  >
                    <Link to={item.path} onClick={() => setOpenMobile(false)}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Tools Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
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
        </SidebarGroup>
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
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                    {profileImage ? (
                      <img src={profileImage} alt={userName} className="size-6 rounded-lg" />
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">
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
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                      {profileImage ? (
                        <img src={profileImage} alt={userName} className="size-6 rounded-lg" />
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">
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
                  <DropdownMenuItem onClick={() => { navigate("/settings"); setOpenMobile(false); }}>
                    <Settings className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                  
                  {isAdmin && !autoLogin && (
                    <DropdownMenuItem onClick={() => { navigate("/admin"); setOpenMobile(false); }}>
                      <Shield className="mr-2 size-4" />
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
                      <BookOpen className="mr-2 size-4" />
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
                      <LogOut className="mr-2 size-4" />
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
