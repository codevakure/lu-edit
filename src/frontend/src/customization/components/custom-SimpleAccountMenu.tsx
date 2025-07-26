import { useContext } from "react";
import { ForwardedIconComponent } from "@/components/common/genericIconComponent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/contexts/authContext";
import { useLogout } from "@/controllers/API/queries/auth";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import useAuthStore from "@/stores/authStore";
import { useDarkStore } from "@/stores/darkStore";
import { DOCS_URL, DATASTAX_DOCS_URL } from "@/constants/constants";
import { ENABLE_DATASTAX_LANGFLOW } from "@/customization/feature-flags";
import { stripReleaseStageFromVersion } from "@/utils/utils";
import ThemeButtons from "@/components/core/appHeaderComponent/components/ThemeButtons";

export function SimpleAccountMenu() {
  const navigate = useCustomNavigate();
  const { mutate: mutationLogout } = useLogout();
  const version = useDarkStore((state) => state.version);
  const latestVersion = useDarkStore((state) => state.latestVersion);
  
  const { isAdmin, autoLogin } = useAuthStore((state) => ({
    isAdmin: state.isAdmin,
    autoLogin: state.autoLogin,
  }));

  const handleLogout = () => {
    mutationLogout();
  };

  const isLatestVersion = (() => {
    if (!version || !latestVersion) return false;
    const currentBaseVersion = stripReleaseStageFromVersion(version);
    const latestBaseVersion = stripReleaseStageFromVersion(latestVersion);
    return currentBaseVersion === latestBaseVersion;
  })();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-md hover:bg-muted"
        >
          <ForwardedIconComponent
            name="Settings"
            className="h-4 w-4"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className={`text-xs ${
              isLatestVersion 
                ? "text-emerald-600 dark:text-emerald-400" 
                : "text-amber-600 dark:text-amber-400"
            }`}>
              {version} {isLatestVersion ? "(latest)" : "(update available)"}
            </span>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
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
        
        <div className="px-3 py-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Theme</span>
            <ThemeButtons />
          </div>
        </div>
        
        {!autoLogin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <ForwardedIconComponent name="LogOut" className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SimpleAccountMenu;
