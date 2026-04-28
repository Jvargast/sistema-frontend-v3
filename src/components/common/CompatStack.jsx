import { forwardRef } from "react";
import { Stack as MuiStack } from "@mui/material";
import { mergeSx, splitSystemProps } from "./systemPropUtils";

const CompatStack = forwardRef(function CompatStack({ sx, ...props }, ref) {
  const { systemSx, rest } = splitSystemProps(props);

  return <MuiStack ref={ref} sx={mergeSx(systemSx, sx)} {...rest} />;
});

export default CompatStack;
