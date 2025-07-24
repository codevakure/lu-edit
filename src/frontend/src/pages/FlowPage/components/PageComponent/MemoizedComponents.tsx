import { Background, Panel } from "@xyflow/react";
import { memo } from "react";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import CanvasControls, {
  CustomControlButton,
} from "@/components/core/canvasControlsComponent";
import ComponentsModalDropdown from "@/components/core/componentsModalDropdown";
import LogCanvasControls from "@/components/core/logCanvasControlsComponent";
import { cn } from "@/utils/utils";

export const MemoizedBackground = memo(() => (
  <Background size={2} gap={20} className="" />
));

interface MemoizedCanvasControlsProps {
  setIsAddingNote: (value: boolean) => void;
  position: { x: number; y: number };
  shadowBoxWidth: number;
  shadowBoxHeight: number;
}

export const MemoizedLogCanvasControls = memo(() => <LogCanvasControls />);

export const MemoizedCanvasControls = memo(
  ({
    setIsAddingNote,
    position,
    shadowBoxWidth,
    shadowBoxHeight,
  }: MemoizedCanvasControlsProps) => (
    <CanvasControls>
      <CustomControlButton
        iconName="sticky-note"
        tooltipText="Add Note"
        onClick={() => {
          setIsAddingNote(true);
          const shadowBox = document.getElementById("shadow-box");
          if (shadowBox) {
            shadowBox.style.display = "block";
            shadowBox.style.left = `${position.x - shadowBoxWidth / 2}px`;
            shadowBox.style.top = `${position.y - shadowBoxHeight / 2}px`;
          }
        }}
        testId="add_note"
      />
    </CanvasControls>
  ),
);

export const MemoizedSidebarTrigger = memo(({ isLoading }: { isLoading?: boolean }) => (
  <Panel
    className={cn(
      "react-flow__controls !top-auto !m-2 flex gap-1.5 rounded-md border border-secondary-hover bg-background fill-foreground stroke-foreground p-1.5 text-primary shadow transition-all duration-300 [&>button]:border-0 [&>button]:bg-background hover:[&>button]:bg-accent",
      "pointer-events-auto opacity-100",
    )}
    position="top-left"
  >
    <ComponentsModalDropdown isLoading={isLoading} />
  </Panel>
));
