// features/search/searchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  candidates: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setCandidates: (state, action) => {
      state.candidates = action.payload;
    },
    setSearchForm: (state, action) => {
      state.searchForm = action.payload;
    },
    clearCandidates: (state) => {
      state.candidates = [];
    },
    clearSearchForm: (state) => {
      state.searchForm = [];
    },
  },
});

export const {
  setCandidates,
  clearCandidates,
  setSearchForm,
  clearSearchForm,
} = searchSlice.actions;
export default searchSlice.reducer;
