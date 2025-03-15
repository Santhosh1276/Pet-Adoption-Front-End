import { useEffect, useState } from "react";
import { getFavorites } from "../api/api";
import NavBar from "../components/NavBar";
import { Grid, Typography, Container } from "@mui/material";
import PetCardForFavourites from "../components/PetCardForFavourites";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Favorites = () => {
  const [favoritePets, setFavoritePets] = useState([]);
    const [refreshPets, setRefreshPets] = useState(false);

const refreshPetsHandler = () => {
    setRefreshPets((prev) => !prev);
  };
  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = localStorage.getItem("user_id");
      const pets = await getFavorites(userId);
      setFavoritePets(pets);
    };

    fetchFavorites();
  }, [refreshPets]);

  // Function to handle drag end
  const onDragEnd = (result) => {
    if (!result.destination) return; // If dropped outside, do nothing

    const reorderedPets = Array.from(favoritePets);
    const [movedPet] = reorderedPets.splice(result.source.index, 1);
    reorderedPets.splice(result.destination.index, 0, movedPet);

    setFavoritePets(reorderedPets);
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="lg">
        {favoritePets.length > 0 && (
          <Typography
            variant="h4"
            textAlign="center"
            sx={{ mt: 10, fontWeight: "bold", color: "#2C3E50" }}
          >
            YOUR FAVORITES
          </Typography>
        )}

        {favoritePets.length > 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="pets" direction="horizontal">
              {(provided) => (
                <Grid
                  container
                  spacing={3}
                  sx={{ mt: 3, justifyContent: "center" }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {favoritePets.map((pet, index) => (
                    <Draggable key={pet._id} draggableId={String(pet._id)} index={index}>
                      {(provided) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <PetCardForFavourites pet={pet} refreshPets={refreshPetsHandler} />
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
          <Grid container justifyContent="center" sx={{ mt: 5 }}>
            <Typography variant="h6" color="textSecondary">
              No favorites added yet. Start exploring pets!
            </Typography>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Favorites;
