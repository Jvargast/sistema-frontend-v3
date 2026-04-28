import { forwardRef } from "react";
import { Popover as MuiPopover } from "@mui/material";
import { mergeSlotProps, mergeSlots } from "./slotPropUtils";

const CompatPopover = forwardRef(function CompatPopover(
  {
    BackdropProps,
    PaperProps,
    slotProps,
    slots,
    TransitionComponent,
    TransitionProps,
    ...props
  },
  ref
) {
  return (
    <MuiPopover
      ref={ref}
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

export default CompatPopover;
