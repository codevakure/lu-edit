import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";

import { CustomOrgSelector } from "@/customization/components/custom-org-selector";
import { CustomProductSelector } from "@/customization/components/custom-product-selector";
import { ENABLE_DATASTAX_LANGFLOW } from "@/customization/feature-flags";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import useTheme from "@/customization/hooks/use-custom-theme";
import FlowMenu from "./components/FlowMenu";

export default function AppHeader(): JSX.Element {
  const navigate = useCustomNavigate();
  useTheme();

  return (
    <header className="bg-background flex h-12 items-center gap-3 px-3 py-1 sm:gap-4">
      <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
      <Separator orientation="vertical" className="h-6" />
      
      {/* Selectors (only if DataStax is enabled) */}
      {ENABLE_DATASTAX_LANGFLOW && (
        <div className="flex items-center gap-2">
          <CustomOrgSelector />
          <CustomProductSelector />
        </div>
      )}

      {/* Search Bar */}
      <Button
        variant="outline"
        className="bg-muted/25 text-muted-foreground hover:bg-muted/50 relative h-8 w-full flex-1 justify-start rounded-md text-sm font-normal shadow-none sm:pr-12 md:w-40 md:flex-none lg:w-56 xl:w-64"
      >
        <Search className="absolute top-1/2 left-1.5 -translate-y-1/2 h-4 w-4" />
        <span className="ml-3">Search flows...</span>
        <kbd className="bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Flow Menu */}
      <FlowMenu />
    </header>
  );
}
