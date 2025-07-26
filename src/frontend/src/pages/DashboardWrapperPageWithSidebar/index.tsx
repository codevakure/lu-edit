import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "@/components/core/appHeaderComponent";
import NavigationSidebar from "@/components/core/navigationSidebar";
import useTheme from "@/customization/hooks/use-custom-theme";

export function DashboardWrapperPageWithSidebar() {
  useTheme();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <AppHeader />
      <div className="flex w-full flex-1 flex-row overflow-hidden">
        <NavigationSidebar />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
