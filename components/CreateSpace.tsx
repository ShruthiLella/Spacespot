import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { enAU } from 'date-fns/locale/en-AU';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/spacespot-datepicker.css';
import TradingHoursInput from './TradingHoursInput';
function formatDateToDisplay(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function formatDateToISO(date: Date | null) {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function parseToDate(val: string): Date | null {
  if (!val) return null;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
    const [d, m, y] = val.split('/');
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const [y, m, d] = val.split('-');
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  return null;
}
function parseISOToDate(iso: string): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return null;
  return new Date(Number(y), Number(m) - 1, Number(d));
}
import AddFloor from './AddFloor';
import {
  Building2, Calendar, Check, Clock, FileText, Globe, Info,
  Layers, Mail, MapPin, Maximize2, Phone, Settings,
  Shield, Upload, Users, X, Image as ImageIcon,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type SpaceFormState = {
  spaceName: string;
  category: string;
  spaceWebsite: string;
  spaceOwner: string;
  spaceOwnerEmail: string;
  tradingHours: string;
  managedByEmail: string;
  managedByPhone: string;
  country: string;
  spaceAddress: string;
  activeFrom: string;
  activeTo: string;
  ownership: string;
  management: string;
  abn: string;
  acn: string;
  netLettableArea: string;
  longTermNLA: string;
  casualLettableArea: string;
  expectedFootTraffic: string;
  expectedRevenue: string;
  addFloors: string;
  floorNamingPattern: string;
  minPLIValue: string;
  termsUploaded: boolean;
  tradingHoursObj?: any;
};

type SavedSpaceDraft = {
  id: string;
  name: string;
  location: string;
  type: string;
  floors: number;
  units: number;
  availableUnits: number;
  occupancy: number;
  status: 'Active';
  approvalStatus: 'Draft';
  floorBreakdown?: { floor: string; units: number }[];
  savedAt: string;
  form: SpaceFormState;
  aboveCount: number;
  undergroundCount: number;
};

type SubmittedSpaceRequest = {
  id: string;
  name: string;
  location: string;
  type: string;
  floors: number;
  units: number;
  availableUnits: number;
  occupancy: number;
  status: 'Inactive';
  approvalStatus: 'Pending Approval';
  floorBreakdown?: { floor: string; units: number }[];
  submittedAt: string;
};

const SPACE_DRAFTS_STORAGE_KEY = 'spacespot.spaceDrafts';
const SUBMITTED_SPACES_STORAGE_KEY = 'spacespot.submittedSpaces';

const CYAN = 'var(--spacespot-cyan-primary, #14D8CC)';
const NAVY = '#1a2b3c';

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: '#fff', border: '1px solid #dbe5ee', borderRadius: '10px', padding: '20px',
};
const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid #cfd7e2', borderRadius: '6px',
  padding: '9px 12px', fontSize: '13px', color: '#1f2937',
  backgroundColor: '#f9fbfc', outline: 'none', boxSizing: 'border-box',
};
const selectStyle: React.CSSProperties = {
  ...inputStyle, appearance: 'none', paddingRight: '30px', cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238fafc4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
};
const requiredAsterisk = <span style={{ color: '#e11d48', marginLeft: 2 }}>*</span>;
const labelStyle: React.CSSProperties = {
  fontSize: '12px', color: '#374151', fontWeight: 600,
  marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px',
};
const twoColStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
};
const chipStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '6px 14px', backgroundColor: '#eaf6f5',
  border: '1px solid #b2e0dc', borderRadius: '20px',
  fontSize: '12px', fontWeight: 600, color: NAVY, cursor: 'pointer',
  whiteSpace: 'nowrap' as const,
};
const sqMSuffix: React.CSSProperties = {
  position: 'absolute', right: '10px', top: '50%',
  transform: 'translateY(-50%)', fontSize: '11px', color: '#8fafc4', fontWeight: 500,
};

const fieldIcon = (Icon: React.ElementType) => <Icon size={13} color={CYAN} />;

