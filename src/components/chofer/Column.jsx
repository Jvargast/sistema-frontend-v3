import PropTypes from "prop-types";
import { Droppable } from "@hello-pangea/dnd";
import { Paper, Typography, Box, useTheme } from "@mui/material";
import PedidoCard from "./PedidoCard";

const Column = ({
  droppableId,
  title,
  pedidos,
  onVerDetalle,
  onSacarDeTablero,
}) => {
  const theme = useTheme();
  const EMPTY_SLOT_COUNT = 4;
  const showEmptySlots = pedidos.length < EMPTY_SLOT_COUNT;

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <Paper
          component="div"
          elevation={snapshot.isDraggingOver ? 3 : 1}
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            width: "100%",
            maxHeight: { xs: "65vh", md: "70vh" },
            /* height: "100%", */
            boxSizing: "border-box",
            overflowY: "auto",
            borderRadius: 3,
            p: 1,
            boxShadow: snapshot.isDraggingOver
              ? "0 6px 24px 0 rgba(240,77,110,0.11)"
              : theme.shadows[1],
            border: `2px solid ${
              snapshot.isDraggingOver
                ? theme.palette.primary.light
                : theme.palette.divider
            }`,
            background: snapshot.isDraggingOver
              ? theme.palette.mode === "dark"
                ? theme.palette.primary.dark + "11"
                : theme.palette.primary.light + "22"
              : theme.palette.background.paper,
            transition: "all 0.2s",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.text.primary
                    : "#305088",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              {title}
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
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              pr: 0.5,
            }}
          >
            {pedidos.map((pedido, index) => (
              <PedidoCard
                key={pedido.id_pedido}
                pedido={pedido}
                index={index}
                onVerDetalle={onVerDetalle}
                onSacarDeTablero={onSacarDeTablero}
              />
            ))}

            {showEmptySlots &&
              Array.from({ length: EMPTY_SLOT_COUNT - pedidos.length }).map(
                (_, idx) => (
                  <Box
                    key={`slot-${idx}`}
                    sx={{
                      height: 130,
                      borderRadius: 2,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.grey[800]
                          : "#F5F7FB",
                      border: `1.5px dashed ${
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light + "99"
                          : "#C7DAFF"
                      }`,
                      opacity: 0.45,
                    }}
                  />
                )
              )}

            {provided.placeholder}
          </Box>
        </Paper>
      )}
    </Droppable>
  );
};

Column.propTypes = {
  droppableId: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  pedidos: PropTypes.array.isRequired,
  onVerDetalle: PropTypes.func,
  onSacarDeTablero: PropTypes.func,
};

export default Column;
