import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { helix } from 'ldrs'
import "../Components/loader.css"



const ProtectedRoute = ({children}) => {
    
    helix.register()

    const {user, loading} = useAuth();
    if (loading) return <l-helix id="loader" size="45" speed="2.5" color="#3B82F6" ></l-helix>
    if (user) return children
    return <Navigate to={"/register"} />

};

export default ProtectedRoute;