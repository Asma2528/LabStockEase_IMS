// Import necessary functions and utilities from Redux Toolkit and RTK Query
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// Import slices and API service definitions from their respective files
import UserSlice from "./slice/user.slice"; // Slice for managing user-related state
import SidebarSlice from "./slice/Sidebar.slice"; // Slice for managing sidebar state
import { AuthApi } from "./queries/Auth.query"; // RTK Query API service for authentication
import { ChemicalsApi } from "./queries/Chemicals.query"; // RTK Query API service for chemicals data
import { ReagentsApi } from "./queries/Reagents.query"; // RTK Query API service for reagents data
import { GlasswareApi } from "./queries/Glassware.query"; // RTK Query API service for glassware data
import { MeasuringApi } from "./queries/Measuring.query"; // RTK Query API service for measuring data
import { OthersApi } from "./queries/Others.query"; // RTK Query API service for other data
import { ChemistryDashboardApi } from "./queries/Chemistry.dashboard.query"; // RTK Query API service for chemistry dashboard data
import { ChemistryRequisitionApi } from "./queries/ChemistryRequisition.query";
import { VendorApi } from "./queries/Vendors.query";

// Configure the Redux store
export const store = configureStore({
    reducer: {
        // Add slices for user and sidebar state management
        user: UserSlice, // Slice for managing user state
        sidebar: SidebarSlice, // Slice for managing sidebar state

        // Add RTK Query API services reducers to the store
        [AuthApi.reducerPath]: AuthApi.reducer,
        [VendorApi.reducerPath]: VendorApi.reducer,
         // Reducer for AuthApi, handles authentication-related API state
        [ChemicalsApi.reducerPath]: ChemicalsApi.reducer, // Reducer for ChemicalsApi, handles chemicals-related API state
        [ReagentsApi.reducerPath]: ReagentsApi.reducer, // Reducer for ReagentsApi, handles reagents-related API state
        [GlasswareApi.reducerPath]: GlasswareApi.reducer, // Reducer for GlasswareApi, handles glassware-related API state
        [MeasuringApi.reducerPath]: MeasuringApi.reducer, // Reducer for MeasuringApi, handles measuring-related API state
        [OthersApi.reducerPath]: OthersApi.reducer, // Reducer for OthersApi, handles miscellaneous API state
        [ChemistryDashboardApi.reducerPath]: ChemistryDashboardApi.reducer, // Reducer for ChemistryDashboardApi, handles chemistry dashboard-related API state
        [ChemistryRequisitionApi.reducerPath]: ChemistryRequisitionApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        // Configure middleware for the store
        getDefaultMiddleware()
            .concat(AuthApi.middleware) // Add middleware for AuthApi
            .concat(ChemicalsApi.middleware) // Add middleware for ChemicalsApi
            .concat(ReagentsApi.middleware) // Add middleware for ReagentsApi
            .concat(GlasswareApi.middleware) // Add middleware for GlasswareApi
            .concat(MeasuringApi.middleware) // Add middleware for MeasuringApi
            .concat(OthersApi.middleware) // Add middleware for OthersApi
            .concat(ChemistryDashboardApi.middleware)
            .concat(ChemistryRequisitionApi.middleware)
            .concat(VendorApi.middleware),// Add middleware for ChemistryDashboardApi
});

// Set up listeners for RTK Query to handle automatic refetching and other actions
setupListeners(store.dispatch);

// Export the configured store for use in the application
export default store;


/*

This code is used to configure a Redux store for a React application that uses Redux Toolkit. Redux Toolkit is a library that simplifies Redux usage by providing utilities for creating and managing the store, slices, and asynchronous logic.
*/