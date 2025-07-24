import { memo, useState } from "react";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FlowSidebarComponent } from "@/pages/FlowPage/components/flowSidebarComponent";

interface ComponentsModalDropdownProps {
  isLoading?: boolean;
}

/**
 * Popover dropdown component that displays the components sidebar in a dropdown format
 * with 70% height and sidebar width, activated by a + icon button
 */
const ComponentsModalDropdown = memo(({ 
  isLoading = false 
}: ComponentsModalDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 shadow transition-all duration-300 hover:bg-accent"
          data-testid="components-popover-trigger"
        >
          <ForwardedIconComponent name="Plus" className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[17.5rem] h-[70vh] p-0 border border-border bg-background shadow-lg"
        align="start"
        side="bottom"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <PopoverPrimitive.Arrow className="fill-background stroke-border" />
        <div className="h-full overflow-hidden">
          {/* Wrap the FlowSidebarComponent in SidebarProvider for context */}
          <SidebarProvider width="17.5rem" defaultOpen={true}>
            <FlowSidebarComponent isLoading={isLoading} />
          </SidebarProvider>
        </div>
      </PopoverContent>
    </Popover>
  );
});

ComponentsModalDropdown.displayName = 'ComponentsModalDropdown';

export default ComponentsModalDropdown;
