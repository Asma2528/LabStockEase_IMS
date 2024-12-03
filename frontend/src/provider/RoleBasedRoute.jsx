import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserSlicePath } from '../provider/slice/user.slice';

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { role } = useSelector(UserSlicePath);

    // console.log('Current user role:', role); // Log current role

    if (!allowedRoles.includes(role)) {
        // console.log(`Access denied for role: ${role}`); // Log access denial
        return <Navigate to="/unauthorized" />;
    }else {
        // console.log(`Access granted for role: ${role}`);
      }

    return children;
};

RoleBasedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default RoleBasedRoute;
