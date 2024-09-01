// import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
const BreadCrumbs = ({ PageName, PageLink }) => {
  return (
    <><div className="w-[86%] lg:w-[93%] mx-10 my-10 flex md:items-center md:justify-between flex-col md:flex-row">
    <h1 className='text-2xl font-semibold leading-tight'>{PageName}</h1>
    <ul className="flex items-center gap-x-2 text-blue-500">
      <li><span>Dashboard</span></li>
      <li><span>/</span></li>
      <li><Link to={PageLink}>{PageName}</Link></li>
    </ul>
  </div>
</>
);
};
BreadCrumbs.propTypes = {
PageName: PropTypes.string.isRequired,
PageLink: PropTypes.string.isRequired,
};
export default BreadCrumbs;