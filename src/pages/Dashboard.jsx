import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PetForm from "../components/PetForm";
import { getPetsByAdopterId, getPetsByFosterId, getPetsByShelterId, getPetsByShelterId_fostering, submitPetForm } from "../api/api";
import Toast from "../components/Toast";
import NavBar from "../components/NavBar";
import PetsTable from "../components/PetsTable";
import Loader from "../components/Loader";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"; // Responsive Container for Charts
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const COLORS = ["#2C3E50", "#E74C3C"]; // Colors for Pie Chart
  let { user } = useAuth(); // from user context
  const [form, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [pets, setPets] = useState([]);
  const [chartData, setChartData] = useState([]); // State for chart data

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        let petsData = [];

        if (user.userRole === "adopter" || user.userRole === "foster") {
          if (user.userRole === "adopter") {
            let response = await getPetsByAdopterId();
            let data = await response.json();
            petsData = data?.data?.map((val) => ({ ...val, table: "adoption" })) || [];
          } else {
            let response = await getPetsByFosterId();
            let data = await response.json();
            petsData = data?.data?.map((val) => ({ ...val, table: "fostering" })) || [];
          }
        } else {
          let responseAdoption = await getPetsByShelterId();
          let responseFostering = await getPetsByShelterId_fostering();

          let dataAdoption = await responseAdoption.json();
          let dataFostering = await responseFostering.json();

          let updatedAdoption = dataAdoption?.data?.map((val) => ({ ...val, table: "adoption" })) || [];
          let updatedFostering = dataFostering?.data?.map((val) => ({ ...val, table: "fostering" })) || [];

          petsData = [...updatedAdoption, ...updatedFostering];

          // Prepare chart data for shelter role
          setChartData([
            { name: "Adoption", value: updatedAdoption.length },
            { name: "Fostering", value: updatedFostering.length },
          ]);
        }

        setPets(petsData);
        console.log("Fetched Pets >>>>", petsData);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user.userId && user.userRole && user.accessToken) {
      fetchPets();
    }
  }, [user]); // Re-run when user changes

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handlePetSubmit = async (petData) => {
    console.log("Pet Data Submitted:", petData);
    let result = await submitPetForm(petData);
    let jsonResponse = await result.json();
    console.log("json >>>>>>>>>>>>>", jsonResponse);
    if (jsonResponse?.message === "Pet listed successfully") {
      setToast({
        open: true,
        message: "Pet added successfully!",
        severity: "success",
      });
      setShowForm(false);
    } else {
      setToast({
        open: true,
        message: "Failed to add pet!",
        severity: "error",
      });
      setShowForm(false);
    }
  };

  return (
    <Box>
      <NavBar />
      <Loader open={loading} />

      <Box sx={{ marginTop: 10, px: 2 }}>
        {localStorage.getItem("user_role") === "shelter" && (
          <>
            <Button
              variant={form ? "outlined" : "contained"} 
              sx={{
                fontSize: "1rem",
                fontWeight: "600",
                width:"100%",
                textTransform: "uppercase",
                padding: "5px 10px",
                boxShadow:3,
                mt:1,
                backgroundColor: form ? "#E74C3C" : "#2C3E50",
                color: "white",
                borderRadius: "8px",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: form ? "#C0392B" : "#1A252F",
                  boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.3)",
                },
              }}
              onClick={toggleForm}
            >
              {form ? "❌ Cancel" : "➕ Add Pet"}
            </Button>

            {form && <PetForm onSubmit={handlePetSubmit} />}

            {/* Centered Pie Chart */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", mt: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#2C3E50" }}>
                Shelter Pet Distribution
              </Typography>
              <Box sx={{ width: "100%", maxWidth: 400 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </>
        )}

        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
        />

        <Box sx={{ marginTop: 15 }}>
          <PetsTable pets={pets} user_role={localStorage.getItem("user_role")} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
