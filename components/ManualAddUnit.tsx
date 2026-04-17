import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ImageUp,
  Info,
  MapPin,
  Sparkles,
  Upload,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type LocationState = {
  spaceId?: string;
};

const SPACE_LOOKUP: Record<string, { name: string; type: string; location: string }> = {
  SP001: { name: 'Downtown Office Complex', type: 'Commercial', location: '123 Business Street, Sydney NSW 2000' },
  SP002: { name: 'Tech Hub Building A', type: 'Commercial', location: '45 Tech Avenue, Melbourne VIC 3000' },
  SP003: { name: 'Riverside Business Park', type: 'Commercial', location: '78 River Road, Brisbane QLD 4000' },
  SP004: { name: 'Innovation Center', type: 'Technology', location: '90 Innovation Drive, Perth WA 6000' },
  SP005: { name: 'Retail Plaza East Wing', type: 'Retail', location: '12 Retail Street, Adelaide SA 5000' },
  SP006: { name: 'Healthcare Professional Suites', type: 'Medical', location: '56 Health Avenue, Canberra ACT 2600' },
};

const sectionCard: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1.5px solid #9fe5df',
  borderRadius: '8px',
  padding: '10px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '8px',
  color: '#7f8ea1',
  marginBottom: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  letterSpacing: '0.04em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '26px',
  border: '1px solid #9fb0c4',
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  fontSize: '10px',
  color: '#203249',
  padding: '0 8px',
  boxSizing: 'border-box',
};

