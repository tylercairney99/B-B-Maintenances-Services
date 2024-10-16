import axios from 'axios';

// Backend URL hosted on Render
const API_URL = 'https://b-b-maintenances-services.onrender.com';

// **Fetch All Events**
export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/events`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// **Add New Event**
export const addEvent = async (
  office_id: number,
  employee_id: number,
  event_date: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/events`,
      { office_id, employee_id, event_date },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};
