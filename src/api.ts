import axios from 'axios';

// Use your backend URL from Render
const API_URL = 'https://b-b-maintenances-services.onrender.com';

// Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Allow credentials
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all events
export const getEvents = async () => {
  try {
    const response = await axiosInstance.get('/api/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Fetch all payment summaries
export const getPaymentSummaries = async () => {
  try {
    const response = await axiosInstance.get('/api/payment_summaries');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment summaries:', error);
    throw error;
  }
};

// Add a new event
export const addEvent = async (office_id: number, employee_id: number, event_date: string) => {
  try {
    const response = await axiosInstance.post('/api/events', {
      office_id,
      employee_id,
      event_date,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};
