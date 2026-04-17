import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Check,
  Clock,
  FileText,
  Globe,
  Info,
  Layers,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  Plus,
  Settings,
  Shield,
  Upload,
  Users,
  Image as ImageIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type SpaceFormState = {
  spaceName: string;
  category: string;
  spaceWebsite: string;
  tradingHours: string;
  managedByEmail: string;
  managedByPhone: string;
  spaceAddress: string;
  activeFrom: string;
  activeTo: string;
  ownership: string;
  management: string;
  overallRentableArea: string;
  permanentRentableArea: string;
  otherRentableArea: string;
  expectedFootTraffic: string;
  expectedRevenue: string;
  addFloors: string;
  floorNamingPattern: string;
  minPLIValue: string;
};

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #dbe5ee',
  borderRadius: '10px',
  padding: '20px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #cfd7e2',
  borderRadius: '6px',
  padding: '9px 12px',
  fontSize: '13px',
  color: '#1f2937',
  backgroundColor: '#f9fbfc',
  outline: 'none',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238fafc4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: '30px',
  cursor: 'pointer',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#374151',
  fontWeight: 600,
  marginBottom: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const uploadBoxStyle: React.CSSProperties = {
  border: '1px solid #cfd7e2',
  borderRadius: '6px',
  padding: '10px 14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  backgroundColor: '#f9fbfc',
  cursor: 'pointer',
};

