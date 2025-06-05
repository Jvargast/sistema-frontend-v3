import { Paper, Typography, Box, useTheme } from "@mui/material";

const EmptyColumn = () => {
  const theme = useTheme();
  return (
    <Paper
      elevation={1}
      sx={{

        width: "100%",
        height: "100%", 
        boxSizing: "border-box",
        borderRadius: 3,
        p: 1,
        boxShadow: theme.shadows[1],
        border: `2px solid ${theme.palette.divider}`,
        background:
          theme.palette.mode === "dark" ? theme.palette.grey[900] : "#F5F7FB",
        opacity: 0.88,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          fontSize={13}
          sx={{
            fontWeight: "bold",
            color:
              theme.palette.mode === "dark"
                ? theme.palette.text.primary
                : "#305088",
            letterSpacing: 0.5,
            mb: 0.5
          }}
        >
          Chofer
        </Typography>
        <Typography
          fontSize={13}
          fontWeight={400}
          sx={{
            color:
              theme.palette.mode === "dark"
                ? theme.palette.grey[400]
                : theme.palette.grey[600],
            textTransform: "uppercase",
          }}
        >
          No Asignado
        </Typography>
        <Box
          sx={{
            mx: "auto",
            height: 2,
            width: 48,
            borderRadius: 1,
            background:
              theme.palette.mode === "dark"
                ? theme.palette.primary.main + "55"
                : "#C7DAFF",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minHeight: 240,
          flex: 1,
          justifyContent: "flex-start",
        }}
      >
        {Array.from({ length: 4 }).map((_, idx) => (
          <Box
            key={`placeholder-${idx}`}
            sx={{
              height: 130,
              borderRadius: 2,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : "#F5F5F5",
              border: `1.5px dashed ${
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light + "99"
                  : "#C7DAFF"
              }`,
              opacity: 0.48,
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default EmptyColumn;
