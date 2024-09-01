import PropTypes from 'prop-types';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { SlChemistry } from "react-icons/sl";
import { BiSolidReport } from "react-icons/bi";
import { GiMaterialsScience } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import '../index.css';
import { SidebarSlicePath, toggleSidebar } from '../provider/slice/Sidebar.slice';
// import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { RiMedicineBottleLine } from "react-icons/ri";
import { PiPlant } from "react-icons/pi";
import { FaVirus } from "react-icons/fa";
import { MdOutlineScience } from "react-icons/md";

const MainLayout = ({ children }) => {

  const selector = useSelector(SidebarSlicePath) || { collapsed: false, toggle: false };
  const dispatch = useDispatch();

  return (
    <div className="flex items-start lg:gap-x-2 ">
      <Sidebar collapsed={selector.collapsed} breakPoint="lg" toggled={selector.toggle}> <Menu className="mt-3">
          <MenuItem className="lg:hidden bg-white" onClick={() => dispatch(toggleSidebar())} > {selector.toggle ? <IoIosArrowDropright className="text-2xl" /> : <IoIosArrowDropleft className="text-2xl" />} </MenuItem>
          <MenuItem className="hover:bg-blue-100" component={<Link to="/" />} icon={<MdOutlineSpaceDashboard className="text-2xl" />}> Dashboard </MenuItem>
          <MenuItem component={<Link to="/chemistry" />} icon={<SlChemistry className="text-2xl" />}> Chemistry </MenuItem>
          <MenuItem component={<Link to="/physics" />} icon={<GiMaterialsScience className="text-2xl" />}> Physics </MenuItem>
          <MenuItem component={<Link to="/biology" />} icon={<RiMedicineBottleLine className="text-2xl" />}> Biology </MenuItem>
          <MenuItem component={<Link to="/botany" />} icon={<PiPlant className="text-2xl" />}> Botany </MenuItem>
          <MenuItem component={<Link to="/microbiology" />} icon={<FaVirus className="text-xl" />}> Microbiology </MenuItem>
          <MenuItem component={<Link to="/lifescience" />} icon={<MdOutlineScience className="text-2xl" />}> Life Science </MenuItem>
          <MenuItem icon={<BiSolidReport />}> Reports </MenuItem>
        </Menu>
      </Sidebar> <div className="w-full">
        {children}
      </div>
    </div>
  );
};

// biology, botany, life sceince, micro

// Define prop types
MainLayout.propTypes = {
  children: PropTypes.node.isRequired,};
  export default MainLayout;