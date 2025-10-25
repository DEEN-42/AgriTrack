import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  machines: [],
  chcs: [],
  stats: {},
  loading: false,
  error: null,
};

// Async thunk to fetch all data
export const fetchData = createAsyncThunk(
  'data/fetchData',
  async () => {
    const [machinesRes, chcsRes, statsRes] = await Promise.all([
      fetch('/mockdata/machines.json'),
      fetch('/mockdata/chcs.json'),
      fetch('/mockdata/stats.json'),
    ]);

    const machines = await machinesRes.json();
    const chcs = await chcsRes.json();
    const stats = await statsRes.json();

    return { machines, chcs, stats };
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.machines = action.payload.machines;
        state.chcs = action.payload.chcs;
        state.stats = action.payload.stats;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