export default function CreateSpace() {
  const navigate = useNavigate();

  const [form, setForm] = useState<SpaceFormState>({
    spaceName: '',
    category: 'Retail',
    spaceWebsite: '',
    tradingHours: '',
    managedByEmail: '',
    managedByPhone: '',
    spaceAddress: '',
    activeFrom: '',
    activeTo: '',
    ownership: '',
    management: '',
    overallRentableArea: '',
    permanentRentableArea: '',
    otherRentableArea: '',
    expectedFootTraffic: '',
    expectedRevenue: '',
    addFloors: '',
    floorNamingPattern: 'Level 1, Level 2, Level 3...',
    minPLIValue: '',
  });

  const [precinctInput, setPrecinctInput] = useState('');
  const [precincts, setPrecincts] = useState<string[]>([]);

  const updateField = (key: keyof SpaceFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    toast.success('Space submitted for approval');
    navigate('/manage/spaces');
  };

  const addPrecinct = () => {
    if (precinctInput.trim()) {
      setPrecincts((prev) => [...prev, precinctInput.trim()]);
      setPrecinctInput('');
    }
  };

  const sectionHeader = (icon: React.ReactNode, title: string, subtitle?: string) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '18px' }}>
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #14D8CC 0%, #0FB6C5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a2b3c' }}>{title}</div>
        {subtitle && <div style={{ fontSize: '12px', color: '#8a9ab0', marginTop: '2px' }}>{subtitle}</div>}
      </div>
    </div>
  );

  const fieldIcon = (Icon: React.ElementType) => (
    <Icon size={13} color="var(--spacespot-cyan-primary, #14D8CC)" />
  );

  return (
    <div style={{ backgroundColor: '#eef2f6', minHeight: '100vh', padding: '16px 16px 32px' }}>
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 260px',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Page Header */}
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1a2b3c' }}>Create New Space</h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7e91' }}>
              Complete all the required details to register a new space
            </p>
          </div>

          {/* ── Basic Information ── */}
          <div style={sectionCardStyle}>
            {sectionHeader(<Info size={16} color="#ffffff" />, 'Basic Information', 'Primary space details and contact information')}

            <div style={{ display: 'grid', gap: '14px' }}>
              {/* Space Name */}
              <div>
                <label style={labelStyle}>{fieldIcon(Building2)} Space Name</label>
                <input
                  style={inputStyle}
                  placeholder="e.g., Beachside Canberra Mall"
                  value={form.spaceName}
                  onChange={(e) => updateField('spaceName', e.target.value)}
                />
              </div>

              {/* Category | Space Website */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>{fieldIcon(Layers)} Category</label>
                  <select
                    style={selectStyle}
                    value={form.category}
                    onChange={(e) => updateField('category', e.target.value)}
                  >
                    <option value="Retail">Retail</option>
                    <option value="Commercial">Commercial</option>
                    <option value="CoWorking">CoWorking</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>{fieldIcon(Globe)} Space Website<span style={{ fontWeight: 400, color: '#8a9ab0', fontSize: '11px' }}>(Optional)</span></label>
                  <input
                    style={inputStyle}
                    placeholder="www.beachsideactmall.co"
                    value={form.spaceWebsite}
                    onChange={(e) => updateField('spaceWebsite', e.target.value)}
                  />
                </div>
              </div>

              {/* Trading Hours | Managed By (Email) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>{fieldIcon(Clock)} Trading Hours</label>
                  <input
                    style={inputStyle}
                    placeholder="8:30 AM - 5:30 PM (Mon-..."
                    value={form.tradingHours}
                    onChange={(e) => updateField('tradingHours', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{fieldIcon(Mail)} Managed By (Email)</label>
                  <input
                    style={inputStyle}
                    placeholder="mallmanager@company.c"
                    value={form.managedByEmail}
                    onChange={(e) => updateField('managedByEmail', e.target.value)}
                  />
                </div>
              </div>

              {/* Managed By Phone */}
              <div>
                <label style={labelStyle}>{fieldIcon(Phone)} Managed By Phone</label>
                <input
                  style={inputStyle}
                  placeholder="+61 411111111"
                  value={form.managedByPhone}
                  onChange={(e) => updateField('managedByPhone', e.target.value)}
                />
              </div>

              {/* Space Address */}
              <div>
                <label style={labelStyle}>{fieldIcon(MapPin)} Space Address</label>
                <input
                  style={inputStyle}
                  placeholder="10 Bond Street, Chelsea, Sydney 2000"
                  value={form.spaceAddress}
                  onChange={(e) => updateField('spaceAddress', e.target.value)}
                />
              </div>

              {/* Space Logo */}
              <div>
                <label style={labelStyle}>{fieldIcon(ImageIcon)} Space Logo</label>
                <div
                  style={{
                    border: '1.5px dashed #b0bec8',
                    borderRadius: '8px',
                    padding: '24px 16px',
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: '#fafcfd',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#eafaf8',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <Upload size={18} color="var(--spacespot-cyan-primary, #14D8CC)" />
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7e91', fontWeight: 500 }}>Click to upload logo</div>
                    <div style={{ fontSize: '11px', color: '#aab4bf' }}>PNG, JPG up to 5MB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Operational Details ── */}
          <div style={sectionCardStyle}>
            {sectionHeader(<Settings size={16} color="#ffffff" />, 'Operational Details')}

            <div style={{ display: 'grid', gap: '14px' }}>
              {/* Active From | Active To */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>{fieldIcon(Calendar)} Active From</label>
                  <input
                    type="date"
                    style={inputStyle}
                    value={form.activeFrom}
                    onChange={(e) => updateField('activeFrom', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{fieldIcon(Calendar)} Active To</label>
                  <input
                    type="date"
                    style={inputStyle}
                    value={form.activeTo}
                    onChange={(e) => updateField('activeTo', e.target.value)}
                  />
                </div>
              </div>

              {/* Ownership | Management */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>{fieldIcon(Building2)} Ownership</label>
                  <input
                    style={inputStyle}
                    placeholder="Business Name of the spa..."
                    value={form.ownership}
                    onChange={(e) => updateField('ownership', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{fieldIcon(Users)} Management</label>
                  <input
                    style={inputStyle}
                    placeholder="Business Name of the con..."
                    value={form.management}
                    onChange={(e) => updateField('management', e.target.value)}
                  />
                </div>
              </div>

              {/* Overall Rentable Area | Permanent Rentable Area */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>{fieldIcon(Maximize2)} Overall Rentable Area</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      style={{ ...inputStyle, paddingRight: '45px' }}
                      placeholder="e.g., 5000"
                      value={form.overallRentableArea}
                      onChange={(e) => updateField('overallRentableArea', e.target.value)}
                    />
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#8fafc4', fontWeight: 500 }}>Sq M</span>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>{fieldIcon(Maximize2)} Permanent Rentable Area</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      style={{ ...inputStyle, paddingRight: '45px' }}
                      placeholder="e.g., 3800"
                      value={form.permanentRentableArea}
                      onChange={(e) => updateField('permanentRentableArea', e.target.value)}
                    />
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#8fafc4', fontWeight: 500 }}>Sq M</span>
                  </div>
                </div>
              </div>

              {/* Other Rentable Area | Expected Foot Traffic */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>{fieldIcon(Maximize2)} Other Rentable Area</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      style={{ ...inputStyle, paddingRight: '45px' }}
                      placeholder="e.g., 1200"
                      value={form.otherRentableArea}
                      onChange={(e) => updateField('otherRentableArea', e.target.value)}
                    />
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#8fafc4', fontWeight: 500 }}>Sq M</span>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>{fieldIcon(Users)} Expected Foot Traffic (per month)</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., 10000"
                    value={form.expectedFootTraffic}
                    onChange={(e) => updateField('expectedFootTraffic', e.target.value)}
                  />
                </div>
              </div>

              {/* Expected Revenue */}
              <div>
                <label style={labelStyle}>{fieldIcon(FileText)} Expected Revenue for the Space (per month)</label>
                <input
                  style={inputStyle}
                  placeholder="e.g., 100000"
                  value={form.expectedRevenue}
                  onChange={(e) => updateField('expectedRevenue', e.target.value)}
                />
              </div>

              {/* Add Floors */}
              <div>
                <label style={labelStyle}>Add Floors</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    style={inputStyle}
                    placeholder="How many floors? (e.g., 5)"
                    value={form.addFloors}
                    onChange={(e) => updateField('addFloors', e.target.value)}
                  />
                  <select
                    style={selectStyle}
                    value={form.floorNamingPattern}
                    onChange={(e) => updateField('floorNamingPattern', e.target.value)}
                  >
                    <option value="Level 1, Level 2, Level 3...">Level 1, Level 2, Level 3...</option>
                    <option value="Floor 1, Floor 2, Floor 3...">Floor 1, Floor 2, Floor 3...</option>
                    <option value="Ground, 1st, 2nd, 3rd...">Ground, 1st, 2nd, 3rd...</option>
                  </select>
                </div>
                <div style={{ fontSize: '11px', color: '#8a9ab0', marginTop: '5px' }}>
                  Select naming pattern – floors will be auto-named. You can edit names below.
                </div>
              </div>

              {/* Add Precincts */}
              <div>
                <label style={labelStyle}>{fieldIcon(MapPin)} Add Precincts</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="e.g., Water Front"
                    value={precinctInput}
                    onChange={(e) => setPrecinctInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPrecinct()}
                  />
                  <button
                    type="button"
                    onClick={addPrecinct}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '9px 18px',
                      backgroundColor: '#1a2b3c',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#ffffff',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                {precincts.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {precincts.map((p, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '5px 12px',
                          backgroundColor: '#eaf6f5',
                          border: '1px solid #b2e0dc',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#1a2b3c',
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Lease Requirements ── */}
          <div style={sectionCardStyle}>
            {sectionHeader(<Shield size={16} color="#ffffff" />, 'Lease Requirements')}

            <div style={{ display: 'grid', gap: '14px' }}>
              {/* Min PLI Value */}
              <div>
                <label style={labelStyle}>{fieldIcon(Shield)} Min. Space Public Liability Insurance Value</label>
                <input
                  style={inputStyle}
                  placeholder="1000000"
                  value={form.minPLIValue}
                  onChange={(e) => updateField('minPLIValue', e.target.value)}
                />
              </div>

              {/* Upload: General Terms & Conditions */}
              <div>
                <label style={labelStyle}>{fieldIcon(FileText)} Upload General Terms &amp; Conditions for Tenants</label>
                <div style={uploadBoxStyle}>
                  <Upload size={16} color="#8fafc4" />
                  <span style={{ fontSize: '12px', color: '#6b7e91', fontWeight: 500 }}>Upload Document</span>
                </div>
              </div>

              {/* Upload: Space Safety Guidelines */}
              <div>
                <label style={labelStyle}>{fieldIcon(FileText)} Upload Space Safety Guidelines for Tenants</label>
                <div style={uploadBoxStyle}>
                  <Upload size={16} color="#8fafc4" />
                  <span style={{ fontSize: '12px', color: '#6b7e91', fontWeight: 500 }}>Upload Document</span>
                </div>
              </div>

              {/* Upload: Additional Documents */}
              <div>
                <label style={labelStyle}>{fieldIcon(FileText)} Upload Additional Documents (If Any) for Tenants</label>
                <div style={uploadBoxStyle}>
                  <Upload size={16} color="#8fafc4" />
                  <span style={{ fontSize: '12px', color: '#6b7e91', fontWeight: 500 }}>Upload Document</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={() => navigate('/manage/spaces')}
              style={{
                border: 'none',
                backgroundColor: '#9ca3af',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '10px 24px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none',
                backgroundColor: '#1a2b3c',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '10px 24px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Check size={14} /> Submit Space for Approval
            </button>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <aside style={{ position: 'sticky', top: '16px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #9fe5df',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '13px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Building2 size={18} color="#2e455d" />
              <span style={{ fontWeight: 700, fontSize: '15px', color: '#1a2b3c' }}>Space Summary</span>
            </div>

            {/* Space Main Image placeholder */}
            <div
              style={{
                width: '100%',
                aspectRatio: '16 / 10',
                backgroundColor: '#17283e',
                borderRadius: '8px',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={24} color="#4a6a85" />
                <span style={{ fontSize: '11px', color: '#4a6a85', fontWeight: 500 }}>Space Main Image</span>
              </div>
            </div>

            {/* Space details */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#eafaf8',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--spacespot-cyan-primary, #14D8CC)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#ffffff',
                }}
              >
                {form.spaceName ? form.spaceName.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#1a2b3c' }}>
                  {form.spaceName || 'Space Name'}
                </div>
                <div style={{ fontSize: '11px', color: '#6b7e91', marginTop: '2px' }}>
                  {form.category || 'Category'}
                </div>
              </div>
            </div>

            {/* Info rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5f7286', fontSize: '12px' }}>
                <MapPin size={14} color="#8fafc4" />
                <span>{form.spaceAddress || 'No address'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5f7286', fontSize: '12px' }}>
                <Mail size={14} color="#8fafc4" />
                <span>{form.managedByEmail || 'No email'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5f7286', fontSize: '12px' }}>
                <Phone size={14} color="#8fafc4" />
                <span>{form.managedByPhone || 'No phone'}</span>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#e4edf4', margin: '12px 0' }} />

            {/* Form completion */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#5f7286' }}>Form Completion</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-cyan-primary, #14D8CC)' }}>
                {Math.round(
                  (Object.values(form).filter((v) => typeof v === 'string' && v.trim() !== '').length /
                    Object.keys(form).length) *
                    100,
                )}
                %
              </span>
            </div>
            <div style={{ height: '6px', backgroundColor: '#e6edf3', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.round(
                    (Object.values(form).filter((v) => typeof v === 'string' && v.trim() !== '').length /
                      Object.keys(form).length) *
                      100,
                  )}%`,
                  height: '100%',
                  backgroundColor: 'var(--spacespot-cyan-primary, #14D8CC)',
                  borderRadius: '999px',
                  transition: 'width 0.3s',
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              style={{
                width: '100%',
                marginTop: '14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#1a2b3c',
                color: '#ffffff',
                fontSize: '13px',
                padding: '11px 10px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Check size={14} /> Submit Space for Approval
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
