import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import PetFilter from "../components/PetFilter";
import { Box, Container, Grid, Typography } from "@mui/material";
import { getAllPets, getPetsByFilter } from "../api/api";
import PetCardForHome from "../components/PetCardForHome";
import Loader from "../components/Loader";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { usePetFilters } from "../context/PetFilterContext";

const Home = () => {
  const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);

  const [refreshPets, setRefreshPets] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const { filters } = usePetFilters();

  console.log("filters >>>", filters);

  const refreshPetsHandler = () => {
    setRefreshPets((prev) => !prev);
  };

  const handleSearch = () => {
    setSearchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true)
        const hasValues = Object.values(filters).some((value) => value !== null);
        if (hasValues) {
          let response = await getPetsByFilter(filters);
          console.log(response, "resp >>>>");
          let petsData = response.data;
          setPets(petsData ?? []);
                  setLoading(false)

        } else {
          let response = await getAllPets();
          let petsData = await response.json();
          setPets(petsData?.data ?? []);
            setLoading(false)

        }
      } catch (error) {
        console.error("Error fetching pets:", error);
          setLoading(false)

      }
    };

    fetchPets();
  }, [refreshPets, filters, searchTrigger]);

  const onDragEnd = (result) => {
    console.log("Drag result:", result);
    if (!result.destination) return;

    const reorderedPets = [...pets];
    const [movedItem] = reorderedPets.splice(result.source.index, 1);
    reorderedPets.splice(result.destination.index, 0, movedItem);

    setPets(reorderedPets);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#ECF0F3", pt: 8 , height: "100vh",
      width: "100vw",}}>
      <Loader open={loading } />
      <NavBar />
      <PetFilter pets={pets} onSearch={handleSearch} />
      <Container sx={{ mt: 0, pb: 6 }} maxWidth="xl">
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          color="#2C3E50"
          sx={{ mt: 2,mb:2, letterSpacing: 1 }}
        >
          🐾 Available Pets 🐾
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {pets.length > 0 ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="pets" direction="horizontal">
                {(provided) => (
                  <Grid
                    container
                    spacing={{ xs: 2, sm: 3, md: 4 }}
                    justifyContent="center"
                    alignItems="stretch"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {pets.map((pet, index) => (
                      <Draggable key={pet._id} draggableId={String(pet._id)} index={index}>
                        {(provided) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            xl={2.5}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Box display="flex" height="100%" justifyContent="center">
                              <PetCardForHome pet={pet} index={index} refreshPets={refreshPetsHandler} />
                            </Box>
                          </Grid>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Grid>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <Grid item xs={12} textAlign="center" sx={{ mt: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No pets available.
              </Typography>
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
