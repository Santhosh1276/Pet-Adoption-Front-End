/* eslint-disable react/prop-types */
import { useState } from "react";
import { Box, Button, TextField, MenuItem, Typography, Input } from "@mui/material";

const PetForm = ({ onSubmit }) => {
  const [petData, setPetData] = useState({
    name: "",
    breed: "",
    age: "",
    color: "",
    size: "",
    location: "",
    image: null,
  });

  const sizes = ["Small", "Medium", "Large"];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPetData({ ...petData, image: reader.result }); // Store Base64 string
    };

    if (file) {
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(petData); // Call API to submit data
  };

  return (
    <Box 
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 800,
        margin: "auto",
        padding: 3,
        boxShadow: 2,
        borderRadius: 2,
        backgroundColor: "white",
        mt:2
      }}
    >
   <Typography
  variant="h4"
  textAlign="center"
  sx={{
    fontWeight: "bold",
    color: "#37474F", // Subtle dark grayish-blue color
    textTransform: "uppercase",
    letterSpacing: 1.5,
  }}
>
  Add New Pet
</Typography>


      <TextField
        id="pet-name"
        label="Pet Name"
        name="name"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleChange}
        required
      />

      <TextField
        id="pet-breed"
        label="Breed"
        name="breed"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleChange}
        required
      />

      <TextField
        id="pet-age"
        label="Age"
        name="age"
        type="number"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleChange}
        required
      />

      <TextField
        id="pet-color"
        label="Color"
        name="color"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleChange}
        required
      />

      <TextField
        id="pet-size"
        label="Size"
        name="size"
        select
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleChange}
        required
      >
        {sizes.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="pet-location"
        label="Location"
        name="location"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleChange}
        required
      />

     

      <Typography variant="body1"  mt={2} mb={1} sx={{color:"black"}}>
        Upload Image:
      </Typography>
      <Input type="file" accept="image/*" onChange={handleImageChange} required />
      <Button 
        type="submit"
        variant="contained"
        color="success"
        fullWidth
        sx={{ mt: 2 }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default PetForm;
