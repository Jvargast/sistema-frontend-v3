import { Paper } from "@mui/material";
import PropTypes from 'prop-types';

const DraggablePanel = ({ children }) => {
  return <Paper sx={{ p: 2, cursor: "grab" }}>{children}</Paper>;
};
DraggablePanel.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DraggablePanel;

