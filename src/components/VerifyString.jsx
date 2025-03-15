/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";

const VerifyString = () => {
  const [str, SetStr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset link sent to:", str);
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
        <Typography variant="h4" sx={{fontSize: "1rem", fontWeight: "bold"}} gutterBottom>
          Copy/Paste Characters from E-Mail
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, textAlign: "center" }}>
                  
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Enter String"
            variant="outlined"
            value={str}
            onChange={(e) => SetStr(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="outlined" color="secondary" sx={{backgroundColor:"#2C3E50"}} fullWidth>
            Validate
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default VerifyString;
