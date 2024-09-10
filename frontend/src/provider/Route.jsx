import { createBrowserRouter } from "react-router-dom";
import App from '../App';
import AuthorizedRoute from './AuthorizedRoute';

import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home/index"; 
import ErrorPage from "../pages/Error";
import ForgotPassword from "../pages/forgotPassword";
import ResetPassword from "../pages/resetPassword";

// Chemistry
import ChemistryPage from "../pages/Chemistry/Home";
import ChemicalsPage from "../pages/Chemistry/chemicals";
import ReagentsPage from "../pages/Chemistry/reagents";
import GlasswarePage from "../pages/Chemistry/glassware";
import MeasuringPage from "../pages/Chemistry/measuring";
import OthersPage from "../pages/Chemistry/others";

// import Glassware from "../pages/Chemistry/Glassware";
// import Measuring from "../pages/Chemistry/Measuring";
// import OthersChemistry from "../pages/Chemistry/Others";

// // Physics
// import PhysicsPage from "../pages/Physics";
// import Instruments from "../pages/Physics/Instruments";
// import Materials from "../pages/Physics/Materials";
// import Electronics from "../pages/Physics/Electronics";
// import Optical from "../pages/Physics/Optical";
// import OthersPhysics from "../pages/Physics/Others";

// // Biology
// import BiologyPage from "../pages/Biology";
// import Microscopes from "../pages/Biology/Microscopes";
// import Specimens from "../pages/Biology/Specimens";
// import Stains from "../pages/Biology/Stains";
// import Dissection from "../pages/Biology/Dissection";
// import Slides from "../pages/Biology/Slides";
// import OthersBiology from "../pages/Biology/Others";

// // Botany
// import BotanyPage from "../pages/Botany";
// import PlantSpecimens from "../pages/Botany/PlantSpecimens";
// import Seeds from "../pages/Botany/Seeds";
// import Herbarium from "../pages/Botany/Herbarium";
// import Fertilizers from "../pages/Botany/Fertilizers";
// import Equipment from "../pages/Botany/Equipment";
// import OthersBotany from "../pages/Botany/Others";

// // Microbiology
// import MicrobiologyPage from "../pages/Microbiology";
// import Cultures from "../pages/Microbiology/Cultures";
// import PetriDishes from "../pages/Microbiology/PetriDishes";
// import AgarMedia from "../pages/Microbiology/AgarMedia";
// import Incubators from "../pages/Microbiology/Incubators";
// import Sterilization from "../pages/Microbiology/Sterilization";
// import OthersMicrobiology from "../pages/Microbiology/Others";

// // Life Science
// import LifeSciencePage from "../pages/LifeScience";
// import ChemicalsLife from "../pages/LifeScience/Chemicals";
// import SpecimensLife from "../pages/LifeScience/Specimens";
// import EquipmentLife from "../pages/LifeScience/Equipment";
// import OthersLifeScience from "../pages/LifeScience/Others";

export const Routes = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      {
        path: '/',
        element: <Home /> 
      },

      // Chemistry Routes
      {
        path: '/chemistry',
        element: <ChemistryPage />
      },
      {
        path: '/chemistry/chemicals',
        element: <ChemicalsPage/>
      },
      {
        path: '/chemistry/reagents',
        element: <ReagentsPage/>
      },
      {
        path: '/chemistry/glassware',
        element: <GlasswarePage/>
      },
      {
        path: '/chemistry/measuring',
        element: <MeasuringPage/>
      },
      {
        path: '/chemistry/others',
        element: <OthersPage/>
      },
      // // Physics Routes
      // {
      //   path: '/physics',
      //   element: <PhysicsPage />,
      //   children: [
      //     { path: 'instruments', element: <Instruments /> },
      //     { path: 'materials', element: <Materials /> },
      //     { path: 'electronics', element: <Electronics /> },
      //     { path: 'optical', element: <Optical /> },
      //     { path: 'others', element: <OthersPhysics /> },
      //   ],
      // },

      // // Biology Routes
      // {
      //   path: '/biology',
      //   element: <BiologyPage />,
      //   children: [
      //     { path: 'microscopes', element: <Microscopes /> },
      //     { path: 'specimens', element: <Specimens /> },
      //     { path: 'stains', element: <Stains /> },
      //     { path: 'dissection', element: <Dissection /> },
      //     { path: 'slides', element: <Slides /> },
      //     { path: 'others', element: <OthersBiology /> },
      //   ],
      // },

      // // Botany Routes
      // {
      //   path: '/botany',
      //   element: <BotanyPage />,
      //   children: [
      //     { path: 'plant-specimens', element: <PlantSpecimens /> },
      //     { path: 'seeds', element: <Seeds /> },
      //     { path: 'herbarium', element: <Herbarium /> },
      //     { path: 'fertilizers', element: <Fertilizers /> },
      //     { path: 'equipment', element: <Equipment /> },
      //     { path: 'others', element: <OthersBotany /> },
      //   ],
      // },

      // // Microbiology Routes
      // {
      //   path: '/microbiology',
      //   element: <MicrobiologyPage />,
      //   children: [
      //     { path: 'cultures', element: <Cultures /> },
      //     { path: 'petri-dishes', element: <PetriDishes /> },
      //     { path: 'agar-media', element: <AgarMedia /> },
      //     { path: 'incubators', element: <Incubators /> },
      //     { path: 'sterilization', element: <Sterilization /> },
      //     { path: 'others', element: <OthersMicrobiology /> },
      //   ],
      // },

      // // Life Science Routes
      // {
      //   path: '/lifescience',
      //   element: <LifeSciencePage />,
      //   children: [
      //     { path: 'chemicals', element: <ChemicalsLife /> },
      //     { path: 'specimens', element: <SpecimensLife /> },
      //     { path: 'equipment', element: <EquipmentLife /> },
      //     { path: 'others', element: <OthersLifeScience /> },
      //   ],
      // },

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
  }


]);
