/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Autocomplete,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Collapse,
  IconButton,
  TextField,
} from "@mui/material";
import { usePetFilters } from "../context/PetFilterContext";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const PetFilter = ({ pets, onSearch }) => {
  const { filters, dispatch } = usePetFilters();
  const [showFilter, setShowFilter] = useState(false);

  // 🔹 Get unique filter options dynamically
  const getUniqueOptions = (key) => [...new Set(pets.map((pet) => pet[key]).filter(Boolean))];

  return (
    <Box sx={{ position: "relative", width: "100%", textAlign: "left" }}>
      {/* Toggle Filter Button */}
      <Button
        startIcon={<FilterAltIcon />}
        variant="contained"
        sx={{
          fontSize: "0.9rem",
          fontWeight: "bold",
          borderRadius: "8px",
          backgroundColor: showFilter ? "#34495E" : "#2C3E50",
          color: "#ffffff",
          transition: "0.3s ease-in-out",
          "&:hover": { backgroundColor: "#1F2C38" },
        }}
        onClick={() => setShowFilter((prev) => !prev)}
      >
        {showFilter ? "Hide Filters" : "Show Filters"}
      </Button>

      {/* Filter Panel */}
      <Collapse in={showFilter} timeout={400}>
        <Paper
          elevation={6}
          sx={{
            mt: 3,
            p: 3,
            borderRadius: "10px",
            maxWidth: "700px",
            mx: "auto",
            bgcolor: "#ffffff",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.12)",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold" color="#2C3E50">
              Filter Your Search
            </Typography>
            <IconButton onClick={() => setShowFilter(false)} color="error">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Filter Inputs */}
          <Grid container spacing={2}>
            {[
              { label: "Breed", key: "breed" },
              { label: "Age", key: "age" },
              { label: "Size", key: "size" },
              { label: "Location", key: "location" },
            ].map(({ label, key }) => (
              <Grid item xs={12} sm={6} key={key}>
                <Autocomplete
                  options={getUniqueOptions(key)}
                  getOptionLabel={(option) => String(option)}
                  value={filters[key] || null}
                  onChange={(event, newValue) => {
                    dispatch({ type: "SET_FILTER", filterType: key, value: newValue });
                    onSearch(); // 🔹 Auto-search on selection
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={label} variant="outlined" />
                  )}
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>

          {/* Action Buttons */}
          <Box mt={3} display="flex" justifyContent="space-between">
            {/* <Button
              variant="contained"
              color="primary"
              sx={{
                fontWeight: "bold",
                borderRadius: "8px",
                width: "48%",
                bgcolor: "#2980B9",
                "&:hover": { bgcolor: "#1F618D" },
              }}
              onClick={onSearch}
            >
              Search
            </Button> */}
            <Button
              startIcon={<RestartAltIcon />}
              variant="outlined"
              sx={{
                fontWeight: "bold",
                borderRadius: "8px",
                width: "100%",
                borderColor: "#34495E",
                color: "#34495E",
                "&:hover": { bgcolor: "#ECF0F1" },
              }}
              onClick={() => {
                dispatch({ type: "RESET_FILTERS" });
                onSearch();
              }}
            >
              Reset
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default PetFilter;
