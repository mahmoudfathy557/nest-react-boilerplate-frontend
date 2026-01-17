import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user?.name || user?.email}!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};