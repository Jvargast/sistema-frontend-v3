import { forwardRef } from "react";
import { Modal as MuiModal } from "@mui/material";
import { mergeSlotProps, mergeSlots } from "./slotPropUtils";

const CompatModal = forwardRef(function CompatModal(
  {
    BackdropComponent,
    BackdropProps,
    disableEscapeKeyDown,
    slotProps,
    slots,
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
    <MuiModal
      ref={ref}
      onClose={onClose ? handleClose : undefined}
      slots={mergeSlots(slots, { backdrop: BackdropComponent })}
      slotProps={mergeSlotProps(slotProps, { backdrop: BackdropProps })}
      {...props}
    />
  );
});

export default CompatModal;
