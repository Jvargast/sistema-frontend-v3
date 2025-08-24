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
import {
  Close,
  Remove,
  /*   CropSquare, */
  ViewQuilt,
  ClearAll,
} from "@mui/icons-material";
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
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "background.paper",
        borderBottom: "1px solid #ededed",
        minHeight: 44,
        height: 44,
        px: 1,
      }}
    >
      <Box
        className="custom-tabs-scrollbar"
        sx={{
          flex: 1,
          minWidth: 0,
          overflowX: "auto",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
        }}
      >
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
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: "0 18px",
                            borderRadius: 8,
                            height: 42,
                            cursor: "pointer",
                            marginRight: 0,
                            borderRight:
                              idx !== visibleTabs.length - 1
                                ? "1px solid #ededed"
                                : "none",
                            bgcolor: isActive
                              ? "rgba(25, 118, 210, 0.09)"
                              : "transparent",
                            borderBottom: isActive
                              ? "2px solid #1976d2"
                              : "2px solid transparent",
                            "&:hover": {
                              bgcolor: isActive
                                ? "rgba(25, 118, 210, 0.11)"
                                : "rgba(25, 118, 210, 0.04)",
                            },
                            userSelect: "none",
                            transition:
                              "background .2s, opacity .2s, border .2s",
                          }}
                          onClick={() => {
                            dispatch(setActiveTab(tab.key));
                            navigate("/" + tab.path);
                          }}
                        >
                          {IconComponent && (
                            <IconComponent
                              sx={{
                                fontSize: 18,
                                color: isActive
                                  ? "primary.main"
                                  : "action.active",
                                mr: 0.5,
                              }}
                            />
                          )}
                          <Typography
                            sx={{
                              fontWeight: isActive ? 500 : 400,
                              fontSize: 13,
                              color: isActive
                                ? "primary.main"
                                : "text.secondary",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {tab.label}
                          </Typography>
                          {/* Minimizar */}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(minimizeTab(tab.key));
                            }}
                            title="Minimizar"
                            sx={{
                              color: "#b0b0b0",
                              "&:hover": { color: "#1976d2" },
                              p: "4px",
                              ml: 1,
                            }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          {/* Cerrar */}
                          <IconButton
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
                            sx={{
                              color: "#b0b0b0",
                              "&:hover": { color: "#e53935" },
                              p: "4px",
                            }}
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
