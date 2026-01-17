import { Link } from 'react-router-dom';
import { SignUpForm } from '../components/SignUpForm';

export const SignUpPage = () => {
    return (
        <div>
            <h1>Sign Up</h1>
            <SignUpForm />
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};