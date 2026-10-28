const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Atlas Connected Successfully!'))
.catch((err) => console.error('MongoDB Connection Error:', err));

// User Schema & Model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Employee', 'Manager', 'HR'], default: 'Employee' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Leave Schema & Model
const leaveSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    reason: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending Manager', 'Pending HR', 'Approved', 'Rejected'], 
        default: 'Pending Manager' 
    },
    remarks: { type: String, default: '' }
}, { timestamps: true });

const Leave = mongoose.model('Leave', leaveSchema);

// Announcement Schema & Model
const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    target: { type: String, default: 'All' }
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', announcementSchema);

// Attendance Schema & Model
const attendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    status: { type: String, enum: ['Present', 'Absent'], default: 'Present' }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

// Training Schema & Model
const trainingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    trainerName: { type: String, required: true },
    assignedTo: { type: String, required: true }, // Employee Name or 'All'
    date: { type: String, required: true }
}, { timestamps: true });

const Training = mongoose.model('Training', trainingSchema);

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = verified; 
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

// REGISTER ROUTE
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'Employee'
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            name: user.name,    
            role: user.role,    
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// POST: Submit Leave Application
app.post('/api/leaves', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const newLeave = new Leave({
            employeeId: user._id,
            employeeName: user.name,
            employeeEmail: user.email,
            startDate,
            endDate,
            reason,
            status: 'Pending Manager'
        });

        await newLeave.save();
        res.status(201).json({ message: 'Leave application submitted successfully!', leave: newLeave });
    } catch (err) {
        res.status(500).json({ message: 'Server error during leave submission.' });
    }
});

// GET: Fetch Leaves for Logged-In Employee
app.get('/api/leaves/my-leaves', verifyToken, async (req, res) => {
    try {
        const leaves = await Leave.find({ employeeId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching leave applications.' });
    }
});

// GET: Manager - Fetch leaves pending manager review
app.get('/api/leaves/manager', verifyToken, async (req, res) => {
    try {
        const leaves = await Leave.find({ status: 'Pending Manager' }).sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching manager leave queue.' });
    }
});

// PUT: Manager - Action
app.put('/api/leaves/:id/manager-action', verifyToken, async (req, res) => {
    try {
        const { action, remarks } = req.body;
        const nextStatus = action === 'Approve' ? 'Pending HR' : 'Rejected';

        const updatedLeave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status: nextStatus, remarks: remarks || '' },
            { new: true }
        );

        res.status(200).json({ message: `Leave updated by manager.`, leave: updatedLeave });
    } catch (err) {
        res.status(500).json({ message: 'Error processing manager action.' });
    }
});

// GET: HR - Fetch leaves pending HR review
app.get('/api/leaves/hr', verifyToken, async (req, res) => {
    try {
        const leaves = await Leave.find({ status: 'Pending HR' }).sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching HR leave queue.' });
    }
});

// PUT: HR - Final Action
app.put('/api/leaves/:id/hr-action', verifyToken, async (req, res) => {
    try {
        const { action, remarks } = req.body;
        const finalStatus = action === 'Approve' ? 'Approved' : 'Rejected';

        const updatedLeave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status: finalStatus, remarks: remarks || '' },
            { new: true }
        );

        res.status(200).json({ message: `Leave final status: ${finalStatus}`, leave: updatedLeave });
    } catch (err) {
        res.status(500).json({ message: 'Error processing HR action.' });
    }
});

// ANNOUNCEMENT ROUTES
app.post('/api/announcements', verifyToken, async (req, res) => {
    try {
        const { title, message, target } = req.body;
        const newAnnouncement = new Announcement({ title, message, target: target || 'All' });
        await newAnnouncement.save();
        res.status(201).json({ message: 'Announcement broadcasted successfully!', announcement: newAnnouncement });
    } catch (err) {
        res.status(500).json({ message: 'Error creating announcement.' });
    }
});

app.get('/api/announcements', verifyToken, async (req, res) => {
    try {
        const announcements = await Announcement.find({
            $or: [{ target: 'All' }, { target: 'Employee' }]
        }).sort({ createdAt: -1 });
        res.status(200).json(announcements);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching announcements.' });
    }
});

// ATTENDANCE ROUTES
app.post('/api/attendance', verifyToken, async (req, res) => {
    try {
        const { date, checkIn, checkOut, status } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const newAttendance = new Attendance({
            employeeId: user._id,
            name: user.name,
            email: user.email,
            date,
            checkIn,
            checkOut,
            status
        });

        await newAttendance.save();
        res.status(201).json({ message: 'Attendance logged successfully!', attendance: newAttendance });
    } catch (err) {
        res.status(500).json({ message: 'Server error logging attendance.' });
    }
});

app.get('/api/attendance/my-attendance', verifyToken, async (req, res) => {
    try {
        const records = await Attendance.find({ employeeId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching attendance records.' });
    }
});

app.get('/api/attendance/all', verifyToken, async (req, res) => {
    try {
        const records = await Attendance.find().sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching all attendance records.' });
    }
});

// TRAINING ROUTES
app.post('/api/trainings', verifyToken, async (req, res) => {
    try {
        const { title, description, trainerName, assignedTo, date } = req.body;
        if (!title || !description || !trainerName || !assignedTo || !date) {
            return res.status(400).json({ message: 'All training fields are required.' });
        }

        const newTraining = new Training({ title, description, trainerName, assignedTo, date });
        await newTraining.save();
        res.status(201).json({ message: 'Training assigned successfully!', training: newTraining });
    } catch (err) {
        console.error('Error creating training:', err);
        res.status(500).json({ message: 'Server error creating training.' });
    }
});

app.get('/api/trainings', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const trainings = await Training.find({
            $or: [{ assignedTo: 'All' }, { assignedTo: user.name }]
        }).sort({ createdAt: -1 });

        res.status(200).json(trainings);
    } catch (err) {
        console.error('Error fetching trainings:', err);
        res.status(500).json({ message: 'Error fetching trainings.' });
    }
});

app.get('/api/trainings/all', verifyToken, async (req, res) => {
    try {
        const trainings = await Training.find().sort({ createdAt: -1 });
        res.status(200).json(trainings);
    } catch (err) {
        console.error('Error fetching manager trainings:', err);
        res.status(500).json({ message: 'Error fetching training list.' });
    }
});

// Users route for Employee Management dropdown/list
app.get('/api/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});