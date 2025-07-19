import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import LoaderComponent from "../../../components/common/LoaderComponent";
import BackButton from "../../../components/common/BackButton";
import Header from "../../../components/common/Header";
import ModalForm from "../../../components/common/ModalForm";
import PropTypes from "prop-types";

const MobileUserManagement = ({
  usuariosMapped,
  handleEdit,
  handleAddUser,
  open,
  setOpen,
  handleSubmit,
  fields,
  isAllLoading,
  page,
  pageSize,
  paginacion,
  handlePageChange,
}) => {
  if (isAllLoading) return <LoaderComponent />;

  return (
    <Box sx={{ padding: 2, minHeight: "100vh" }}>
      <BackButton to="/admin" label="Volver al menú" />
      <Header title="Usuarios" subtitle="Gestión de Usuarios" />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<AddIcon />}
        sx={{ mb: 2, fontWeight: 600, borderRadius: 2, py: 1.3 }}
        onClick={handleAddUser}
      >
        Nuevo Usuario
      </Button>

      <Stack spacing={2}>
        {usuariosMapped.map((user) => (
          <Card
            key={user.rut}
            sx={{
              borderRadius: 3,
              boxShadow: "0 3px 10px #0001",
              px: 1.5,
              py: 2,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  {user.nombre} {user.apellido}
                </Typography>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEdit(user)}
                >
                  <EditIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={0.2}>
                <b>Rut:</b> {user.rut}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={0.2}>
                <b>Rol:</b> {user.rol}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={0.2}>
                <b>Empresa:</b> {user.Empresa}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={0.2}>
                <b>Sucursal:</b> {user.Sucursal}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Último login:</b> {user.ultimo_login}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {paginacion && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={1.2}
          mt={3}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 16 }} />}
              disabled={page === 0}
              onClick={() => handlePageChange(page - 1, pageSize)}
              sx={{ borderRadius: 3, fontWeight: 600, minWidth: 0, px: 2 }}
            >
              Anterior
            </Button>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, px: 1, minWidth: 76, textAlign: "center" }}
            >
              Página {page + 1} /{" "}
              {Math.max(1, Math.ceil(paginacion.totalItems / pageSize))}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              endIcon={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
              disabled={
                usuariosMapped.length < pageSize ||
                (page + 1) * pageSize >= paginacion.totalItems
              }
              onClick={() => handlePageChange(page + 1, pageSize)}
              sx={{ borderRadius: 3, fontWeight: 600, minWidth: 0, px: 2 }}
            >
              Siguiente
            </Button>
          </Box>
          <Box display="flex" alignItems="center" gap={0.8}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Filas por página:
            </Typography>
            <Select
              value={pageSize}
              size="small"
              sx={{ minWidth: 70, borderRadius: 2 }}
              onChange={(e) => handlePageChange(0, Number(e.target.value))}
              MenuProps={{
                PaperProps: { style: { borderRadius: 12 } },
              }}
            >
              {[5, 10, 20, 50].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      )}

      <ModalForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        fields={fields}
        title="Crear Nuevo Usuario"
      />
    </Box>
  );
};
MobileUserManagement.propTypes = {
  usuariosMapped: PropTypes.arrayOf(
    PropTypes.shape({
      rut: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired,
      apellido: PropTypes.string.isRequired,
      rol: PropTypes.string,
      Empresa: PropTypes.string,
      Sucursal: PropTypes.string,
      ultimo_login: PropTypes.string,
    })
  ).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleAddUser: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  isAllLoading: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  paginacion: PropTypes.shape({
    totalItems: PropTypes.number.isRequired,
  }).isRequired,
  handlePageChange: PropTypes.func.isRequired,
};

export default MobileUserManagement;
