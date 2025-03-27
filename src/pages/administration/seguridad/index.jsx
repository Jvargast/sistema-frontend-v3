import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import usePaginatedData from "../../../utils/usePaginateData";
import BackButton from "../../../components/common/BackButton";
import AuditLogs from "../../../components/seguridad/AuditLogs";
import SecuritySettings from "../../../components/seguridad/SecuritySettings";
import TransactionLogs from "../../../components/seguridad/TransactionLogs";
import { useGetLogsQuery } from "../../../store/services/auditLogsApi";
import { useGetAllLogsQuery } from "../../../store/services/logVentasApi";

const Seguridad = () => {
  const {
    data: transacctionsLogs,
    isLoading: isLoadingLogsTransacciones,
    paginacion: transactionPagination,
    handlePageChange: handleTransactionPageChange,
  } = usePaginatedData(useGetAllLogsQuery);

  const {
    data: auditLogsReview,
    isLoading: isLoadingAuditLogs,
    paginacion: auditPagination,
    handlePageChange: handleAuditPageChange,
  } = usePaginatedData(useGetLogsQuery);

  const securitySettings = { twoFactorEnabled: true, lockoutEnabled: false };

  const handleUpdateSettings = (field, value) => {
    console.log(`Update ${field} to ${value}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F8FAFC",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 3,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        <BackButton to="/admin" label="Volver al menú" />
        <Typography variant="h4" fontWeight="bold" textAlign="center" my={4}>
          Seguridad y Auditoría
        </Typography>

        <Grid container spacing={3}>
          {/* Configuración de Seguridad */}
          <Grid item xs={12} md={6}>
            <SecuritySettings
              settings={securitySettings}
              onUpdate={handleUpdateSettings}
            />
          </Grid>

          {/* Auditorías de Logs y Transacciones */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "12px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: "0px 6px 15px rgba(0,0,0,0.15)" },
                marginBottom: 2,
              }}
            >
              <CardContent>
                <AuditLogs
                  logs={auditLogsReview}
                  isLoading={isLoadingAuditLogs}
                  onPageChange={handleAuditPageChange}
                  paginacion={auditPagination}
                />
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: "12px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: "0px 6px 15px rgba(0,0,0,0.15)" },
              }}
            >
              <CardContent>
                <TransactionLogs
                  transactions={transacctionsLogs || []}
                  isLoading={isLoadingLogsTransacciones}
                  onPageChange={handleTransactionPageChange}
                  paginacion={transactionPagination}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Seguridad;
