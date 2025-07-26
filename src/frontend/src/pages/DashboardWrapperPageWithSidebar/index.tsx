import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "@/components/core/appHeaderComponent";
import NavigationSidebar from "@/components/core/navigationSidebar";
import useTheme from "@/customization/hooks/use-custom-theme";
import { SidebarProvider } from "@/components/ui/sidebar";

export function DashboardWrapperPageWithSidebar() {
  useTheme();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <NavigationSidebar />
        <div className="ml-auto w-full max-w-full peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)] peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))] sm:transition-[width] sm:duration-200 sm:ease-linear flex h-svh flex-col">
          <AppHeader />
          <div className="flex-1 overflow-y-auto bg-background">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
