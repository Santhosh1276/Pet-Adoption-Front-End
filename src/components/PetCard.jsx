/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Modal,
  Grid,
  Tooltip,
} from "@mui/material";

const PetCard = ({ pet }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        sx={{
          width: 260,
          height: 360, // Reduced height for a compact look
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          boxShadow: 2,
          transition: "0.3s",
          "&:hover": { boxShadow: 8, transform: "scale(1.02)" },
        }}
      >
        {/* Image Section with Tooltip */}
        <Tooltip title="Click to enlarge" arrow>
          <CardMedia
            component="img"
            height="100" // Adjusted image height
            image={pet.image || "https://via.placeholder.com/260"}
            alt={pet.name}
            sx={{ objectFit: "cover", cursor: "pointer" }}
            onClick={() => setOpen(true)}
          />
        </Tooltip>

        <CardContent sx={{ flexGrow: 1, overflow: "hidden", p: 1.5 }}>
          <Typography variant="h6" fontWeight="bold" noWrap>
            {pet.name}
          </Typography>

          <Box sx={{ mt: 0.5 }}>
            <Grid container spacing={0.5}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  <b>Breed:</b> {pet.breed}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  <b>Age:</b> {pet.age} yrs
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  <b>Color:</b> {pet.color}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  <b>Size:</b> {pet.size}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <b>Location:</b> {pet.location}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 1 }}>
            {pet.isFostered ? (
              <Typography color="success.main" fontWeight="bold">
                Fostered ✅
              </Typography>
            ) : (
              <Typography color="error.main" fontWeight="bold">
                Available 🏡
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <img
          src={pet.image || "https://via.placeholder.com/300"}
          alt={pet.name}
          style={{ width: "60%", height: "auto", borderRadius: "3px" }}
        />
      </Modal>
    </>
  );
};

export default PetCard;
