import React, { useState } from 'react';
import TimeDropdown from './TimeDropdown';
import '../styles/spacespot-timepicker.css';

const DAYS = [
  'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
];


function pad(num) {
  return num.toString().padStart(2, '0');
}

function to12Hour(time) {
  if (!time) return '';
  let [h, m] = time.split(':');
  h = parseInt(h, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}.${pad(m)} ${ampm}`;
}

function summarize(hours) {
  // Group consecutive days with same hours or closed
  let result = [];
  let group = null;
  for (let i = 0; i < DAYS.length; i++) {
    const day = DAYS[i];
    const val = hours[day];
    let str;
    if (!val || !val.open || !val.close) {
      str = 'Closed';
    } else {
      str = `${to12Hour(val.open)} - ${to12Hour(val.close)}`;
    }
    if (!group) {
      group = { start: day, end: day, str };
    } else if (group.str === str) {
      group.end = day;
    } else {
      result.push(group);
      group = { start: day, end: day, str };
    }
  }
  if (group) result.push(group);
  return result.map(g =>
    g.start === g.end
      ? `${g.start} ${g.str}`
      : `${g.start}-${g.end} ${g.str}`
  ).join(', ');
}

export default function TradingHoursInput({ value, onChange }) {
  const [hours, setHours] = useState(() => value || DAYS.reduce((acc, d) => ({ ...acc, [d]: { open: '', close: '' } }), {}));
  const [allOpen, setAllOpen] = useState('');
  const [allClose, setAllClose] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleChange = (day, field, val) => {
    const updated = {
      ...hours,
      [day]: { ...hours[day], [field]: val }
    };
    setHours(updated);
    if (onChange) onChange(updated, summarize(updated));
  };

  const setAllDays = () => {
    if (!allOpen || !allClose) return;
    const updated = { ...hours };
    DAYS.forEach(day => {
      updated[day] = { open: allOpen, close: allClose };
    });
    setHours(updated);
    if (onChange) onChange(updated, summarize(updated));
  };

  const copyToAllDays = (fromDay) => {
    const { open, close } = hours[fromDay];
    if (!open || !close) return;
    const updated = { ...hours };
    DAYS.forEach(day => {
      updated[day] = { open, close };
    });
    setHours(updated);
    if (onChange) onChange(updated, summarize(updated));
  };

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {/* All Days Row */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 6, marginLeft: 24 }}>
        <span style={{ width: 80, fontWeight: 600, fontSize: '12px', color: '#374151', letterSpacing: '0.01em', lineHeight: '32px', marginTop: 2, marginBottom: 2 }}>All Days</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 2 }}>Open</label>
            <TimeDropdown
              value={allOpen}
              onChange={setAllOpen}
              placeholder="Open"
              style={{ width: 120, minWidth: 120, marginBottom: 4 }}
            />
          </div>
          <span style={{ color: '#8fafc4', fontWeight: 500, fontSize: '13px', margin: '0 18px' }}>-</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 2 }}>Close</label>
            <TimeDropdown
              value={allClose}
              onChange={setAllClose}
              placeholder="Close"
              style={{ width: 120, minWidth: 120, marginBottom: 4 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end', marginLeft: 32, marginTop: 18 }}>
            <button type="button" style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 8, border: 'none', background: 'var(--spacespot-cyan-primary, #14D8CC)', color: '#fff', cursor: 'pointer', transition: 'background 0.2s', marginLeft: 0 }} onClick={setAllDays}>
              Apply
            </button>
            <button type="button" style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 8, border: 'none', background: '#eaf6f5', color: '#1a2b3c', cursor: 'pointer', transition: 'background 0.2s', marginLeft: 0 }} onClick={() => setShowDetails(v => !v)}>
              {showDetails ? 'Hide individual days' : 'Edit individual days'}
            </button>
          </div>
        </div>
      </div>
      {/* Per-day controls, collapsible */}
      {showDetails && (
        <div style={{ display: 'grid', gap: 4, background: '#f9fbfc', borderRadius: 8, padding: 8, marginLeft: 24 }}>
          {DAYS.map(day => {
            const isClosed = !hours[day].open && !hours[day].close;
            return (
              <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 80, minHeight: 32 }}>
                <span style={{ width: 38, fontWeight: 500, fontSize: '13px', color: '#374151' }}>{day}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 2 }}>Open</label>
                  <TimeDropdown
                    value={hours[day].open}
                    onChange={val => handleChange(day, 'open', val)}
                    placeholder="Open"
                    style={{ width: 100, background: isClosed ? '#f3f4f6' : '#fff', marginBottom: 4 }}
                    disabled={isClosed}
                  />
                </div>
                <span style={{ color: '#8fafc4', fontWeight: 500, fontSize: '13px', margin: '0 6px' }}>-</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 2 }}>Close</label>
                  <TimeDropdown
                    value={hours[day].close}
                    onChange={val => handleChange(day, 'close', val)}
                    placeholder="Close"
                    style={{ width: 100, background: isClosed ? '#f3f4f6' : '#fff', marginBottom: 4 }}
                    disabled={isClosed}
                  />
                </div>
                <button
                  type="button"
                  style={{ marginLeft: 6, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 8, border: 'none', background: isClosed ? '#eaf6f5' : '#e11d48', color: isClosed ? '#1a2b3c' : '#fff', cursor: 'pointer', transition: 'background 0.2s' }}
                  onClick={() => {
                    if (isClosed) {
                      // Re-enable, do nothing (user can set hours)
                    } else {
                      // Set as closed
                      handleChange(day, 'open', '');
                      handleChange(day, 'close', '');
                    }
                  }}
                >
                  {isClosed ? 'Closed' : 'Set Closed'}
                </button>
              </div>
            );
          })}
        </div>
      )}
      {/* No summary here; will be shown in Space Summary card */}
    </div>
  );
}

