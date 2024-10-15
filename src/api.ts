import axios from 'axios';

// Use your Render backend URL here
const API_URL = 'https://b-b-maintenances-services.onrender.com';

// Fetch all events
export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/events`, {
      withCredentials: true, // Allow credentials to be sent
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Fetch all payment summaries
export const getPaymentSummaries = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/payment_summaries`, {
      withCredentials: true, // Allow credentials to be sent
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment summaries:', error);
    throw error;
  }
};

// Add a new event
export const addEvent = async (office_id: number, employee_id: number, event_date: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/events`,
      {
        office_id,
        employee_id,
        event_date,
      },
      {
        withCredentials: true, // Allow credentials to be sent
        headers: {
          'Content-Type': 'application/json', // Ensure JSON content-type
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};
