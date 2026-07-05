import { useTheme, Divider } from "@mui/material";
import PropTypes from "prop-types";
import Box from "./CompatBox";
import Typography from "./CompatTypography";

const Header = ({
  title,
  subtitle,
  eyebrow,
  actions,
  titleVariant = "h2",
  sx,
}) => {
  const theme = useTheme();

  if (!actions && !eyebrow && titleVariant === "h2" && !sx) {
    return (
      <Box>
        <Typography
          variant="h2"
          color={theme.palette.text.primary}
          gutterBottom
          fontWeight="bold"
          sx={{ mb: "5px" }}
        >
          {title}
        </Typography>
        <Box sx={{ display: "inline-block", position: "relative", mb: 2 }}>
          <Typography
            variant="subtitle1"
            color={theme.palette.text.secondary}
            sx={{ fontWeight: 400 }}
          >
            {subtitle}
          </Typography>

          <Divider
            sx={{
              position: "absolute",
              bottom: -2,
              left: 0,
              width: "100%",
              height: 2,
              borderRadius: 1,
              backgroundColor: theme.palette.primary.main,
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={[{ mb: 3 }, sx]}>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "stretch", md: "flex-start" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 1.75, md: 3 },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          {eyebrow ? (
            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                display: "block",
                fontWeight: 800,
                letterSpacing: 0,
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {eyebrow}
            </Typography>
          ) : null}

          <Typography
            variant={titleVariant}
            color={theme.palette.text.primary}
            fontWeight="bold"
            sx={{
              lineHeight: 1.12,
              mb: subtitle ? 0.75 : 0,
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </Typography>

          {subtitle ? (
            <Box sx={{ display: "inline-block", position: "relative" }}>
              <Typography
                variant="subtitle1"
                color={theme.palette.text.secondary}
                sx={{ fontWeight: 500, lineHeight: 1.45 }}
              >
                {subtitle}
              </Typography>

              <Divider
                sx={{
                  position: "absolute",
                  bottom: -4,
                  left: 0,
                  width: "100%",
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: theme.palette.primary.main,
                }}
              />
            </Box>
          ) : null}
        </Box>

        {actions ? (
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: "100%", md: "auto" },
              display: "flex",
              justifyContent: { xs: "stretch", md: "flex-end" },
            }}
          >
            {actions}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  eyebrow: PropTypes.string,
  actions: PropTypes.node,
  titleVariant: PropTypes.string,
  sx: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
    PropTypes.object,
  ]),
};

Header.defaultProps = {
  subtitle: "",
  eyebrow: "",
  actions: null,
  titleVariant: "h2",
  sx: undefined,
};

export default Header;
