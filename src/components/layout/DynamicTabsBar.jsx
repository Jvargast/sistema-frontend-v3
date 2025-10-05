import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  Paper,
} from "@mui/material";
import { Close, Remove, ViewQuilt, ClearAll } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  closeTab,
  maximizeTab,
  minimizeTab,
  setActiveTab,
  reorderTabs,
} from "../../store/reducers/tabSlice";
import * as MuiIcons from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router";
import { alpha } from "@mui/material/styles";

const paperSx = (t) => ({
  display: "flex",
  alignItems: "center",
  bgcolor:
    t.palette.mode === "light"
      ? t.palette.background.paper
      : alpha(t.palette.background.paper, 0.6),
  borderBottom: `1px solid ${
    t.palette.roles?.border || alpha(t.palette.divider, 0.5)
  }`,
  minHeight: 34,
  height: 34,
  px: 0.25,
});

const scrollSx = (t) => ({
  position: "relative",
  flex: 1,
  minWidth: 0,
  overflowX: "auto",
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  "&::before, &::after": {
    content: '""',
    position: "sticky",
    top: 0,
    width: 8,
    height: "100%",
    pointerEvents: "none",
    zIndex: 1,
  },
  "&::before": {
    left: 0,
    background: `linear-gradient(90deg, ${t.palette.background.paper}, transparent)`,
  },
  "&::after": {
    right: 0,
    background: `linear-gradient(270deg, ${t.palette.background.paper}, transparent)`,
  },
});

const tabItemSx = (t, { active, last }) => {
  const idleHover =
    t.palette.mode === "light"
      ? alpha(t.palette.primary.main, 0.04)
      : alpha("#fff", 0.06);

  const activeBg =
    t.palette.mode === "light"
      ? alpha(t.palette.primary.main, 0.08)
      : alpha("#fff", 0.1);

  return {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    height: 28,
    px: 0.5,
    borderRadius: 6,
    cursor: "grab",
    userSelect: "none",
    transition: "background .14s, color .14s",
    marginRight: last ? 0 : 0.25,
    bgcolor: active ? activeBg : "transparent",
    "&:hover": { backgroundColor: active ? activeBg : idleHover },
    "&:active": { cursor: "grabbing" },
    "&::after": {
      content: '""',
      position: "absolute",
      left: "22%",
      right: "22%",
      bottom: 0,
      height: 1.5,
      borderRadius: 1.5,
      background: active
        ? `linear-gradient(90deg, ${t.palette.primary.main}, ${alpha(
            t.palette.secondary?.main || t.palette.primary.light,
            0.9
          )})`
        : "transparent",
    },
    "& .tab-action": {
      opacity: 0,
      transform: "translateY(-1px)",
      transition: "opacity .1s, transform .1s",
      marginLeft: 0,   
    },
    "&:hover .tab-action": { opacity: 1, transform: "translateY(0)" },
  };
};

const tabLabelSx = (t, active) => ({
  fontWeight: active ? 700 : 600,
  fontSize: 12,
  letterSpacing: -0.2,
  color: active ? t.palette.primary.main : t.palette.text.secondary,
  whiteSpace: "nowrap",
});

