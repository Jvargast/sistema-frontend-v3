// EmptyColumn.jsx
import { Paper, Typography } from "@mui/material";

const EmptyColumn = () => (
  <Paper
    elevation={1}
    className="w-full max-h-[80vh] overflow-y-auto rounded-lg p-4 shadow-md flex flex-col bg-gray-100 opacity-50"
  >
    <div className="text-center mb-4">
      <Typography variant="h6" className="font-bold text-gray-400 uppercase">
        Chofer no asignado
      </Typography>
      <div className="mx-auto mt-1 mb-2 h-[2px] w-16 bg-gray-200"></div>
    </div>

    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={`placeholder-${idx}`}
          className="h-20 bg-gray-200 rounded-md shadow-inner"
        />
      ))}
    </div>
  </Paper>
);

export default EmptyColumn;
