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
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      dispatch(setUser(data.user));
      SetLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token") || '';

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
