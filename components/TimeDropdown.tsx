import React, { useEffect, useState } from 'react';

interface TimeDropdownProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
}

function parseTime12h(val: string) {
  if (!val) return { h: '', m: '', ampm: 'AM' };
  let [h, m] = val.split(':');
  h = h || '';
  m = m || '';
  let ampm = 'AM';
  let hour = parseInt(h, 10);
  if (!isNaN(hour)) {
    if (hour >= 12) {
      ampm = 'PM';
      if (hour > 12) hour -= 12;
    }
    if (hour === 0) hour = 12;
  }
  return { h: hour ? String(hour).padStart(2, '0') : '', m: m.padStart(2, '0'), ampm };
}

function to24h(h: string, m: string, ampm: string) {
  if (!h || !m) return '';
  let hour = parseInt(h, 10);
  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${m}`;
}

export default function TimeDropdown({ value, onChange, disabled, style, placeholder }: TimeDropdownProps) {
  const parsed = parseTime12h(value);
  const [h, setH] = useState(parsed.h);
  const [m, setM] = useState(parsed.m);
  const [ampm, setAMPM] = useState(parsed.ampm);
  useEffect(() => {
    // Sync with parent value if it changes externally
    const p = parseTime12h(value);
    setH(p.h);
    setM(p.m);
    setAMPM(p.ampm);
    // eslint-disable-next-line
  }, [value]);

  useEffect(() => {
    if (h && m && ampm) {
      onChange(to24h(h, m, ampm));
    } else {
      onChange('');
    }
    // eslint-disable-next-line
  }, [h, m, ampm]);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const mins = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center', ...style }}>
      <select
        value={h}
        onChange={e => setH(e.target.value)}
        disabled={disabled}
        style={{ width: 52, fontSize: 13, fontWeight: 600, borderRadius: 6, border: '1px solid #cfd7e2', background: disabled ? '#f3f4f6' : '#fff', color: '#1f2937', padding: '5px 18px 5px 2px', textAlign: 'center' }}
        aria-label="Hour"
      >
        <option value="">HH</option>
        {hours.map(hr => <option key={hr} value={hr}>{hr}</option>)}
      </select>
      <span style={{ fontWeight: 600, color: '#8fafc4', fontSize: 13, margin: '0 1px' }}>:</span>
      <select
        value={m}
        onChange={e => setM(e.target.value)}
        disabled={disabled}
        style={{ width: 52, fontSize: 13, fontWeight: 600, borderRadius: 6, border: '1px solid #cfd7e2', background: disabled ? '#f3f4f6' : '#fff', color: '#1f2937', padding: '5px 18px 5px 2px', textAlign: 'center' }}
        aria-label="Minute"
      >
        <option value="">MM</option>
        {mins.map(min => <option key={min} value={min}>{min}</option>)}
      </select>
      <select
        value={ampm}
        onChange={e => setAMPM(e.target.value)}
        disabled={disabled}
        style={{ width: 60, fontSize: 13, fontWeight: 600, borderRadius: 6, border: '1px solid #cfd7e2', background: disabled ? '#f3f4f6' : '#fff', color: '#1f2937', padding: '5px 18px 5px 2px', textAlign: 'center' }}
        aria-label="AM/PM"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}
