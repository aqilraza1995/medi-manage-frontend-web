import { LocationState } from "@/types/authType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { State, City } from "country-state-city";

const INDIAN_STATES = State.getStatesOfCountry('IN').map(state => ({
  name: state.name,
  isoCode: state.isoCode,
  value: state.name
}));

const initialState: LocationState = {
  states: INDIAN_STATES,
  cities: [],
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCitiesByState: (state, action: PayloadAction<string>) => {
      const selectedState = state.states.find((s) => s.name === action.payload);
      
      if (!selectedState) {
        state.cities = [];
        return;
      }
      
      state.cities = City.getCitiesOfState('IN', selectedState.isoCode).map(city => ({
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