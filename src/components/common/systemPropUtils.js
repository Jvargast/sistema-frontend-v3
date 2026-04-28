export const SYSTEM_PROPS = new Set([
  "alignContent",
  "alignItems",
  "alignSelf",
  "bgcolor",
  "border",
  "borderBottom",
  "borderColor",
  "borderLeft",
  "borderRadius",
  "borderRight",
  "borderTop",
  "bottom",
  "boxShadow",
  "color",
  "columnGap",
  "display",
  "flex",
  "flexBasis",
  "flexDirection",
  "flexGrow",
  "flexShrink",
  "flexWrap",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "gap",
  "gridArea",
  "gridAutoColumns",
  "gridAutoFlow",
  "gridAutoRows",
  "gridColumn",
  "gridRow",
  "gridTemplateAreas",
  "gridTemplateColumns",
  "gridTemplateRows",
  "height",
  "justifyContent",
  "justifyItems",
  "justifySelf",
  "left",
  "letterSpacing",
  "lineHeight",
  "m",
  "margin",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginTop",
  "maxHeight",
  "maxWidth",
  "mb",
  "minHeight",
  "minWidth",
  "ml",
  "mr",
  "mt",
  "mx",
  "my",
  "order",
  "overflow",
  "overflowX",
  "overflowY",
  "p",
  "padding",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "pb",
  "pl",
  "position",
  "pr",
  "pt",
  "px",
  "py",
  "right",
  "rowGap",
  "textAlign",
  "textOverflow",
  "top",
  "whiteSpace",
  "width",
  "zIndex",
]);

export const mergeSx = (systemSx, sx) => {
  if (!Object.keys(systemSx).length) return sx;
  if (Array.isArray(sx)) return [systemSx, ...sx];
  return sx ? [systemSx, sx] : systemSx;
};

export const splitSystemProps = (props) => {
  const systemSx = {};
  const rest = {};

  Object.entries(props).forEach(([key, value]) => {
    if (SYSTEM_PROPS.has(key)) {
      systemSx[key] = value;
    } else {
      rest[key] = value;
    }
  });

  return { systemSx, rest };
};
