import PropTypes from 'prop-types';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { SlChemistry } from "react-icons/sl";
import { GiMaterialsScience } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import '../index.css';
import { SidebarSlicePath, toggleSidebar } from '../provider/slice/Sidebar.slice';
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
      <Sidebar collapsed={selector.collapsed} breakPoint="lg" toggled={selector.toggle}>
        <Menu className="mt-3">
          <MenuItem className="lg:hidden bg-white" onClick={() => dispatch(toggleSidebar())} >
            {selector.toggle ? <IoIosArrowDropright className="text-2xl" /> : <IoIosArrowDropleft className="text-2xl" />}
          </MenuItem>

          <MenuItem className="hover:bg-blue-100" component={<Link to="/" />} icon={<MdOutlineSpaceDashboard className="text-2xl" />}>
            Dashboard
          </MenuItem>

          {/* Chemistry SubMenu */}
          <SubMenu label="Chemistry" icon={<SlChemistry className="text-2xl" />}>
            <MenuItem component={<Link to="/chemistry" />}>Dashboard</MenuItem>
            <MenuItem component={<Link to="/chemistry/chemicals" />}>Chemicals</MenuItem>
            <MenuItem component={<Link to="/chemistry/reagants" />}>Reagants</MenuItem>
            <MenuItem component={<Link to="/chemistry/glassware" />}>Glassware</MenuItem>
            <MenuItem component={<Link to="/chemistry/measuring" />}>Measuring</MenuItem>
            <MenuItem component={<Link to="/chemistry/others" />}>Others</MenuItem>
          </SubMenu>

          {/* Physics SubMenu */}
          <SubMenu label="Physics" icon={<GiMaterialsScience className="text-2xl" />}>
            <MenuItem component={<Link to="/physics" />}>Dashboard</MenuItem>
            <MenuItem component={<Link to="/physics/instruments" />}>Instruments</MenuItem>
            <MenuItem component={<Link to="/physics/materials" />}>Materials</MenuItem>
            <MenuItem component={<Link to="/physics/electronics" />}>Electronics</MenuItem>
            <MenuItem component={<Link to="/physics/optical" />}>Optical</MenuItem>
            <MenuItem component={<Link to="/physics/others" />}>Others</MenuItem>
          </SubMenu>

          {/* Biology SubMenu */}
          <SubMenu label="Biology" icon={<RiMedicineBottleLine className="text-2xl" />}>
            <MenuItem component={<Link to="/biology" />}>Dashboard</MenuItem>
            <MenuItem component={<Link to="/biology/microscopes" />}>Microscopes</MenuItem>
            <MenuItem component={<Link to="/biology/specimens" />}>Specimens</MenuItem>
            <MenuItem component={<Link to="/biology/stains" />}>Stains and Dyes</MenuItem>
            <MenuItem component={<Link to="/biology/dissection" />}>Dissection Kits</MenuItem>
            <MenuItem component={<Link to="/biology/slides" />}>Slides and Cover Slips</MenuItem>
            <MenuItem component={<Link to="/biology/others" />}>Others</MenuItem>
          </SubMenu>

          {/* Botany SubMenu */}
          <SubMenu label="Botany" icon={<PiPlant className="text-2xl" />}>
            <MenuItem component={<Link to="/botany" />}>Dashboard</MenuItem>
            <MenuItem component={<Link to="/botany/plant-specimens" />}>Plant Specimens</MenuItem>
            <MenuItem component={<Link to="/botany/seeds" />}>Seeds</MenuItem>
            <MenuItem component={<Link to="/botany/herbarium" />}>Herbarium Sheets</MenuItem>
            <MenuItem component={<Link to="/botany/fertilizers" />}>Fertilizers</MenuItem>
            <MenuItem component={<Link to="/botany/equipment" />}>Botanical Equipment</MenuItem>
            <MenuItem component={<Link to="/botany/others" />}>Others</MenuItem>
          </SubMenu>

          {/* Microbiology SubMenu */}
          <SubMenu label="Microbiology" icon={<FaVirus className="text-xl" />}>
            <MenuItem component={<Link to="/microbiology" />}>Dashboard</MenuItem>
            <MenuItem component={<Link to="/microbiology/cultures" />}>Microbial Cultures</MenuItem>
            <MenuItem component={<Link to="/microbiology/petri-dishes" />}>Petri Dishes</MenuItem>
            <MenuItem component={<Link to="/microbiology/agar-media" />}>Agar Media</MenuItem>
            <MenuItem component={<Link to="/microbiology/incubators" />}>Incubators</MenuItem>
            <MenuItem component={<Link to="/microbiology/sterilization" />}>Sterilization</MenuItem>
            <MenuItem component={<Link to="/microbiology/others" />}>Others</MenuItem>
          </SubMenu>

          {/* Life Science SubMenu */}
          <SubMenu label="Life Science" icon={<MdOutlineScience className="text-2xl" />}>
            <MenuItem component={<Link to="/lifescience" />}>Dashboard</MenuItem>
            <MenuItem component={<Link to="/lifescience/chemicals" />}>Chemicals</MenuItem>
            <MenuItem component={<Link to="/lifescience/specimens" />}>Specimens</MenuItem>
            <MenuItem component={<Link to="/lifescience/equipment" />}>Equipment</MenuItem>
            <MenuItem component={<Link to="/lifescience/others" />}>Others</MenuItem>
          </SubMenu>

        </Menu>
      </Sidebar>

      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

// Define prop types
MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
