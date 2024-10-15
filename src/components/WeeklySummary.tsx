import React, { useMemo } from 'react';
import { EventInput } from '@fullcalendar/core';
import '../styles/Summary.css';

interface WeeklySummaryProps {
  events: EventInput[];
  visibleRange: { start: Date; end: Date };
}

const officeHours: { [key: string]: number } = {
  'Common Area': 0.5,
  'Office 108': 1.5,
  'Office 201': 1,
  'Office 302': 3,
  'Office 303': 2,
  'Office 304': 1,
};

const FIRST_PAYDAY = new Date('2024-10-13');

const getPayPeriodStart = (endDate: Date): Date => {
  const start = new Date(endDate);
  start.setDate(endDate.getDate() - 13);
  return start;
};

const getNearestPayday = (date: Date): Date => {
  const diff = Math.ceil((date.getTime() - FIRST_PAYDAY.getTime()) / (14 * 86400000));
  return new Date(FIRST_PAYDAY.getTime() + (diff - 1) * 14 * 86400000);
};

const calculateBiweeklyTotals = (
  events: EventInput[],
  visibleRange: { start: Date; end: Date }
) => {
  const { start, end } = visibleRange;
  const totals: { periodStart: string; periodEnd: string; totalHours: number; totalPay: number }[] = [];

  let currentPayday = getNearestPayday(start);

  while (currentPayday <= end) {
    const periodStart = getPayPeriodStart(currentPayday);
    const nextPayday = new Date(currentPayday.getTime() + 14 * 86400000);

    const periodEvents = events.filter((event) => {
      const eventDate = new Date(event.start as string);
      return eventDate >= periodStart && eventDate <= currentPayday;
    });

    const totalHours = periodEvents.reduce(
      (acc, event) => acc + (officeHours[event.title!] || 0),
      0
    );
    const totalPay = totalHours * 21;

    totals.push({
      periodStart: periodStart.toISOString().split('T')[0],
      periodEnd: currentPayday.toISOString().split('T')[0],
      totalHours,
      totalPay,
    });

    currentPayday = nextPayday;
  }

  return totals;
};

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ events, visibleRange }) => {
  const biweeklyTotals = useMemo(
    () => calculateBiweeklyTotals(events, visibleRange),
    [events, visibleRange]
  );

  return (
    <div className="summary-container">
      <h2 className="summary-title">Biweekly Payment Summary</h2>
      <div className="title-divider"></div>
      {biweeklyTotals.map(({ periodStart, periodEnd, totalHours, totalPay }) => (
        <div key={periodEnd} className="biweekly-summary">
          <div>
            <h3>Period: {periodStart} - {periodEnd}</h3>
            <p>Total Hours: {totalHours}</p>
            <p>Total Pay: ${totalPay.toFixed(2)}</p>
          </div>
          <div className="payday-section">
            <div className="payday-icon">
              <img src="/money%20logo.png" alt="Payday Icon" />
            </div>
            <span className="payment-date">Payday: {periodEnd}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeeklySummary;
