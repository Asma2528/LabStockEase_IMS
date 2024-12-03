import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk('user/fetchData', async () => {
  const response = await axios.get('/api/user');
  if (typeof response.data !== 'object' || response.data.includes('<html>')) {
    throw new Error('Unexpected response format');
  }

  console.log('Fetched user data from API:', response.data); // Log API response
  return response.data;
});


const userSlice = createSlice({
  name: 'user',
  initialState: {
    role: null,
    name: null,
    email: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    removeUser(state) {
      // console.log('Removing user from state'); // Log removal
      state.role = null;
      state.name = null;
      state.email = null;
    },
    setUser(state, action) {
      // console.log('Setting user data:', action.payload); // Log action payload
      state.role = action.payload.role;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        // console.log('Fetching user data...');
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        // console.log('User data fetch succeeded:', action.payload); // Log success payload
        state.status = 'succeeded';
        state.role = action.payload.role;
        state.name = action.payload.name;
        state.email = action.payload.email;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        // console.error('User data fetch failed:', action.error.message); // Log error
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { removeUser, setUser } = userSlice.actions;
export const UserSlicePath = (state) => {
  return state.user;
};

export default userSlice.reducer;