export default function ManualAddUnit() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const selectedId = state.spaceId || 'SP003';
  const selectedSpace = SPACE_LOOKUP[selectedId] || SPACE_LOOKUP.SP003;

  const [unitSummaryForm, setUnitSummaryForm] = useState({
    unitId: '',
    unitName: '',
    floor: '',
    area: '',
    status: 'Proposed for creation',
  });

  const completion = useMemo(() => {
    const values = [
      unitSummaryForm.unitId,
      unitSummaryForm.unitName,
      unitSummaryForm.floor,
      unitSummaryForm.area,
      unitSummaryForm.status,
    ];
    const filled = values.filter((value) => value.trim().length > 0).length;
    return Math.round((filled / values.length) * 100);
  }, [unitSummaryForm]);

  const handleAddUnit = () => {
    toast.success('Added Unit successfully');
    navigate('/create/created-units', {
      state: {
        spaceId: selectedId,
        spaceName: selectedSpace.name,
        unit: {
          id: unitSummaryForm.unitId || 'UNIT-001',
          name: unitSummaryForm.unitName || 'Pop-up Space',
          floor: unitSummaryForm.floor || 'Level 1',
          area: unitSummaryForm.area || '25 Sq M',
          status: unitSummaryForm.status || 'Proposed for creation',
        },
      },
    });
  };

  return (
    <div style={{ padding: '12px 10px 20px', backgroundColor: '#eef2f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        <button
          type="button"
          onClick={() => navigate('/create/units/configure', { state: { spaceId: selectedId } })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#7b8da2',
            fontSize: '11px',
            cursor: 'pointer',
            marginBottom: '6px',
            padding: 0,
          }}
        >
          <ArrowLeft size={12} /> Back to Selection
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              backgroundColor: 'var(--spacespot-cyan-primary)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 6px 10px rgba(20, 216, 204, 0.2)',
            }}
          >
            <Sparkles size={16} color="#ffffff" />
          </div>
          <div style={{ fontSize: '22px', color: 'var(--spacespot-navy-primary)', fontWeight: 600 }}>Manually Add Units</div>
        </div>
        <div style={{ width: '56px', height: '2px', backgroundColor: '#8adfd7', marginBottom: '12px', borderRadius: '999px' }} />

        <div
          style={{
            ...sectionCard,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>SPACE ID</div>
            <div style={{ fontSize: '22px', lineHeight: 1, color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>{selectedId}</div>
          </div>

          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>SPACE NAME</div>
            <div style={{ fontSize: '16px', color: 'var(--spacespot-navy-primary)', fontWeight: 600 }}>{selectedSpace.name}</div>
          </div>

          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>TYPE</div>
            <span
              style={{
                display: 'inline-block',
                fontSize: '10px',
                color: '#16bfb6',
                border: '1px solid #c9ebe7',
                backgroundColor: '#ecfbf9',
                borderRadius: '999px',
                padding: '2px 8px',
                fontWeight: 600,
              }}
            >
              {selectedSpace.type}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>LOCATION</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#6b7e91' }}>
              <MapPin size={10} color="#9aacc0" />
              {selectedSpace.location}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '10px', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '8px', paddingRight: '250px' }}>
            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <Info size={12} color="var(--spacespot-cyan-primary)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Basic Information</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={labelStyle}><Info size={9} color="var(--spacespot-cyan-primary)" />Unit ID</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., CWC1-F1-U1"
                    value={unitSummaryForm.unitId}
                    onChange={(e) => setUnitSummaryForm((prev) => ({ ...prev, unitId: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}><Building2 size={9} color="var(--spacespot-cyan-primary)" />Unit Name</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., Coffee Shop"
                    value={unitSummaryForm.unitName}
                    onChange={(e) => setUnitSummaryForm((prev) => ({ ...prev, unitName: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}><MapPin size={9} color="var(--spacespot-cyan-primary)" />Floor</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., Level 1"
                    value={unitSummaryForm.floor}
                    onChange={(e) => setUnitSummaryForm((prev) => ({ ...prev, floor: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}><Info size={9} color="var(--spacespot-cyan-primary)" />Ownership</label>
                  <input style={inputStyle} placeholder="e.g., Water Front" />
                </div>
                <div>
                  <label style={labelStyle}><Building2 size={9} color="var(--spacespot-cyan-primary)" />Unit Category</label>
                  <select style={inputStyle} defaultValue="Pop-up Space">
                    <option>Pop-up Space</option>
                    <option>Retail</option>
                    <option>Office</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}><ImageUp size={9} color="var(--spacespot-cyan-primary)" />Unit Image</label>
                  <button
                    type="button"
                    style={{
                      ...inputStyle,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backgroundColor: '#f8fbfd',
                    }}
                  >
                    <ImageUp size={11} color="var(--spacespot-cyan-primary)" /> Upload Image
                  </button>
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={labelStyle}><Info size={9} color="var(--spacespot-cyan-primary)" />Unit Description</label>
                  <textarea
                    rows={3}
                    style={{ ...inputStyle, height: 'auto', padding: '7px 8px', resize: 'vertical' }}
                    placeholder="e.g., Coffee shop pop-up space between Kmart and Coles"
                  />
                </div>
              </div>
            </div>

            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <Sparkles size={12} color="var(--spacespot-cyan-primary)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Unit Specifications</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={labelStyle}><MapPin size={9} color="var(--spacespot-cyan-primary)" />Area (Sq M)</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., 10"
                    value={unitSummaryForm.area}
                    onChange={(e) => setUnitSummaryForm((prev) => ({ ...prev, area: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}><Info size={9} color="var(--spacespot-cyan-primary)" />Height (m)</label>
                  <input style={inputStyle} placeholder="e.g., 3" />
                </div>
                <div>
                  <label style={labelStyle}><Info size={9} color="var(--spacespot-cyan-primary)" />Width (m)</label>
                  <input style={inputStyle} placeholder="e.g., 2.5" />
                </div>
                <div>
                  <label style={labelStyle}><Info size={9} color="var(--spacespot-cyan-primary)" />Length (m)</label>
                  <input style={inputStyle} placeholder="e.g., 4" />
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={labelStyle}><Sparkles size={9} color="var(--spacespot-cyan-primary)" />Unit Features</label>
                  <input style={inputStyle} placeholder="e.g., Power, Water, Internet, Tables, Furniture" />
                </div>
              </div>
            </div>

            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <Calendar size={12} color="var(--spacespot-cyan-primary)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Pricing & Availability</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={labelStyle}><Calendar size={9} color="var(--spacespot-cyan-primary)" />Standard Unit Price (Per Day)</label>
                  <input style={inputStyle} placeholder="e.g., 100" />
                </div>
                <div>
                  <label style={labelStyle}><MapPin size={9} color="var(--spacespot-cyan-primary)" />Expected Foot Traffic</label>
                  <input style={inputStyle} placeholder="30 people per 1 hour" />
                </div>
                <div>
                  <label style={labelStyle}><Sparkles size={9} color="var(--spacespot-cyan-primary)" />Unit Hotness</label>
                  <select style={inputStyle} defaultValue="Normal">
                    <option>Normal</option>
                    <option>Hot</option>
                    <option>Premium</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}><CheckCircle2 size={9} color="var(--spacespot-cyan-primary)" />Unit Status</label>
                  <select
                    style={inputStyle}
                    value={unitSummaryForm.status}
                    onChange={(e) => setUnitSummaryForm((prev) => ({ ...prev, status: e.target.value }))}
                  >
                    <option>Proposed for creation</option>
                    <option>Available</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}><Calendar size={9} color="var(--spacespot-cyan-primary)" />Available From</label>
                  <input style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}><Calendar size={9} color="var(--spacespot-cyan-primary)" />Available To</label>
                  <input style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}><Calendar size={9} color="var(--spacespot-cyan-primary)" />Price Plan</label>
                  <button
                    type="button"
                    style={{
                      ...inputStyle,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      backgroundColor: '#f8fbfd',
                    }}
                  >
                    <Calendar size={11} color="var(--spacespot-cyan-primary)" /> Generate Pricing Plan
                  </button>
                </div>
                <div>
                  <label style={labelStyle}> </label>
                  <button
                    type="button"
                    style={{
                      ...inputStyle,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      backgroundColor: '#f8fbfd',
                    }}
                  >
                    <Upload size={11} color="var(--spacespot-cyan-primary)" /> Upload Excel Document
                  </button>
                </div>
              </div>
            </div>

            <div style={{ ...sectionCard, borderColor: '#cad3de' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Info size={12} color="#7f8ea1" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Special Conditions</span>
                </div>
                <button
                  type="button"
                  style={{
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: 'var(--spacespot-navy-primary)',
                    color: '#ffffff',
                    fontSize: '8px',
                    padding: '3px 7px',
                    cursor: 'pointer',
                  }}
                >
                  AI Generate
                </button>
              </div>
              <textarea
                rows={3}
                style={{ ...inputStyle, height: 'auto', padding: '7px 8px', resize: 'vertical', borderColor: '#b7c3d1' }}
                placeholder="e.g., No Political party hire, No Power facility"
              />
            </div>
          </div>

          <aside
            style={{
              ...sectionCard,
              position: 'fixed',
              top: '96px',
              right: '32px',
              width: '230px',
              zIndex: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
              <Building2 size={12} color="var(--spacespot-cyan-primary)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Unit Summary</span>
            </div>

            <div style={{ backgroundColor: '#eafaf8', borderRadius: '6px', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontSize: '8px', color: '#8ea0b4' }}>Unit Name</div>
              <div style={{ fontSize: '13px', color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>
                {unitSummaryForm.unitName || 'Pop-up Space'}
              </div>
            </div>

            <div style={{ display: 'grid', gap: '7px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7e91' }}>
                <span>ID</span>
                <strong style={{ color: '#2a3b52' }}>{unitSummaryForm.unitId || '-'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7e91' }}>
                <span>Floor</span>
                <strong style={{ color: '#2a3b52' }}>{unitSummaryForm.floor || '-'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7e91' }}>
                <span>Area</span>
                <strong style={{ color: '#2a3b52' }}>{unitSummaryForm.area || '-'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7e91' }}>
                <span>Status</span>
                <span style={{ fontSize: '9px', color: 'var(--spacespot-warning)', backgroundColor: '#fff4e5', border: '1px solid #f5d39c', borderRadius: '999px', padding: '1px 7px' }}>
                  {unitSummaryForm.status}
                </span>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#e4edf5', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#7f8ea1', marginBottom: '6px' }}>
              <span>Form Completion</span>
              <span style={{ color: 'var(--spacespot-cyan-primary)', fontWeight: 700 }}>{completion}%</span>
            </div>
            <div style={{ height: '6px', backgroundColor: '#edf2f7', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{ width: `${completion}%`, height: '100%', backgroundColor: 'var(--spacespot-cyan-primary)' }} />
            </div>

            <button
              type="button"
              onClick={handleAddUnit}
              style={{
                width: '100%',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'var(--spacespot-navy-primary)',
                color: '#ffffff',
                fontSize: '11px',
                height: '30px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Add Unit
            </button>

            <div style={{ marginTop: '9px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--spacespot-gray-500)', fontSize: '9px' }}>
              <CheckCircle2 size={11} color="var(--spacespot-cyan-primary)" />
              Info synced as you type.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

