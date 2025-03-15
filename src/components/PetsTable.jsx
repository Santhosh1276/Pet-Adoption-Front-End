/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";
import { Delete, Visibility, CheckCircle } from "@mui/icons-material";
import {
  approveOrRejectMail,
  deletePetForAdoption,
  deletePetForFostering,
  getPetById,
  updatePetForAdoption,
  updatePetForFostering,
} from "../api/api";
import Loader from "./Loader";
import Toast from "../components/Toast";

import { useNavigate } from "react-router-dom";


const PetsTable = ({ pets, user_role }) => {
    const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [viewPet, setViewPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const confirmButtonStyle = {
    backgroundColor: dialogType === "approve" ? "#2e7d32" : "#d32f2f",
    color: "#fff",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: dialogType === "approve" ? "#1b5e20" : "#b71c1c",
    },
  };

  async function handleView(pet) {
    console.log("get pets >>>", pet);
    let fetchPetId = await getPetById(pet?.petId);
    let jsonResponse = await fetchPetId.json();
    if (jsonResponse?.message === "Pet Found") {
      setViewPet(jsonResponse?.data);
      handleOpenDialog("view", pet);
    }
  }

  /** Handles opening the dialog for different actions */
  const handleOpenDialog = (type, pet) => {
    setDialogType(type);
    setSelectedPet(pet);
    setOpenDialog(true);
  };

  /** Handles confirmation actions */
  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (dialogType === "approve") {
        console.log("Approving pet:", selectedPet);
        if (selectedPet?.table === "fostering") {
          // for fostering
          let updatePetByShelterId = await updatePetForFostering(
            selectedPet?.petId,
            { isFostered: true, fosterId: selectedPet?.fosterParentId }
          );
          let data = await updatePetByShelterId.json();
          console.log("data >>>", data);
          if (data) {
            let fetchPetId = await getPetById(selectedPet?.petId);
            let jsonResponse = await fetchPetId.json();
            if (jsonResponse?.message === "Pet Found") {
              let petData = jsonResponse?.data ?? {};
              let params = {
                name: petData?.name,
                breed: petData?.breed,
                age: petData?.age,
                color: petData?.color,
                location: petData?.location,
                shelterId: petData?.shelterId,
                type: "Fostering",
                message: selectedPet?.message,
                isAccepted: true,
              };
              let mail = await approveOrRejectMail(params);
              let mailRespond = await mail.json();
              if (mailRespond?.message === "success") {
                setToast({
                  open: true,
                  message: "Mail send to Foster",
                  severity: "success",
                });
              }
            }
          }
        } // for adoption
        else {
          let updatePetByShelterId = await updatePetForAdoption(
            selectedPet?.petId,
            { isShelterAccepted: true, adopterId: selectedPet?.adopterId }
          );
          let data = await updatePetByShelterId.json();
          console.log("data >>>", data);
            if (data) {
            let fetchPetId = await getPetById(selectedPet?.petId);
            let jsonResponse = await fetchPetId.json();
            if (jsonResponse?.message === "Pet Found") {
              let petData = jsonResponse?.data ?? {};
              let params = {
                name: petData?.name,
                breed: petData?.breed,
                age: petData?.age,
                color: petData?.color,
                location: petData?.location,
                shelterId: petData?.shelterId,
                type: "Adopting",
                message: selectedPet?.message,
                isAccepted: true,
              };
              let mail = await approveOrRejectMail(params);
              let mailRespond = await mail.json();
              if (mailRespond?.message === "success") {
                setToast({
                  open: true,
                  message: "Mail send to Adopter",
                  severity: "success",
                });
              }
            }
          }
        }
        // Call the function to approve the pet
      } else if (dialogType === "delete") {
        console.log("Deleting pet:", selectedPet);
        // Call the function to delete the pet
        if (selectedPet?.table === "fostering") {
          let deleteFoster = await deletePetForFostering(selectedPet?.petId);
          let data = await deleteFoster.json();
          console.log("data >>>", data);
            if (data) {
            let fetchPetId = await getPetById(selectedPet?.petId);
            let jsonResponse = await fetchPetId.json();
            if (jsonResponse?.message === "Pet Found") {
              let petData = jsonResponse?.data ?? {};
              let params = {
                name: petData?.name,
                breed: petData?.breed,
                age: petData?.age,
                color: petData?.color,
                location: petData?.location,
                shelterId: petData?.shelterId,
                type: "Fostering",
                message: selectedPet?.message,
                isAccepted: false,
              };
              let mail = await approveOrRejectMail(params);
              let mailRespond = await mail.json();
              if (mailRespond?.message === "success") {
                setToast({
                  open: true,
                  message: "Mail send to Foster",
                  severity: "success",
                });
              }
            }
          }
        } else {
          let deleteAdoption = await deletePetForAdoption(selectedPet?.petId);
          let data = await deleteAdoption.json();
          console.log("data >>>", data);
            if (data) {
            let fetchPetId = await getPetById(selectedPet?.petId);
            let jsonResponse = await fetchPetId.json();
            if (jsonResponse?.message === "Pet Found") {
              let petData = jsonResponse?.data ?? {};
              let params = {
                name: petData?.name,
                breed: petData?.breed,
                age: petData?.age,
                color: petData?.color,
                location: petData?.location,
                shelterId: petData?.shelterId,
                type: "Adopting",
                message: selectedPet?.message,
                isAccepted: false,
              };
              let mail = await approveOrRejectMail(params);
              let mailRespond = await mail.json();
              if (mailRespond?.message === "success") {
                setToast({
                  open: true,
                  message: "Mail send to Adopter",
                  severity: "success",
                });
              }
            }
          }
        }
      }
      setOpenDialog(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
            navigate("/dash-board");

    }
  };

  const renderTable = (title, petList) => {
    return (
      <>
     
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mt: 4,
            mb: 2,
            textAlign: "center",
            color: "#1A237E",
            textTransform: "capitalize",
            letterSpacing: "0.8px",
          }}
        >
          {title}
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 6,
            borderRadius: 3,
            mt: 2,
            overflowX: "auto",
            border: "1px solid #ddd",
            maxWidth: "100%",
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2C3E50" }}>
                <TableCell sx={tableHeaderStyle}>Pet Name</TableCell>
                <TableCell sx={tableHeaderStyle}>Message</TableCell>
                <TableCell sx={tableHeaderStyle}>Status</TableCell>
                {(user_role === "admin" || user_role === "shelter") && (
                  <TableCell sx={tableHeaderStyle} align="center">
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {petList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#757575", fontWeight: 500 }}
                    >
                      No pets found
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#9E9E9E" }}>
                      It looks like there are no records available at the
                      moment.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                petList.map((pet, index) => (
                  <TableRow
                    key={pet._id}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#F5F5F5" : "#FFFFFF",
                      transition: "background-color 0.3s ease",
                      "&:hover": { backgroundColor: "#E3F2FD" },
                    }}
                  >
                    <TableCell sx={tableCellStyle}>{pet.pet_name}</TableCell>
                    <TableCell sx={tableCellStyle}>{pet.message}</TableCell>
                    <TableCell sx={tableCellStyle}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color:
                            pet.status === "Approved" || pet.status === "Active"
                              ? "#2E7D32"
                              : "#D32F2F",
                        }}
                      >
                        {pet?.status ?? "Pending"}
                      </Typography>
                    </TableCell>

                    {(user_role === "admin" || user_role === "shelter") && (
                      <TableCell align="center">
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1.5}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Tooltip title="View Full Details">
                            <Button
                              variant="contained"
                              sx={viewButtonStyle}
                              startIcon={<Visibility />}
                              onClick={() => handleView(pet)}
                            >
                              View
                            </Button>
                          </Tooltip>

                          <Tooltip title="Approve Pet">
                            <Button
                              variant="contained"
                              sx={approveButtonStyle}
                              startIcon={<CheckCircle />}
                              onClick={() => handleOpenDialog("approve", pet)}
                            >
                              Approve
                            </Button>
                          </Tooltip>

                          <Tooltip title="Reject Pet">
                            <IconButton
                              sx={deleteButtonStyle}
                              onClick={() => handleOpenDialog("delete", pet)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  return (
    <>
       
      {user_role === "shelter" && (
        <>
          {renderTable(
            "Fostering Pets",
            pets?.filter((val) => val?.table === "fostering")
          )}
          {renderTable(
            "Adopting Pets",
            pets?.filter((val) => val?.table === "adoption")
          )}
        </>
      )}
      {user_role === "adopter" && renderTable("Adopted Pets", pets)}
      {user_role === "foster" && renderTable("Fostered Pets", pets)}

      {/* Dialog for Confirmation and Viewing */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: "1.3rem",
            fontWeight: 600,
            color: "#333",
          }}
        >
          {dialogType === "view"
            ? "Pet Details"
            : dialogType === "approve"
            ? "Confirm Approval"
            : "Confirm Deletion"}
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            p: 0,
          }}
        >
          {dialogType === "view" ? (
            <>
              <Avatar
                src={viewPet?.image || "/default_pet_image.jpg"}
                alt={viewPet?.name || "No Image"}
                sx={{
                  width: { xs: 120, sm: 150, md: 170 },
                  height: { xs: 120, sm: 150, md: 170 },
                  border: "3px solid #ddd",
                  boxShadow: 2,
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#222", textAlign: "center" }}
              >
                {viewPet?.name || "Unknown Pet"}
              </Typography>
              {[
                { label: "Breed", value: viewPet?.breed },
                { label: "Location", value: viewPet?.location },
                { label: "Size", value: viewPet?.size },
                { label: "Color", value: viewPet?.color },
                { label: "Message", value: selectedPet?.message },
              ].map((item, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{ color: "#555", textAlign: "center" }}
                >
                  <strong>
                    {item.label}{" "}
                    {item?.label === "Message"
                      ? user_role === "adopter"
                        ? "From Adopter"
                        : "From Foster"
                      : ""}
                    :
                  </strong>{" "}
                  {item.value || "N/A"}
                </Typography>
              ))}
            </>
          ) : (
            <DialogContentText
              sx={{ textAlign: "center", fontSize: "1rem", color: "#333" }}
            >
              Are you sure you want to {dialogType} "{selectedPet?.pet_name}"?
            </DialogContentText>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
          {dialogType !== "view" && (
            <Button onClick={handleConfirm} sx={confirmButtonStyle}>
              Confirm
            </Button>
          )}
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: "#1976d2", fontWeight: 500 }}
          >
            {dialogType === "view" ? "Close" : "Cancel"}
          </Button>
        </DialogActions>
      </Dialog>
        <Loader open={loading} />
        {/* Toast  */}
        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
        />
    </>
  );
};

// Styles for better readability
const tableHeaderStyle = {
  fontWeight: "bold",
  color: "#FFFFFF",
  fontSize: "1rem",
  padding: "14px",
  whiteSpace: "nowrap",
};

const tableCellStyle = {
  fontSize: "1rem",
  fontWeight: "500",
  padding: "14px",
  whiteSpace: "nowrap",
};

const viewButtonStyle = {
  textTransform: "none",
  fontSize: "0.85rem",
  borderRadius: "8px",
  backgroundColor: "#1976d2",
  color: "#fff",
  fontWeight: "bold",
  "&:hover": { backgroundColor: "#1565c0" },
  minWidth: "80px",
};

const approveButtonStyle = {
  backgroundColor: "#2e7d32",
  color: "#fff",
  fontWeight: "bold",
  "&:hover": { backgroundColor: "#1b5e20" },
  minWidth: "80px",
};

const deleteButtonStyle = {
  borderRadius: "8px",
  padding: "8px",
  backgroundColor: "#d32f2f",
  color: "#fff",
  "&:hover": { backgroundColor: "#b71c1c" },
};

export default PetsTable;
