import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../venta/ProductDetails";
import PropTypes from "prop-types";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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

const ModalForm = ({
  open,
  onClose,
  onSubmit,
  fields,
  title,
  initialData,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    initialData ||
      fields.reduce((acc, field) => {
        const defaultValue = field.defaultValue || "";
        return {
          ...acc,
          [field.name]:
            field.type === "checkbox" ? Boolean(defaultValue) : defaultValue,
        };
      }, {})
  );
  // Sincroniza `formData` cuando `fields` cambian
  useEffect(() => {
    if (initialData) {
      setFormData(
        Object.keys(initialData).reduce((acc, key) => {
          const field = fields.find((f) => f.name === key);
          return {
            ...acc,
            [key]:
              field?.type === "checkbox"
                ? Boolean(initialData[key])
                : initialData[key],
          };
        }, {})
      );
    } else {
      setFormData(
        fields.reduce((acc, field) => {
          const defaultValue = field.defaultValue || "";
          return {
            ...acc,
            [field.name]:
              field.type === "checkbox" ? Boolean(defaultValue) : defaultValue,
          };
        }, {})
      );
    }
  }, [fields, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? Boolean(checked) : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetailsChange = (details) => {
    setFormData((prev) => ({
      ...prev,
      detalles: details,
    }));
  };

  const handleSubmit = () => {
    const processedFormData = { ...formData };

    // Convertir monto a número
    if (processedFormData.monto) {
      processedFormData.monto = parseFloat(processedFormData.monto);
    }
    onSubmit(processedFormData);
    onClose();
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent component="form" onSubmit={(e) => e.preventDefault()}>
        {fields.map((field) => {
          if (field.name === "detalles") {
            return (
              <ProductDetails
                key={field.name}
                value={formData.detalles}
                onChange={handleDetailsChange}
                productos={field.productos}
                setSearchTerm={field.setSearchTerm}
              />
            );
          }
          switch (field.type) {
            case "text":
            case "number":
              return (
                <TextField
                  key={field.name}
                  fullWidth
                  margin="dense"
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
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
                          prev[field.name].replace(/[^0-9kK]/gi, "")
                        ),
                      }));
                    }
                  }}
                  disabled={field.disabled}
                  autoComplete={field.name === "rut" ? "username" : "off"}
                />
              );
            case "password":
              return (
                <TextField
                  key={field.name}
                  fullWidth
                  margin="dense"
                  label={field.label}
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={field.disabled}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              );
            case "select":
              if (field.searchable) {
                // Si el campo admite búsqueda, usa react-select
                return (
                  <div key={field.name} style={{ marginBottom: "16px" }}>
                    <label style={{ marginBottom: "8px", display: "block" }}>
                      {field.label}
                    </label>
                    <ReactSelect
                      options={[
                        ...field.options,
                        {
                          value: "create",
                          label: `${field.searchOption}`,
                        },
                      ]}
                      placeholder="Buscar..."
                      value={field.options.find(
                        (option) => option.value === formData[field.name]
                      )}
                      onChange={(selectedOption) => {
                        if (selectedOption.value === "create") {
                          navigate(`${field.route}`); // Redirige a la creación de clientes
                        } else {
                          handleSelectChange(field.name, selectedOption.value);
                        }
                      }}
                      isSearchable
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Asegura que el z-index sea alto
                      }}
                    />
                  </div>
                );
              } else {
                // Comportamiento normal para selects estándar
                const selectId = `select-${field.name}`;
                return (
                  <FormControl key={field.name} fullWidth margin="dense">
                    <InputLabel htmlFor={selectId}>{field.label}</InputLabel>
                    <Select
                      id={selectId}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      label={field.label}
                    >
                      {field.options.map((option, index) => (
                        <MenuItem
                          key={option.value || index}
                          value={option.value}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }
            case "checkbox":
              return (
                <FormControlLabel
                  key={field.name}
                  control={
                    <Checkbox
                      name={field.name}
                      checked={formData[field.name]}
                      onChange={handleChange}
                    />
                  }
                  label={field.label}
                />
              );
            default:
              return null;
          }
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="info">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
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
