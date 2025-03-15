import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import NavBar from "./NavBar";
import { updateUserDetails } from "../api/api";

const ProfileCard = () => {
  const [user, setUser] = useState({
    image: "",
    name: "",
    mobile: "",
    email: "",
  });
  
  const [editMode, setEditMode] = useState(false);
  const [newUser, setNewUser] = useState(user);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const storedUser = {
      user_image: localStorage.getItem("user_image") ?? "https://via.placeholder.com/150",
      name: localStorage.getItem("user_name") || "John Doe",
      mobile: localStorage.getItem("mobile_number") || "+1234567890",
      email: localStorage.getItem("email") || "johndoe@example.com",
    };
    setUser(storedUser);
    setNewUser(storedUser);
  }, []);

  const handleEdit = () => setEditMode(true);

  const handleSave = async () => {

  const updatedUser = {
    ...newUser,
    user_image: selectedImage || user.user_image,
  };

  // Update localStorage
  localStorage.setItem("user_image", updatedUser.user_image);
  localStorage.setItem("user_name", updatedUser.name);
  localStorage.setItem("mobile_number", updatedUser.mobile);

  setUser(updatedUser); // Update state with new data

  // Send the updated user to backend
  try {
    const response = await updateUserDetails(updatedUser);
    const data = await response.json();
    console.log("Response >>>>", data);
  } catch (error) {
    console.error("Error updating user:", error);
  }

  setEditMode(false);
};


  const handleCancel = () => {
    setNewUser(user);
    setSelectedImage(null);
    setEditMode(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{  position: "fixed",
    backgroundColor: "#e3f2fd",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
      alignItems: "center",
      }}>
      <NavBar />
      <Box sx={{ display: "flex", justifyContent: "center", mt:0 }}>
        <Card
          sx={{
            width: 500,
            p: 4,
            borderRadius: 6,
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.15)",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={selectedImage ?? user.user_image}
                sx={{
                  width: 140,
                  height: 140,
                  mx: "auto",
                  mb: 2,
                  border: "2px solid rgb(193, 203, 236)",
                  boxShadow: "0 6px 20px rgba(165, 188, 241, 0.3)",
                }}
              />
              {editMode && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    id="upload-photo"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="upload-photo">
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        backgroundColor: "#fff",
                        boxShadow: 3,
                      }}
                      size="small"
                      component="span"
                    >
                      <CameraAltIcon fontSize="small" />
                    </IconButton>
                  </label>
                </>
              )}
            </Box>

            {editMode ? (
              <>
                <TextField fullWidth label="Name" variant="outlined" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} sx={{ mb: 2, borderRadius: 2 }} />
                <TextField fullWidth label="Mobile" variant="outlined" value={newUser.mobile} onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })} sx={{ mb: 2 }} />
                <TextField fullWidth label="Email" variant="outlined" value={newUser.email} disabled sx={{ bgcolor: "#f5f5f5" }} />
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt:1 }}>
                  <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave}>Save</Button>
                  <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={handleCancel}>Cancel</Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, color: "#2C3E50" }}>{user.name}</Typography>
                <Typography variant="body1" sx={{ mb: 1, color: "text.secondary" }}>📞 {user.mobile}</Typography>
                <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>📧 {user.email}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{ textTransform: "none", fontWeight: "bold", px: 2, py: 1, borderRadius:3 }}
                  >Edit Profile
                  </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ProfileCard;