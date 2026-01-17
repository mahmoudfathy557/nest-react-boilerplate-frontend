import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { useSignInMutation } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { signInSchema, type SignInInput } from '../features/auth/authSchemas';
import { z } from 'zod';

export const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [signIn, { isLoading }] = useSignInMutation();

    const [formData, setFormData] = useState<SignInInput>({
        email: '',
        password: '',
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});
        setApiError('');

        // Validate with Zod
        const result = signInSchema.safeParse(formData);

        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path.length > 0) {
                    errors[err.path[0].toString()] = err.message;
                }
            });
            setValidationErrors(errors);
            return;
        }

        try {
            const response = await signIn(result.data).unwrap();
            dispatch(setCredentials(response));
            navigate('/dashboard');
        } catch (err: any) {
            setApiError(err?.data?.message || 'Failed to sign in');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {validationErrors.email && <span>{validationErrors.email}</span>}
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {validationErrors.password && <span>{validationErrors.password}</span>}
            </div>

            {apiError && <div>{apiError}</div>}

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
        </form>
    );
};