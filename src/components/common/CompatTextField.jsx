import { forwardRef, Fragment } from "react";
import { TextField as MuiTextField } from "@mui/material";
import { normalizeSelectProps } from "./slotPropUtils";

const asObject = (value, ownerState) =>
  typeof value === "function" ? value(ownerState) : value || {};

const mergeAdornments = (base, legacy) => {
  const merged = { ...base, ...legacy };

  if (base.className && legacy.className) {
    merged.className = `${base.className} ${legacy.className}`;
  }

  if (base.startAdornment && legacy.startAdornment) {
    merged.startAdornment = (
      <Fragment>
        {legacy.startAdornment}
        {base.startAdornment}
      </Fragment>
    );
  }

  if (base.endAdornment && legacy.endAdornment) {
    merged.endAdornment = (
      <Fragment>
        {legacy.endAdornment}
        {base.endAdornment}
      </Fragment>
    );
  }

  return merged;
};

const mergeSlotProp = (base, legacy, mergeAdornmentProps = false) => {
  if (!legacy) return base;
  if (!base) return legacy;

  if (typeof base === "function" || typeof legacy === "function") {
    return (ownerState) =>
      mergeSlotProp(
        asObject(base, ownerState),
        asObject(legacy, ownerState),
        mergeAdornmentProps
      );
  }

  return mergeAdornmentProps
    ? mergeAdornments(base, legacy)
    : { ...base, ...legacy };
};

const CompatTextField = forwardRef(function CompatTextField(
  {
    FormHelperTextProps,
    InputProps,
    InputLabelProps,
    inputProps,
    SelectProps,
    slotProps,
    ...props
  },
  ref
) {
  const normalizedSlotProps = {
    ...slotProps,
    formHelperText: mergeSlotProp(
      slotProps?.formHelperText,
      FormHelperTextProps
    ),
    input: mergeSlotProp(slotProps?.input, InputProps, true),
    inputLabel: mergeSlotProp(slotProps?.inputLabel, InputLabelProps),
    htmlInput: mergeSlotProp(slotProps?.htmlInput, inputProps),
    select: mergeSlotProp(slotProps?.select, normalizeSelectProps(SelectProps)),
  };

  return <MuiTextField ref={ref} slotProps={normalizedSlotProps} {...props} />;
});

export default CompatTextField;
