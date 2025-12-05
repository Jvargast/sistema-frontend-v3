import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

const StatusLegend = ({
  items,
  columns = 2,
  title = "Leyenda estados",
  hideOnMobile = true,
  maxWidth = 480, 
}) => {
  const data = items ?? [];

  return (
    <Box
      sx={{
        display: hideOnMobile ? { xs: "none", md: "flex" } : "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth,
        px: 2,
        py: 1.25,
        borderRadius: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "#F5F7FB",
        border: "1px dashed",
        borderColor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.grey[700]
            : theme.palette.grey[300],
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          color: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.grey[300]
              : theme.palette.grey[700],
          mb: 1,
          display: "block",
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: `repeat(${Math.min(columns, 2)}, minmax(0, 1fr))`,
            md: `repeat(${columns}, minmax(0, 1fr))`,
          },
          columnGap: 2,
          rowGap: 1,
        }}
      >
        {data.map((item) => (
          <Box
            key={item.id || item.label}
            sx={{ display: "flex", alignItems: "flex-start", gap: 0.75 }}
          >
            <Box
              sx={{
                mt: "4px",
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: (theme) =>
                  typeof item.color === "function"
                    ? item.color(theme)
                    : item.color,
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, display: "block" }}
              >
                {item.label ?? item.id}
              </Typography>
              {item.description && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[500]
                        : theme.palette.grey[600],
                  }}
                >
                  {item.description}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

StatusLegend.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      description: PropTypes.string,
      color: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    })
  ),
  columns: PropTypes.number,
  title: PropTypes.string,
  hideOnMobile: PropTypes.bool,
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default StatusLegend;
