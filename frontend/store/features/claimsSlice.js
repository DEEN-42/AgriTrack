import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  claims: [],
  loading: false,
  error: null,
};

// Async thunk to fetch claims
export const fetchClaims = createAsyncThunk(
  'claims/fetchClaims',
  async () => {
    const response = await fetch('/mockdata/claims.json');
    const claims = await response.json();
    return claims;
  }
);

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    approveClaim: (state, action) => {
      const claim = state.claims.find((c) => c.claimId === action.payload);
      if (claim) {
        claim.status = 'Approved';
      }
    },
    rejectClaim: (state, action) => {
      const claim = state.claims.find((c) => c.claimId === action.payload);
      if (claim) {
        claim.status = 'Rejected';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.claims = action.payload;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { approveClaim, rejectClaim } = claimsSlice.actions;
export default claimsSlice.reducer;
