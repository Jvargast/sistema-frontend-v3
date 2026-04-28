import { forwardRef } from "react";
import { Snackbar as MuiSnackbar } from "@mui/material";
import { mergeSlotProps, mergeSlots } from "./slotPropUtils";

const CompatSnackbar = forwardRef(function CompatSnackbar(
  { ClickAwayListenerProps, ContentProps, slotProps, slots, TransitionComponent, TransitionProps, ...props },
  ref
) {
  return (
    <MuiSnackbar
      ref={ref}
      slots={mergeSlots(slots, { transition: TransitionComponent })}
      slotProps={mergeSlotProps(slotProps, {
        clickAwayListener: ClickAwayListenerProps,
        content: ContentProps,
        transition: TransitionProps,
      })}
      {...props}
    />
  );
});

export default CompatSnackbar;
