import React from 'react'; // Ensure React is imported
// import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

const breadcrumbMap = {
  '/': 'Dashboard',
  '/chemistry': 'Chemistry',
  '/chemistry/chemicals': 'Chemicals',
  '/chemistry/chemicals/logs': 'Chemical Logs',
  '/chemistry/reagents': 'Reagents',
  '/chemistry/reagents/logs': 'Reagents Logs',
  '/chemistry/glassware': 'Glassware',
  '/chemistry/measuring': 'Measuring',
  '/chemistry/others': 'Others',
  '/physics': 'Physics',
  '/physics/instruments': 'Instruments',
  '/physics/materials': 'Materials',
  '/physics/electronics': 'Electronics',
  '/physics/optical': 'Optical',
  '/physics/others': 'Others',
  '/biology': 'Biology',
  '/biology/microscopes': 'Microscopes',
  '/biology/specimens': 'Specimens',
  '/biology/stains': 'Stains and Dyes',
  '/biology/dissection': 'Dissection Kits',
  '/biology/slides': 'Slides and Cover Slips',
  '/biology/others': 'Others',
  '/botany': 'Botany',
  '/botany/plant-specimens': 'Plant Specimens',
  '/botany/seeds': 'Seeds',
  '/botany/herbarium': 'Herbarium Sheets',
  '/botany/fertilizers': 'Fertilizers',
  '/botany/equipment': 'Botanical Equipment',
  '/botany/others': 'Others',
  '/microbiology': 'Microbiology',
  '/microbiology/cultures': 'Microbial Cultures',
  '/microbiology/petri-dishes': 'Petri Dishes',
  '/microbiology/agar-media': 'Agar Media',
  '/microbiology/incubators': 'Incubators',
  '/microbiology/sterilization': 'Sterilization',
  '/microbiology/others': 'Others',
  '/lifescience': 'Life Science',
  '/lifescience/chemicals': 'Chemicals',
  '/lifescience/specimens': 'Specimens',
  '/lifescience/equipment': 'Equipment',
  '/lifescience/others': 'Others',
};

const BreadCrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  const breadcrumbItems = pathnames.map((_, index) => {
    const pathname = `/${pathnames.slice(0, index + 1).join('/')}`;
    return {
      name: breadcrumbMap[pathname] || 'Unknown',
      link: pathname
    };
  });

  return (
    <div className="w-[86%] lg:w-[93%] mx-10 mt-2 mb-10 flex md:items-center md:justify-between flex-col md:flex-row">
      <h1 className='text-2xl font-semibold leading-tight'>{breadcrumbItems[breadcrumbItems.length - 1].name}</h1>
      <ul className="flex items-center gap-x-2 text-blue-500" aria-label="breadcrumb">
        <li><Link to="/">Dashboard</Link></li>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <li><span>/</span></li>
            <li>
              {index === breadcrumbItems.length - 1
                ? <span>{item.name}</span>
                : <Link to={item.link}>{item.name}</Link>}
            </li>
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default BreadCrumbs;
