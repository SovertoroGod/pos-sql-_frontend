
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


const RoleGuard = ({ children, roles }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/" replace />
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }
    return children;
}

export default RoleGuard