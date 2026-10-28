import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
    const [activeTab, setActiveTab] = useState('announcements'); 
    const [announcements, setAnnouncements] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [attendance, setAttendance] = useState([]);
    
    // Leave Application Form State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [leaveMessage, setLeaveMessage] = useState('');

    // Attendance Form State
    const [attForm, setAttForm] = useState({
        date: '',
        checkIn: '',
        checkOut: '',
        status: 'Present'
    });
    const [attMessage, setAttMessage] = useState('');

    const navigate = useNavigate();
    
    const userName = sessionStorage.getItem('userName') || 'Employee';
    const userEmail = sessionStorage.getItem('userEmail') || 'Not available';
    const userRole = sessionStorage.getItem('userRole') || 'Employee';

    useEffect(() => {
        fetchMyLeaves(); 
        fetchAnnouncements(); 
        fetchMyAttendance();
        fetchTrainings(); // Fetch live assigned trainings from database
    }, []);

    const fetchMyLeaves = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/leaves/my-leaves', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(res.data);
        } catch (err) {
            console.error('Error fetching employee leaves:', err);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/announcements', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnnouncements(res.data);
        } catch (err) {
            console.error('Error fetching announcements:', err);
        }
    };

    const fetchTrainings = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/trainings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrainings(res.data);
        } catch (err) {
            console.error('Error fetching trainings:', err);
        }
    };

    const fetchMyAttendance = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/attendance/my-attendance', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAttendance(res.data);
        } catch (err) {
            console.error('Error fetching attendance:', err);
        }
    };

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        setLeaveMessage('');

        try {
            const token = sessionStorage.getItem('token');
            await axios.post('http://localhost:5000/api/leaves', 
                { startDate, endDate, reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setLeaveMessage('Leave application submitted successfully!');
            setStartDate('');
            setEndDate('');
            setReason('');
            fetchMyLeaves();
        } catch (err) {
            setLeaveMessage(err.response?.data?.message || 'Failed to submit leave application.');
        }
    };

    const handleLogAttendance = async (e) => {
        e.preventDefault();
        setAttMessage('');

        try {
            const token = sessionStorage.getItem('token');
            await axios.post('http://localhost:5000/api/attendance', 
                attForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAttMessage('Attendance logged successfully!');
            setAttForm({ date: '', checkIn: '', checkOut: '', status: 'Present' });
            fetchMyAttendance();
        } catch (err) {
            setAttMessage('Failed to log attendance.');
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved':
            case 'Present':
                return { bg: 'rgba(74, 222, 128, 0.15)', color: '#4ade80' };
            case 'Rejected':
            case 'Absent':
                return { bg: 'rgba(248, 113, 113, 0.15)', color: '#f87171' };
            case 'Pending HR':
                return { bg: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa' };
            case 'Pending Manager':
            default:
                return { bg: 'rgba(250, 204, 21, 0.15)', color: '#facc15' };
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', borderBottom: '1px solid #1f2937', padding: '20px 40px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f8fafc' }}>Employee Portal — Welcome, {userName}</h2>
                <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                    Logout
                </button>
            </div>

            <div style={{ padding: '30px 40px' }}>
                <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid #1f2937', paddingBottom: '12px', marginBottom: '30px' }}>
                    <button onClick={() => { setActiveTab('announcements'); fetchAnnouncements(); fetchTrainings(); }} style={{ background: 'none', border: 'none', color: activeTab === 'announcements' ? '#fff' : '#94a3b8', fontSize: '15px', fontWeight: activeTab === 'announcements' ? 'bold' : 'normal', cursor: 'pointer', paddingBottom: '5px', borderBottom: activeTab === 'announcements' ? '2px solid #ef4444' : 'none' }}>Announcements</button>
                    <button onClick={() => { setActiveTab('leaves'); fetchMyLeaves(); }} style={{ background: 'none', border: 'none', color: activeTab === 'leaves' ? '#fff' : '#94a3b8', fontSize: '15px', fontWeight: activeTab === 'leaves' ? 'bold' : 'normal', cursor: 'pointer', paddingBottom: '5px', borderBottom: activeTab === 'leaves' ? '2px solid #ef4444' : 'none' }}>Leaves</button>
                    <button onClick={() => { setActiveTab('attendance'); fetchMyAttendance(); }} style={{ background: 'none', border: 'none', color: activeTab === 'attendance' ? '#fff' : '#94a3b8', fontSize: '15px', fontWeight: activeTab === 'attendance' ? 'bold' : 'normal', cursor: 'pointer', paddingBottom: '5px', borderBottom: activeTab === 'attendance' ? '2px solid #ef4444' : 'none' }}>Attendance</button>
                    <button onClick={() => setActiveTab('profile')} style={{ background: 'none', border: 'none', color: activeTab === 'profile' ? '#fff' : '#94a3b8', fontSize: '15px', fontWeight: activeTab === 'profile' ? 'bold' : 'normal', cursor: 'pointer', paddingBottom: '5px', borderBottom: activeTab === 'profile' ? '2px solid #ef4444' : 'none' }}>Profile</button>
                </div>

                {/* TAB 1: ANNOUNCEMENTS & TRAININGS */}
                {activeTab === 'announcements' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '25px', minHeight: '220px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#f8fafc' }}>Announcements</h3>
                            {announcements.length === 0 ? (
                                <p style={{ color: '#94a3b8', fontSize: '14px' }}>No announcements available.</p>
                            ) : (
                                announcements.map((a) => (
                                    <div key={a._id} style={{ backgroundColor: '#0b0f19', border: '1px solid #374151', borderRadius: '8px', padding: '15px', marginBottom: '12px' }}>
                                        <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '6px' }}>{a.title}</h4>
                                        <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>{a.message}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '25px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#f8fafc' }}>Trainings</h3>
                            {trainings.length === 0 ? (
                                <p style={{ color: '#94a3b8', fontSize: '14px' }}>No assigned trainings available.</p>
                            ) : (
                                trainings.map((t) => (
                                    <div key={t._id} style={{ backgroundColor: '#0b0f19', border: '1px solid #374151', borderRadius: '8px', padding: '18px', marginBottom: '12px' }}>
                                        <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#f8fafc' }}>{t.title}</h4>
                                        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>{t.description}</p>
                                        <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}><strong>Trainer:</strong> {t.trainerName}</p>
                                        <p style={{ fontSize: '12px', color: '#cbd5e1' }}><strong>Date:</strong> {t.date}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: LEAVES */}
                {activeTab === 'leaves' && (
                    <div>
                        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '25px', marginBottom: '30px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#f8fafc' }}>Apply for Leave</h3>
                            {leaveMessage && <p style={{ color: leaveMessage.includes('success') ? '#4ade80' : '#f87171', marginBottom: '15px', fontSize: '14px' }}>{leaveMessage}</p>}
                            
                            <form onSubmit={handleApplyLeave}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#cbd5e1' }}>Start Date</label>
                                        <input type="text" placeholder="dd/mm/yyyy" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#cbd5e1' }}>End Date</label>
                                        <input type="text" placeholder="dd/mm/yyyy" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#cbd5e1' }}>Reason</label>
                                    <textarea placeholder="Reason for leave" value={reason} onChange={(e) => setReason(e.target.value)} rows="3" required style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                                </div>
                                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Apply Leave</button>
                            </form>
                        </div>

                        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '25px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#f8fafc' }}>My Leaves</h3>
                            {leaves.length === 0 ? (
                                <p style={{ color: '#94a3b8', fontSize: '14px' }}>No leave applications submitted yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {leaves.map((l) => {
                                        const style = getStatusStyle(l.status);
                                        return (
                                            <div key={l._id} style={{ backgroundColor: '#0b0f19', border: '1px solid #374151', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '6px', color: '#f8fafc' }}>{l.startDate} → {l.endDate}</h4>
                                                    <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}><strong>Reason:</strong> {l.reason}</p>
                                                    {l.remarks && <p style={{ fontSize: '12px', color: '#60a5fa' }}><strong>Remarks:</strong> {l.remarks}</p>}
                                                </div>
                                                <span style={{ backgroundColor: style.bg, color: style.color, padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>{l.status}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 3: ATTENDANCE */}
                {activeTab === 'attendance' && (
                    <div>
                        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '25px', marginBottom: '30px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#f8fafc' }}>Log Attendance</h3>
                            {attMessage && <p style={{ color: attMessage.includes('success') ? '#4ade80' : '#f87171', marginBottom: '15px', fontSize: '14px' }}>{attMessage}</p>}
                            
                            <form onSubmit={handleLogAttendance}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#cbd5e1' }}>Date</label>
                                        <input type="text" placeholder="dd/mm/yyyy" value={attForm.date} onChange={(e) => setAttForm({...attForm, date: e.target.value})} required style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#cbd5e1' }}>Check In</label>
                                        <input type="text" placeholder="9:00 AM" value={attForm.checkIn} onChange={(e) => setAttForm({...attForm, checkIn: e.target.value})} required style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#cbd5e1' }}>Check Out</label>
                                        <input type="text" placeholder="5:00 PM" value={attForm.checkOut} onChange={(e) => setAttForm({...attForm, checkOut: e.target.value})} required style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#cbd5e1' }}>Status</label>
                                        <select value={attForm.status} onChange={(e) => setAttForm({...attForm, status: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #374151', color: '#fff', borderRadius: '6px', fontSize: '14px' }}>
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Submit Attendance</button>
                            </form>
                        </div>

                        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '25px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#f8fafc' }}>My Attendance History</h3>
                            {attendance.length === 0 ? (
                                <p style={{ color: '#94a3b8', fontSize: '14px' }}>No attendance records found.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {attendance.map((att) => {
                                        const style = getStatusStyle(att.status);
                                        return (
                                            <div key={att._id} style={{ backgroundColor: '#0b0f19', border: '1px solid #374151', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '6px', color: '#f8fafc' }}>{att.date}</h4>
                                                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>Check In: {att.checkIn} | Check Out: {att.checkOut}</p>
                                                </div>
                                                <span style={{ backgroundColor: style.bg, color: style.color, padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{att.status}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 4: PROFILE */}
                {activeTab === 'profile' && (
                    <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '25px', maxWidth: '600px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#f8fafc' }}>My Profile</h3>
                        <div style={{ backgroundColor: '#0b0f19', border: '1px solid #374151', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <p style={{ fontSize: '14px' }}><strong>Name:</strong> <span style={{ color: '#cbd5e1' }}>{userName}</span></p>
                            <p style={{ fontSize: '14px' }}><strong>Email:</strong> <span style={{ color: '#cbd5e1' }}>{userEmail}</span></p>
                            <p style={{ fontSize: '14px' }}><strong>Role:</strong> <span style={{ color: '#cbd5e1' }}>{userRole}</span></p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeDashboard;