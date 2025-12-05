import { useState } from "react";
import PropTypes from "prop-types";
import { Box, TextField, IconButton, Popover } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../reactCalendarMui.css";

const toISO = (date) =>
  date instanceof Date ? date.toISOString().slice(0, 10) : "";

const DateRangeFilter = ({
  fromId,
  toId,
  labelFrom = "Desde",
  labelTo = "Hasta",
  values,
  onChange,
  size = "small",
  variant = "outlined",
  sx,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const fromVal = values[fromId] || "";
  const toVal = values[toId] || "";

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCalendarChange = (value) => {
    if (!Array.isArray(value)) return;
    const [start, end] = value;

    if (start) onChange(fromId, toISO(start));
    if (end) {
      onChange(toId, toISO(end));
      setTimeout(handleClose, 0);
    }
  };

  const calendarValue =
    fromVal && toVal
      ? [new Date(fromVal), new Date(toVal)]
      : fromVal
      ? [new Date(fromVal), new Date(fromVal)]
      : new Date();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        flexWrap: "wrap",
        alignItems: "center",
        ...sx,
      }}
    >
      <TextField
        type="date"
        size={size}
        variant={variant}
        label={labelFrom}
        value={fromVal}
        onChange={(e) => onChange(fromId, e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 150, flex: 1 }}
      />

      <TextField
        type="date"
        size={size}
        variant={variant}
        label={labelTo}
        value={toVal}
        onChange={(e) => onChange(toId, e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 150, flex: 1 }}
      />

      <IconButton
        onClick={handleOpen}
        size="small"
        aria-label="Abrir calendario"
      >
        <CalendarMonthIcon fontSize="small" />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 1 }}>
          <Calendar
            onChange={handleCalendarChange}
            value={calendarValue}
            selectRange
            locale="es-ES"
          />
        </Box>
      </Popover>
    </Box>
  );
};

DateRangeFilter.propTypes = {
  fromId: PropTypes.string.isRequired,
  toId: PropTypes.string.isRequired,
  labelFrom: PropTypes.string,
  labelTo: PropTypes.string,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["small", "medium"]),
  variant: PropTypes.oneOf(["outlined", "filled", "standard"]),
  sx: PropTypes.object,
};

export default DateRangeFilter;
