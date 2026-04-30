import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Image as ImageIcon,
  ImageUp,
  Info,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createUnits } from '../src/api';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

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

// Design system style tokens
const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--spacespot-gray-300)',
  borderRadius: '6px',
  padding: '9px 12px',
  fontSize: '13px',
  color: 'var(--spacespot-navy-primary)',
  backgroundColor: 'var(--spacespot-gray-50)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};
const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  paddingRight: '30px',
  cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238fafc4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
};
const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--spacespot-gray-700)',
  fontWeight: 600,
  marginBottom: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

export default function ManualAddUnit() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const selectedId = state.spaceId || 'SP003';
  const selectedSpace = SPACE_LOOKUP[selectedId] || SPACE_LOOKUP.SP003;

  const [unitSummaryForm, setUnitSummaryForm] = useState({
    unitName: 'Coffee Shop',
    unitNumber: '101',
    unitCategory: 'Pop up space',
    floor: 'Level-1',
    precinct: 'Water Front',
    unitId: 'unit_CVQ_1_101',
    unitDescription: 'Coffe Shop pop space between Kmart and Coles, Advertising Panel',
    unitArea: '10',
    unitAreaUnit: 'Sq m',
    unitHeight: '',
    unitWidth: '',
    unitLength: '',
    unitDepth: '',
    unitFeatures: [],
    unitStatus: 'Available',
    unitBasePrice: '1000',
    availableFrom: '',
    availableTo: '',
    specialConditions: 'No Politcal party hire, No Power facility',
    expectedFootTraffic: '400000',
    unitImages: [],
    // Add area and status for compatibility with mappedUnit and UI
    area: '10',
    status: 'Available',
  });

  const completion = useMemo(() => {
    const values = [
      unitSummaryForm.unitId,
      unitSummaryForm.unitName,
      unitSummaryForm.unitNumber,
      unitSummaryForm.unitCategory,
      unitSummaryForm.floor,
      unitSummaryForm.precinct,
      unitSummaryForm.unitDescription,
      unitSummaryForm.unitArea,
      unitSummaryForm.unitStatus,
      unitSummaryForm.unitBasePrice,
      unitSummaryForm.availableFrom,
      unitSummaryForm.availableTo,
      unitSummaryForm.specialConditions,
      unitSummaryForm.expectedFootTraffic,
    ];
    const filled = values.filter((value) => (value ?? '').toString().trim().length > 0).length;
    return Math.round((filled / values.length) * 100);
  }, [unitSummaryForm]);

  const handleAddUnit = async () => {
    const mappedUnit = {
      name: unitSummaryForm.unitName || 'Pop-up Space',
      floor: unitSummaryForm.floor || 'Level 1',
      type: 'Office', // or add a field to the form
      area: unitSummaryForm.unitArea || unitSummaryForm.area || '25',
      status: unitSummaryForm.unitStatus || unitSummaryForm.status || 'Proposed for creation',
      code: unitSummaryForm.unitId || `MANUAL-${Date.now()}`,
      precinct: selectedSpace.name,
      category: unitSummaryForm.unitCategory || 'Permanent',
      frontage: '',
      monthlyRate: unitSummaryForm.unitBasePrice || 0,
      spaceId: selectedId,
    };
    try {
      await createUnits([mappedUnit]);
      window.dispatchEvent(new Event('unit-added'));
      toast.success('Added Unit successfully');
      navigate('/create/created-units', {
        state: {
          spaceId: selectedId,
          spaceName: selectedSpace.name,
          unit: mappedUnit,
        },
      });
    } catch (err) {
      toast.error('Failed to add unit');
    }
  };

  return (
    <div style={{ padding: '24px 0 32px', backgroundColor: 'var(--spacespot-gray-100)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1342px', margin: '0 auto', padding: '0 24px' }}>
        <button
          type="button"
          onClick={() => navigate('/create/units/configure', { state: { spaceId: selectedId } })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--spacespot-gray-500)',
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
        <div style={{ width: '56px', height: '2px', backgroundColor: 'var(--spacespot-cyan-light)', marginBottom: '20px', borderRadius: '999px' }} />

        <Card variant="default" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '20px', padding: '24px' }}>
          <div>
            <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-400)', marginBottom: '4px', letterSpacing: '0.04em' }}>SPACE ID</div>
            <div style={{ fontSize: '22px', lineHeight: 1, color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>{selectedId}</div>
          </div>
          <div>
            <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-400)', marginBottom: '4px', letterSpacing: '0.04em' }}>SPACE NAME</div>
            <div style={{ fontSize: '16px', color: 'var(--spacespot-navy-primary)', fontWeight: 600 }}>{selectedSpace.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-400)', marginBottom: '4px', letterSpacing: '0.04em' }}>TYPE</div>
            <Badge variant="accent" size="sm">{selectedSpace.type}</Badge>
          </div>
          <div>
            <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-400)', marginBottom: '4px', letterSpacing: '0.04em' }}>LOCATION</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}>
              <MapPin size={10} color="var(--spacespot-gray-400)" />
              {selectedSpace.location}
            </div>
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '32px', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '20px' }}>
            <Card variant="default" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <Info size={12} color="var(--spacespot-cyan-primary)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Basic Information</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Unit Name</label>
                  <input style={inputStyle} value={unitSummaryForm.unitName} onChange={e => setUnitSummaryForm(prev => ({ ...prev, unitName: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Unit Number</label>
                  <input style={inputStyle} value={unitSummaryForm.unitNumber} onChange={e => setUnitSummaryForm(prev => ({ ...prev, unitNumber: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Unit Category</label>
                  <select style={selectStyle} value={unitSummaryForm.unitCategory} onChange={e => setUnitSummaryForm(prev => ({ ...prev, unitCategory: e.target.value }))}>
                    <option>Pop up space</option>
                    <option>Vending machine</option>
                    <option>Storage</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Floor</label>
                  <select style={selectStyle} value={unitSummaryForm.floor} onChange={e => setUnitSummaryForm(prev => ({ ...prev, floor: e.target.value }))}>
                    <option>Level-1</option>
                    <option>Level-2</option>
                    <option>Level-3</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Precinct</label>
                  <input style={inputStyle} value={unitSummaryForm.precinct} onChange={e => setUnitSummaryForm(prev => ({ ...prev, precinct: e.target.value }))} />
                </div>
                {/* Unit ID field removed from Basic Information section as requested */}
                <div>
                  <label style={labelStyle}>Unit Image</label>
                  <Button variant="outline" size="sm" icon={<ImageUp size={14} />} style={{ width: '100%', justifyContent: 'center' }}>
                    Upload Image
                  </Button>
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={labelStyle}>Unit Description</label>
                  <textarea style={{ ...inputStyle, height: 'auto', padding: '7px 8px', resize: 'vertical' }} value={unitSummaryForm.unitDescription} onChange={e => setUnitSummaryForm(prev => ({ ...prev, unitDescription: e.target.value }))} />
                </div>
              </div>
            </Card>

            <Card variant="default" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <Sparkles size={12} color="var(--spacespot-cyan-primary)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Unit Specifications</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}><MapPin size={9} color="var(--spacespot-cyan-primary)" />Area (Sq M)</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., 10"
                    value={unitSummaryForm.unitArea}
                    onChange={(e) => setUnitSummaryForm((prev) => ({ ...prev, unitArea: e.target.value, area: e.target.value }))}
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
            </Card>

            <Card variant="default" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <Calendar size={12} color="var(--spacespot-cyan-primary)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Pricing & Availability</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}><Calendar size={9} color="var(--spacespot-cyan-primary)" />Standard Unit Price (Per Day)</label>
                  <input style={inputStyle} placeholder="e.g., 100" />
                </div>
                <div>
                  <label style={labelStyle}><MapPin size={9} color="var(--spacespot-cyan-primary)" />Expected Foot Traffic</label>
                  <input style={inputStyle} placeholder="30 people per 1 hour" />
                </div>
                {/* Unit Hotness field removed */}
                <div>
                  <label style={labelStyle}><CheckCircle2 size={9} color="var(--spacespot-cyan-primary)" />Unit Status</label>
                  <select
                    style={selectStyle}
                    value={unitSummaryForm.unitStatus}
                    onChange={(e) => setUnitSummaryForm((prev) => ({ ...prev, unitStatus: e.target.value, status: e.target.value }))}
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
                {/* Price Plan, Generate Pricing Plan, and Upload Excel Document removed as requested */}
              </div>
            </Card>

            <Card variant="default" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Info size={12} color="var(--spacespot-gray-400)" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Special Conditions</span>
                </div>
              </div>
              <textarea
                rows={3}
                style={{ ...inputStyle, height: 'auto', padding: '7px 8px', resize: 'vertical', borderColor: 'var(--spacespot-gray-300)' }}
                placeholder="e.g., No Political party hire, No Power facility"
              />
            </Card>
          </div>

          <aside
            style={{
              backgroundColor: 'var(--spacespot-white)',
              border: '1.5px solid var(--spacespot-cyan-300)',
              borderRadius: '16px',
              padding: '24px',
              position: 'sticky',
              top: '24px',
              alignSelf: 'start',
              boxShadow: 'var(--spacespot-shadow-md)',
              minWidth: '0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Building2 size={14} color="var(--spacespot-navy-primary)" />
              <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--spacespot-navy-primary)' }}>Unit Summary</span>
            </div>

            {/* Image placeholder */}
            <div style={{ width: '100%', aspectRatio: '16 / 10', backgroundColor: '#17283e', borderRadius: '8px', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={22} color="#4a6a85" />
                <span style={{ fontSize: '10px', color: '#4a6a85', fontWeight: 500 }}>Unit Main Image</span>
              </div>
            </div>

            {/* Unit name chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--spacespot-cyan-pale)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--spacespot-cyan-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '14px', color: '#fff' }}>
                {unitSummaryForm.unitName ? unitSummaryForm.unitName.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--spacespot-navy-primary)' }}>{unitSummaryForm.unitName || 'Unit Name'}</div>
                <div style={{ fontSize: '10px', color: 'var(--spacespot-gray-500)', marginTop: '2px' }}>{unitSummaryForm.unitCategory || 'Category'}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '7px', marginBottom: '8px' }}>
              {[
                { label: 'ID', value: unitSummaryForm.unitId },
                { label: 'Unit Number', value: unitSummaryForm.unitNumber },
                { label: 'Category', value: unitSummaryForm.unitCategory },
                { label: 'Floor', value: unitSummaryForm.floor },
                { label: 'Precinct', value: unitSummaryForm.precinct },
                { label: 'Area', value: unitSummaryForm.unitArea },
                { label: 'Base Price (per day)', value: unitSummaryForm.unitBasePrice },
                { label: 'Available From', value: unitSummaryForm.availableFrom },
                { label: 'Available To', value: unitSummaryForm.availableTo },
                { label: 'Foot Traffic', value: unitSummaryForm.expectedFootTraffic },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}>
                  <span>{label}</span>
                  <strong style={{ color: 'var(--spacespot-navy-light)' }}>{value || '-'}</strong>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--spacespot-gray-500)', alignItems: 'center' }}>
                <span>Status</span>
                <Badge variant="warning" size="sm">{unitSummaryForm.unitStatus || '-'}</Badge>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--spacespot-gray-200)', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--spacespot-gray-500)', marginBottom: '6px' }}>
              <span>Form Completion</span>
              <span style={{ color: 'var(--spacespot-cyan-primary)', fontWeight: 700 }}>{completion}%</span>
            </div>
            <div style={{ height: '6px', backgroundColor: 'var(--spacespot-gray-100)', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{ width: `${completion}%`, height: '100%', backgroundColor: 'var(--spacespot-cyan-primary)', transition: 'width 0.3s ease' }} />
            </div>

            <Button variant="primary" size="sm" onClick={handleAddUnit} style={{ width: '100%', justifyContent: 'center' }}>
              Submit Unit for Approval
            </Button>

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

