/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  Tooltip,
  Rating,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Draggable } from "@hello-pangea/dnd";
import Toast from "../components/Toast";


import {
  addReview,
  applyNewAdoption,
  applyNewFoster,
  deletePetById,
  sendMail,
  setFavoritesPet,
} from "../api/api";

const PetCardForHome = ({ pet, refreshPets ,index}) => {
  console.log("pet >>>>", pet);
  const [openModal, setOpenModal] = useState(null);
  const [message, setMessage] = useState("");
  const [weeks, setWeeks] = useState("");
  const [error, setError] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [rating, setRating] = useState(3);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState( pet.reviews ?? []);
    const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  let userId = localStorage.getItem("user_id");
  const userName = localStorage.getItem("user_name"); // Assuming user name is stored

 const handleReviewSubmit = async () => {
    const reviewData = { userId, userName, rating, reviewText };
    try {
      const response = await addReview(pet._id, reviewData);
      if (response.ok) {
        setReviews([...reviews, { ...reviewData, createdAt: new Date() }]);
         setToast({
        open: true,
        message: "Review added successfully!",
        severity: "success",
      });
        setOpenModal(null);
        setReviewText("");
        refreshPets()
      }
    } catch (err) {
      console.error("Error adding review:", err);
       setToast({
        open: true,
        message: "Error Uploading Review!",
        severity: "error",
      });
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const response = await setFavoritesPet(pet, userId);
      const result = await response.json();
      if (response.ok) {
        setFavorite(result.favorites.includes(userId));
        
        refreshPets(); // Refresh pet list to reflect favorite changes
      }
    } catch (err) {
       
      console.error("Error toggling favorite", err);
    }
  };

  const handleDeleteClick = () => {
    setOpenConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    console.log("Delete Pet logic here", pet);
    if (pet?.isAdopted || pet?.isFostered) {
      setToast({
        open: true,
        message: `Pet ${pet.name} is currently ${pet?.isAdopted ? "Adopted" :"Fostered" } You can't delete `,
        severity: "warning",
      });
      
      setOpenConfirm(false);
    }
    else{
      let deletePet = await deletePetById(pet?._id);
    let response = await deletePet.json();
    if (response?.message === "Pet deleted successfully") {
      console.log("delete pet >>>>", response);
      setToast({
        open: true,
        message: "Pet Deleted Successfully",
        severity: "success",
      });
      
      setOpenConfirm(false);
      refreshPets();
    }
  }

  };

  const handleDeleteCancel = () => {
    setOpenConfirm(false);
  };

  const currentUserRole = localStorage.getItem("user_role");
  console.log("current role >>>>", currentUserRole);

  const handleRequest = async (type) => {
    let userId = localStorage.getItem("user_id");
    let data = {
      petId: pet?._id,
      pet_name: pet?.name,
      message,
      shelterId: pet?.shelterId,
      ...(type === "adopt"
        ? { adopterId: userId }
        : { fosterParentId: userId, duration: weeks }),
    };

    let response = await (type === "adopt"
      ? applyNewAdoption(data)
      : applyNewFoster(data));
    let result = await response.json();

    if (
      result.message.includes("submitted") ||
      result.message.includes("registered")
    ) {
      let sendMailToShelter = await sendMail({
        ...pet,
        type: type.toUpperCase(),
        message,
      });

      let mailRespond = await sendMailToShelter.json();
      if (mailRespond?.message === "success") {
          setToast({
        open: true,
        message: "Data send to Shelter",
        severity: "success",
      })
        refreshPets();
        setOpenModal(null);
        setMessage("");
        setWeeks("");
        setError("");
      }
    } else {
      setError(result?.message);
       setToast({
        open: true,
        message: "Data Not Send to Shelter",
        severity: "success",
      });
      setTimeout(() => {
        setError("");
        setOpenModal(null);
      }, 2000);
    }
  };

  return (

    <>
       <Draggable draggableId={String(pet._id)} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{  borderRadius: 2, }}
        >
      <Box
        sx={{
                width: 250,
          height:360,
          // boxShadow: 3,
          p: 1,
          transition: "0.3s",
          
        }}
      >
        
        <Box sx={{ position: "relative" }}>
          <Tooltip title="Add to Wishlist" arrow>
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8, color: "red" }}
              onClick={() => handleToggleFavorite()}
            >
              {favorite || pet?.favorites?.includes(userId) ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Tooltip>
          <CardMedia
            component="img"
            height="140"
            image={pet.image || "https://via.placeholder.com/250"}
            alt={pet.name}
            sx={{ borderRadius: 2, cursor: "pointer" }}
            onClick={() => setOpenModal("image")}
          />
        </Box>

        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" noWrap>
            {pet.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pet.breed} - {pet.age} yrs - {pet.size}
          </Typography>
          <Typography
            variant="body2"
            color={pet.isFostered ? "success.main" : "error.main"}
          >
            {pet.isFostered ? "Fostered ✅" : "Available 🏡"}
          </Typography>
          <Box
            sx={{ mt: 1, display: "flex", justifyContent: "center", gap: 1 }}
          >
            {currentUserRole === "adopter" && (
              <Button
                variant="contained"
                size="small"
                onClick={() => setOpenModal("adopt")}
              >
                Adopt
              </Button>
            )}
            {currentUserRole === "foster" && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setOpenModal("foster")}
              >
                Foster
              </Button>
            )}
            {currentUserRole === "shelter" && (
              <Button
                variant="outlined"
                size="small"
                sx={{
                  color: "red",
                  borderColor: "red",
                  fontWeight: "bold",
                  "&:hover": {
                    bgcolor: "#ffebee",
                    borderColor: "#b71c1c",
                    color: "#b71c1c",
                  },
                }}
                onClick={() => handleDeleteClick()}
              >
                Delete Pet
              </Button>
            )}

            {(currentUserRole === "adopter" ||
              currentUserRole === "foster") && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setOpenModal("review")}
              >
                Review
              </Button>
                    )}
                  
                </Box>
                 {/* Reviews Section */}
            <Box sx={{ mt: 2, maxHeight: 100, overflowY: "auto" }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Reviews
              </Typography>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <Box
                    key={index}
                    sx={{
                      mt: 1,
                      p: 1,
                      bgcolor: "#f5f5f5",
                      borderRadius: 2,
                      textAlign: "left",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {review.userName}:
                    </Typography>
                    <Typography variant="body2">{review.reviewText}</Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No reviews yet.
                </Typography>
              )}
            </Box>
        </CardContent>
            </Box>
            </Card>
      )}

    

    </Draggable>

       {/* Toast  */}
      <Toast
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={() => setToast({ ...toast, open: false })}
              />
      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this pet? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Modal */}
      <Modal
        open={openModal === "image"}
        onClose={() => setOpenModal(null)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box onClick={() => setOpenModal(null)} sx={{ outline: "none" }}>
          <img
            src={pet.image || "https://via.placeholder.com/400"}
            alt={pet.name}
            style={{
              width: "80%",
              height: "auto",
              borderRadius: "5px",
              display: "block",
              margin: "auto",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking image
          />
        </Box>
      </Modal>

      {/* Request Modals */}
      {["adopt", "foster"].includes(openModal) && (
        <Modal
          open
          onClose={() => setOpenModal(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              p: 4,
              borderRadius: 2,
              width: 350,
              boxShadow: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
              sx={{ color: "grey" }}
            >
              {openModal === "adopt" ? "Adopt a Pet" : "Foster a Pet"}
            </Typography>
            <Typography variant="subtitle1" mb={2}>
              You are requesting to {openModal} {pet?.name}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mb: 2 }}
            />
            {openModal === "foster" && (
              <TextField
                fullWidth
                label="Weeks"
                type="number"
                value={weeks}
                onChange={(e) => setWeeks(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleRequest(openModal)}
            >
              Submit Request
            </Button>
            {error && (
              <Typography color="error" mt={2}>
                {error}
              </Typography>
            )}
          </Box>
        </Modal>
      )}

      {/* Review Modal */}
      <Modal
        open={openModal === "review"}
        onClose={() => setOpenModal(null)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            width: 350,
            boxShadow: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={2}
            sx={{ color: "grey" }}
          >
            Leave a Review
          </Typography>
          <Typography variant="subtitle1" mb={2}>
            Share your experience with {pet?.name}
          </Typography>
          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Your Review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" fullWidth onClick={handleReviewSubmit}>
            Submit Review
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default PetCardForHome;