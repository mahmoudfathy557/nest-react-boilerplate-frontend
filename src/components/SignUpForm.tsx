import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { useSignUpMutation } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { signUpSchema, type SignUpInput } from '../features/auth/authSchemas';

export const SignUpForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [signUp, { isLoading }] = useSignUpMutation();

    const [formData, setFormData] = useState<SignUpInput>({
        email: '',
        password: '',
        name: '',
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});
        setApiError('');

        // Validate with Zod
        const result = signUpSchema.safeParse(formData);

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
            const response = await signUp(result.data).unwrap();
            dispatch(setCredentials(response));
            navigate('/dashboard');
        } catch (err: any) {
            setApiError(err?.data?.message || 'Failed to sign up');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name (Optional)</label>
                <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {validationErrors.name && <span>{validationErrors.name}</span>}
            </div>

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
                {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
        </form>
    );
};