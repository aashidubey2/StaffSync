import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            const { token, user } = res.data;

            // Isolate session variables securely to current tab
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('userName', user.name);
            sessionStorage.setItem('userEmail', user.email);
            sessionStorage.setItem('userRole', user.role);

            // Redirect based on user role
            if (user.role === 'HR') {
                navigate('/hr-dashboard');
            } else if (user.role === 'Manager') {
                navigate('/manager-dashboard');
            } else {
                navigate('/employee-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#070a13', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            fontFamily: 'sans-serif',
            padding: '20px',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Ambient Background Glow Shapes */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '450px',
                height: '450px',
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, rgba(7, 10, 19, 0) 70%)',
                borderRadius: '50%',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-10%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, rgba(7, 10, 19, 0) 70%)',
                borderRadius: '50%',
                zIndex: 0
            }} />

            {/* Main Split Container */}
            <div style={{ 
                width: '100%', 
                maxWidth: '960px', 
                minHeight: '560px',
                backgroundColor: 'rgba(17, 24, 39, 0.65)', 
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)', 
                borderRadius: '24px', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                overflow: 'hidden',
                zIndex: 1
            }}>
                {/* Left Aesthetic Brand Panel */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(147, 51, 234, 0.2) 100%)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.06)',
                    padding: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                }}>
                    <div>
                        <div style={{ 
                            width: '44px', 
                            height: '44px', 
                            background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
                            borderRadius: '12px', 
                            marginBottom: '25px',
                            boxShadow: '0 10px 20px rgba(37, 99, 235, 0.4)'
                        }} />
                        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#f8fafc', letterSpacing: '-0.5px', lineHeight: '1.2', marginBottom: '15px' }}>
                            Welcome back to StaffSync.
                        </h2>
                        <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6' }}>
                            Manage workflows, live attendance, interactive multi-stage leave approvals, and enterprise announcements seamlessly in one unified platform.
                        </p>
                    </div>

                    <div>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                            <span style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
                            <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '500' }}>Enterprise MERN Cloud Active</span>
                        </div>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div style={{ 
                    padding: '50px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center' 
                }}>
                    <div style={{ marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '6px' }}>Sign In</h1>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Enter your credential details to continue</p>
                    </div>

                    {error && (
                        <div style={{ 
                            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                            border: '1px solid rgba(239, 68, 68, 0.3)', 
                            color: '#f87171', 
                            padding: '12px 16px', 
                            borderRadius: '10px', 
                            fontSize: '13px', 
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>Email Address</label>
                            <input 
                                type="email" 
                                placeholder="name@staffsync.com" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                style={{ 
                                    width: '100%', 
                                    padding: '14px 16px', 
                                    backgroundColor: 'rgba(7, 10, 19, 0.6)', 
                                    border: '1px solid #374151', 
                                    color: '#fff', 
                                    borderRadius: '10px', 
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'all 0.2s ease'
                                }} 
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#374151'}
                            />
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                style={{ 
                                    width: '100%', 
                                    padding: '14px 16px', 
                                    backgroundColor: 'rgba(7, 10, 19, 0.6)', 
                                    border: '1px solid #374151', 
                                    color: '#fff', 
                                    borderRadius: '10px', 
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'all 0.2s ease'
                                }} 
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#374151'}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ 
                                width: '100%', 
                                padding: '14px', 
                                backgroundColor: '#2563eb', 
                                backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '10px', 
                                fontWeight: 'bold', 
                                cursor: loading ? 'not-allowed' : 'pointer', 
                                fontSize: '15px',
                                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-1px)')}
                            onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '25px' }}>
                        <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: '#60a5fa', fontWeight: '600', textDecoration: 'none' }}>
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;