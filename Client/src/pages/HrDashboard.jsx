import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HrDashboard = () => {
    const [activeTab, setActiveTab] = useState('leaves'); 
    
    // Data states
    const [leaves, setLeaves] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);

    // Employee Management Form State
    const [empForm, setEmpForm] = useState({
        name: '',
        email: '',
        department: '',
        position: '',
        salary: '',
        joinDate: '',
        phone: '',
        address: ''
    });

    // Announcement Form State
    const [announcement, setAnnouncement] = useState({
        title: '',
        message: '',
        target: 'All'
    });
    const [announcementStatus, setAnnouncementStatus] = useState('');

    const navigate = useNavigate();
    const hrName = sessionStorage.getItem('userName') || sessionStorage.getItem('name') || 'HR Admin';

    useEffect(() => {
        fetchAllLeaves();
        fetchEmployees();
        fetchAllAttendance();
    }, []);

    const fetchAllLeaves = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/leaves/hr', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(res.data);
        } catch (err) {
            console.error('Error fetching HR leaves:', err);
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
            console.error('Error fetching employees from DB:', err);
        }
    };

    const fetchAllAttendance = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/attendance/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAttendance(res.data);
        } catch (err) {
            console.error('Error fetching attendance records:', err);
        }
    };

    const handleUpdateLeaveStatus = async (leaveId, status) => {
        try {
            const token = sessionStorage.getItem('token');
            const action = status === 'Approved' ? 'Approve' : 'Reject';
            
            await axios.put(`http://localhost:5000/api/leaves/${leaveId}/hr-action`, 
                { action, remarks: 'Final review by HR' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchAllLeaves();
        } catch (err) {
            alert('Failed to update leave status.');
        }
    };

    const handleAddEmployeeSubmit = (e) => {
        e.preventDefault();
        alert('Employee details added successfully!');
        setEmpForm({ name: '', email: '', department: '', position: '', salary: '', joinDate: '', phone: '', address: '' });
    };

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            await axios.post('http://localhost:5000/api/announcements', 
                announcement, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setAnnouncementStatus('Announcement broadcasted successfully!');
            setAnnouncement({ title: '', message: '', target: 'All' });
            setTimeout(() => setAnnouncementStatus(''), 3000);
        } catch (err) {
            console.error('Error broadcasting announcement:', err);
            setAnnouncementStatus('Failed to broadcast announcement.');
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', borderBottom: '1px solid #1f2937', padding: '20px 40px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f8fafc' }}>HR Portal — Welcome, {hrName}</h2>
                <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                    Logout
                </button>
            </div>

            <div style={{ padding: '30px 40px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#f8fafc' }}>HR Dashboard</h1>

                <div style={{ display: 'flex', gap: '35px', borderBottom: '1px solid #1f2937', paddingBottom: '12px', marginBottom: '30px' }}>
                    <button onClick={() => { setActiveTab('leaves'); fetchAllLeaves(); }} style={{ background: 'none', border: 'none', color: activeTab === 'leaves' ? '#fff' : '#94a3b8', fontSize: '15px', fontWeight: activeTab === 'leaves' ? 'bold' : 'normal', cursor: 'pointer', paddingBottom: '5px', borderBottom: activeTab === 'leaves' ? '2px solid #ef4444' : 'none' }}>Leave Applications</button>
                    <button onClick={() => { setActiveTab('employees'); fetchEmployees(); }} style={{ background: 'none', border: 'none', color: activeTab === 'employees' ? '#fff' : '#94a3b8', fontSize: '15px', fontWeight: activeTab === 'employees' ? 'bold' : 'normal', cursor: 'pointer', paddingBottom: '5px', borderBottom: activeTab === 'employees' ? '2px solid #ef4444' : 'none' }}>Employee Management</button>
                    <button onClick={() => setActiveTab('announcements')} style={{ background: 'none', border: 'none', color: activeTab === 'announcements' ? '#fff' : '#94a3b8', fontSize: '15px', fontWeight: activeTab === 'announcements' ? 'bold' : 'normal', cursor: 'pointer', paddingBottom: '5px', borderBottom: activeTab === 'announcements' ? '2px solid #ef4444' : 'none' }}>Announcements</button>
                    <button onClick={() => { setActiveTab('attendance'); fetchAllAttendance(); }} style={{ background: 'none', border: 'none', color: activeTab === 'attendance' ? '#fff' : '#94a3b8', fontSize: '15px', fontWeight: activeTab === 'attendance' ? 'bold' : 'normal', cursor: 'pointer', paddingBottom: '5px', borderBottom: activeTab === 'attendance' ? '2px solid #ef4444' : 'none' }}>Attendance</button>
                </div>

                {/* TAB 1: LEAVE APPLICATIONS */}
                {activeTab === 'leaves' && (
                    <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '30px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '25px', color: '#f8fafc' }}>Leave Applications Pending HR Review</h3>
                        
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #374151', color: '#94a3b8' }}>
                                        <th style={{ padding: '12px' }}>Employee</th>
                                        <th style={{ padding: '12px' }}>Email</th>
                                        <th style={{ padding: '12px' }}>Start Date</th>
                                        <th style={{ padding: '12px' }}>End Date</th>
                                        <th style={{ padding: '12px' }}>Reason</th>
                                        <th style={{ padding: '12px' }}>Status</th>
                                        <th style={{ padding: '12px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No leave applications pending HR review.</td>
                                        </tr>
                                    ) : (
                                        leaves.map((l) => (
                                            <tr key={l._id} style={{ borderBottom: '1px solid #1f2937' }}>
                                                <td style={{ padding: '15px', color: '#f8fafc' }}>{l.employeeName}</td>
                                                <td style={{ padding: '15px', color: '#94a3b8' }}>{l.employeeEmail}</td>
                                                <td style={{ padding: '15px', color: '#cbd5e1' }}>{l.startDate}</td>
                                                <td style={{ padding: '15px', color: '#cbd5e1' }}>{l.endDate}</td>
                                                <td style={{ padding: '15px', color: '#cbd5e1' }}>{l.reason}</td>
                                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#facc15' }}>{l.status}</td>
                                                <td style={{ padding: '15px' }}>
                                                    {l.status === 'Pending HR' ? (
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button onClick={() => handleUpdateLeaveStatus(l._id, 'Approved')} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Approve</button>
                                                            <button onClick={() => handleUpdateLeaveStatus(l._id, 'Rejected')} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Reject</button>
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#64748b', fontSize: '13px' }}>Completed</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 2: EMPLOYEE MANAGEMENT */}
                {activeTab === 'employees' && (
                    <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '30px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '25px', color: '#f8fafc' }}>Employee Management</h3>
                        
                        <form onSubmit={handleAddEmployeeSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <input type="text" placeholder="Name" value={empForm.name} onChange={(e) => setEmpForm({...empForm, name: e.target.value})} required style={{ padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                                <input type="email" placeholder="Email" value={empForm.email} onChange={(e) => setEmpForm({...empForm, email: e.target.value})} required style={{ padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                                <input type="text" placeholder="Department" value={empForm.department} onChange={(e) => setEmpForm({...empForm, department: e.target.value})} required style={{ padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                                <input type="text" placeholder="Position" value={empForm.position} onChange={(e) => setEmpForm({...empForm, position: e.target.value})} required style={{ padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                                <input type="text" placeholder="Salary" value={empForm.salary} onChange={(e) => setEmpForm({...empForm, salary: e.target.value})} required style={{ padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                                <input type="text" placeholder="dd/mm/yyyy" value={empForm.joinDate} onChange={(e) => setEmpForm({...empForm, joinDate: e.target.value})} required style={{ padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                                <input type="text" placeholder="Phone" value={empForm.phone} onChange={(e) => setEmpForm({...empForm, phone: e.target.value})} required style={{ padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                                <input type="text" placeholder="Address" value={empForm.address} onChange={(e) => setEmpForm({...empForm, address: e.target.value})} required style={{ padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px', gridColumn: 'span 2' }} />
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginBottom: '35px' }}>Add Employee</button>
                        </form>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #374151', color: '#94a3b8' }}>
                                        <th style={{ padding: '12px' }}>Name</th>
                                        <th style={{ padding: '12px' }}>Email</th>
                                        <th style={{ padding: '12px' }}>Department</th>
                                        <th style={{ padding: '12px' }}>Position</th>
                                        <th style={{ padding: '12px' }}>Role</th>
                                        <th style={{ padding: '12px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((emp, idx) => (
                                        <tr key={emp._id || idx} style={{ borderBottom: '1px solid #1f2937' }}>
                                            <td style={{ padding: '15px', color: '#f8fafc' }}>{emp.name}</td>
                                            <td style={{ padding: '15px', color: '#94a3b8' }}>{emp.email}</td>
                                            <td style={{ padding: '15px', color: '#cbd5e1' }}>{emp.department || 'General'}</td>
                                            <td style={{ padding: '15px', color: '#cbd5e1' }}>{emp.position || 'Staff'}</td>
                                            <td style={{ padding: '15px', color: '#60a5fa', fontWeight: 'bold' }}>{emp.role}</td>
                                            <td style={{ padding: '15px', display: 'flex', gap: '8px' }}>
                                                <button style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Edit</button>
                                                <button style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: ANNOUNCEMENTS */}
                {activeTab === 'announcements' && (
                    <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '30px', maxWidth: '800px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '25px', color: '#f8fafc' }}>Broadcast Announcement</h3>
                        {announcementStatus && <p style={{ color: '#4ade80', marginBottom: '15px', fontSize: '14px' }}>{announcementStatus}</p>}
                        
                        <form onSubmit={handleCreateAnnouncement}>
                            <div style={{ marginBottom: '20px' }}>
                                <input type="text" placeholder="Title" value={announcement.title} onChange={(e) => setAnnouncement({...announcement, title: e.target.value})} required style={{ width: '100%', padding: '14px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <textarea placeholder="Message" value={announcement.message} onChange={(e) => setAnnouncement({...announcement, message: e.target.value})} rows="5" required style={{ width: '100%', padding: '14px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <select value={announcement.target} onChange={(e) => setAnnouncement({...announcement, target: e.target.value})} style={{ padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px', width: '150px' }}>
                                    <option value="All">All</option>
                                    <option value="Employee">Employees</option>
                                    <option value="Manager">Managers</option>
                                </select>
                                <button type="submit" style={{ padding: '12px 30px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>Create</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB 4: ATTENDANCE */}
                {activeTab === 'attendance' && (
                    <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '30px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '25px', color: '#f8fafc' }}>Employee Attendance Records</h3>
                        
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #374151', color: '#94a3b8' }}>
                                        <th style={{ padding: '12px' }}>Employee</th>
                                        <th style={{ padding: '12px' }}>Email</th>
                                        <th style={{ padding: '12px' }}>Date</th>
                                        <th style={{ padding: '12px' }}>Check In</th>
                                        <th style={{ padding: '12px' }}>Check Out</th>
                                        <th style={{ padding: '12px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No attendance records found.</td>
                                        </tr>
                                    ) : (
                                        attendance.map((att) => (
                                            <tr key={att._id} style={{ borderBottom: '1px solid #1f2937' }}>
                                                <td style={{ padding: '15px', color: '#f8fafc' }}>{att.name}</td>
                                                <td style={{ padding: '15px', color: '#94a3b8' }}>{att.email}</td>
                                                <td style={{ padding: '15px', color: '#cbd5e1' }}>{att.date}</td>
                                                <td style={{ padding: '15px', color: '#cbd5e1' }}>{att.checkIn}</td>
                                                <td style={{ padding: '15px', color: '#cbd5e1' }}>{att.checkOut}</td>
                                                <td style={{ padding: '15px', color: att.status === 'Present' ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>{att.status}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HrDashboard;