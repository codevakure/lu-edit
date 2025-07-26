import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavigationSidebar from "@/components/core/navigationSidebar";
import AppHeader from "@/components/core/appHeaderComponent";
import useTheme from "@/customization/hooks/use-custom-theme";

export function ApplicationLayout() {
  useTheme();
  
  const location = useLocation();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      {/* Header */}
      <AppHeader />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <NavigationSidebar />
        
        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
