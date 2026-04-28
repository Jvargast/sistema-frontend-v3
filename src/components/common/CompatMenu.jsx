import { forwardRef } from "react";
import { Menu as MuiMenu } from "@mui/material";
import { normalizeMenuProps } from "./slotPropUtils";

const CompatMenu = forwardRef(function CompatMenu(props, ref) {
  return <MuiMenu ref={ref} {...normalizeMenuProps(props)} />;
});

export default CompatMenu;
