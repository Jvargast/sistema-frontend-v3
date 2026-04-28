import { forwardRef } from "react";
import { StepLabel as MuiStepLabel } from "@mui/material";
import { mergeSlotProps, mergeSlots } from "./slotPropUtils";

const CompatStepLabel = forwardRef(function CompatStepLabel(
  { slotProps, slots, StepIconComponent, StepIconProps, ...props },
  ref
) {
  return (
    <MuiStepLabel
      ref={ref}
      slots={mergeSlots(slots, { stepIcon: StepIconComponent })}
      slotProps={mergeSlotProps(slotProps, { stepIcon: StepIconProps })}
      {...props}
    />
  );
});

export default CompatStepLabel;
