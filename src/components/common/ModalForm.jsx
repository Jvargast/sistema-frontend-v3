import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import { forwardRef, useEffect, useMemo, useState } from "react";
import ReactSelect from "react-select";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../venta/ProductDetails";
import PropTypes from "prop-types";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";

const formatRut = (value) => {
  const cleanValue = value.replace(/[^0-9kK]/gi, "");
  if (cleanValue.length < 2) return cleanValue;

  const body = cleanValue.slice(0, -1);
  const dv = cleanValue.slice(-1);
  let formatted = "";
  let i = 0;

  for (let j = body.length - 1; j >= 0; j--) {
    formatted = body[j] + formatted;
    i++;
    if (i === 3 && j !== 0) {
      formatted = "." + formatted;
      i = 0;
    }
  }

  return `${formatted}-${dv}`;
};

const SlideUp = forwardRef(function SlideUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const buildDefaults = (fields) =>
  fields.reduce((acc, field) => {
    const def = field.defaultValue ?? (field.type === "checkbox" ? false : "");
    acc[field.name] = field.type === "checkbox" ? Boolean(def) : def;
    return acc;
  }, {});

const mergeInitial = (fields, initialData) => {
  const base = buildDefaults(fields);
  if (!initialData) return base;

  for (const key of Object.keys(initialData)) {
    const field = fields.find((f) => f.name === key);
    if (!field) continue;
    base[key] =
      field.type === "checkbox" ? Boolean(initialData[key]) : initialData[key];
  }
  return base;
};

const ModalForm = ({
  open,
  onClose,
  onSubmit,
  fields,
  title,
  initialData,
  isLoading,
}) => {
  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const validateField = (field, value, allValues) => {
    if (
      field.required &&
      (value === "" || value === null || value === undefined)
    ) {
      return field.requiredMessage || "Este campo es obligatorio";
    }
    if (
      field.minLength &&
      typeof value === "string" &&
      value.length < field.minLength
    ) {
      return (
        field.minLengthMessage ||
        `Debe tener al menos ${field.minLength} caracteres`
      );
    }
    if (field.pattern) {
      const re =
        field.pattern instanceof RegExp
          ? field.pattern
          : new RegExp(field.pattern);
      if (typeof value === "string" && !re.test(value)) {
        return field.patternMessage || "Formato inválido";
      }
    }
    if ((field.name === "email" || field.format === "email") && value) {
      if (!emailRegex.test(String(value))) {
        return (
          field.formatMessage || "Correo inválido (ej: usuario@dominio.com)"
        );
      }
    }

    if (typeof field.validate === "function") {
      const msg = field.validate(value, allValues);
      if (msg) return msg;
    }

    return "";
  };

  const validateAll = () => {
    const next = {};
    fields.forEach((f) => {
      const v = formData[f.name];
      const err = validateField(f, v, formData);
      if (err) next[f.name] = err;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(mergeInitial(fields, initialData));
  useEffect(() => {
    setFormData(mergeInitial(fields, initialData));
  }, [fields, initialData]);

  const isFieldDisabled = (name) =>
    !!fields.find((f) => f.name === name)?.disabled;

  const isNumericSelect = (field) =>
    Array.isArray(field.options) &&
    field.options.some((o) => typeof o.value === "number");

  const coerceSelectValue = (field, cur) => {
    const opts = field.options ?? [];
    if (cur === "" || cur == null) return "";
    if (isNumericSelect(field)) {
      const num = Number(cur);
      return opts.some((o) => Number(o.value) === num) ? num : "";
    }
    const str = String(cur);
    return opts.some((o) => String(o.value) === str) ? str : "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (isFieldDisabled(name)) return;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? Boolean(checked) : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    if (isFieldDisabled(name)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (details) => {
    setFormData((prev) => ({
      ...prev,
      detalles: details,
    }));
  };

  const handleSubmit = () => {
    if (!validateAll()) return;
    const processedFormData = { ...formData };
    if (processedFormData.monto) {
      processedFormData.monto = parseFloat(processedFormData.monto);
    }
    onSubmit(processedFormData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const rsStyles = useMemo(
    () => ({
      menuPortal: (base) => ({ ...base, zIndex: 1300 }),
      control: (base, state) => ({
        ...base,
        minHeight: 40,
        borderRadius: 12,
        borderColor: state.isFocused ? "#1976d2" : "#e0e0e0",
        boxShadow: state.isFocused ? "0 0 0 3px rgba(25,118,210,0.12)" : "none",
        ":hover": { borderColor: "#1976d2" },
      }),
      menu: (base) => ({
        ...base,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
      }),
      option: (base, state) => ({
        ...base,
        padding: "10px 12px",
        backgroundColor: state.isFocused ? "rgba(25,118,210,0.08)" : "white",
        color: "#1f2937",
      }),
      placeholder: (base) => ({ ...base, color: "#9aa0a6" }),
      singleValue: (base) => ({ ...base, color: "#1f2937" }),
    }),
    []
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={SlideUp}
      aria-labelledby="modal-form-title"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
        },
      }}
    >
      <DialogTitle
        id="modal-form-title"
        sx={{
          m: 0,
          py: 2,
          px: 3,
          color: "common.white",
          fontWeight: 700,
          background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {title}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "common.white",
            bgcolor: "rgba(255,255,255,0.12)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
          }}
          aria-label="Cerrar"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        component="form"
        onSubmit={(e) => e.preventDefault()}
        sx={{
          px: 3,
          pt: 3,
          pb: 1,
          backgroundColor: (t) =>
            t.palette.mode === "light" ? "#fafafa" : "background.default",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Grid container spacing={2}>
            {fields.map((field) => {
              if (field.name === "detalles") {
                return (
                  <Grid item xs={12} key={field.name}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1.5, color: "text.secondary" }}
                    >
                      {field.label ?? "Detalles"}
                    </Typography>
                    <ProductDetails
                      value={formData.detalles}
                      onChange={handleDetailsChange}
                      productos={field.productos}
                      setSearchTerm={field.setSearchTerm}
                    />
                  </Grid>
                );
              }

              switch (field.type) {
                case "text":
                case "number":
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={field.fullWidth ? 12 : 6}
                      key={field.name}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name] ?? ""}
                        onChange={(e) => {
                          const { value } = e.target;
                          const raw = value.replace(/[^0-9kK.-]/g, "");
                          setFormData((prev) => ({
                            ...prev,
                            [field.name]: field.name === "rut" ? raw : value,
                          }));
                        }}
                        onBlur={() => {
                          if (field.name === "rut") {
                            setFormData((prev) => ({
                              ...prev,
                              [field.name]: formatRut(
                                prev[field.name]?.replace(/[^0-9kK]/gi, "") ||
                                  ""
                              ),
                            }));
                          }
                        }}
                        disabled={field.disabled}
                        autoComplete={field.name === "rut" ? "username" : "off"}
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: 2 },
                        }}
                        error={Boolean(errors[field.name])}
                        helperText={errors[field.name] || field.helperText}
                      />
                    </Grid>
                  );

                case "password":
                  return (
                    <Grid item xs={12} sm={6} key={field.name}>
                      <TextField
                        fullWidth
                        size="small"
                        label={field.label}
                        name={field.name}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData[field.name]}
                        onChange={handleChange}
                        disabled={field.disabled}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={togglePasswordVisibility}
                                edge="end"
                              >
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(errors[field.name])}
                        helperText={errors[field.name] || field.helperText}
                      />
                    </Grid>
                  );

                case "select":
                  if (field.searchable) {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={field.fullWidth ? 12 : 6}
                        key={field.name}
                      >
                        <Typography
                          variant="caption"
                          sx={{ mb: 0.75, display: "block", fontWeight: 600 }}
                        >
                          {field.label}
                        </Typography>
                        <ReactSelect
                          options={[
                            ...field.options,
                            { value: "create", label: field.searchOption },
                          ]}
                          placeholder="Buscar..."
                          value={field.options.find(
                            (o) => o.value === formData[field.name]
                          )}
                          onChange={(opt) => {
                            if (field.disabled) return;
                            if (opt?.value === "create") navigate(field.route);
                            else handleSelectChange(field.name, opt.value);
                          }}
                          isDisabled={!!field.disabled}
                          isSearchable
                          menuPortalTarget={document.body}
                          styles={rsStyles}
                        />
                      </Grid>
                    );
                  }
                  // Select normal
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={field.fullWidth ? 12 : 6}
                      key={field.name}
                    >
                      <FormControl fullWidth size="small">
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                          name={field.name}
                          value={coerceSelectValue(field, formData[field.name])}
                          label={field.label}
                          onChange={handleChange}
                          disabled={!!field.disabled}
                          sx={{ borderRadius: 2 }}
                          MenuProps={{
                            PaperProps: {
                              sx: { borderRadius: 2, boxShadow: 8 },
                            },
                          }}
                        >
                          {field.options.map((option, idx) => (
                            <MenuItem
                              key={option.value ?? idx}
                              value={option.value}
                            >
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {errors[field.name] || field.helperText}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  );

                case "checkbox":
                  return (
                    <Grid item xs={12} key={field.name}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name={field.name}
                            checked={!!formData[field.name]}
                            onChange={handleChange}
                          />
                        }
                        label={field.label}
                      />
                    </Grid>
                  );

                default:
                  return null;
              }
            })}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          py: 2,
          px: 3,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "rgba(250,250,250,0.9)"
              : "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          position: "sticky",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disableElevation
          sx={{ borderRadius: 2, px: 2.5, fontWeight: 700 }}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
ModalForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      defaultValue: PropTypes.any,
      type: PropTypes.string.isRequired,
      label: PropTypes.string,
      disabled: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.any.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
      searchable: PropTypes.bool,
      searchOption: PropTypes.string,
      route: PropTypes.string,
      productos: PropTypes.array,
      setSearchTerm: PropTypes.func,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  initialData: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default ModalForm;
