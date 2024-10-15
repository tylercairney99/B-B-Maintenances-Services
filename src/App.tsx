// App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CalendarView from './components/CalendarView';
import WeeklySummary from './components/WeeklySummary';
import PayPeriodsView from './components/PayPeriodsView';
import { EventInput } from '@fullcalendar/core';
import { getEvents } from './api';
import './styles/Global.css';
import './styles/Navbar.css'; // Import the new Navbar styles

const App: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [visibleRange, setVisibleRange] = useState<{ start: Date; end: Date } | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleDatesChange = (start: Date, end: Date) => {
    setVisibleRange({ start, end });
  };

  return (
    <Router>
      <div>
        <nav className="navbar">
          <h1>B&B Maintenances Services LLC</h1>
          <div>
            <Link to="/">Home</Link>
            <Link to="/pay-periods">Pay Periods</Link>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <CalendarView
                    events={events}
                    setEvents={setEvents}
                    onDatesChange={handleDatesChange}
                  />
                  {visibleRange && <WeeklySummary events={events} visibleRange={visibleRange} />}
                </>
              }
            />
            <Route path="/pay-periods" element={<PayPeriodsView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
