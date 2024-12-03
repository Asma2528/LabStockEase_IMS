import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import MainLayout from './layouts/MainLayout';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, UserSlicePath } from './provider/slice/user.slice';

function App() {
  const [loading, SetLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector(UserSlicePath);

  const fetchUser = async (token) => {
    // console.log("Fetching user with token:", token);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // console.log('Fetched user data:', data);
      dispatch(setUser(data.user));
      SetLoading(false);
    } catch (error) {
      // console.error("Error fetching user data:", error);
      // console.error("Error response data:", error.response?.data); // Log additional details
      navigate("/login");
    }
  };
  
  
  

  useEffect(() => {
    const token = localStorage.getItem("token") || '';
// console.log("token fetched from localstorage: ",token);
    if (!token) {
      navigate("/login");
    } else {
      if (selector?.email) {
        SetLoading(false);
      } else {
        fetchUser(token);
      }
    }
  }, [selector, navigate, dispatch]);

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <Header />
      <MainLayout>
        <Outlet />
      </MainLayout>
    </>
  );
}

export default App;
