
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


const RoleGuard = ({ children, roles }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (!user) {
        return <Navigate to="/" replace />
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }
    return children;
}

export default RoleGuard