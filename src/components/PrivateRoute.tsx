import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
    children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { token } = useAppSelector((state) => state.auth);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};