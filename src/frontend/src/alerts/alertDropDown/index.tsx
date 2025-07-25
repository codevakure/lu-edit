import { Cross2Icon } from "@radix-ui/react-icons";
import { forwardRef, useEffect, useState } from "react";
import IconComponent from "../../components/common/genericIconComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { ZERO_NOTIFICATIONS } from "../../constants/constants";
import useAlertStore from "../../stores/alertStore";
import type { AlertDropdownType } from "../../types/alerts";
import SingleAlert from "./components/singleAlertComponent";

const AlertDropdown = forwardRef<HTMLDivElement, AlertDropdownType>(
  function AlertDropdown({ children, notificationRef, onClose }, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const notificationList = useAlertStore((state) => state.notificationList);
    const clearNotificationList = useAlertStore(
      (state) => state.clearNotificationList,
    );
    const removeFromNotificationList = useAlertStore(
      (state) => state.removeFromNotificationList,
    );
    const setNotificationCenter = useAlertStore(
      (state) => state.setNotificationCenter,
    );

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      if (open) {
        setNotificationCenter(false);
      }
      if (!open) {
        onClose?.();
      }
    };

    return (
      <Popover
        data-testid="notification-dropdown"
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          ref={notificationRef}
          data-testid="notification-dropdown-content"
          className="noflow nowheel nopan nodelete nodrag z-50 flex h-[500px] w-[500px] flex-col"
          side="right"
          align="start"
          sideOffset={8}
        >
          <div className="text-md flex flex-row justify-between pl-3 font-medium text-foreground">
            Notifications
            <div className="flex gap-3 pr-3">
              <button
                className="text-muted-foreground hover:text-status-red"
                onClick={() => {
                  handleOpenChange(false);
                  setTimeout(clearNotificationList, 100);
                }}
              >
                <IconComponent name="Trash2" className="h-4 w-4" />
              </button>
              <button
                className="text-foreground opacity-70 hover:opacity-100"
                onClick={() => {
                  handleOpenChange(false);
                }}
              >
                <Cross2Icon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="text-high-foreground mt-3 flex h-full w-full flex-col overflow-y-scroll scrollbar-hide">
            {notificationList.length !== 0 ? (
              notificationList.map((alertItem) => (
                <SingleAlert
                  key={alertItem.id}
                  dropItem={alertItem}
                  removeAlert={removeFromNotificationList}
                />
              ))
            ) : (
              <div className="flex h-full w-full items-center justify-center pb-16 text-ring">
                {ZERO_NOTIFICATIONS}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

export default AlertDropdown;
