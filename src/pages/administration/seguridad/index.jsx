import { Box, Card, CardContent, Divider, Tab, Tabs } from "@mui/material";
import usePaginatedData from "../../../utils/usePaginateData";
import BackButton from "../../../components/common/BackButton";
import AuditLogs from "../../../components/seguridad/AuditLogs";
import SecuritySettings from "../../../components/seguridad/SecuritySettings";
import TransactionLogs from "../../../components/seguridad/TransactionLogs";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import SecurityIcon from "@mui/icons-material/Security";
import { useGetLogsQuery } from "../../../store/services/auditLogsApi";
import { useGetAllLogsQuery } from "../../../store/services/logVentasApi";
import { useState } from "react";
import Header from "../../../components/common/Header";
import { useRegisterRefresh } from "../../../hooks/useRegisterRefresh";

const Seguridad = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const {
    data: transacctionsLogs,
    isLoading: isLoadingLogsTransacciones,
    paginacion: transactionPagination,
    handlePageChange: handleTransactionPageChange,
    refetch: refetchTransactions,
  } = usePaginatedData(useGetAllLogsQuery);

  const {
    data: auditLogsReview,
    isLoading: isLoadingAuditLogs,
    paginacion: auditPagination,
    handlePageChange: handleAuditPageChange,
    refetch: refetchAudit,
  } = usePaginatedData(useGetLogsQuery);

  useRegisterRefresh(
    "seguridad",
    async () => {
      await Promise.all([refetchTransactions(), refetchAudit()]);
      return true;
    },
    [refetchTransactions, refetchAudit]
  );

  const securitySettings = { twoFactorEnabled: true, lockoutEnabled: false };

  const handleUpdateSettings = (field, value) => {
    console.log(`Update ${field} to ${value}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        bgcolor: "background.default",
        py: 6,
        px: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1000px" }}>
        <BackButton to="/admin" label="Volver al menú" />

        <Header title="Seguridad" subtitle="Gestión de Seguridad" />

        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0px 4px 24px rgba(40,60,99,0.13)",
            transition: "box-shadow 0.3s",
            "&:hover": { boxShadow: "0px 8px 34px rgba(30,50,90,0.16)" },
            width: "100%",
            maxWidth: "1000px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Tabs principal */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "background.default",
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              px: { xs: 0, md: 2 },
              pt: 1,
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={(_, val) => setTabIndex(val)}
              variant="fullWidth"
              TabIndicatorProps={{
                sx: { height: 4, borderRadius: 2, bgcolor: "primary.main" },
              }}
              sx={{
                ".MuiTab-root": {
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  px: 3,
                  py: 2,
                  textTransform: "none",
                  color: "text.secondary",
                  "&.Mui-selected": { color: "primary.main" },
                },
              }}
            >
              <Tab
                icon={<FactCheckIcon sx={{ mr: 1 }} />}
                iconPosition="start"
                label="Auditoría"
              />
              <Tab
                icon={<ReceiptLongIcon sx={{ mr: 1 }} />}
                iconPosition="start"
                label="Logs de Ventas"
              />
              <Tab
                icon={<SecurityIcon sx={{ mr: 1 }} />}
                iconPosition="start"
                label="Seguridad"
              />
            </Tabs>
          </Box>
          <Divider />

          {/* Contenido de cada tab */}
          <CardContent sx={{ flex: 1, minHeight: 390, px: { xs: 1, md: 4 } }}>
            {tabIndex === 0 && (
              <AuditLogs
                logs={auditLogsReview}
                isLoading={isLoadingAuditLogs}
                onPageChange={handleAuditPageChange}
                paginacion={auditPagination}
              />
            )}
            {tabIndex === 1 && (
              <TransactionLogs
                transactions={transacctionsLogs || []}
                isLoading={isLoadingLogsTransacciones}
                onPageChange={handleTransactionPageChange}
                paginacion={transactionPagination}
              />
            )}
            {tabIndex === 2 && (
              <SecuritySettings
                settings={securitySettings}
                onUpdate={handleUpdateSettings}
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Seguridad;