const generateFloorNames = (count: number, pattern: string): string[] => {
  const names: string[] = [];
  for (let i = 1; i <= count; i++) {
    if (pattern.startsWith('Level')) names.push(`Level ${i}`);
    else if (pattern.startsWith('Floor')) names.push(`Floor ${i}`);
    else if (pattern.startsWith('Ground')) {
      names.push(i === 1 ? 'Ground' : `Level ${i - 1}`);
    } else if (pattern.startsWith('With')) {
      if (i === 1) names.push('Basement');
      else if (i === 2) names.push('Ground');
      else names.push(`Level ${i - 2}`);
    }
  }
  return names;
};

export default function CreateSpace() {
  const [aboveCount, setAboveCount] = useState(0);
  const [undergroundCount, setUndergroundCount] = useState(0);
  const [draftId, setDraftId] = useState('');
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<SpaceFormState>({
    spaceName: '', category: 'Retail', spaceWebsite: '', spaceOwner: '', spaceOwnerEmail: '',
    tradingHours: '', managedByEmail: '', managedByPhone: '',
    country: '',
    spaceAddress: '', activeFrom: '', activeTo: '',
    ownership: '', management: '',
    abn: '', acn: '',
    netLettableArea: '', longTermNLA: '',
    casualLettableArea: '', expectedFootTraffic: '',
    expectedRevenue: '', addFloors: '',
    floorNamingPattern: 'Level 1, Level 2, Level 3...',
    minPLIValue: '',
    termsUploaded: false,
    tradingHoursObj: {},
  });

  const [precinctInput, setPrecinctInput] = useState('');
  const [precincts, setPrecincts] = useState<string[]>([]);
  const [floorNames, setFloorNames] = useState<string[]>([]);
  const [editingFloor, setEditingFloor] = useState<number | null>(null);
  const [editingFloorName, setEditingFloorName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Document state
  const [generatedDocs, setGeneratedDocs] = useState<Record<string, boolean>>({});
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const termsInputRef = useRef<HTMLInputElement | null>(null);

  const getFieldErrorStyle = (fieldKey: keyof SpaceFormState): React.CSSProperties => (
    errors[fieldKey]
      ? {
          borderColor: '#e11d48',
          boxShadow: '0 0 0 3px rgba(225, 29, 72, 0.12)',
          backgroundColor: '#fff7f9',
        }
      : {}
  );

  const focusFirstInvalidField = (nextErrors: { [key: string]: string }) => {
    const firstInvalidKey = Object.keys(nextErrors)[0];
    if (!firstInvalidKey) return;

    const target = document.querySelector(`[data-field="${firstInvalidKey}"]`) as HTMLElement | null;
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const focusable = target.querySelector('input, select, button, textarea') as HTMLElement | null;
    focusable?.focus();
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedDraftId = params.get('draftId');
    if (!requestedDraftId) return;

    try {
      const raw = localStorage.getItem(SPACE_DRAFTS_STORAGE_KEY);
      if (!raw) return;

      const drafts = JSON.parse(raw) as SavedSpaceDraft[];
      const draft = drafts.find((d) => d.id === requestedDraftId);
      if (!draft) return;

      setDraftId(draft.id);
      setForm(draft.form);
      setAboveCount(draft.aboveCount || 0);
      setUndergroundCount(draft.undergroundCount || 0);
    } catch {
      // Ignore malformed drafts storage and keep fresh form defaults.
    }
  }, [location.search]);

  const updateField = (key: keyof SpaceFormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleUploadClick = (docKey: string) => {
    fileInputRefs.current[docKey]?.click();
  };

  const handleFileChange = (docKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedDocs((prev) => ({ ...prev, [docKey]: file.name }));
  };

  const handleGenerateTemplate = (docKey: string, label: string) => {
    setGeneratedDocs((prev) => ({ ...prev, [docKey]: true }));
    const content = `${label} - SpaceSpot Template\n\nSpace Name:\nCategory:\nAddress:\nOwner:\nTerm:\nRent:\nSpecial Conditions:\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docKey}-spacespot-template.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadField = (label: string, docKey: string) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'center' }}>
      <div>
        <label style={labelStyle}>{label}</label>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
          {uploadedDocs[docKey]
            ? `Uploaded: ${uploadedDocs[docKey]}`
            : generatedDocs[docKey]
              ? 'Template generated'
              : 'No document selected'}
        </div>
      </div>
      <button type="button" style={chipStyle} onClick={() => handleUploadClick(docKey)}>
        Upload Document
      </button>
      <button type="button" style={chipStyle} onClick={() => handleGenerateTemplate(docKey, label)}>
        Generate SpaceSpot Template
      </button>
      <input
        type="file"
        style={{ display: 'none' }}
        ref={(el) => { fileInputRefs.current[docKey] = el; }}
        onChange={(e) => handleFileChange(docKey, e)}
      />
    </div>
  );

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.spaceName.trim()) newErrors.spaceName = 'Required';
    if (!form.category.trim()) newErrors.category = 'Required';

    // Mandatory owner fields
    if (!form.spaceOwner.trim()) newErrors.spaceOwner = 'Required';
    if (!form.spaceOwnerEmail.trim()) {
      newErrors.spaceOwnerEmail = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.spaceOwnerEmail.trim())) {
      newErrors.spaceOwnerEmail = 'Enter a valid email';
    }

    if (!form.managedByEmail.trim()) newErrors.managedByEmail = 'Required';
    if (!form.managedByPhone.trim()) newErrors.managedByPhone = 'Required';
    if (!form.country.trim()) newErrors.country = 'Required';
    if (!form.spaceAddress.trim()) newErrors.spaceAddress = 'Required';
    if (!form.activeFrom.trim()) newErrors.activeFrom = 'Required';
    if (!form.activeTo.trim()) newErrors.activeTo = 'Required';

    if (!form.abn.trim()) newErrors.abn = 'Required';
    if (!form.acn.trim()) newErrors.acn = 'Required';
    if (!form.minPLIValue.trim()) newErrors.minPLIValue = 'Required';
    if (!form.termsUploaded) newErrors.termsUploaded = 'Please upload or generate T&Cs';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      focusFirstInvalidField(newErrors);
      return;
    }

    const floorTotal = aboveCount + undergroundCount;
    const submittedSpace: SubmittedSpaceRequest = {
      id: `SP-${Date.now()}`,
      name: form.spaceName.trim(),
      location: form.spaceAddress.trim(),
      type: form.category.trim() || 'Retail',
      floors: floorTotal,
      units: 0,
      availableUnits: 0,
      occupancy: 0,
      status: 'Inactive',
      approvalStatus: 'Pending Approval',
      floorBreakdown: floorTotal > 0
        ? generateFloorNames(floorTotal, form.floorNamingPattern).map((floor) => ({ floor, units: 0 }))
        : undefined,
      submittedAt: new Date().toISOString(),
    };

    try {
      const rawSubmitted = localStorage.getItem(SUBMITTED_SPACES_STORAGE_KEY);
      const existingSubmitted = rawSubmitted ? JSON.parse(rawSubmitted) as SubmittedSpaceRequest[] : [];
      localStorage.setItem(SUBMITTED_SPACES_STORAGE_KEY, JSON.stringify([submittedSpace, ...existingSubmitted]));

      if (draftId) {
        const rawDrafts = localStorage.getItem(SPACE_DRAFTS_STORAGE_KEY);
        const existingDrafts = rawDrafts ? JSON.parse(rawDrafts) as SavedSpaceDraft[] : [];
        const remainingDrafts = existingDrafts.filter((draft) => draft.id !== draftId);
        localStorage.setItem(SPACE_DRAFTS_STORAGE_KEY, JSON.stringify(remainingDrafts));
      }
    } catch {
      toast.error('Unable to submit space for approval');
      return;
    }

    setShowSubmitSuccess(true);
  };

  const handleSaveDraft = () => {
    const generatedId = `DRF-${Date.now()}`;
    const resolvedDraftId = draftId || generatedId;
    const floorTotal = aboveCount + undergroundCount;
    const draft: SavedSpaceDraft = {
      id: resolvedDraftId,
      name: form.spaceName.trim() || 'Untitled Draft Space',
      location: form.spaceAddress.trim() || 'Not specified',
      type: form.category.trim() || 'Retail',
      floors: floorTotal,
      units: 0,
      availableUnits: 0,
      occupancy: 0,
      status: 'Active',
      approvalStatus: 'Draft',
      floorBreakdown: floorTotal > 0
        ? generateFloorNames(floorTotal, form.floorNamingPattern).map((floor) => ({ floor, units: 0 }))
        : undefined,
      savedAt: new Date().toISOString(),
      form,
      aboveCount,
      undergroundCount,
    };

    try {
      const raw = localStorage.getItem(SPACE_DRAFTS_STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) as SavedSpaceDraft[] : [];
      const next = existing.some((d) => d.id === resolvedDraftId)
        ? existing.map((d) => (d.id === resolvedDraftId ? draft : d))
        : [draft, ...existing];

      localStorage.setItem(SPACE_DRAFTS_STORAGE_KEY, JSON.stringify(next));
      setDraftId(resolvedDraftId);
      toast.success('Draft saved');
      setTimeout(() => navigate('/manage/spaces'), 250);
    } catch {
      toast.error('Unable to save draft');
    }
  };

  const handleDeleteDraft = () => {
    if (!draftId) {
      toast.error('No draft found to delete');
      return;
    }

    try {
      const raw = localStorage.getItem(SPACE_DRAFTS_STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) as SavedSpaceDraft[] : [];
      const remaining = existing.filter((draft) => draft.id !== draftId);
      localStorage.setItem(SPACE_DRAFTS_STORAGE_KEY, JSON.stringify(remaining));
      toast.success('Draft deleted');
      navigate('/manage/spaces');
    } catch {
      toast.error('Unable to delete draft');
    }
  };

  const updateFloors = (count: number, pattern: string) => {
    setFloorNames(count > 0 && count <= 200 ? generateFloorNames(count, pattern) : []);
    setEditingFloor(null);
  };

  const confirmFloorEdit = () => {
    if (editingFloor !== null && editingFloorName.trim()) {
      setFloorNames((prev) => prev.map((n, i) => (i === editingFloor ? editingFloorName.trim() : n)));
    }
    setEditingFloor(null);
    setEditingFloorName('');
  };

  const cancelFloorEdit = () => { setEditingFloor(null); setEditingFloorName(''); };

  const addPrecinct = () => {
    if (precinctInput.trim()) {
      setPrecincts((prev) => [...prev, precinctInput.trim()]);
      setPrecinctInput('');
    }
  };

  const filledCount = Object.values(form).filter((v) => typeof v === 'string' && v.trim() !== '').length;
  const completionPct = Math.round((filledCount / Object.keys(form).length) * 100);

  const sectionHeader = (icon: React.ReactNode, title: string, subtitle?: string) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '18px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #14D8CC 0%, #0FB6C5 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: NAVY }}>{title}</div>
        {subtitle && <div style={{ fontSize: '12px', color: '#8a9ab0', marginTop: '2px' }}>{subtitle}</div>}
      </div>
    </div>
  );

  const textField = (label: string, Icon: React.ElementType, key: keyof SpaceFormState, placeholder: string, required?: boolean, extra?: Partial<React.InputHTMLAttributes<HTMLInputElement>>) => (
    <div data-field={key}>
      <label style={labelStyle}>{fieldIcon(Icon)} {label} {required && requiredAsterisk}</label>
      <input style={{ ...inputStyle, ...getFieldErrorStyle(key) }} placeholder={placeholder} value={form[key] as string} onChange={(e) => updateField(key, e.target.value)} {...extra} />
      {errors[key] && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors[key]}</div>}
    </div>
  );

  const areaField = (label: string, key: keyof SpaceFormState, placeholder: string, required?: boolean) => (
    <div data-field={key}>
      <label style={labelStyle}>{fieldIcon(Maximize2)} {label} {required && requiredAsterisk}</label>
      <div style={{ position: 'relative' }}>
        <input style={{ ...inputStyle, paddingRight: '45px', ...getFieldErrorStyle(key) }} placeholder={placeholder} value={form[key] as string} onChange={(e) => updateField(key, e.target.value)} />
        <span style={sqMSuffix}>Sq M</span>
      </div>
      {errors[key] && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors[key]}</div>}
    </div>
  );

  const sidebarRow = (Icon: React.ElementType, value: string, fallback: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5f7286', fontSize: '12px' }}>
      <Icon size={14} color="#8fafc4" />
      <span>{value || fallback}</span>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#eef2f6', minHeight: '100vh', padding: '24px 0 32px' }}>
      {showSubmitSuccess && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '24px',
          }}
        >
          <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.2)', padding: '28px', textAlign: 'center', border: '1px solid #c8f2ee' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#e6fffe', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <Check size={26} color={CYAN} />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>Submitted Space for Approval</div>
            <div style={{ fontSize: '13px', color: '#6b7e91', marginBottom: '22px' }}>Your space request has been submitted successfully.</div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitSuccess(false);
                }}
                style={{ border: '1px solid #d1d5db', backgroundColor: '#fff', color: NAVY, borderRadius: '10px', padding: '11px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', minWidth: '100px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitSuccess(false);
                  navigate('/manage/spaces');
                }}
                style={{ border: 'none', backgroundColor: NAVY, color: '#fff', borderRadius: '10px', padding: '11px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', minWidth: '100px' }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={{ maxWidth: '1342px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '32px', alignItems: 'start' }}>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: NAVY }}>Create New Space</h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7e91' }}>Complete all the required details to register a new space</p>
          </div>

          {/* Basic Information */}
          <div style={{ ...sectionCardStyle, padding: '24px' }}>
            {sectionHeader(<Info size={16} color="#fff" />, 'Basic Information', 'Primary space details and contact information')}
            <div style={{ display: 'grid', gap: '14px' }}>
              {textField('Space Name', Building2, 'spaceName', 'e.g., Beachside Canberra Mall', true)}

              <div style={twoColStyle}>
                <div data-field="category">
                  <label style={labelStyle}>{fieldIcon(Layers)} Category {requiredAsterisk}</label>
                  <select style={{ ...selectStyle, ...getFieldErrorStyle('category') }} value={form.category} onChange={(e) => updateField('category', e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="Retail">Retail</option>
                    <option value="Commercial">Commercial</option>
                    <option value="CoWorking">CoWorking</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                  {errors.category && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors.category}</div>}
                </div>
                <div>
                  <label style={labelStyle}>{fieldIcon(Globe)} Space Website <span style={{ fontWeight: 400, color: '#8a9ab0', fontSize: '11px' }}>(Optional)</span></label>
                  <input style={inputStyle} placeholder="www.beachsideactmall.com" value={form.spaceWebsite} onChange={(e) => updateField('spaceWebsite', e.target.value)} />
                </div>
              </div>

              <div style={twoColStyle}>
                <div data-field="spaceOwner">
                  <label style={labelStyle}>{fieldIcon(Building2)} Space Registered to (Space Owner) {requiredAsterisk}</label>
                  <input
                    style={{ ...inputStyle, ...getFieldErrorStyle('spaceOwner') }}
                    placeholder="CVQ Properties"
                    value={form.spaceOwner}
                    onChange={e => updateField('spaceOwner', e.target.value)}
                  />
                  {errors.spaceOwner && (
                    <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors.spaceOwner}</div>
                  )}
                </div>
                <div data-field="spaceOwnerEmail">
                  <label style={labelStyle}>{fieldIcon(Mail)} Space Owner (Email) {requiredAsterisk}</label>
                  <input
                    style={{ ...inputStyle, ...getFieldErrorStyle('spaceOwnerEmail') }}
                    placeholder="Chris.Hemsworth@cvq.com"
                    value={form.spaceOwnerEmail}
                    onChange={e => updateField('spaceOwnerEmail', e.target.value)}
                  />
                  {errors.spaceOwnerEmail && (
                    <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors.spaceOwnerEmail}</div>
                  )}
                </div>
              </div>

              <div style={twoColStyle}>
                {textField('Managed By (Space Contributor)', Mail, 'managedByEmail', 'mallmanager@company.com', true)}
                {textField('Phone number (Manager)', Phone, 'managedByPhone', '+61 411111111', true)}
              </div>

              <div data-field="country">
                <label style={labelStyle}>{fieldIcon(Globe)} Country {requiredAsterisk}</label>
                <select style={{ ...selectStyle, ...getFieldErrorStyle('country') }} value={form.country} onChange={e => updateField('country', e.target.value)}>
                  <option value="">Select Country</option>
                  <option value="Australia">Australia</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="India">India</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="China">China</option>
                  <option value="Japan">Japan</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Brazil">Brazil</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Other">Other</option>
                </select>
                {errors.country && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors.country}</div>}
              </div>

              {textField('Space Address', MapPin, 'spaceAddress', '10 Bond Street, Chelsea, Sydney 2000', true)}

              <div data-field="tradingHours">
                <label style={labelStyle}>{fieldIcon(Clock)} Trading Hours</label>
                <div style={{ borderRadius: '8px', ...getFieldErrorStyle('tradingHours') }}>
                  <TradingHoursInput
                    value={form.tradingHoursObj}
                    onChange={(obj: any, summary: string) => {
                      setForm(prev => ({ ...prev, tradingHoursObj: obj, tradingHours: summary }));
                    }}
                  />
                </div>
                {errors.tradingHours && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors.tradingHours}</div>}
              </div>

              <AddFloor
                aboveCount={aboveCount}
                setAboveCount={setAboveCount}
                undergroundCount={undergroundCount}
                setUndergroundCount={setUndergroundCount}
              />
            </div>
          </div>

          {/* Operational Details */}
          <div style={{ ...sectionCardStyle, padding: '24px' }}>
            {sectionHeader(<Settings size={16} color="#fff" />, 'Operational Details')}
            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={twoColStyle}>
                <div data-field="activeFrom">
                  <label style={labelStyle}>{fieldIcon(Calendar)} Active From {requiredAsterisk}</label>
                  <DatePicker
                    locale={enAU}
                    selected={parseISOToDate(form.activeFrom)}
                    onChange={(date: Date | null) => updateField('activeFrom', formatDateToISO(date))}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="spacespot-datepicker"
                    wrapperClassName="spacespot-datepicker-wrapper"
                    popperClassName="spacespot-datepicker-popper"
                    customInput={<input style={{ ...inputStyle, padding: '7px 10px', ...getFieldErrorStyle('activeFrom') }} />}
                    autoComplete="off"
                    onChangeRaw={(e) => {
                      if (!e) return;
                      const val = (e.target as HTMLInputElement).value;
                      const parsed = parseToDate(val);
                      if (parsed) updateField('activeFrom', formatDateToISO(parsed));
                    }}
                    formatWeekDay={name => name.replace(/[^A-Z]/g, '').slice(0, 2)}
                    renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 8px 8px' }}>
                        <button type="button" className="react-datepicker__navigation" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}><ChevronLeft className="spacespot-datepicker-nav-icon" /></button>
                        <span style={{ fontWeight: 700, fontSize: 16, color: '#1a2b3c' }}>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <button type="button" className="react-datepicker__navigation" onClick={increaseMonth} disabled={nextMonthButtonDisabled}><ChevronRight className="spacespot-datepicker-nav-icon" /></button>
                      </div>
                    )}
                  />
                  {errors.activeFrom && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors.activeFrom}</div>}
                </div>
                <div data-field="activeTo">
                  <label style={labelStyle}>{fieldIcon(Calendar)} Active To {requiredAsterisk}</label>
                  <DatePicker
                    locale={enAU}
                    selected={parseISOToDate(form.activeTo)}
                    onChange={(date: Date | null) => updateField('activeTo', formatDateToISO(date))}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="spacespot-datepicker"
                    wrapperClassName="spacespot-datepicker-wrapper"
                    popperClassName="spacespot-datepicker-popper"
                    customInput={<input style={{ ...inputStyle, padding: '7px 10px', ...getFieldErrorStyle('activeTo') }} />}
                    autoComplete="off"
                    onChangeRaw={(e) => {
                      if (!e) return;
                      const val = (e.target as HTMLInputElement).value;
                      const parsed = parseToDate(val);
                      if (parsed) updateField('activeTo', formatDateToISO(parsed));
                    }}
                    formatWeekDay={name => name.replace(/[^A-Z]/g, '').slice(0, 2)}
                    renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 8px 8px' }}>
                        <button type="button" className="react-datepicker__navigation" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}><ChevronLeft className="spacespot-datepicker-nav-icon" /></button>
                        <span style={{ fontWeight: 700, fontSize: 16, color: '#1a2b3c' }}>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <button type="button" className="react-datepicker__navigation" onClick={increaseMonth} disabled={nextMonthButtonDisabled}><ChevronRight className="spacespot-datepicker-nav-icon" /></button>
                      </div>
                    )}
                  />
                  {errors.activeTo && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors.activeTo}</div>}
                </div>
              </div>

              <div style={twoColStyle}>
                {textField('ABN', Info, 'abn', 'e.g., 12 345 678 901', true)}
                {textField('ACN', Info, 'acn', 'e.g., 123 456 789', true)}
              </div>

              <div style={twoColStyle}>
                {areaField('Net Lettable area (NLA)', 'netLettableArea', 'e.g., 5000')}
                {areaField('Long-term NLA', 'longTermNLA', 'e.g., 3800')}
              </div>

              <div style={twoColStyle}>
                {areaField('Casual Lettable Area (CLA)', 'casualLettableArea', 'e.g., 1200')}
                {textField('Expected Foot Traffic (per month)', Users, 'expectedFootTraffic', 'e.g., 10000')}
              </div>

              {textField('Expected Revenue for the Space (per month)', FileText, 'expectedRevenue', 'e.g., 100000')}
              {textField('Min. Public Liability Insurance (AUD)', Shield, 'minPLIValue', '1000000', true)}
            </div>
          </div>

          {/* Lease Requirements */}
          <div style={{ ...sectionCardStyle, padding: '24px' }}>
            {sectionHeader(<Shield size={16} color="#fff" />, 'Lease Requirements')}
            <div style={{ display: 'grid', gap: '14px' }}>

              {/* Upload Space T&Cs - fixed */}
              <div data-field="termsUploaded">
                <label style={labelStyle}>Upload Space T&Cs for tenants {requiredAsterisk}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'center', borderRadius: '8px', padding: errors.termsUploaded ? '10px' : 0, ...getFieldErrorStyle('termsUploaded') }}>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>
                    {uploadedDocs['termsAndConditions']
                      ? `Uploaded: ${uploadedDocs['termsAndConditions']}`
                      : generatedDocs['termsAndConditions']
                        ? 'Template generated'
                        : 'No document selected'}
                  </div>
                  <button
                    type="button"
                    style={chipStyle}
                    onClick={() => termsInputRef.current?.click()}
                  >
                    Upload Document
                  </button>
                  <button
                    type="button"
                    style={chipStyle}
                    onClick={() => {
                      handleGenerateTemplate('termsAndConditions', 'Space T&Cs for Tenants');
                      setForm(prev => ({ ...prev, termsUploaded: true }));
                    }}
                  >
                    Generate SpaceSpot Template
                  </button>
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    ref={termsInputRef}
                    onChange={(e) => {
                      handleFileChange('termsAndConditions', e);
                      setForm(prev => ({ ...prev, termsUploaded: true }));
                    }}
                  />
                </div>
                {errors.termsUploaded && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 4 }}>{errors.termsUploaded}</div>}
              </div>

              {uploadField('Upload Space Safety Guidelines for Tenants', 'safety')}
              {uploadField('Upload Additional Documents (If Any) for Tenants', 'additional')}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={handleDeleteDraft}
              disabled={!draftId}
              style={{ border: 'none', backgroundColor: draftId ? '#dc2626' : '#f3b4b4', color: '#fff', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: 600, cursor: draftId ? 'pointer' : 'not-allowed', marginRight: '10px' }}
            >
              Delete Draft
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              style={{ border: 'none', backgroundColor: NAVY, color: '#fff', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginRight: '10px' }}
            >
              Save
            </button>
            <button type="button" onClick={() => navigate('/manage/spaces')} style={{ border: 'none', backgroundColor: '#9ca3af', color: '#fff', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside style={{ position: 'sticky', top: '24px' }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid #dbe5ee', borderRadius: '10px', padding: '24px', fontSize: '13px', boxShadow: '0 2px 8px rgba(20, 216, 204, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <Building2 size={20} color={CYAN} />
              <span style={{ fontWeight: 700, fontSize: '16px', color: NAVY }}>Space Summary</span>
            </div>

            <div style={{ width: '100%', aspectRatio: '16 / 10', backgroundColor: '#17283e', borderRadius: '8px', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={22} color="#4a6a85" />
                <span style={{ fontSize: '10px', color: '#4a6a85', fontWeight: 500 }}>Space Main Image</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--spacespot-cyan-pale)', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: CYAN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '14px', color: '#fff' }}>
                {form.spaceName ? form.spaceName.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '12px', color: NAVY }}>{form.spaceName || 'Space Name'}</div>
                <div style={{ fontSize: '10px', color: 'var(--spacespot-gray-500)', marginTop: '2px' }}>{form.category || 'Category'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151' }}>
                <Globe size={13} /><span style={{ fontWeight: 600 }}>Website:</span>
                <span style={{ color: '#6b7e91' }}>{form.spaceWebsite || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151' }}>
                <Mail size={13} /><span style={{ fontWeight: 600 }}>Managed By:</span>
                <span style={{ color: '#6b7e91' }}>{form.managedByEmail || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151' }}>
                <Phone size={13} /><span style={{ fontWeight: 600 }}>Manager Phone:</span>
                <span style={{ color: '#6b7e91' }}>{form.managedByPhone || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151' }}>
                <Globe size={13} /><span style={{ fontWeight: 600 }}>Country:</span>
                <span style={{ color: '#6b7e91' }}>{form.country || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151' }}>
                <MapPin size={13} /><span style={{ fontWeight: 600 }}>Address:</span>
                <span style={{ color: '#6b7e91' }}>{form.spaceAddress || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151' }}>
                <Calendar size={13} /><span style={{ fontWeight: 600 }}>Active:</span>
                <span style={{ color: '#6b7e91' }}>
                  {form.activeFrom ? formatDateToDisplay(form.activeFrom) : <span style={{ color: '#b0bec5' }}>N/A</span>}
                  {' - '}
                  {form.activeTo ? formatDateToDisplay(form.activeTo) : <span style={{ color: '#b0bec5' }}>N/A</span>}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151' }}>
                <Info size={13} /><span style={{ fontWeight: 600 }}>ABN:</span>
                <span style={{ color: '#6b7e91' }}>{form.abn || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
                <span style={{ fontWeight: 600, marginLeft: 10 }}>ACN:</span>
                <span style={{ color: '#6b7e91' }}>{form.acn || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151' }}>
                <Maximize2 size={13} /><span style={{ fontWeight: 600 }}>NLA:</span>
                <span style={{ color: '#6b7e91' }}>{form.netLettableArea || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
                <span style={{ fontWeight: 600, marginLeft: 10 }}>CLA:</span>
                <span style={{ color: '#6b7e91' }}>{form.casualLettableArea || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151' }}>
                <Shield size={13} /><span style={{ fontWeight: 600 }}>Min. PLI (AUD):</span>
                <span style={{ color: '#6b7e91' }}>{form.minPLIValue || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {sidebarRow(MapPin, form.spaceAddress, 'No address')}
              {sidebarRow(Mail, form.managedByEmail, 'No email')}
              {sidebarRow(Phone, form.managedByPhone, 'No phone')}
            </div>

            <div style={{ marginBottom: '16px', background: '#f4f8fb', borderRadius: 8, border: '1px solid #9fe5df', padding: '12px 16px', color: NAVY, fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 700 }}>Total Floors:</span>
              <span style={{ fontSize: '15px', color: CYAN, fontWeight: 700 }}>{aboveCount + undergroundCount}</span>
            </div>

            <div style={{ height: '1px', backgroundColor: '#e4edf4', margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: '#5f7286', fontWeight: 600 }}>Form Completion</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: CYAN }}>{completionPct}%</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#e6edf3', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{ width: `${completionPct}%`, height: '100%', backgroundColor: CYAN, borderRadius: '999px', transition: 'width 0.3s' }} />
            </div>

            <button type="button" onClick={handleSubmit} style={{ width: '100%', marginTop: '10px', borderRadius: '10px', border: 'none', backgroundColor: NAVY, color: '#fff', fontSize: '14px', padding: '13px 0', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '0.01em' }}>
              <Check size={16} /> Submit Space for Approval
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
