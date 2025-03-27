import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
  Grid,
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
    <Box sx={{ p: { xs: 2, sm: 3 }, display: "flex", justifyContent: "center" }}>
      <Card
        sx={{
          width: "100%",
          maxWidth: "780px",
          p: { xs: 3, sm: 4 },
          borderRadius: "12px",
          background: "linear-gradient(135deg, #ffffff 30%, #f5f7fa 100%)",
          border: "1px solid #dfe6e9", 
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: "#2c3e50", textAlign: "center" }}>
            Información del Usuario
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
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
                            <IconButton onClick={togglePasswordVisibility} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          transition: "0.3s",
                          bgcolor: "#ffffff",
                          border: "1px solid #dfe6e9",
                          "&:hover fieldset": { borderColor: "#3498db" },
                          "&.Mui-focused fieldset": { borderColor: "#2980b9" },
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
                          borderRadius: "10px",
                          transition: "0.3s",
                          bgcolor: "#ffffff",
                          border: "1px solid #dfe6e9",
                          "&:hover fieldset": { borderColor: "#3498db" },
                          "&.Mui-focused fieldset": { borderColor: "#2980b9" },
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
                          borderRadius: "10px",
                          transition: "0.3s",
                          bgcolor: "#ffffff",
                          border: "1px solid #dfe6e9",
                          "&:hover fieldset": { borderColor: "#3498db" },
                          "&.Mui-focused fieldset": { borderColor: "#2980b9" },
                        },
                      }}
                    />
                  )}
                </Grid>
              ))
            )}
          </Grid>

          {/* Botones de acción */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel || (() => navigate(-1))}
              sx={{
                minWidth: 150,
                fontWeight: "bold",
                textTransform: "none",
                color: "#e74c3c",
                borderColor: "#e74c3c",
                fontSize: "1rem",
                borderRadius: "10px",
                transition: "0.3s",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "#e74c3c",
                  borderColor: "#e74c3c",
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
                minWidth: 150,
                fontSize: "1rem",
                textTransform: "none",
                borderRadius: "10px",
                backgroundColor: "#3498db",
                color: "#fff",
                transition: "0.3s",
                "&:hover": { backgroundColor: "#2980b9" },
              }}
            >
              {isUpdating ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
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
