/* eslint-disable react/prop-types */
import { Snackbar, Alert } from "@mui/material";

const Toast = ({ message, severity, open, onClose }) => {
  console.log(" >>>>",message, severity, open, onClose)
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000} // Toast disappears after 3 seconds
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }} // 👈 Bottom-Right Position
    >
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
