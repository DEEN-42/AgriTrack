import { createSlice } from '@reduxjs/toolkit';

// Load auth state from localStorage on initial load
const loadAuthState = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    
    if (token && user && role) {
      return {
        isAuthenticated: true,
        token,
        user: JSON.parse(user),
        role, // 'farmer', 'owner', 'admin'
      };
    }
  }
  return {
    isAuthenticated: false,
    token: null,
    user: null,
    role: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthState(),
  reducers: {
    login: (state, action) => {
      const { token, user, role } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      state.role = role;
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', role);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.role = null;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
