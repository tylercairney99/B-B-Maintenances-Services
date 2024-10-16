"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
// Load environment variables
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// **Allow All Requests (Temporary)**
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept'],
}));
// Optionally, handle OPTIONS requests globally
app.options('*', cors());
// Middleware to parse JSON
app.use(express_1.default.json());
// **MySQL Pool Configuration**
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, // 10 seconds
});
console.log('MySQL Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});
// **Root Route** - Test if backend is running
app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});
// **Test Database Connection Route**
app.get('/api/db-test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield pool.getConnection();
        yield connection.ping(); // Test the connection
        connection.release();
        res.send('Database connection successful!');
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
}));
// **Get All Events**
app.get('/api/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield pool.query('SELECT * FROM events');
        res.json(rows);
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}));
// **Add New Event**
app.post('/api/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { office_id, employee_id, event_date } = req.body;
    try {
        const [result] = yield pool.query('INSERT INTO events (office_id, employee_id, event_date) VALUES (?, ?, ?)', [office_id, employee_id, event_date]);
        res.status(201).json({ id: result.insertId });
    }
    catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: 'Failed to add event' });
    }
}));
// **Fetch Payment Summaries**
app.get('/api/payment_summaries', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield pool.query('SELECT * FROM payment_summaries');
        res.json(rows);
    }
    catch (error) {
        console.error('Error fetching payment summaries:', error);
        res.status(500).json({ error: 'Failed to fetch payment summaries' });
    }
}));
// **Start the Server**
app.listen(PORT, (err) => {
    if (err) {
        console.error(`Failed to start server on port ${PORT}:`, err);
        process.exit(1); // Exit if there’s an error
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});
