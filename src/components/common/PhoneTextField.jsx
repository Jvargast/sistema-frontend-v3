import { forwardRef } from "react";
import { InputAdornment } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import {
  formatPhoneInputCL,
  isPhonePrefixOnlyCL,
  validatePhoneCL,
} from "../../utils/phoneCl";
import TextField from "./CompatTextField";
import Box from "./CompatBox";

const ALLOWED_CONTROL_KEYS = new Set([
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "Tab",
  "Home",
  "End",
]);

const buildChangeEvent = (event, name, value) => ({
  ...event,
  target: {
    ...event?.target,
    name: name ?? event?.target?.name,
    value,
  },
  currentTarget: {
    ...event?.currentTarget,
    name: name ?? event?.currentTarget?.name,
    value,
  },
});

const PhoneTextField = forwardRef(function PhoneTextField(
  {
    value = "",
    name,
    onChange,
    onBlur,
    onFocus,
    helperText,
    error,
    validate = true,
    required = false,
    InputProps,
    inputProps,
    placeholder = "+56 9 1234 5678",
    sx,
    ...props
  },
  ref
) {
  const theme = useTheme();
  const isPrefixOnly = isPhonePrefixOnlyCL(value);
  const validation = value && !isPrefixOnly ? validatePhoneCL(value) : null;
  const showValidationError =
    validate && !!value && !isPrefixOnly && validation?.valid === false;
  const resolvedError = Boolean(error || showValidationError);
  const resolvedHelperText =
    helperText ??
    (validate && !!value && !isPrefixOnly ? validation?.msg || " " : " ");

  const emitChange = (event, nextValue) => {
    onChange?.(buildChangeEvent(event, name, nextValue), nextValue);
  };

  const handleChange = (event) => {
    emitChange(
      event,
      formatPhoneInputCL(event.target.value, { keepPrefix: true })
    );
  };

  const handleFocus = (event) => {
    if (!value) emitChange(event, "+56 ");
    onFocus?.(event);
  };

  const handleBlur = (event) => {
    if (!required && isPhonePrefixOnlyCL(event.target.value)) {
      emitChange(event, "");
    }
    onBlur?.(event);
  };

  const handleKeyDown = (event) => {
    props.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (
      ALLOWED_CONTROL_KEYS.has(event.key) ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }
    if (!/[0-9+ ]/.test(event.key)) event.preventDefault();
  };

  const prefixAdornment = (
    <InputAdornment position="start">
      <Box
        component="span"
        sx={{
          borderRadius: 0.75,
          px: 0.75,
          py: 0.25,
          bgcolor:
            theme.palette.mode === "light"
              ? alpha("#0F172A", 0.07)
              : alpha(theme.palette.common.white, 0.1),
          color:
            theme.palette.mode === "light"
              ? "#0F172A"
              : theme.palette.common.white,
          fontSize: "0.72rem",
          fontWeight: 800,
          letterSpacing: 0,
          lineHeight: 1.4,
        }}
      >
        CL
      </Box>
    </InputAdornment>
  );

  return (
    <TextField
      {...props}
      ref={ref}
      name={name}
      value={value}
      required={required}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      error={resolvedError}
      helperText={resolvedHelperText}
      inputProps={{
        inputMode: "tel",
        autoComplete: "tel",
        maxLength: 16,
        pattern: "[0-9+ ]*",
        ...inputProps,
      }}
      InputProps={{
        ...InputProps,
        startAdornment: InputProps?.startAdornment || prefixAdornment,
      }}
      sx={[
        {
          "& .MuiOutlinedInput-root": {
            borderRadius: 1,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
});

PhoneTextField.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  helperText: PropTypes.node,
  error: PropTypes.bool,
  validate: PropTypes.bool,
  required: PropTypes.bool,
  InputProps: PropTypes.object,
  inputProps: PropTypes.object,
  placeholder: PropTypes.string,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default PhoneTextField;
