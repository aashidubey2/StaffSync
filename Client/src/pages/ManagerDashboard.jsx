import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState('leaves'); // 'leaves' or 'training'
    const [leaves, setLeaves] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [employees, setEmployees] = useState([]);
    
    // Remarks state mapped by leave ID
    const [remarks, setRemarks] = useState({});
    
    // Training Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [trainerName, setTrainerName] = useState('');
    const [assignedTo, setAssignedTo] = useState('All');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    
    // Use sessionStorage to prevent cross-tab session leakage
    const userName = sessionStorage.getItem('userName') || 'Manager';

    useEffect(() => {
        fetchManagerLeaves();
        fetchTrainings();
        fetchEmployees();
    }, []);

    const fetchManagerLeaves = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/leaves/manager', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(res.data);
        } catch (err) {
            console.error('Error fetching manager leaves', err);
        }
    };

    const fetchTrainings = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/trainings/all', {
                headers: { Authorization: `Bearer ${token}` }
            }).catch(() => ({ data: [] }));
            setTrainings(res.data);
        } catch (err) {
            console.error('Error fetching trainings', err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(res.data);
        } catch (err) {
            console.error('Error fetching users', err);
        }
    };

    const handleManagerLeaveAction = async (id, action) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/leaves/${id}/manager-action`, 
                { 
                    action, 
                    remarks: remarks[id] || '' 
                }, 
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchManagerLeaves();
        } catch (err) {
            console.error('Error updating leave status', err);
            alert('Failed to process manager action.');
        }
    };

    const handleCreateTraining = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            await axios.post('http://localhost:5000/api/trainings', {
                title,
                description,
                trainerName,
                assignedTo,
                date
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Training created and assigned successfully!');
            setTitle('');
            setDescription('');
            setTrainerName('');
            setAssignedTo('All');
            setDate('');
            fetchTrainings();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to create training.');
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', borderBottom: '1px solid #1f2937', padding: '20px 40px', borderRadius: '8px', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f8fafc' }}>Manager Portal</h2>
                <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                    Logout
                </button>
            </div>

            <h1 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '24px', fontWeight: 'bold', color: '#f8fafc' }}>Welcome Back, {userName}</h1>
            <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '30px', fontSize: '14px' }}>Welcome to StaffSync Manager Portal!</p>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
                <button 
                    onClick={() => setActiveTab('leaves')} 
                    style={{ padding: '10px 20px', backgroundColor: activeTab === 'leaves' ? '#2563eb' : '#111827', color: '#fff', border: '1px solid #1f2937', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Leave Applications
                </button>
                <button 
                    onClick={() => setActiveTab('training')} 
                    style={{ padding: '10px 20px', backgroundColor: activeTab === 'training' ? '#16a34a' : '#111827', color: '#fff', border: '1px solid #1f2937', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Training & Development
                </button>
            </div>

            {/* Tab 1: Leave Applications */}
            {activeTab === 'leaves' && (
                <div style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '10px', border: '1px solid #1f2937', maxWidth: '1000px', margin: '0 auto' }}>
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #1f2937', paddingBottom: '10px', color: '#f8fafc' }}>Pending Team Leave Requests</h3>
                    {leaves.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>No pending leave requests from employees.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {leaves.map((leave) => (
                                <div key={leave._id} style={{ backgroundColor: '#0b0f19', padding: '20px', borderRadius: '8px', border: '1px solid #374151' }}>
                                    <p style={{ fontSize: '14px', marginBottom: '6px' }}><strong>Employee:</strong> <span style={{ color: '#cbd5e1' }}>{leave.employeeName}</span></p>
                                    <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}><strong>Email:</strong> {leave.employeeEmail}</p>
                                    <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}><strong>From:</strong> {leave.startDate} <strong>To:</strong> {leave.endDate}</p>
                                    <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '10px' }}><strong>Reason:</strong> {leave.reason}</p>
                                    <p style={{ fontSize: '13px', marginBottom: '15px' }}><strong>Status:</strong> <span style={{ color: '#facc15', fontWeight: 'bold' }}>{leave.status}</span></p>
                                    
                                    {/* Remarks Input */}
                                    <div style={{ marginBottom: '12px' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Add remarks (optional)" 
                                            value={remarks[leave._id] || ''}
                                            onChange={(e) => setRemarks({ ...remarks, [leave._id]: e.target.value })}
                                            style={{ width: '100%', padding: '10px', backgroundColor: '#111827', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleManagerLeaveAction(leave._id, 'Approve')} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                                            Approve (Send to HR)
                                        </button>
                                        <button onClick={() => handleManagerLeaveAction(leave._id, 'Reject')} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tab 2: Training & Development */}
            {activeTab === 'training' && (
                <div style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '10px', border: '1px solid #1f2937', maxWidth: '1000px', margin: '0 auto' }}>
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #1f2937', paddingBottom: '10px', color: '#f8fafc' }}>Training & Development</h3>
                    
                    {message && <p style={{ color: message.includes('success') ? '#4ade80' : '#f87171', marginBottom: '15px', fontSize: '14px' }}>{message}</p>}
                    
                    <form onSubmit={handleCreateTraining} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#cbd5e1' }}>Training Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Cloud Security" required style={{ width: '100%', padding: '10px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#cbd5e1' }}>Trainer Name</label>
                            <input type="text" value={trainerName} onChange={(e) => setTrainerName(e.target.value)} placeholder="e.g. Adnan Saif" required style={{ width: '100%', padding: '10px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#cbd5e1' }}>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Training session overview..." required rows="3" style={{ width: '100%', padding: '10px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#cbd5e1' }}>Assign To</label>
                            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }}>
                                <option value="All">All Employees</option>
                                {employees.filter(emp => emp.role === 'Employee').map(emp => (
                                    <option key={emp._id} value={emp.name}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#cbd5e1' }}>Date</label>
                            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="dd/mm/yyyy" required style={{ width: '100%', padding: '10px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                        </div>
                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" style={{ padding: '12px 30px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                                Create Training
                            </button>
                        </div>
                    </form>

                    <h4 style={{ marginBottom: '15px', color: '#f8fafc', fontSize: '16px' }}>Existing Trainings</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                        {trainings.length === 0 ? (
                            <p style={{ color: '#94a3b8', fontSize: '14px' }}>No trainings created yet.</p>
                        ) : (
                            trainings.map((t) => (
                                <div key={t._id} style={{ backgroundColor: '#0b0f19', padding: '15px', borderRadius: '8px', border: '1px solid #374151' }}>
                                    <h5 style={{ color: '#f8fafc', fontSize: '15px', marginBottom: '6px' }}>{t.title}</h5>
                                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: '8px 0' }}>{t.description}</p>
                                    <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}><strong>Trainer:</strong> {t.trainerName}</p>
                                    <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}><strong>Assigned To:</strong> {t.assignedTo}</p>
                                    <p style={{ fontSize: '12px', color: '#cbd5e1' }}><strong>Date:</strong> {t.date}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerDashboard;