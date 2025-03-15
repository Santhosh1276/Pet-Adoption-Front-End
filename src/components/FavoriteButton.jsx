/* eslint-disable react/prop-types */
import  { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const FavoriteButton = ({ onToggle, isFavorite = false }) => {
    const [favorite, setFavorite] = useState(isFavorite);

    const handleClick = () => {
        setFavorite(!favorite);
        if (onToggle) onToggle(!favorite);
    };

    return (
        <Tooltip title={favorite ? "Remove from Favorites" : "Add to Favorites"}>
            <IconButton color={favorite ? "error" : "default"} onClick={handleClick}>
                {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default FavoriteButton;
