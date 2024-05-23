import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = () => {
    const isAuthenticated = useAuth();
    if (!isAuthenticated) {
        // Redirige al login si no hay token
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;