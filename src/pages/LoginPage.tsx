import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
    return (
        <div>
            <h1>Login</h1>
            <LoginForm />
            <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
};