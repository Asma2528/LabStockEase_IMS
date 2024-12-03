import { createBrowserRouter } from "react-router-dom";
import App from '../App';
import AuthorizedRoute from './AuthorizedRoute';

import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home/index"; 
import ErrorPage from "../pages/Error";
import ForgotPassword from "../pages/forgotPassword";
import ResetPassword from "../pages/resetPassword";
import Unauthorized from "../pages/Unauthorized";

// Chemistry
import ChemistryPage from "../pages/Chemistry/Home";
import ChemistryRequisitionPage from "../pages/Chemistry/Requisition/index";
import ChemistryAdminRequisitionPage from "../pages/Chemistry/Requisition/adminRequisition"
import ChemistryApprovedRequisitionPage from "../pages/Chemistry/Requisition/approvedRequisition"
import ChemicalsPage from "../pages/Chemistry/chemicals";
import ChemicalsRestockPage from "../pages/Chemistry/chemicals/restock.chemicals";
import ChemicalsLogPage from "../pages/Chemistry/chemicals/log.chemicals";
import ReagentsLogPage from "../pages/Chemistry/reagents/log.reagents";
import ReagentsPage from "../pages/Chemistry/reagents";
import GlasswarePage from "../pages/Chemistry/glassware";
import MeasuringPage from "../pages/Chemistry/measuring";
import OthersPage from "../pages/Chemistry/others";
import VendorsPage from "../pages/Vendors/index"


export const Routes = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      {
        path: '/',
        element: <AuthorizedRoute element={<Home />} allowedRoles={['admin']} />
      },

      // Chemistry Routes
      {
        path: '/chemistry',
        element: <AuthorizedRoute element={<ChemistryPage />} allowedRoles={['admin', 'chemistry']} />
      },
      {
        path: '/vendors',
        element: <AuthorizedRoute element={<VendorsPage />} allowedRoles={['admin']} />
      },
      {
        path: '/chemistry/chemicals',
        element: <AuthorizedRoute element={<ChemicalsPage />} allowedRoles={['admin', 'chemistry']} />
      },
      {
        path: '/chemistry/requisition',
        element: <AuthorizedRoute element={<ChemistryRequisitionPage />} allowedRoles={['chemistry', 'chemistry-faculty']} />
      },
      {
        path: '/chemistry/admin-requisition',
        element: <AuthorizedRoute element={<ChemistryAdminRequisitionPage />} allowedRoles={['admin']} />
      },
      {
        path: '/chemistry/approved-requisition',
        element: <AuthorizedRoute element={<ChemistryApprovedRequisitionPage />} allowedRoles={['chemistry']} />
      },
      {
        path: '/chemistry/chemicals/restock',
        element: <AuthorizedRoute element={<ChemicalsRestockPage />} allowedRoles={['admin', 'chemistry']} />
      },
      {
        path: '/chemistry/chemicals/logs',
        element: <AuthorizedRoute element={<ChemicalsLogPage />} allowedRoles={['admin', 'chemistry']} />
      },
      {
        path: '/chemistry/reagents',
        element: <AuthorizedRoute element={<ReagentsPage />} allowedRoles={['admin', 'chemistry']} />
      },
      {
        path: '/chemistry/reagents/logs',
        element: <AuthorizedRoute element={<ReagentsLogPage />} allowedRoles={['admin', 'chemistry']} />
      },
      {
        path: '/chemistry/glassware',
        element: <AuthorizedRoute element={<GlasswarePage />} allowedRoles={['admin', 'chemistry']} />
      },
      {
        path: '/chemistry/measuring',
        element: <AuthorizedRoute element={<MeasuringPage />} allowedRoles={['admin', 'chemistry']} />
      },
      {
        path: '/chemistry/others',
        element: <AuthorizedRoute element={<OthersPage />} allowedRoles={['admin', 'chemistry']} />
      },

      // Error Page
      {
        path: '*',
        element: <ErrorPage />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <AuthorizedRoute element={<Register />} allowedRoles={['admin']} />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
  }
]);
