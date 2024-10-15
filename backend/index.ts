import express, { Request, Response, NextFunction } from 'express';
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow dynamic origin from Vercel frontend deployments
const allowedOrigins = [
  'https://b-b-maintenances-services.vercel.app',
  'https://b-b-maintenances-services-1h3alu236-tylers-projects-f53a2000.vercel.app',
  'https://b-b-maintenances-services-5x74cl4v9-tylers-projects-f53a2000.vercel.app'
];

// **CORS Configuration**
app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      console.log(`Request from origin: ${origin}`); // Debugging line
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow request
      } else {
        console.error(`Blocked by CORS policy: ${origin}`); // Log the blocked origin
        callback(new Error('Not allowed by CORS')); // Block request
      }
    },
    credentials: true, // Allow cookies or credentials
  })
);

// Middleware to parse JSON
app.use(express.json());

// Error-handling middleware for CORS
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    console.error('CORS error:', err.message);
    return res.status(401).json({ error: 'CORS policy: Unauthorized origin' });
  }
  next(err);
});

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
});

console.log('MySQL Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// **Root Route** - Test if backend is running
app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running successfully!');
});

// **Get All Events**
app.get('/api/events', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// **Add New Event**
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

// **Fetch Payment Summaries**
app.get('/api/payment_summaries', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payment_summaries');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching payment summaries:', error);
    res.status(500).json({ error: 'Failed to fetch payment summaries' });
  }
});

// **Start the Server**
app.listen(PORT, (err?: Error) => {
  if (err) {
    console.error(`Failed to start server on port ${PORT}:`, err);
    process.exit(1); // Exit if there’s an error
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
