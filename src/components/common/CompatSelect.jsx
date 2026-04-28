import { forwardRef } from "react";
import { Select as MuiSelect } from "@mui/material";
import { normalizeSelectProps } from "./slotPropUtils";

const CompatSelect = forwardRef(function CompatSelect(
  { SelectProps, ...props },
  ref
) {
  return (
    <MuiSelect ref={ref} {...normalizeSelectProps({ ...SelectProps, ...props })} />
  );
});

export default CompatSelect;
