import { useDispatch, useSelector } from 'react-redux';
import { collapsedSidebar, toggleSidebar } from '../provider/slice/Sidebar.slice';
import { HiOutlineMenu } from "react-icons/hi";
import { IoLogOutOutline } from "react-icons/io5";
import { removeUser } from '../provider/slice/user.slice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import logo from '../assets/logo.png';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Directly select the user from Redux store
    const user = useSelector((state) => state.user);

    const sidebarHandler = () => dispatch(collapsedSidebar());
    const sidebarHandlerToggle = () => dispatch(toggleSidebar());
    const logoutHandler = () => {
        try {
            localStorage.removeItem("token");
            toast.success("User logged out");
            dispatch(removeUser());
            navigate("/login");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <header className="py-2 shadow md px-5 bg-blue-900">
            <div className="nav flex items-center justify-between">
                <div className="btn">
                    <button className='lg:hidden' onClick={sidebarHandlerToggle}>
                        <HiOutlineMenu className='text-2xl text-white' />
                    </button>
                    <button className='hidden lg:flex' onClick={sidebarHandler}>
                        <HiOutlineMenu className='text-2xl text-white' />
                    </button>
                </div>
                <div className="logo flex">
                    <img src={logo} alt="LabStockEase Logo" className="mx-2 w-6 h-9" />
                    <h1 className='text-xl text-white my-2'>LabStockEase</h1>
                </div>
                
                <div className="end flex gap-4">
                    <p className="text-sm text-white hidden md:block">Hello, {user.name || "Guest"}</p>
                    <button title='logout' className="-mt-1" onClick={logoutHandler}>
                        <IoLogOutOutline className='text-2xl text-white ' />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
