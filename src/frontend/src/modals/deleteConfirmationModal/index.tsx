import { DialogClose } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

export default function DeleteConfirmationModal({
  children,
  onConfirm,
  description,
  asChild,
  open,
  setOpen,
  note = "",
}: {
  children?: JSX.Element;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  description?: string;
  asChild?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  note?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={!children ? true : asChild} tabIndex={-1}>
        {children ?? <></>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center">
              <Trash2
                className="h-6 w-6 pr-1 text-foreground"
                strokeWidth={1.5}
              />
              <span className="pl-2">Delete</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <span className="pb-3 text-sm">
          This will permanently delete the {description ?? "flow"}
          {note ? " " + note : ""}.<br></br>This can't be undone.
        </span>
        <DialogFooter>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen?.(false);
            }}
            className="mr-1 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            data-testid="btn_cancel_delete_confirmation_modal"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground ring-offset-background transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            onClick={(e) => {
              onConfirm(e);
              setOpen?.(false);
            }}
            data-testid="btn_delete_delete_confirmation_modal"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
