import { createBrowserRouter } from "react-router-dom";
import App from '../App';
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home/index"; 
import ErrorPage from "../pages/Error";

import ChemistryPage from "../pages/Chemistry";

export const Routes = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Use 'element' instead of 'Component'
    children: [
      {
        path: '/',
        element: <Home /> // Use 'element'
      },
      {path: '/chemistry',
        element: <ChemistryPage /> 
    },
    {
      path:'*',
      element: <ErrorPage /> 
  }
      
    ]
  },
  {
    path: '/login',
    element: <Login /> // Use 'element'
  },
  {
    path: '/register',
    element: <Register /> // Use 'element'
  }
]);