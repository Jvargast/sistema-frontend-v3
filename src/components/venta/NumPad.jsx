import { Box, Button, useTheme } from "@mui/material";
import BackspaceIcon from "@mui/icons-material/Backspace";
import ClearIcon from "@mui/icons-material/Clear";
import PropTypes from "prop-types";

const NUMPAD_VALUES = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["0", ".", "del"],
];

const NumPad = ({ value, onChange }) => {
  const theme = useTheme();

  const strValue = typeof value === "string" ? value : String(value ?? "");

  const handleClick = (val) => {
    if (val === "del") {
      onChange(strValue.length > 1 ? strValue.slice(0, -1) : "");
    } else if (val === "clear") {
      onChange("");
    } else {
      if (val === "." && strValue.includes(".")) return;
      if (strValue === "0" && val !== ".") {
        onChange(val);
        return;
      }
      onChange(strValue + val);
    }
  };

  return (
    <Box
      sx={{
        width: 260,
        p: 2,
        background:
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.grey[100],
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        userSelect: "none",
      }}
    >
      {/* Botón C (Clear) */}
      <Box display="flex" justifyContent="flex-end" width="100%" mb={0.5}>
        <Button
          onClick={() => handleClick("clear")}
          size="large"
          variant="outlined"
          sx={{
            fontSize: "1.3rem",
            fontWeight: 700,
            borderRadius: "50%",
            width: 56,
            height: 56,
            minWidth: 56,
            color: "#fff",
            background: theme.palette.error.main,
            borderColor: theme.palette.error.main,
            transition: "all .18s",
            boxShadow: "0 2px 6px rgba(255,82,82,0.10)",
            "&:hover": {
              background: "#fff",
              color: theme.palette.error.main,
              borderColor: theme.palette.error.main,
              boxShadow: "0 2px 10px rgba(255,82,82,0.18)",
            },
          }}
          startIcon={<ClearIcon sx={{ fontSize: 22 }} />}
        >
          C
        </Button>
      </Box>
      {/* Numpad */}
      <Box display="flex" flexDirection="column" gap={2} width="100%">
        {NUMPAD_VALUES.map((row, idx) => (
          <Box key={idx} display="flex" gap={2}>
            {row.map((val) =>
              val === "del" ? (
                <Button
                  key={val}
                  fullWidth
                  size="large"
                  variant="outlined"
                  onClick={() => handleClick("del")}
                  sx={{
                    fontSize: "2rem",
                    fontWeight: 600,
                    flex: 1,
                    minWidth: 0,
                    borderRadius: "50%",
                    width: 64,
                    height: 64,
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.error.light
                        : theme.palette.error.main,
                    borderColor: theme.palette.error.main,
                    background: "#fff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    "&:hover": {
                      background: theme.palette.error.main,
                      color: "#fff",
                    },
                  }}
                >
                  <BackspaceIcon sx={{ fontSize: 32 }} />
                </Button>
              ) : (
                <Button
                  key={val}
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={() => handleClick(val)}
                  sx={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    flex: 1,
                    minWidth: 0,
                    borderRadius: "50%",
                    width: 64,
                    height: 64,
                    boxShadow: "0 2px 6px rgba(80,80,80,0.09)",
                    background:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary[700]
                        : theme.palette.primary.main,
                    color: "#fff",
                    "&:hover": {
                      background:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary[800]
                          : theme.palette.primary.dark,
                    },
                  }}
                >
                  {val}
                </Button>
              )
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

NumPad.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default NumPad;
