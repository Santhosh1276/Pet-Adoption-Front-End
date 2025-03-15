import { Box, Container, Typography,  } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#2C3E50",
        color: "white",
        py: 1.0, // Reduced padding for a compact look
          }}
    >
      <Container >

        {/* Copyright */}
        <Typography variant="caption" textAlign="center" sx={{ mt: 1, display: "block" }}>
          © {new Date().getFullYear()} Pet Adoption. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
