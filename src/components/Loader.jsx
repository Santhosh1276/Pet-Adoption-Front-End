/* eslint-disable react/prop-types */
import { Backdrop, CircularProgress } from "@mui/material";

const Loader = ({ open = true }) => {
  return (
    <Backdrop
      sx={{ color: "#2C3E50", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="#2C3E50" size={60} thickness={5} />
    </Backdrop>
  );
};

export default Loader;
