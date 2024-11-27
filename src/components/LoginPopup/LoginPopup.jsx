import React, { useState } from 'react';
import './LoginPopup.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const LoginPopup = ({ setShowLogin, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and register modes

    const handleSubmit = async (event) => {
        event.preventDefault();

        // For registration, check if passwords match
        if (!isLogin && password !== confirmPassword) {
            Swal.fire({
                title: 'Error!',
                text: 'Passwords do not match.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        const endpoint = isLogin
            ? 'http://13.60.90.90:8000/api/login/'
            : 'http://13.60.90.90:8000/api/register/'; // Different endpoint for login vs register

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('access_token', data['token']);
                    setShowLogin(false);
                    setIsLoggedIn(true);

                    Swal.fire({
                        title: 'Success!',
                        text: 'You have logged in successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        navigate('/shipping'); // Navigate to the desired route
                    });
                } else {
                    // Handle successful registration
                    Swal.fire({
                        title: 'Success!',
                        text: 'Your account has been created successfully! Please log in.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        setIsLogin(true); // Switch back to login mode
                    });
                }
            } else {
                const errorMessage = data.message || (isLogin ? 'Login failed.' : 'Registration failed.');
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <div className="login">
            <div className="form-container">
                <button onClick={() => setShowLogin(false)} className="closebtn">
                    X
                </button>
                <div className="head">{isLogin ? 'Login' : 'Register'}</div>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    {!isLogin && (
                        <div className="form-control">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your password"
                            />
                        </div>
                    )}
                    <button type="submit" className="submitbtn">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <span style={{ color: 'grey', fontSize: '.9rem', marginTop: '20px' }}>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'blue',
                        }}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </span>
            </div>
        </div>
    );
};

export default LoginPopup;
