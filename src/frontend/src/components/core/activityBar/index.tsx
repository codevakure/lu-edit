import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ForwardedIconComponent } from "@/components/common/genericIconComponent";
import ShadTooltip from "@/components/common/shadTooltipComponent";
import { Button } from "@/components/ui/button";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import { cn } from "@/utils/utils";

interface ActivityBarItem {
  id: string;
  icon: string;
  label: string;
  path: string;
}

const activityBarItems: ActivityBarItem[] = [
  {
    id: "dashboard",
    icon: "Home",
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    id: "chat",
    icon: "MessageSquare",
    label: "Chat",
    path: "/chat",
  },
  {
    id: "agents",
    icon: "Bot",
    label: "Agents",
    path: "/agents",
  },
  {
    id: "flows",
    icon: "Workflow",
    label: "Flows",
    path: "/flows",
  },
];

const ActivityBar = () => {
  const location = useLocation();
  const navigate = useCustomNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const getIsActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={cn(
        "flex h-full flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-300",
        isExpanded ? "w-48" : "w-12"
      )}
    >
      {/* Toggle Button */}
      <div className="p-1 border-b border-zinc-800">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleExpanded}
          className="h-10 w-10 rounded-md text-foreground hover:bg-muted"
        >
          <ForwardedIconComponent
            name={isExpanded ? "PanelLeftClose" : "PanelRightOpen"}
            className="h-5 w-5"
          />
        </Button>
      </div>

      {/* Navigation Items */}
      <div className={cn(
        "flex flex-col gap-1 py-1",
        isExpanded ? "px-2" : "px-1"
      )}>
        {activityBarItems.map((item) => {
          const isActive = getIsActive(item.path);
          
          if (isExpanded) {
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={cn(
                  "h-9 w-auto justify-start gap-3 rounded-md transition-colors text-sm font-medium px-2 text-left mx-1",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
                data-testid={`activity-bar-${item.id}`}
              >
                <ForwardedIconComponent
                  name={item.icon}
                  className="h-4 w-4 flex-shrink-0"
                />
                <span className="flex-1 text-left">{item.label}</span>
              </Button>
            );
          }

          return (
            <ShadTooltip
              key={item.id}
              content={item.label}
              side="right"
              delayDuration={500}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(item.path)}
                className={cn(
                  "h-10 w-10 rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
                data-testid={`activity-bar-${item.id}`}
              >
                <ForwardedIconComponent
                  name={item.icon}
                  className="h-5 w-5"
                />
              </Button>
            </ShadTooltip>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityBar;
