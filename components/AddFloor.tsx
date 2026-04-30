import React, { useState } from 'react';

// Style constants from CreateSpace for consistency
const NAVY = '#1a2b3c';
const CYAN = 'var(--spacespot-cyan-primary, #14D8CC)';
const labelStyle: React.CSSProperties = {
  fontSize: '12px', color: '#374151', fontWeight: 600,
  marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px',
};
const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid #cfd7e2', borderRadius: '6px',
  padding: '9px 12px', fontSize: '13px', color: '#1f2937',
  backgroundColor: '#f9fbfc', outline: 'none', boxSizing: 'border-box',
};
const chipStyle: React.CSSProperties = {
  padding: '6px 14px', backgroundColor: '#eaf6f5',
  border: '1px solid #b2e0dc', borderRadius: '20px',
  fontSize: '12px', fontWeight: 600, color: NAVY, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: '6px',
};

type AddFloorProps = {
  aboveCount: number;
  setAboveCount: React.Dispatch<React.SetStateAction<number>>;
  undergroundCount: number;
  setUndergroundCount: React.Dispatch<React.SetStateAction<number>>;
};

export default function AddFloor({ aboveCount, setAboveCount, undergroundCount, setUndergroundCount }: AddFloorProps) {
  const [aboveFloors, setAboveFloors] = useState<string[]>([]);
  const [undergroundFloors, setUndergroundFloors] = useState<string[]>([]);
  const [editing, setEditing] = useState<{ type: 'above' | 'underground'; idx: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  // Generate chips when counts change
  React.useEffect(() => {
    setAboveFloors(Array.from({ length: aboveCount }, (_, i) => `Floor ${i + 1}`));
  }, [aboveCount]);
  React.useEffect(() => {
    setUndergroundFloors(Array.from({ length: undergroundCount }, (_, i) => `UG ${i + 1}`));
  }, [undergroundCount]);

  // Handle chip edit
  const handleChipClick = (type: 'above' | 'underground', idx: number, value: string) => {
    setEditing({ type, idx });
    setEditValue(value);
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value);
  const handleEditBlur = () => {
    if (editing) {
      if (editing.type === 'above') {
        setAboveFloors(floors => floors.map((f, i) => (i === editing.idx ? editValue : f)));
      } else {
        setUndergroundFloors(floors => floors.map((f, i) => (i === editing.idx ? editValue : f)));
      }
      setEditing(null);
      setEditValue('');
    }
  };

  const totalFloors = aboveFloors.length + undergroundFloors.length;

  return (
    <div style={{ width: '100%', padding: 0 }}>
      <div style={{ display: 'grid', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Number of floors</label>
            <input
              type="number"
              min={0}
              value={aboveCount}
              onChange={e => setAboveCount(Math.max(0, parseInt(e.target.value) || 0))}
              style={{ ...inputStyle, width: '100%' }}
              placeholder="e.g., 5"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Number of underground floors (basement)</label>
            <input
              type="number"
              min={0}
              value={undergroundCount}
              onChange={e => setUndergroundCount(Math.max(0, parseInt(e.target.value) || 0))}
              style={{ ...inputStyle, width: '100%' }}
              placeholder="e.g., 2"
            />
          </div>
        </div>

        <div>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Floors</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 4 }}>
            {aboveFloors.map((floor, i) =>
              editing && editing.type === 'above' && editing.idx === i ? (
                <input
                  key={`above-${i}`}
                  value={editValue}
                  autoFocus
                  onChange={handleEditChange}
                  onBlur={handleEditBlur}
                  style={{ ...chipStyle, padding: '6px 10px', minWidth: 60, background: '#fff', border: '1.5px solid ' + CYAN, color: NAVY }}
                />
              ) : (
                <span
                  key={`above-${i}`}
                  onClick={() => handleChipClick('above', i, floor)}
                  style={{ ...chipStyle }}
                >
                  {floor}
                </span>
              )
            )}
            {undergroundFloors.map((floor, i) =>
              editing && editing.type === 'underground' && editing.idx === i ? (
                <input
                  key={`ug-${i}`}
                  value={editValue}
                  autoFocus
                  onChange={handleEditChange}
                  onBlur={handleEditBlur}
                  style={{ ...chipStyle, padding: '6px 10px', minWidth: 60, background: '#fffbe6', border: '1.5px solid #ffcc80', color: NAVY }}
                />
              ) : (
                <span
                  key={`ug-${i}`}
                  onClick={() => handleChipClick('underground', i, floor)}
                  style={{ ...chipStyle, background: '#ffe0b2', border: '1px solid #ffcc80' }}
                >
                  {floor}
                </span>
              )
            )}
          </div>
        </div>

        {/* Removed Space Summary from AddFloor to avoid duplicate summary in operational details */}
      </div>
    </div>
  );
}

