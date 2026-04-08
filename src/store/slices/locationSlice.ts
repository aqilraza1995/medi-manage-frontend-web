import { LocationState } from "@/types/authType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { State, City } from "country-state-city";


const initialState: LocationState = {
  states: State.getStatesOfCountry('IN').map(state => ({
    name: state.name,
    isoCode: state.isoCode
  })),
  cities: [],
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCitiesByState: (state, action: PayloadAction<string>) => {
      const demo = City.getCitiesOfState('IN', action.payload).map(city => ({
        name: city.name
      }));
      state.cities = City.getCitiesOfState('IN', action.payload).map(city => ({
        name: city.name
      }));
    },
    clearCities: (state) => {
      state.cities = [];
    },
  },
});

export const { setCitiesByState, clearCities } = locationSlice.actions;
export default locationSlice.reducer;