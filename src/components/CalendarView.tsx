// CalendarView.tsx
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { addEvent } from '../api';
import '../styles/Calendar.css'; // Ensure the new styles are applied

interface CalendarViewProps {
  events: EventInput[];
  setEvents: React.Dispatch<React.SetStateAction<EventInput[]>>;
  onDatesChange: (start: Date, end: Date) => void;
}

const offices = ['Common Area', 'Office 108', 'Office 201', 'Office 302', 'Office 303', 'Office 304'];

const CalendarView: React.FC<CalendarViewProps> = ({ events, setEvents, onDatesChange }) => {
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);

  const handleDateClick = async (info: any) => {
    if (!selectedOffice) return alert('Please select an office first.');

    const isDuplicate = events.some(
      (event) => event.start === info.dateStr && event.title === selectedOffice
    );

    if (isDuplicate) {
      alert(`${selectedOffice} is already scheduled for this day.`);
      return;
    }

    const newEvent: EventInput = {
      id: `${info.dateStr}-${selectedOffice}`,
      title: selectedOffice,
      start: info.dateStr,
      allDay: true,
    };

    try {
      await addEvent(1, 1, info.dateStr);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    } catch (error) {
      console.error('Failed to add event:', error);
    }
  };

  const handleEventRemove = (info: any) => {
    const eventToRemove = info.event;
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventToRemove.id));
  };

  const handleDatesSet = (arg: any) => {
    const start = new Date(arg.start);
    const end = new Date(arg.end);
    onDatesChange(start, end);
  };

  return (
    <div className="calendar-layout">
      <div className="office-selection">
        <h3>Select an Office</h3>
        <select onChange={(e) => setSelectedOffice(e.target.value)} defaultValue="">
          <option value="" disabled>Select an office</option>
          {offices.map((office) => (
            <option key={office} value={office}>{office}</option>
          ))}
        </select>
      </div>

      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          editable={true}
          eventClick={handleEventRemove}
          datesSet={handleDatesSet}
        />
      </div>
    </div>
  );
};

export default CalendarView;
