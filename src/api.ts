import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Update this if your backend is deployed

// Fetch all events
export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/events`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Fetch all payment summaries
export const getPaymentSummaries = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/payment_summaries`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment summaries:', error);
    throw error;
  }
};

// Add a new event
export const addEvent = async (office_id: number, employee_id: number, event_date: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/events`, {
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
