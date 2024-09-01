import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import UserSlice from "./slice/user.slice"; // Ensure path is correct
import SidebarSlice from "./slice/Sidebar.slice"; // Ensure path is correct
import { AuthApi } from "./queries/Auth.query";
import { ChemistryApi } from "./queries/Chemistry.query"; // Include if needed

export const store = configureStore({
    reducer: {
        user: UserSlice, // Use the slice directly
        sidebar: SidebarSlice, // Use the slice directly
        [AuthApi.reducerPath]: AuthApi.reducer, // API slices require this format
        [ChemistryApi.reducerPath]: ChemistryApi.reducer, // Include if needed
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(AuthApi.middleware)
            .concat(ChemistryApi.middleware), // Include if needed
});

setupListeners(store.dispatch);

export default store;