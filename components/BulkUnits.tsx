import { useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, CheckCircle2, Download, FileSpreadsheet,
  Layers, MapPin, Pencil, Plus, Trash2, Upload, X, Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { createUnits } from '../src/api';

// ── Types ──

type LocationState = { spaceId?: string };

interface ParsedUnit {
  unitName: string;
  floor: string;
  type: string;
  area: string;
  status: string;
}

const SPACE_LOOKUP: Record<string, { name: string; type: string; location: string }> = {
  SP001: { name: 'Downtown Office Complex', type: 'Commercial', location: '123 Business Street, Sydney NSW 2000' },
  SP002: { name: 'Tech Hub Building A', type: 'Commercial', location: '45 Tech Avenue, Melbourne VIC 3000' },
  SP003: { name: 'Riverside Business Park', type: 'Commercial', location: '78 River Road, Brisbane QLD 4000' },
  SP004: { name: 'Innovation Center', type: 'Technology', location: '90 Innovation Drive, Perth WA 6000' },
  SP005: { name: 'Retail Plaza East Wing', type: 'Retail', location: '12 Retail Street, Adelaide SA 5000' },
  SP006: { name: 'Healthcare Professional Suites', type: 'Medical', location: '56 Health Avenue, Canberra ACT 2600' },
};

const CYAN = 'var(--spacespot-cyan-primary)';
const NAVY = 'var(--spacespot-navy-primary)';

// For Unit images, suggest using a public image URL or a filename to be uploaded separately.
const SAMPLE_CSV = `Unit Name,Unit Number,Unit Category,Floor,Precinct,Unit Description,Unit Area,Unit Dimensions,Unit Features,Unit Status,Unit Base Price(per day),Available from,Available To,Special conditions- unit,Expected Foot Traffic(per month),Unit images
Coffee Shop,101,"Pop up space",Level-1,"Water Front","Coffee Shop pop space between Kmart and Coles, Advertising Panel","10 Sq m (Height, Width, Length)","L- W- H- D-","Power; Water; Internet; Tables; Furniture",Available,1000,25-Dec-2026,03-Mar-2027,"No Political party hire; No Power facility",400000,https://example.com/image.jpg`;

// ── Component ──

export default function BulkUnits() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const selectedId = state.spaceId || 'SP003';
  const space = SPACE_LOOKUP[selectedId] || SPACE_LOOKUP.SP003;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [parsedUnits, setParsedUnits] = useState<ParsedUnit[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);

  // Quick form state
  const [qfCount, setQfCount] = useState(5);
  const [qfPrefix, setQfPrefix] = useState('Unit');
  const [qfStartNum, setQfStartNum] = useState(101);
  const [qfFloor, setQfFloor] = useState('Level 1');
  const [qfType, setQfType] = useState('Office');
  const [qfArea, setQfArea] = useState('100');
  const [qfStatus, setQfStatus] = useState('Available');

  const parseCSV = useCallback((text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      setError('CSV file must contain a header row and at least one data row.');
      return;
    }

    const header = lines[0].toLowerCase();
    if (!header.includes('unit name') || !header.includes('floor')) {
      setError('CSV must include at least "Unit Name" and "Floor" columns.');
      return;
    }

    const units: ParsedUnit[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim());
      if (cols.length < 2 || !cols[0]) continue;
      units.push({
        unitName: cols[0],
        floor: cols[1] || '',
        type: cols[2] || 'Office',
        area: cols[3] || '0',
        status: cols[4] || 'Available',
      });
    }

    if (units.length === 0) {
      setError('No valid unit rows found in the CSV.');
      return;
    }
    setError('');
    setParsedUnits(units);
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      if (!f.name.endsWith('.csv')) {
        setError('Please upload a .csv file.');
        return;
      }
      setFile(f);
      setError('');
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') parseCSV(text);
      };
      reader.readAsText(f);
    },
    [parseCSV],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile],
  );

  const removeUnit = (idx: number) => {
    setParsedUnits((prev) => prev.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
  };

  const updateUnit = (idx: number, field: keyof ParsedUnit, value: string) => {
    setParsedUnits((prev) => prev.map((u, i) => i === idx ? { ...u, [field]: value } : u));
  };

  const generateFromForm = () => {
    const units: ParsedUnit[] = [];
    for (let i = 0; i < qfCount; i++) {
      units.push({
        unitName: `${qfPrefix} ${qfStartNum + i}`,
        floor: qfFloor,
        type: qfType,
        area: qfArea,
        status: qfStatus,
      });
    }
    setParsedUnits((prev) => [...prev, ...units]);
    setFile(null);
    setError('');
  };

  const clearFile = () => {
    setFile(null);
    setParsedUnits([]);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_units_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (parsedUnits.length === 0) return;
    // Map fields to backend format
    const mappedUnits = parsedUnits.map((u, i) => ({
      name: u.unitName,
      floor: u.floor,
      type: u.type,
      area: u.area,
      status: u.status,
      code: `BULK-${Date.now()}-${i+1}`,
      precinct: space.name,
      category: 'Permanent', // or map from type if needed
      frontage: '',
      monthlyRate: 0,
      spaceId: selectedId,
    }));
    try {
      await createUnits(mappedUnits);
      window.dispatchEvent(new Event('unit-added'));
      toast.success(`${parsedUnits.length} units added successfully!`);
      navigate('/create/created-units', { state: { spaceId: selectedId } });
    } catch (err) {
      toast.error('Failed to add units');
    }
  };

  const thStyle: React.CSSProperties = {
    padding: '8px 10px', textAlign: 'left', fontSize: '9px',
    color: 'var(--spacespot-gray-400)', fontWeight: 700, letterSpacing: '0.03em',
  };

  return (
    <div style={{ backgroundColor: '#eef2f6', minHeight: '100vh', padding: '24px 0 32px' }}>
      <div style={{ maxWidth: '1342px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <button type="button" onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'grid', placeItems: 'center' }}>
            <ArrowLeft size={18} color={NAVY} />
          </button>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: CYAN, display: 'grid', placeItems: 'center', boxShadow: '0 6px 10px rgba(20,216,204,0.2)' }}>
            <Layers size={16} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '22px', color: NAVY, fontWeight: 600 }}>Bulk Add Units</div>
            <div style={{ fontSize: '10px', color: '#8ea0b4' }}>Upload a CSV file to add multiple units at once</div>
          </div>
        </div>
        <div style={{ width: '56px', height: '2px', backgroundColor: '#8adfd7', marginBottom: '18px', borderRadius: '999px' }} />

        {/* Space Info Bar */}
        <div style={{
          backgroundColor: '#fff', border: '1.5px solid #9fe5df', borderRadius: '10px',
          padding: '18px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '18px', marginBottom: '24px',
        }}>
          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>SPACE ID</div>
            <div style={{ fontSize: '22px', lineHeight: 1, color: NAVY, fontWeight: 700 }}>{selectedId}</div>
          </div>
          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>SPACE NAME</div>
            <div style={{ fontSize: '16px', color: NAVY, fontWeight: 600 }}>{space.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>TYPE</div>
            <span style={{ display: 'inline-block', fontSize: '10px', color: '#16bfb6', border: '1px solid #c9ebe7', backgroundColor: '#ecfbf9', borderRadius: '999px', padding: '2px 8px', fontWeight: 600 }}>
              {space.type}
            </span>
          </div>
          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>LOCATION</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#6b7e91' }}>
              <MapPin size={10} color="#9aacc0" />
              {space.location}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Upload Area */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #dbe5ee', borderRadius: '10px', padding: '24px' }}>
            <div style={{ fontSize: '14px', color: NAVY, fontWeight: 600, marginBottom: '4px' }}>Upload CSV File</div>
            <div style={{ fontSize: '10px', color: '#8ea0b4', marginBottom: '12px' }}>
              Upload a CSV file with unit details. Download the template below for the correct format.
            </div>

            {/* Download template */}
            <button type="button" onClick={downloadTemplate} style={{
              display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #9fe5df',
              backgroundColor: '#ecfbf9', borderRadius: '7px', padding: '6px 12px',
              fontSize: '10px', color: '#0d9488', fontWeight: 600, cursor: 'pointer', marginBottom: '14px',
            }}>
              <Download size={13} /> Download CSV Template
            </button>

            {/* Drop Zone */}
            {!file ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? CYAN : '#c9d5e0'}`,
                  borderRadius: '8px', padding: '30px 16px', textAlign: 'center',
                  cursor: 'pointer', backgroundColor: dragOver ? '#f0fdfa' : '#f8fafc',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ecfbf9', display: 'grid', placeItems: 'center', margin: '0 auto 10px' }}>
                  <Upload size={18} color={CYAN} />
                </div>
                <div style={{ fontSize: '12px', color: NAVY, fontWeight: 600, marginBottom: '4px' }}>
                  Drag & drop your CSV file here
                </div>
                <div style={{ fontSize: '10px', color: '#8ea0b4' }}>
                  or <span style={{ color: CYAN, fontWeight: 600 }}>browse files</span> to upload
                </div>
                <div style={{ fontSize: '9px', color: '#b0bec5', marginTop: '8px' }}>Supported format: .csv</div>
                <input ref={fileInputRef} type="file" accept=".csv" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </div>
            ) : (
              <div style={{ border: '1.5px solid #9fe5df', borderRadius: '8px', padding: '12px', backgroundColor: '#f0fdfa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileSpreadsheet size={18} color={CYAN} />
                    <div>
                      <div style={{ fontSize: '11px', color: NAVY, fontWeight: 600 }}>{file.name}</div>
                      <div style={{ fontSize: '9px', color: '#8ea0b4' }}>{(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                  <button type="button" onClick={clearFile} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                    <X size={16} color="#9ca3af" />
                  </button>
                </div>
                {parsedUnits.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px', fontSize: '10px', color: '#0d9488', fontWeight: 600 }}>
                    <CheckCircle2 size={13} color="#0d9488" />
                    {parsedUnits.length} units parsed successfully
                  </div>
                )}
              </div>
            )}

            {error && (
              <div style={{ marginTop: '10px', fontSize: '10px', color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 10px' }}>
                {error}
              </div>
            )}

            {/* CSV preview section removed as requested */}
          </div>

          {/* Quick Form Card */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #dbe5ee', borderRadius: '10px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '7px', backgroundColor: NAVY, display: 'grid', placeItems: 'center' }}>
                <Zap size={13} color="#fff" />
              </div>
              <div style={{ fontSize: '14px', color: NAVY, fontWeight: 600 }}>Quick Generate</div>
            </div>
            <div style={{ fontSize: '10px', color: '#8ea0b4', marginBottom: '14px' }}>
              Auto-fill multiple units of the same type. You can edit each unit individually after generating.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              {/* Count */}
              <div>
                <label style={{ fontSize: '9px', color: '#8ea0b4', fontWeight: 600, letterSpacing: '0.03em', display: 'block', marginBottom: '4px' }}>NUMBER OF UNITS</label>
                <input type="number" min={1} max={100} value={qfCount} onChange={(e) => setQfCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                  style={{ width: '100%', height: '30px', border: '1px solid #d2dde8', borderRadius: '6px', padding: '0 8px', fontSize: '11px', color: NAVY }} />
              </div>
              {/* Prefix */}
              <div>
                <label style={{ fontSize: '9px', color: '#8ea0b4', fontWeight: 600, letterSpacing: '0.03em', display: 'block', marginBottom: '4px' }}>NAME PREFIX</label>
                <input type="text" value={qfPrefix} onChange={(e) => setQfPrefix(e.target.value)}
                  style={{ width: '100%', height: '30px', border: '1px solid #d2dde8', borderRadius: '6px', padding: '0 8px', fontSize: '11px', color: NAVY }} />
              </div>
              {/* Start Number */}
              <div>
                <label style={{ fontSize: '9px', color: '#8ea0b4', fontWeight: 600, letterSpacing: '0.03em', display: 'block', marginBottom: '4px' }}>START NUMBER</label>
                <input type="number" min={1} value={qfStartNum} onChange={(e) => setQfStartNum(Math.max(1, Number(e.target.value)))}
                  style={{ width: '100%', height: '30px', border: '1px solid #d2dde8', borderRadius: '6px', padding: '0 8px', fontSize: '11px', color: NAVY }} />
              </div>
              {/* Floor */}
              <div>
                <label style={{ fontSize: '9px', color: '#8ea0b4', fontWeight: 600, letterSpacing: '0.03em', display: 'block', marginBottom: '4px' }}>FLOOR</label>
                <input type="text" value={qfFloor} onChange={(e) => setQfFloor(e.target.value)}
                  style={{ width: '100%', height: '30px', border: '1px solid #d2dde8', borderRadius: '6px', padding: '0 8px', fontSize: '11px', color: NAVY }} />
              </div>
              {/* Type */}
              <div>
                <label style={{ fontSize: '9px', color: '#8ea0b4', fontWeight: 600, letterSpacing: '0.03em', display: 'block', marginBottom: '4px' }}>UNIT TYPE</label>
                <select value={qfType} onChange={(e) => setQfType(e.target.value)}
                  style={{ width: '100%', height: '30px', border: '1px solid #d2dde8', borderRadius: '6px', padding: '0 8px', fontSize: '11px', color: NAVY, backgroundColor: '#fff' }}>
                  {['Office', 'Co-working', 'Meeting Room', 'Retail', 'Storage', 'Medical', 'Studio'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              {/* Area */}
              <div>
                <label style={{ fontSize: '9px', color: '#8ea0b4', fontWeight: 600, letterSpacing: '0.03em', display: 'block', marginBottom: '4px' }}>AREA (SQM)</label>
                <input type="text" value={qfArea} onChange={(e) => setQfArea(e.target.value)}
                  style={{ width: '100%', height: '30px', border: '1px solid #d2dde8', borderRadius: '6px', padding: '0 8px', fontSize: '11px', color: NAVY }} />
              </div>

              {/* Unit Status */}
              <div>
                <label style={{ fontSize: '9px', color: '#8ea0b4', fontWeight: 600, letterSpacing: '0.03em', display: 'block', marginBottom: '4px' }}>UNIT STATUS</label>
                <select value={qfStatus} onChange={(e) => setQfStatus(e.target.value)}
                  style={{ width: '100%', height: '30px', border: '1px solid #d2dde8', borderRadius: '6px', padding: '0 8px', fontSize: '11px', color: NAVY, backgroundColor: '#fff' }}>
                  <option>Available</option>
                  <option>Booked</option>
                  <option>Soon to be available</option>
                  <option>Under contract</option>
                </select>
              </div>
            </div>

            {/* Preview snippet */}
            <div style={{ fontSize: '9px', color: '#8ea0b4', marginBottom: '10px' }}>
              Will generate: <strong style={{ color: NAVY }}>{qfPrefix} {qfStartNum}</strong> – <strong style={{ color: NAVY }}>{qfPrefix} {qfStartNum + qfCount - 1}</strong> ({qfCount} units)
            </div>

            <button type="button" onClick={generateFromForm} style={{
              border: 'none', backgroundColor: CYAN, borderRadius: '7px', color: '#fff',
              fontSize: '11px', fontWeight: 600, height: '30px', padding: '0 14px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center',
            }}>
              <Plus size={14} /> Generate {qfCount} Units
            </button>
          </div>

          </div>{/* end left column */}

          {/* Right – Units Summary (sticky) */}
          <div style={{ position: 'sticky', top: '24px', alignSelf: 'start', backgroundColor: '#fff', border: '1px solid #dbe5ee', borderRadius: '10px', padding: '24px', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 40px)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '14px', color: NAVY, fontWeight: 600 }}>Units Summary</div>
                <div style={{ fontSize: '10px', color: '#8ea0b4' }}>
                  {parsedUnits.length > 0 ? `${parsedUnits.length} units ready to add` : 'Upload a CSV or use Quick Generate'}
                </div>
              </div>
              {parsedUnits.length > 0 && (
                <div style={{
                  fontSize: '9px', fontWeight: 700, color: '#0d9488', backgroundColor: '#ecfbf9',
                  border: '1px solid #9fe5df', borderRadius: '999px', padding: '2px 10px',
                }}>
                  {parsedUnits.length} UNITS
                </div>
              )}
            </div>

            {parsedUnits.length === 0 ? (
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: '#b0bec5', fontSize: '11px', minHeight: '180px' }}>
                <div style={{ textAlign: 'center' }}>
                  <FileSpreadsheet size={32} color="#d1d5db" style={{ marginBottom: '8px' }} />
                  <div>No data yet</div>
                  <div style={{ fontSize: '9px', marginTop: '2px' }}>Upload a CSV or use Quick Generate to see a preview here</div>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', maxHeight: '340px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={thStyle}>#</th>
                      <th style={thStyle}>UNIT NAME</th>
                      <th style={thStyle}>FLOOR</th>
                      <th style={thStyle}>TYPE</th>
                      <th style={thStyle}>AREA (SQM)</th>
                      <th style={thStyle}>STATUS</th>
                      <th style={{ ...thStyle, textAlign: 'center' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedUnits.map((u, i) => {
                      const isEditing = editIdx === i;
                      const cellPad: React.CSSProperties = { padding: '4px 6px' };
                      const editInput = (field: keyof ParsedUnit, width?: string) => (
                        <input value={u[field]} onChange={(e) => updateUnit(i, field, e.target.value)}
                          style={{ width: width || '100%', height: '22px', border: '1px solid #9fe5df', borderRadius: '4px', padding: '0 5px', fontSize: '10px', color: NAVY, backgroundColor: '#f0fdfa' }} />
                      );
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isEditing ? '#f7fffe' : undefined }}>
                          <td style={{ ...cellPad, fontSize: '9px', color: '#8ea0b4' }}>{i + 1}</td>
                          <td style={cellPad}>{isEditing ? editInput('unitName') : <span style={{ fontSize: '10px', color: NAVY, fontWeight: 600 }}>{u.unitName}</span>}</td>
                          <td style={cellPad}>{isEditing ? editInput('floor') : <span style={{ fontSize: '10px', color: '#6b7e91' }}>{u.floor}</span>}</td>
                          <td style={cellPad}>{isEditing ? (
                            <select value={u.type} onChange={(e) => updateUnit(i, 'type', e.target.value)}
                              style={{ height: '22px', border: '1px solid #9fe5df', borderRadius: '4px', padding: '0 4px', fontSize: '9px', color: NAVY, backgroundColor: '#f0fdfa' }}>
                              {['Office', 'Co-working', 'Meeting Room', 'Retail', 'Storage', 'Medical', 'Studio'].map((t) => <option key={t}>{t}</option>)}
                            </select>
                          ) : <span style={{ fontSize: '8px', color: '#0d9488', backgroundColor: '#ecfbf9', border: '1px solid #c9ebe7', borderRadius: '999px', padding: '2px 6px' }}>{u.type}</span>}</td>
                          <td style={cellPad}>{isEditing ? editInput('area', '60px') : <span style={{ fontSize: '10px', color: '#6b7e91' }}>{u.area}</span>}</td>
                          <td style={cellPad}>{isEditing ? (
                            <select value={u.status} onChange={(e) => updateUnit(i, 'status', e.target.value)}
                              style={{ height: '22px', border: '1px solid #9fe5df', borderRadius: '4px', padding: '0 4px', fontSize: '9px', color: NAVY, backgroundColor: '#f0fdfa' }}>
                              {['Available', 'Occupied', 'Maintenance'].map((s) => <option key={s}>{s}</option>)}
                            </select>
                          ) : <span style={{ fontSize: '8px', color: '#0d9488', backgroundColor: '#ecfbf9', border: '1px solid #c9ebe7', borderRadius: '999px', padding: '2px 6px' }}>{u.status}</span>}</td>
                          <td style={{ ...cellPad, textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                              <button type="button" onClick={() => setEditIdx(isEditing ? null : i)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                                {isEditing ? <CheckCircle2 size={12} color="#0d9488" /> : <Pencil size={12} color="#b0bec5" />}
                              </button>
                              <button type="button" onClick={() => removeUnit(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                                <Trash2 size={12} color="#d1d5db" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '24px' }}>
          <button type="button" onClick={() => navigate(-1)} style={{
            border: '1px solid #dbe5ee', backgroundColor: '#fff', borderRadius: '10px',
            color: NAVY, fontSize: '13px', fontWeight: 600, height: '38px', padding: '0 24px', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={parsedUnits.length === 0} style={{
            border: 'none', backgroundColor: parsedUnits.length > 0 ? NAVY : '#c9d5e0',
            borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: 600,
            height: '38px', padding: '0 24px', cursor: parsedUnits.length > 0 ? 'pointer' : 'not-allowed',
          }}>
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
}
