 
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import PetsIcon from "@mui/icons-material/Pets";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { login_api } from "../api/api";
import Loader from "../components/Loader";


export const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
      const [loading, setLoading] = useState(false);


  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const login = async () => {
    try {
           localStorage.clear();
     setLoading(true)
      if (!email || !password) {
        setError("Please fill in all fields.");
              setLoading(false)

        return;
      }

      let result = await login_api(email, password);
      let jsonResponse = await result.json();

      if (jsonResponse?.message === "Login Successfully") {
          setSuccess(jsonResponse?.message);
        localStorage.setItem("accessToken", jsonResponse.accessToken);
        localStorage.setItem("user_id", jsonResponse?.userInfo?._id);
        localStorage.setItem("user_name", jsonResponse?.userInfo?.name);
        localStorage.setItem("user_role", jsonResponse?.userInfo?.role);
        localStorage.setItem("user_image", jsonResponse?.userInfo?.user_image ?? "");
        localStorage.setItem("mobile_number", jsonResponse?.userInfo?.mobile_number ?? "");
        localStorage.setItem("email", jsonResponse?.userInfo?.email ?? "");
        console.log("after local storage >>>")
        // setTimeout(() => {
 // setTimeout(async() => {
        // navigate("/");
       window.location.href = "/";

          console.log("after navigate  >>>")
        // setError("");
          // setSuccess("");

      // }, 500);          

        // }, 1500);
      } else if (jsonResponse?.message === "User Not Found") {
        setError(jsonResponse?.message);
        setTimeout(() => {
          navigate("/sign-up");
          setError("");
          setSuccess("");
                // setLoading(false)

        }, 2000);
      }
    }
    catch (e) {
      console.log(e, "error on login >>>")
      setError(e.message)
     
    }
   finally{
          setLoading(false)
   }

  };

  return (
  <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #f0f5f9, #dfe7fd)", // Soft pastel blue
  }}
    >
      
      <Card
        sx={{
          width: 380,
          p: 4,
          borderRadius: 3,
          boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
          background: "#fff",
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <PetsIcon sx={{ fontSize: 50, color: "#FF6F00" }} />
          <Typography variant="h4" fontWeight="bold" color="#333" mt={1} gutterBottom>
            Welcome Back!
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Log in to continue finding your perfect pet match.
          </Typography>

          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: "1rem",
                backgroundColor: "#FF6F00",
                "&:hover": { backgroundColor: "#E65100" },
              }}
              onClick={login}
            >
              Log In
            </Button>

            {/* Error Message */}
            {error && (
              <Typography variant="body1" color="error" textAlign="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            {/* Success Message */}
            {success && (
              <Typography variant="body1" color="success.main" textAlign="center" sx={{ mt: 2 }}>
                {success}
              </Typography>
            )}
          </Box>

          {/* Links */}
          <Box sx={{ mt: 3 }}>
            {/* <Typography variant="body2">
              <Link to="/forgot-password" style={{ color: "#FF6F00", textDecoration: "none" }}>
                Forgot Password?
              </Link>
            </Typography> */}
            <Typography variant="body2" sx={{ mt: 1 }}>
              Dont have an account?{" "}
              <Link to="/sign-up" style={{ color: "#FF6F00", fontWeight: "bold", textDecoration: "none" }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Loader open={loading} />
    </Box>
  );
};
