import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk('user/fetchData', async () => {
  const response = await axios.get('/api/user');
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
      state.role = null;
      state.name = null;
      state.email = null;
    },
    setUser(state, action) {
      state.role = action.payload.role;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.role = action.payload.role;
        state.name = action.payload.name;
        state.email = action.payload.email;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { removeUser, setUser } = userSlice.actions;

export const UserSlicePath = (state) => state.user;

export default userSlice.reducer;
