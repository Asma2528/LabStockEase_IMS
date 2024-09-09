import PropTypes from 'prop-types'; // Import PropTypes
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserSlicePath } from '../provider/slice/user.slice';

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { role } = useSelector(UserSlicePath);

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

// Define prop types for the component
RoleBasedRoute.propTypes = {
    children: PropTypes.node.isRequired, // Ensures children is a valid React node
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired // Ensures allowedRoles is an array of strings
};

export default RoleBasedRoute;
