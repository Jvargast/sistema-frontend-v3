import { forwardRef } from "react";
import { Box as MuiBox } from "@mui/material";
import { mergeSx, splitSystemProps } from "./systemPropUtils";

const CompatBox = forwardRef(function CompatBox({ sx, ...props }, ref) {
  const { systemSx, rest } = splitSystemProps(props);

  return <MuiBox ref={ref} sx={mergeSx(systemSx, sx)} {...rest} />;
});

export default CompatBox;
