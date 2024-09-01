import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name: 'user', // Use 'user' here
    initialState: {
        user: null,
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        removeUser(state) {
            state.user = null;
        },
    },
});
export const { removeUser, setUser } = UserSlice.actions;
export const UserSlicePath = (state) => state.user.user;
export default UserSlice.reducer;