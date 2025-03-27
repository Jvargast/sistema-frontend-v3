import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
  } from "@mui/material";
  import PropTypes from "prop-types";
  
  const InfoFieldGroup = ({ fields = [] }) => {
    return (
      <Box
        sx={{
          mt: 3,
          p: 3,
          borderRadius: "12px",
          backgroundColor: "#f9f9fb",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {fields.map(
          (
            {
              type = "text",
              label,
              value,
              options = [],
              disabled = false,
              onChange,
              name,
              render,
            },
            index
          ) => {
            if (render) {
              return (
                <Box
                  key={index}
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      mb: 1,
                      color: "#34495e",
                    }}
                  >
                    {label}
                  </Typography>
                  {render(value)}
                </Box>
              );
            }
  
            if (type === "select") {
              return (
                <FormControl
                  key={index}
                  fullWidth
                  sx={{
                    mb: 3,
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <InputLabel
                    sx={{ fontSize: "1.1rem", color: "#7f8c8d", fontWeight: "bold" }}
                  >
                    {label}
                  </InputLabel>
                  <Select
                    value={value}
                    onChange={onChange}
                    label={label}
                    name={name}
                    disabled={disabled}
                    sx={{
                      fontSize: "1rem",
                      borderRadius: "8px",
                      "& .MuiSelect-select": {
                        backgroundColor: "#f8f9fc",
                      },
                    }}
                  >
                    {options.map((option, idx) => (
                      <MenuItem
                        key={idx}
                        value={option.value}
                        sx={{ fontSize: "1rem", fontWeight: "bold", color: "#34495e" }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }
  
            return (
              <TextField
                key={index}
                fullWidth
                label={label}
                value={value}
                disabled={disabled}
                onChange={onChange}
                name={name}
                type={type}
                sx={{
                  mb: 3,
                  "& .MuiInputBase-root": {
                    fontSize: "1rem",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "1.1rem",
                    color: "#7f8c8d",
                    fontWeight: "bold",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#dfe6e9",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1abc9c",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3498db",
                    },
                  },
                }}
              />
            );
          }
        )}
      </Box>
    );
  };
  
  InfoFieldGroup.propTypes = {
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            value: PropTypes.any.isRequired,
            label: PropTypes.string.isRequired,
          })
        ),
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        name: PropTypes.string,
        render: PropTypes.func,
      })
    ).isRequired,
  };
  
  export default InfoFieldGroup;
  