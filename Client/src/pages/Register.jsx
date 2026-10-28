import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Employee');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role
            });

            alert('Registration successful! Please login with your credentials.');
            navigate('/login');

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0b0f19', fontFamily: 'sans-serif' }}>
            <form onSubmit={handleRegister} style={{ background: '#111827', border: '1px solid #1f2937', padding: '35px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: '380px' }}>
                
                <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#f8fafc', fontSize: '22px', fontWeight: 'bold' }}>
                    StaffSync Register
                </h2>
                
                {error && <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#cbd5e1', fontWeight: '500' }}>Full Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Enter your name"
                        required 
                        style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#cbd5e1', fontWeight: '500' }}>Email Address</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Enter your email"
                        required 
                        style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#cbd5e1', fontWeight: '500' }}>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter your password"
                        required 
                        style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#cbd5e1', fontWeight: '500' }}>Role</label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                    >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="HR">HR</option>
                    </select>
                </div>

                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginBottom: '20px', transition: 'background 0.2s' }}>
                    Register
                </button>

                <div style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
                    Already have an account? <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Login here</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;