import { Paper, Typography, Box } from "@mui/material";

const EmptyColumn = () => (
  <Paper
    elevation={1}
    className="
      min-w-[280px] max-w-[320px] w-full sm:w-72
      max-h-[80vh] overflow-y-auto rounded-lg
      p-3 sm:p-4 flex flex-col shadow-sm hover:shadow-md
      bg-gray-50 border border-gray-400 hover:border-rose-400
      transition-all duration-300 opacity-90
    "
  >
    {/* Encabezado estilo Column */}
    <div className="text-center mb-4">
      <Typography
        variant="h6"
        className="font-bold text-black tracking-wide uppercase"
      >
        <span className="block">Chofer</span>
        <span className="text-sm font-normal text-gray-500 uppercase">
          No Asignado
        </span>
      </Typography>
      <div className="mx-auto mt-1 mb-2 h-[2px] w-16 bg-indigo-200"></div>
    </div>

    {/* Espacios visuales tipo PedidoCard */}
    <div className="flex flex-col gap-3 min-h-[240px]">
      {Array.from({ length: 4 }).map((_, idx) => (
        <Box
          key={`placeholder-${idx}`}
          sx={{
            height: 130,
            borderRadius: 2,
            backgroundColor: "#F5F5F5",
            border: "1px dashed #E0E0E0",
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  </Paper>
);

export default EmptyColumn;
