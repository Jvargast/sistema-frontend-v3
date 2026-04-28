import { forwardRef } from "react";
import { Tabs as MuiTabs } from "@mui/material";
import { mergeSlotProps } from "./slotPropUtils";

const CompatTabs = forwardRef(function CompatTabs(
  { slotProps, TabIndicatorProps, ...props },
  ref
) {
  return (
    <MuiTabs
      ref={ref}
      slotProps={mergeSlotProps(slotProps, { indicator: TabIndicatorProps })}
      {...props}
    />
  );
});

export default CompatTabs;
