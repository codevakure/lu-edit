import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavigationSidebar from "@/components/core/navigationSidebar";
import AppHeader from "@/components/core/appHeaderComponent";
import useTheme from "@/customization/hooks/use-custom-theme";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function ApplicationLayout() {
  useTheme();
  
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Navigation Sidebar */}
        <NavigationSidebar />
        
        {/* Main Content Area */}
        <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-muted/30 rounded-tl-lg">
          {/* Header */}
          <AppHeader />
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
