import { forwardRef } from "react";
import { Dialog as MuiDialog } from "@mui/material";
import { mergeSlotProps, mergeSlots } from "./slotPropUtils";

const CompatDialog = forwardRef(function CompatDialog(
  {
    BackdropProps,
    disableEscapeKeyDown,
    PaperProps,
    slotProps,
    slots,
    TransitionComponent,
    TransitionProps,
    onClose,
    ...props
  },
  ref
) {
  const handleClose = (event, reason) => {
    if (disableEscapeKeyDown && reason === "escapeKeyDown") return;
    onClose?.(event, reason);
  };

  return (
    <MuiDialog
      ref={ref}
      onClose={onClose ? handleClose : undefined}
      slots={mergeSlots(slots, { transition: TransitionComponent })}
      slotProps={mergeSlotProps(slotProps, {
        backdrop: BackdropProps,
        paper: PaperProps,
        transition: TransitionProps,
      })}
      {...props}
    />
  );
});

export default CompatDialog;
