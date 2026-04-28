import { forwardRef } from "react";
import { Grid as MuiGrid } from "@mui/material";
import { mergeSx, splitSystemProps } from "./systemPropUtils";

const BREAKPOINTS = ["xs", "sm", "md", "lg", "xl"];

const normalizeSize = (props) => {
  const rest = { ...props };
  const nextSize =
    rest.size && typeof rest.size === "object" && !Array.isArray(rest.size)
      ? { ...rest.size }
      : {};

  BREAKPOINTS.forEach((breakpoint) => {
    if (Object.prototype.hasOwnProperty.call(rest, breakpoint)) {
      nextSize[breakpoint] = rest[breakpoint];
      delete rest[breakpoint];
    }
  });

  if (nextSize && typeof nextSize === "object" && Object.keys(nextSize).length) {
    rest.size = nextSize;
  }

  delete rest.item;
  return rest;
};

const CompatGrid = forwardRef(function CompatGrid({ sx, ...props }, ref) {
  const normalizedProps = normalizeSize(props);
  const { systemSx, rest } = splitSystemProps(normalizedProps);

  return <MuiGrid ref={ref} sx={mergeSx(systemSx, sx)} {...rest} />;
});

export default CompatGrid;
