import { forwardRef } from "react";
import { Typography as MuiTypography } from "@mui/material";
import { mergeSx, splitSystemProps } from "./systemPropUtils";

const CompatTypography = forwardRef(function CompatTypography(
  { sx, textAlign, ...props },
  ref
) {
  const { systemSx, rest } = splitSystemProps({
    ...props,
    ...(textAlign ? { textAlign } : {}),
  });

  return <MuiTypography ref={ref} sx={mergeSx(systemSx, sx)} {...rest} />;
});

export default CompatTypography;
