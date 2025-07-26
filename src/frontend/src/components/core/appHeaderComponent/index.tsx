import { useEffect, useRef, useState } from "react";
import DataStaxLogo from "@/assets/DataStaxLogo.svg?react";
import LangflowLogo from "@/assets/LangflowLogo.svg?react";
import { Button } from "@/components/ui/button";

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
    <div
      className={`z-10 flex h-[48px] w-full items-center justify-between border-b px-6 dark:bg-background`}
      data-testid="app-header"
    >
      {/* Left Section */}
      <div
        className={`z-30 flex shrink-0 items-center gap-2`}
        data-testid="header_left_section_wrapper"
      >
        <Button
          unstyled
          onClick={() => navigate("/")}
          className="mr-1 flex h-8 w-8 items-center"
          data-testid="icon-ChevronLeft"
        >
          {ENABLE_DATASTAX_LANGFLOW ? (
            <DataStaxLogo className="fill-black dark:fill-[white]" />
          ) : (
            <LangflowLogo className="h-6 w-6" />
          )}
        </Button>
        {ENABLE_DATASTAX_LANGFLOW && (
          <>
            <CustomOrgSelector />
            <CustomProductSelector />
          </>
        )}
      </div>

      {/* Middle Section */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <FlowMenu />
      </div>

      {/* Right Section - Empty since alerts and user moved to sidebar */}
      <div className="w-0"></div>
    </div>
  );
}
