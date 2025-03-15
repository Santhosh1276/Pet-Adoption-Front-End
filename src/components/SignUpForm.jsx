import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { signUp_api } from "../api/api";
import { useNavigate } from "react-router-dom";

export const SignUpForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    mobile_number: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile_number)) {
      setError("Mobile number must be 10 digits.");
      return;
    }

    let result = await signUp_api(formData);
    let jsonResponse = await result.json();

    if (jsonResponse?.message === "User Created Successfully") {
      setSuccess(jsonResponse?.message);
      setTimeout(() => {
        navigate("/log-in");
      }, 2000);
    } else if (jsonResponse?.message === "User Already Registered") {
      setError("User already registered. Redirecting...");
      setTimeout(() => {
        navigate("/log-in");
      }, 2000);
    } else {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
      }}
    >
      <Card
        sx={{
          width: 400,
          p: 4,
          borderRadius: 4,
          boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight="bold" textAlign="center" color="#2C3E50" gutterBottom>
            Sign Up
          </Typography>

          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }} onSubmit={handleSubmit}>
            <TextField label="User Name" fullWidth required name="name" value={formData.name} onChange={handleChange} />
            <TextField label="E-Mail" fullWidth required name="email" value={formData.email} onChange={handleChange} />
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select name="role" value={formData.role} onChange={handleChange}>
                <MenuItem value="foster">Foster</MenuItem>
                <MenuItem value="shelter">Shelter</MenuItem>
                <MenuItem value="adopter">Adopter</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Mobile Number" type="number" fullWidth required name="mobile_number" value={formData.mobile_number} onChange={handleChange} />
            <TextField label="Password" type="password" fullWidth required name="password" value={formData.password} onChange={handleChange} />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.3,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: 2,
                backgroundColor: "#2C3E50",
                "&:hover": { backgroundColor: "#1C2833" },
              }}
            >
              Sign Up
            </Button>

            {error && <Typography variant="body2" color="error" textAlign="center" sx={{ mt: 2 }}>{error}</Typography>}
            {success && <Typography variant="body2" color="success.main" textAlign="center" sx={{ mt: 2 }}>{success}</Typography>}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
