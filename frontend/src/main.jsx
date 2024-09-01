import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { Routes } from './provider/Route.jsx';
import { Provider } from 'react-redux';
import { store } from './provider/Store.jsx';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import { Toaster} from 'sonner'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <PrimeReactProvider>
      <Provider store={store}>
      <Toaster position='top-center' richColors closeButton />
        <RouterProvider router={Routes} />
      </Provider>
    </PrimeReactProvider>
  </React.StrictMode>
);