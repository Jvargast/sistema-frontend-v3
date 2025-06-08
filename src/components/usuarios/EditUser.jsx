import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  CircularProgress,
  Grid,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const EditUserForm = ({
  userId,
  fetchUserData,
  updateUser,
  onCancel,
  onSuccess,
  onError,
  fieldConfig,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserData(userId);
        setFormData(data);
      } catch (error) {
        onError && onError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId, fetchUserData, onError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsUpdating(true);
      await updateUser(userId, formData);
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 6 } }}>
      <Grid container spacing={3}>
        {fieldConfig.flatMap((group, groupIndex) =>
          group.map((field, fieldIndex) => (
            <Grid item key={`${groupIndex}-${fieldIndex}`} xs={12} sm={6}>
              {field.name === "password" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      fontSize: "1.08rem",
                      bgcolor: "background.default",
                      "&:hover fieldset": { borderColor: "primary.light" },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              ) : field.type === "select" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  select
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      fontSize: "1.08rem",
                      bgcolor: "background.default",
                      "&:hover fieldset": { borderColor: "primary.light" },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      fontSize: "1.08rem",
                      bgcolor: "background.default",
                      "&:hover fieldset": { borderColor: "primary.light" },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              )}
            </Grid>
          ))
        )}
      </Grid>

      {/* Acciones */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 6 }}>
        <Button
          variant="outlined"
          onClick={onCancel || (() => navigate(-1))}
          sx={{
            minWidth: 140,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
            color: "error.main",
            borderColor: "error.main",
            "&:hover": {
              bgcolor: "error.main",
              color: "#fff",
              borderColor: "error.main",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isUpdating}
          sx={{
            minWidth: 160,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: "none",
            fontSize: "1rem",
            bgcolor: "primary.main",
            color: "#fff",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "primary.dark",
              color: "#fff",
            },
          }}
        >
          {isUpdating ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </Box>
    </Container>
  );
};

EditUserForm.propTypes = {
  userId: PropTypes.string.isRequired,
  fetchUserData: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  fieldConfig: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            value: PropTypes.any.isRequired,
            label: PropTypes.string.isRequired,
          })
        ),
        disabled: PropTypes.bool,
      })
    )
  ).isRequired,
};

export default EditUserForm;
