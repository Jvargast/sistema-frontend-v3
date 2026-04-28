import PropTypes from "prop-types";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Card, IconButton, Tooltip, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Box from "./CompatBox";
import Typography from "./CompatTypography";
import { getActionIconButtonSx } from "./tableStyles";

const CARD_HEIGHT = 160;

const CompactCatalogCard = ({
  id,
  title,
  description,
  canEdit = false,
  canDelete = false,
  isDeleting = false,
  onEdit,
  onDelete,
  createLabel,
  onCreate,
}) => {
  const theme = useTheme();
  const isCreateCard = Boolean(onCreate);

  if (isCreateCard) {
    return (
      <Card
        elevation={0}
        onClick={onCreate}
        sx={{
          height: CARD_HEIGHT,
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          borderRadius: 1.5,
          border: "2px dashed",
          borderColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[300]
              : theme.palette.grey[700],
          bgcolor:
            theme.palette.mode === "light"
              ? alpha(theme.palette.grey[100], 0.55)
              : alpha(theme.palette.common.white, 0.04),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
          cursor: "pointer",
          transition:
            "border-color 0.15s ease, background-color 0.15s ease, transform 0.15s ease",
          "&:hover": {
            borderColor: alpha(theme.palette.primary.main, 0.45),
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            transform: "translateY(-1px)",
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.grey[500], 0.1),
            color: "text.secondary",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Add />
        </Box>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          color="text.secondary"
          textAlign="center"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            overflowWrap: "anywhere",
            px: 1,
            lineHeight: 1.25,
          }}
        >
          {createLabel}
        </Typography>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: CARD_HEIGHT,
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow:
          theme.palette.mode === "light"
            ? "0 4px 12px rgba(15, 23, 42, 0.08)"
            : "0 4px 12px rgba(0,0,0,0.28)",
        p: 1.25,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition:
          "border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
        "&:hover": {
          borderColor: alpha(theme.palette.grey[500], 0.35),
          boxShadow:
            theme.palette.mode === "light"
              ? "0 8px 18px rgba(15, 23, 42, 0.1)"
              : "0 8px 18px rgba(0,0,0,0.34)",
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          color="text.primary"
          fontWeight={800}
          sx={{ mb: 0.5, letterSpacing: 0, lineHeight: 1.25 }}
        >
          ID: {String(id).padStart(3, "0")}
        </Typography>
        <Typography
          variant="h6"
          color="text.primary"
          title={title}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            overflowWrap: "anywhere",
            fontSize: 18,
            lineHeight: 1.2,
            minHeight: 42,
            mb: 0.6,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          title={description}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            overflowWrap: "anywhere",
            lineHeight: 1.3,
            minHeight: 34,
          }}
        >
          {description || "Sin descripción"}
        </Typography>
      </Box>

      {(canEdit || canDelete) && (
        <Box display="flex" justifyContent="flex-end" gap={0.8}>
          {canEdit && (
            <Tooltip title="Editar">
              <IconButton
                aria-label="Editar"
                size="small"
                onClick={onEdit}
                sx={getActionIconButtonSx(theme, "primary", {
                  width: 32,
                  height: 32,
                  minWidth: 32,
                })}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {canDelete && (
            <Tooltip title="Eliminar">
              <span>
                <IconButton
                  aria-label="Eliminar"
                  size="small"
                  disabled={isDeleting}
                  onClick={onDelete}
                  sx={getActionIconButtonSx(theme, "error", {
                    width: 32,
                    height: 32,
                    minWidth: 32,
                  })}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>
      )}
    </Card>
  );
};

CompactCatalogCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  description: PropTypes.string,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  isDeleting: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  createLabel: PropTypes.string,
  onCreate: PropTypes.func,
};

export default CompactCatalogCard;
