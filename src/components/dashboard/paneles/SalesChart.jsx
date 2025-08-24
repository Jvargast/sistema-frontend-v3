import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useGetVentasResumenSemanalQuery } from "../../../store/services/ventasEstadisticasApi";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import "dayjs/locale/es";
import "dayjs/locale/en";
import { useMemo } from "react";
import PropTypes from "prop-types";

const CLPFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  minimumFractionDigits: 0,
});

const SalesChart = ({ idSucursal }) => {
  const { t, i18n } = useTranslation();
  dayjs.locale(i18n.language);

  const args = useMemo(
    () => (idSucursal ? { id_sucursal: idSucursal } : {}),
    [idSucursal]
  );
  const { data, isLoading, isError } = useGetVentasResumenSemanalQuery(args, {
    refetchOnMountOrArgChange: true,
  });

  const formateado =
    data?.map((d) => ({
      name:
        dayjs(d.dia).format("dddd").charAt(0).toUpperCase() +
        dayjs(d.dia).format("dddd").slice(1),
      ventas: parseFloat(d.total),
    })) ?? [];

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          {t("dashboard.loading_sales_chart")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1, height: 320, display: "flex", flexDirection: "column" }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        📅 {t("dashboard.weekly_sales")} (CLP)
      </Typography>

      {!formateado.length || isError ? (
        <Box
          sx={{
            flex: 1,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
          }}
        >
          <Typography variant="h6">
            💤 {t("dashboard.no_sales_this_week")}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {t("dashboard.come_back_later")}
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={formateado}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(value) => CLPFormatter.format(value)}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => CLPFormatter.format(value)}
              labelFormatter={(label) => `🗓️ ${label}`}
            />
            <Bar dataKey="ventas" fill="#1976d2" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};
SalesChart.propTypes = { idSucursal: PropTypes.number };
export default SalesChart;
