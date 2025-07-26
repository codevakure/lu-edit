import { useState } from "react";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import ShadTooltip from "@/components/common/shadTooltipComponent";
import { ENABLE_PUBLISH } from "@/customization/feature-flags";
import useFlowStore from "@/stores/flowStore";
import useAlertStore from "@/stores/alertStore";

interface RunButtonProps {
  hasIO: boolean;
}

const RunIcon = ({ isRunning }: { isRunning?: boolean }) => (
  <ForwardedIconComponent
    name={isRunning ? "Loader2" : "Play"}
    className={`h-4 w-4 transition-all ${isRunning ? "animate-spin" : ""}`}
    strokeWidth={ENABLE_PUBLISH ? 2 : 1.5}
  />
);

const ButtonLabel = () => (
  <span className="hidden md:block">Run</span>
);

const ActiveButton = ({ onClick, isRunning }: { onClick: () => void; isRunning: boolean }) => (
  <div
    onClick={onClick}
    data-testid="run-btn-flow-active"
    className="playground-btn-flow-toolbar hover:bg-accent cursor-pointer"
  >
    <RunIcon isRunning={isRunning} />
    <ButtonLabel />
  </div>
);

const DisabledButton = ({ tooltip }: { tooltip: string }) => (
  <div
    className="playground-btn-flow-toolbar cursor-not-allowed text-muted-foreground duration-150"
    data-testid="run-btn-flow-disabled"
  >
    <RunIcon />
    <ButtonLabel />
  </div>
);

const RunButton = ({ hasIO }: RunButtonProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const buildFlow = useFlowStore((state) => state.buildFlow);
  const isBuilding = useFlowStore((state) => state.isBuilding);
  const setSuccessData = useAlertStore((state) => state.setSuccessData);
  const setErrorData = useAlertStore((state) => state.setErrorData);

  const handleRunFlow = async () => {
    if (isBuilding || isRunning || !hasIO) return;
    
    setIsRunning(true);
    try {
      await buildFlow({
        silent: false,
        stream: false,
      });
      setSuccessData({
        title: "Flow executed successfully",
      });
    } catch (error) {
      console.error("Error running flow:", error);
      setErrorData({
        title: "Failed to run flow",
        list: [error instanceof Error ? error.message : "Unknown error occurred"],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const isDisabled = !hasIO || isBuilding;
  const tooltipContent = !hasIO 
    ? "Add inputs and outputs to run the flow" 
    : isBuilding || isRunning 
    ? "Flow is currently running" 
    : "Run the entire flow";

  return (
    <ShadTooltip content={tooltipContent}>
      <div>
        {isDisabled ? (
          <DisabledButton tooltip={tooltipContent} />
        ) : (
          <ActiveButton onClick={handleRunFlow} isRunning={isRunning} />
        )}
      </div>
    </ShadTooltip>
  );
};

export default RunButton;
