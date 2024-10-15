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
dotenv.config(); // Load environment variables
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express_1.default.json()); // Parse JSON request bodies
// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
console.log('MySQL Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});
// **Root Route**
app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});
// Route: Get all events
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
// Route: Add a new event
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
// Route: Fetch payment summaries
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
app.listen(PORT, (err) => {
    if (err) {
        console.error(`Failed to start server on port ${PORT}:`, err);
        process.exit(1); // Exit the process if it fails
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});
