/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset link sent to:", email);
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          height: "100vh" 
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center", color:"black", fontSize: "2rem", fontWeight: "bold" }} gutterBottom>
          Forgot Password?
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, textAlign: "center", color:"black" }}>
          Enter your email address below, and we&lsquo;ll send you a link to reset your password.
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{backgroundColor:"#2C3E50"}} fullWidth>
            Send Reset Link
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
