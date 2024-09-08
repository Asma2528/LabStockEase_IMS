import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import UserSlice from "./slice/user.slice"; // Ensure path is correct
import SidebarSlice from "./slice/Sidebar.slice"; // Ensure path is correct
import { AuthApi } from "./queries/Auth.query";
import { ChemicalsApi } from "./queries/Chemicals.query"; // Include if needed
import { ReagantsApi } from "./queries/Reagants.query"; 

export const store = configureStore({
    reducer: {
        user: UserSlice, // Use the slice directly
        sidebar: SidebarSlice, // Use the slice directly
        [AuthApi.reducerPath]: AuthApi.reducer, // API slices require this format
        [ChemicalsApi.reducerPath]: ChemicalsApi.reducer, 
        [ReagantsApi.reducerPath]: ReagantsApi.reducer, // Include if needed
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(AuthApi.middleware)
            .concat(ChemicalsApi.middleware)
            .concat(ReagantsApi.middleware), // Include if needed
});

setupListeners(store.dispatch);

export default store;