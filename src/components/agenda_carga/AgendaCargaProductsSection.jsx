import PropTypes from "prop-types";
import { Alert, Button, Divider } from "@mui/material";
import ProductSelectorRow from "./ProductSelector";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const metricBoxSx = {
  p: 1.5,
  borderRadius: 1.5,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.default",
  minHeight: 70,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
};

const AgendaCargaProductsSection = ({
  productos,
  productosDisponibles,
  maxProductosAdicionales,
  cantidadProductosAdicionales,
  espaciosRestantes,
  cantidadMaximaPorFila,
  puedeAgregarProducto,
  handleAddProductRow,
  handleChangeProduct,
  handleChangeCantidad,
  handleChangeNotas,
  handleRemoveRow,
}) => {
  return (
    <Box
      component="section"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: "0 1px 2px rgba(2,6,23,0.04)"
      }}>

      <Box
        display="flex"
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={2}
        flexWrap="wrap">

        <Box display="flex" alignItems="flex-start" gap={1.5} minWidth={0}>
          <Box
            sx={(theme) => ({
              width: 34,
              height: 34,
              borderRadius: 1.5,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color:
              theme.palette.mode === "dark" ?
              theme.palette.primary.light :
              theme.palette.primary.main,
              bgcolor:
              theme.palette.mode === "dark" ?
              "rgba(90,141,213,0.14)" :
              "rgba(90,141,213,0.1)",
              flex: "0 0 auto"
            })}>

            <Inventory2OutlinedIcon fontSize="small" />
          </Box>
          <Box minWidth={0}>
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 0 }}>
              Productos adicionales
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              Agrega productos retornables que no vienen desde pedidos confirmados.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineOutlinedIcon fontSize="small" />}
          onClick={handleAddProductRow}
          disabled={!puedeAgregarProducto}
          sx={{ textTransform: "none" }}>

          Agregar producto
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {maxProductosAdicionales === null ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Selecciona un camión para calcular cuántos productos adicionales
          puedes cargar.
        </Alert>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 1.5,
              mb: espaciosRestantes > 0 ? 2 : 1.5
            }}>

            {[
              { label: "Capacidad adicional", value: maxProductosAdicionales },
              { label: "Usados", value: cantidadProductosAdicionales },
              { label: "Restantes", value: espaciosRestantes },
            ].map((item) =>
              <Box key={item.label} sx={metricBoxSx}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  {item.label}
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  {item.value}
                </Typography>
              </Box>
            )}
          </Box>

          {espaciosRestantes <= 0 &&
          <Alert severity="warning" sx={{ mb: 2 }}>
              No quedan espacios disponibles para productos adicionales.
            </Alert>
          }
        </>
      )}

      <Box display="flex" flexDirection="column" gap={1.5}>
        {productos.length === 0 &&
        <Box
          sx={{
            py: 3,
            px: 2,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 1.5,
            textAlign: "center"
          }}>

          <Typography variant="body2" color="text.secondary">
            Todavía no agregas productos adicionales.
          </Typography>
        </Box>
        }

        {productos.map((prod, index) => (
          <Box
            key={index}
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.default"
            }}>

            <ProductSelectorRow
              index={index}
              productosDisponibles={productosDisponibles}
              selectedProduct={{
                ...prod,
                id_producto: Number(prod.id_producto),
                es_retornable: prod.es_retornable ?? false,
              }}
              onChangeProduct={handleChangeProduct}
              onChangeCantidad={handleChangeCantidad}
              onChangeNotas={handleChangeNotas}
              onRemoveRow={handleRemoveRow}
              maxCantidad={cantidadMaximaPorFila[index]}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

AgendaCargaProductsSection.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id_producto: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      cantidad: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      notas: PropTypes.string,
      es_retornable: PropTypes.bool,
    })
  ).isRequired,
  productosDisponibles: PropTypes.arrayOf(
    PropTypes.shape({
      id_producto: PropTypes.number,
      nombre_producto: PropTypes.string,
    })
  ).isRequired,
  handleAddProductRow: PropTypes.func.isRequired,
  maxProductosAdicionales: PropTypes.number,
  cantidadProductosAdicionales: PropTypes.number.isRequired,
  espaciosRestantes: PropTypes.number.isRequired,
  cantidadMaximaPorFila: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])])
  ),
  puedeAgregarProducto: PropTypes.bool.isRequired,
  handleChangeProduct: PropTypes.func.isRequired,
  handleChangeCantidad: PropTypes.func.isRequired,
  handleChangeNotas: PropTypes.func.isRequired,
  handleRemoveRow: PropTypes.func.isRequired,
};

export default AgendaCargaProductsSection;
