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
        mt: 2,
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : "#f7fafd",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? theme.shadows[1]
            : "0 2px 8px rgba(44, 62, 80, 0.08)",
        transition: "background 0.2s",
        minWidth: 0,
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
                  borderRadius: 2,
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.background.default
                      : "#fff",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.shadows[0]
                      : "0 1px 5px rgba(44,62,80,0.05)",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1.08rem",
                    fontWeight: "bold",
                    mb: 1,
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.light
                        : "#274b7a",
                    letterSpacing: 0.1,
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
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.background.default
                      : "#fff",
                  borderRadius: 2,
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.shadows[0]
                      : "0 1px 5px rgba(44,62,80,0.06)",
                }}
              >
                <InputLabel
                  sx={{
                    fontSize: "1.06rem",
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.text.secondary
                        : "#607D8B",
                    fontWeight: "bold",
                  }}
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
                    borderRadius: 2,
                    "& .MuiSelect-select": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.palette.background.default
                          : "#f8fafd",
                    },
                  }}
                >
                  {options.map((option, idx) => (
                    <MenuItem
                      key={idx}
                      value={option.value}
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.text.primary
                            : "#2d425e",
                      }}
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
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiInputBase-root": {
                  fontSize: "1rem",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.background.default
                      : "#fff",
                  borderRadius: 2,
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.shadows[0]
                      : "0 1px 5px rgba(44,62,80,0.04)",
                  transition: "background 0.18s",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "1.05rem",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.text.secondary
                      : "#7f8c8d",
                  fontWeight: "bold",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.divider
                        : "#dbe6f6",
                  },
                  "&:hover fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.light
                        : "#90caf9",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.main
                        : "#1976d2",
                    borderWidth: 2,
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