export default function DynamicTabsBar({ isDesktop }) {
  const { openTabs, activeTab } = useSelector((state) => state.tabs);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const visibleTabs = openTabs.filter((tab) => !tab.minimized);
  const minimizedTabs = openTabs.filter((tab) => tab.minimized);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    const fromKey = visibleTabs[result.source.index].key;
    const toKey = visibleTabs[result.destination.index].key;
    const from = openTabs.findIndex((tab) => tab.key === fromKey);
    const to = openTabs.findIndex((tab) => tab.key === toKey);
    dispatch(reorderTabs({ from, to }));
  };

  if (!isDesktop) return null;
  const validTabValue =
    visibleTabs.length > 0 && visibleTabs.some((tab) => tab.key === activeTab)
      ? activeTab
      : visibleTabs[0]?.key ?? false;

  return (
    <Paper elevation={0} sx={(t) => paperSx(t)}>
      <Box className="custom-tabs-scrollbar" sx={(t) => scrollSx(t)}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tabs" direction="horizontal">
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {visibleTabs.map((tab, idx) => {
                  const IconComponent = tab.icon && MuiIcons[tab.icon];
                  const isActive = validTabValue === tab.key;
                  return (
                    <Draggable key={tab.key} draggableId={tab.key} index={idx}>
                      {(prov) => (
                        <Box
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          sx={(t) =>
                            tabItemSx(t, {
                              active: isActive,
                              last: idx === visibleTabs.length - 1,
                            })
                          }
                          onClick={() => {
                            dispatch(setActiveTab(tab.key));
                            navigate("/" + tab.path);
                          }}
                        >
                          {IconComponent && (
                            <IconComponent
                              sx={(t) => ({
                                fontSize: 14,
                                color: isActive
                                  ? t.palette.primary.main
                                  : t.palette.text.disabled,
                                mr: 0.25,
                              })}
                            />
                          )}
                          <Typography sx={(t) => tabLabelSx(t, isActive)}>
                            {tab.label}
                          </Typography>
                          {/* Minimizar */}
                          <IconButton
                            className="tab-action"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(minimizeTab(tab.key));
                            }}
                            title="Minimizar"
                            sx={(t) => ({
                              p: "1px",
                              ml: 0.25,
                              color: t.palette.text.disabled,
                              "&:hover": {
                                color: t.palette.primary.main,
                                backgroundColor: "transparent",
                              },
                              "& .MuiSvgIcon-root": { fontSize: 14 },
                            })}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          {/* Cerrar */}
                          <IconButton
                            className="tab-action"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              const isClosingActive = activeTab === tab.key;

                              const idx = visibleTabs.findIndex(
                                (t) => t.key === tab.key
                              );
                              const remaining = visibleTabs.filter(
                                (t) => t.key !== tab.key
                              );
                              const nextVisible = isClosingActive
                                ? remaining[idx] || remaining[idx - 1] || null
                                : null;
                              const hasOnlyMinimizedAfterClose =
                                isClosingActive &&
                                !nextVisible &&
                                minimizedTabs.length > 0;
                              dispatch(closeTab(tab.key));

                              if (isClosingActive) {
                                if (nextVisible) {
                                  dispatch(setActiveTab(nextVisible.key));
                                  navigate("/" + nextVisible.path, {
                                    replace: true,
                                  });
                                } else if (hasOnlyMinimizedAfterClose) {
                                  const toRestore =
                                    minimizedTabs[minimizedTabs.length - 1];
                                  dispatch(maximizeTab(toRestore.key));
                                  dispatch(setActiveTab(toRestore.key));
                                  navigate("/" + toRestore.path, {
                                    replace: true,
                                  });
                                } else {
                                  navigate("/", { replace: true });
                                }
                              }
                            }}
                            title="Cerrar"
                            sx={(t) => ({
                              p: "1px",
                              ml: 0.25,
                              color: t.palette.text.disabled,
                              "&:hover": {
                                color: t.palette.error.main,
                                backgroundColor: "transparent",
                              },
                              "& .MuiSvgIcon-root": { fontSize: 14 },
                            })}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      <Tooltip title="Ver ventanas minimizadas">
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            color: minimizedTabs.length ? "#1976d2" : "#b0b0b0",
            ml: 1,
            mr: 1,
          }}
        >
          <ViewQuilt fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            elevation: 0,
            sx: (t) => ({
              mt: 0.5,
              borderRadius: 2,
              border: `1px solid ${
                t.palette.roles?.border || alpha(t.palette.divider, 0.6)
              }`,
              boxShadow:
                t.palette.mode === "light"
                  ? "0 12px 32px rgba(2,6,23,0.12)"
                  : "0 16px 40px rgba(0,0,0,0.45)",
              "& .MuiMenuItem-root": { fontWeight: 600, fontSize: 13 },
            }),
          },
        }}
      >
        {minimizedTabs.length === 0 && (
          <MenuItem disabled>No hay ventanas minimizadas</MenuItem>
        )}
        {minimizedTabs.map((tab) => (
          <MenuItem
            key={tab.key}
            onClick={() => {
              dispatch(maximizeTab(tab.key));
              dispatch(setActiveTab(tab.key));
              setAnchorEl(null);
              navigate("/" + tab.path);
            }}
          >
            {tab.label}
          </MenuItem>
        ))}
      </Menu>
      <Tooltip title="Cerrar todas las pestañas">
        <IconButton
          size="small"
          onClick={() => {
            dispatch({ type: "tabs/closeAllTabs" });
          }}
          sx={{
            color: "#b0b0b0",
            "&:hover": { color: "#e53935" },
            p: "4px",
            ml: 1,
          }}
        >
          <ClearAll fontSize="small" />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}

DynamicTabsBar.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
};
