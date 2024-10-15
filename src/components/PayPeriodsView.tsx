// PayPeriodsView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import '../styles/Summary.css';

interface PayPeriod {
  work_date: string;
  total_hours: number;
  total_pay: number;
}

const FIRST_PAYDAY = new Date('2024-10-13');

const getPayPeriodStart = (endDate: Date): Date => {
  const start = new Date(endDate);
  start.setDate(endDate.getDate() - 13); // Move back 13 days for the pay period start
  return start;
};

const getNearestPayday = (date: Date): Date => {
  const diff = Math.ceil((date.getTime() - FIRST_PAYDAY.getTime()) / (14 * 86400000));
  return new Date(FIRST_PAYDAY.getTime() + (diff - 1) * 14 * 86400000); // Move to previous payday
};

const calculateBiweeklyTotals = (events: PayPeriod[], start: Date, end: Date) => {
  const totals: { periodStart: string; periodEnd: string; totalHours: number; totalPay: number }[] = [];
  let currentPayday = getNearestPayday(start);

  while (currentPayday <= end) {
    const periodStart = getPayPeriodStart(currentPayday);
    const nextPayday = new Date(currentPayday.getTime() + 14 * 86400000);

    const periodEvents = events.filter((event) => {
      const eventDate = new Date(event.work_date);
      return eventDate >= periodStart && eventDate <= currentPayday;
    });

    const totalHours = periodEvents.reduce((acc, event) => acc + event.total_hours, 0);
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

const PayPeriodsView: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [payPeriods, setPayPeriods] = useState<PayPeriod[]>([]);
  const [visibleRange, setVisibleRange] = useState<{ start: Date; end: Date } | null>(null);

  useEffect(() => {
    const fetchPayPeriods = async () => {
      try {
        const response = await axios.get(
          `/api/pay-periods/${year}/${month.toString().padStart(2, '0')}`
        );
        setPayPeriods(response.data);
      } catch (error) {
        console.error('Error fetching pay periods:', error);
      }
    };

    fetchPayPeriods();
  }, [year, month]);

  useEffect(() => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    setVisibleRange({ start, end });
  }, [year, month]);

  const biweeklyTotals = useMemo(() => {
    if (!visibleRange) return [];
    return calculateBiweeklyTotals(payPeriods, visibleRange.start, visibleRange.end);
  }, [payPeriods, visibleRange]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(Number(e.target.value));
  };

  return (
    <div className="pay-periods-container">
      <h2>Pay Periods</h2>

      <div className="selectors">
        <select value={year} onChange={handleYearChange}>
          {Array.from({ length: 5 }, (_, i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>

        <select value={month} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <div className="pay-period-list">
        {biweeklyTotals.length === 0 ? (
          <p>No pay periods found.</p>
        ) : (
          biweeklyTotals.map(({ periodStart, periodEnd, totalHours, totalPay }) => (
            <div key={periodEnd} className="pay-period">
              <h3>
                Period: {periodStart} - {periodEnd}
                <span className="payday-icon"> 💰 Payday!</span>
              </h3>
              <p>Total Hours: {totalHours}</p>
              <p>Total Pay: ${totalPay.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PayPeriodsView;
