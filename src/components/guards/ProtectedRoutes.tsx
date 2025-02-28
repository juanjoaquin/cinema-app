import React, { useEffect, useState } from 'react'
import { getUserData } from '../../services/authService';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProp {
    children: React.ReactNode;
}

export const ProtectedRoutes: React.FC<ProtectedRouteProp> = ({ children }) => {

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await getUserData();
                if (userData) {
                    setUser(userData)
                }
            } catch (error) {
                console.log('Error verified user', error)
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
    checkAuth();
    }, [])

    if (loading) return <div>Loading...</div>; 

    if (!user) return <Navigate to="/auth/login" replace />;
  
    return <>{children}</>;
}
