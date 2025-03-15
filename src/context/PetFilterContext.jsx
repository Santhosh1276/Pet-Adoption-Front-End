/* eslint-disable react/prop-types */
import { createContext, useReducer, useContext } from "react";

const PetFilterContext = createContext();

const initialFilters = {
  breed: null,
  age: null,
  size: null,
  location: null,
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.filterType]: action.value };
    case "RESET_FILTERS":
      return initialFilters;
    default:
      return state;
  }
};

export const PetFilterProvider = ({ children }) => {
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  return (
    <PetFilterContext.Provider value={{ filters, dispatch }}>
      {children}
    </PetFilterContext.Provider>
  );
};

export const usePetFilters = () => useContext(PetFilterContext);
