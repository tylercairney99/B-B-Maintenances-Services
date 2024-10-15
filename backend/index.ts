import express, { Request, Response, NextFunction } from 'express';
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow dynamic origins from multiple Vercel URLs
const allowedOrigins = [
  'https://b-b-maintenances-services.vercel.app', // Primary deployment
  'https://b-b-maintenances-services-1h3alu236-tylers-projects-f53a2000.vercel.app' // Alternate deployment
];

// CORS middleware with dynamic origin handling
app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')); // Block the request
      }
    },
    credentials: true, // Allow credentials (if needed for authentication)
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// MySQL connection pool configuration
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

// Logging MySQL config for troubleshooting
console.log('MySQL Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Error-handling middleware for CORS issues
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    console.error('Blocked by CORS policy:', req.headers.origin);
    return res.status(401).json({ error: 'CORS policy: Unauthorized origin' });
  }
  next(err);
});

// **Root Route** - Verify backend is running
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
    process.exit(1); // Exit the process on error
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
