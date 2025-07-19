import { Box, Button, Grid } from "@mui/material";
import PropTypes from "prop-types";

const SimpleNumPad = ({ value, onChange, onClose }) => {
  const handleClick = (val) => {
    if (val === "C") {
      onChange("");
      return;
    }
    onChange(value + val);
  };

  return (
    <Box mt={1} px={1}>
      <Grid container spacing={1}>
        {[1, 2, 3].map((num) => (
          <Grid item xs={4} key={num}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleClick(String(num))}
            >
              {num}
            </Button>
          </Grid>
        ))}
        {[4, 5, 6].map((num) => (
          <Grid item xs={4} key={num}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleClick(String(num))}
            >
              {num}
            </Button>
          </Grid>
        ))}
        {[7, 8, 9].map((num) => (
          <Grid item xs={4} key={num}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleClick(String(num))}
            >
              {num}
            </Button>
          </Grid>
        ))}

        <Grid item xs={4}>
          <Button variant="outlined" fullWidth onClick={() => handleClick("0")}>
            0
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="outlined"
            color="warning"
            fullWidth
            onClick={() => handleClick("C")}
          >
            C
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onClose}
          >
            OK
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

SimpleNumPad.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SimpleNumPad;
