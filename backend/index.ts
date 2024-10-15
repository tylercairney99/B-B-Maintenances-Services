import express, { Request, Response } from 'express';
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Allow dynamic origin from multiple frontend URLs (Vercel projects)
const allowedOrigins = [
  'https://b-b-maintenances-services.vercel.app',  // Main frontend
  'https://b-b-maintenances-services-1h3alu236-tylers-projects-f53a2000.vercel.app' // New deployment
];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  credentials: true, // Allow credentials (cookies or custom headers)
}));


app.use(express.json()); // Parse JSON request bodies

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
app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running successfully!');
});

// Route: Get all events
app.get('/api/events', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Route: Add a new event
app.post('/api/events', async (req: Request, res: Response) => {
  const { office_id, employee_id, event_date } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO events (office_id, employee_id, event_date) VALUES (?, ?, ?)',
      [office_id, employee_id, event_date]
    );
    res.status(201).json({ id: (result as any).insertId });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Failed to add event' });
  }
});

// Route: Fetch payment summaries
app.get('/api/payment_summaries', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payment_summaries');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching payment summaries:', error);
    res.status(500).json({ error: 'Failed to fetch payment summaries' });
  }
});

// Start the server
app.listen(PORT, (err?: Error) => {
  if (err) {
    console.error(`Failed to start server on port ${PORT}:`, err);
    process.exit(1); // Exit the process if it fails
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
