const mysql = require('mysql2/promise');
require('dotenv').config();

const testDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      connectTimeout: 20000, // 20 seconds
    });

    console.log('Connected to the MySQL database!');
    const [rows] = await connection.query('SELECT 1 + 1 AS solution');
    console.log('Query result:', rows[0].solution);

    connection.end();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

testDB();
