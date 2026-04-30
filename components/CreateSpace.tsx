import { useState } from 'react';
import DatePicker from 'react-datepicker';
import enAU from 'date-fns/locale/en-AU';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/spacespot-datepicker.css';
import TradingHoursInput from './TradingHoursInput';
// Helper to format date to dd/mm/yyyy
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

// Parse dd/mm/yyyy or yyyy-mm-dd to Date
function parseToDate(val: string): Date | null {
  if (!val) return null;
  // dd/mm/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
    const [d, m, y] = val.split('/');
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  // yyyy-mm-dd
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
  Layers, Mail, MapPin, Maximize2, Phone, Plus, Settings,
  Shield, Upload, Users, X, Image as ImageIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  spaceAddress: string;
  activeFrom: string;
  activeTo: string;
  ownership: string;
  management: string;
  netLettableArea: string;
  longTermNLA: string;
  casualLettableArea: string;
  expectedFootTraffic: string;
  expectedRevenue: string;
  addFloors: string;
  floorNamingPattern: string;
  minPLIValue: string;
};

// â”€â”€ Shared styles â”€â”€

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
};

const iconBtnBase: React.CSSProperties = {
  width: '40px', height: '38px', borderRadius: '8px',
  border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer',
};

const sqMSuffix: React.CSSProperties = {
  position: 'absolute', right: '10px', top: '50%',
  transform: 'translateY(-50%)', fontSize: '11px', color: '#8fafc4', fontWeight: 500,
};

// â”€â”€ Helpers â”€â”€

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

// â”€â”€ Component â”€â”€

export default function CreateSpace() {
  // Floor state for AddFloor
  const [aboveCount, setAboveCount] = useState(0);
  const [undergroundCount, setUndergroundCount] = useState(0);
  const navigate = useNavigate();

  const [form, setForm] = useState<SpaceFormState>({
    spaceName: '', category: 'Retail', spaceWebsite: '', spaceOwner: '', spaceOwnerEmail: '',
    tradingHours: '', managedByEmail: '', managedByPhone: '',
    country: '',
    spaceAddress: '', activeFrom: '', activeTo: '',
    ownership: '', management: '',
    abn: '', acn: '',
    overallRentableArea: '', permanentRentableArea: '',
    otherRentableArea: '', expectedFootTraffic: '',
    expectedRevenue: '', addFloors: '',
    floorNamingPattern: 'Level 1, Level 2, Level 3...',
    minPLIValue: '',
    termsUploaded: false,
  });

  const [precinctInput, setPrecinctInput] = useState('');
  const [precincts, setPrecincts] = useState<string[]>([]);
  const [floorNames, setFloorNames] = useState<string[]>([]);
  const [editingFloor, setEditingFloor] = useState<number | null>(null);
  const [editingFloorName, setEditingFloorName] = useState('');

  const updateField = (key: keyof SpaceFormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleSubmit = () => {
    // Validate required fields
    const newErrors: { [key: string]: string } = {};
    if (!form.spaceName.trim()) newErrors.spaceName = 'Required';
    if (!form.category.trim()) newErrors.category = 'Required';
    if (!form.managedByEmail.trim()) newErrors.managedByEmail = 'Required';
    if (!form.managedByPhone.trim()) newErrors.managedByPhone = 'Required';
    if (!form.country.trim()) newErrors.country = 'Required';
    if (!form.spaceAddress.trim()) newErrors.spaceAddress = 'Required';
    if (!form.activeFrom.trim()) newErrors.activeFrom = 'Required';
    if (!form.activeTo.trim()) newErrors.activeTo = 'Required';
    if (!form.ownership.trim()) newErrors.ownership = 'Required';
    if (!form.abn.trim()) newErrors.abn = 'Required';
    if (!form.acn.trim()) newErrors.acn = 'Required';
    if (!form.minPLIValue.trim()) newErrors.minPLIValue = 'Required';
    if (!form.termsUploaded) newErrors.termsUploaded = 'Required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    toast.success('Space submitted for approval');
    navigate('/manage/spaces');
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

  // â”€â”€ Reusable renderers â”€â”€

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
    <div>
      <label style={labelStyle}>{fieldIcon(Icon)} {label} {required && requiredAsterisk}</label>
      <input style={inputStyle} placeholder={placeholder} value={form[key]} onChange={(e) => updateField(key, e.target.value)} {...extra} />
      {errors[key] && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors[key]}</div>}
    </div>
  );

  const areaField = (label: string, key: keyof SpaceFormState, placeholder: string, required?: boolean) => (
    <div>
      <label style={labelStyle}>{fieldIcon(Maximize2)} {label} {required && requiredAsterisk}</label>
      <div style={{ position: 'relative' }}>
        <input style={{ ...inputStyle, paddingRight: '45px' }} placeholder={placeholder} value={form[key]} onChange={(e) => updateField(key, e.target.value)} />
        <span style={sqMSuffix}>Sq M</span>
      </div>
      {errors[key] && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors[key]}</div>}
    </div>
  );

  // Track generated docs for review
  const [generatedDocs, setGeneratedDocs] = useState<{ [key: string]: boolean }>({});

  const uploadField = (label: string, docKey: string) => (
    <div style={{ display: 'grid', gridTemplateColumns: generatedDocs[docKey] ? '1fr auto auto' : '1fr auto', alignItems: 'end', gap: 12 }}>
      <div style={{ width: '100%' }}>
        <label style={labelStyle}>{fieldIcon(FileText)} {label}</label>
        <div style={{ border: '1px solid #cfd7e2', borderRadius: '6px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#f9fbfc', cursor: 'pointer' }}>
          <Upload size={16} color="#8fafc4" />
          <span style={{ fontSize: '12px', color: '#6b7e91', fontWeight: 500 }}>Upload Document</span>
        </div>
      </div>
      <button
        type="button"
        style={{ background: CYAN, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 600, fontSize: 12, cursor: 'pointer', height: 38, alignSelf: 'end' }}
        onClick={() => setGeneratedDocs(prev => ({ ...prev, [docKey]: true }))}
      >
        Generate using Spacespot templates
      </button>
      {generatedDocs[docKey] && (
        <button
          type="button"
          style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 600, fontSize: 12, cursor: 'pointer', height: 38, alignSelf: 'end' }}
          onClick={() => alert('Reviewing ' + label)}
        >
          Review
        </button>
      )}
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
      <div style={{ maxWidth: '1342px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '32px', alignItems: 'start' }}>

        {/* â”€â”€ Main Content â”€â”€ */}
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
                <div>
                  <label style={labelStyle}>{fieldIcon(Layers)} Category {requiredAsterisk}</label>
                  <select style={selectStyle} value={form.category} onChange={(e) => updateField('category', e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="Retail">Retail</option>
                    <option value="Commercial">Commercial</option>
                    <option value="CoWorking">CoWorking</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                  {errors.category && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors.category}</div>}
                </div>
                <div>
                  <label style={labelStyle}>{fieldIcon(Globe)} Space Website<span style={{ fontWeight: 400, color: '#8a9ab0', fontSize: '11px' }}>(Optional)</span></label>
                  <input style={inputStyle} placeholder="www.beachsideactmall.com" value={form.spaceWebsite} onChange={(e) => updateField('spaceWebsite', e.target.value)} />
                </div>
              </div>

              <div style={twoColStyle}>
                <div>
                  <label style={labelStyle}>{fieldIcon(Building2)} Space Registered to (Space Owner)</label>
                  <input style={inputStyle} placeholder="CVQ Properties" value={form.spaceOwner} onChange={e => updateField('spaceOwner', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>{fieldIcon(Mail)} Space Owner (Email)</label>
                  <input style={inputStyle} placeholder="Chris.Hemsworth@cvq.com" value={form.spaceOwnerEmail} onChange={e => updateField('spaceOwnerEmail', e.target.value)} />
                </div>
              </div>


              <div style={twoColStyle}>
                {textField('Managed By (Space Contributor)', Mail, 'managedByEmail', 'mallmanager@company.com', true)}
                {textField('Phone number (Manager)', Phone, 'managedByPhone', '+61 411111111', true)}
              </div>
              <div>
                <label style={labelStyle}>{fieldIcon(Globe)} Country {requiredAsterisk}</label>
                <select
                  style={selectStyle}
                  value={form.country}
                  onChange={e => updateField('country', e.target.value)}
                >
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
              <div>
                <label style={labelStyle}>{fieldIcon(Clock)} Trading Hours</label>
                <TradingHoursInput
                  value={form.tradingHoursObj}
                  onChange={(obj, summary) => {
                    setForm(prev => ({ ...prev, tradingHoursObj: obj, tradingHours: summary }));
                  }}
                />
                {errors.tradingHours && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors.tradingHours}</div>}
              </div>


              {/* Space Logo */}
              <div>
                <label style={labelStyle}>{fieldIcon(ImageIcon)} Space Logo</label>
                <div style={{ border: '1.5px dashed #b0bec8', borderRadius: '8px', padding: '24px 16px', display: 'grid', placeItems: 'center', backgroundColor: '#fafcfd', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eafaf8', display: 'grid', placeItems: 'center' }}>
                      <Upload size={18} color={CYAN} />
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7e91', fontWeight: 500 }}>Click to upload logo</div>
                    <div style={{ fontSize: '11px', color: '#aab4bf' }}>PNG, JPG up to 5MB</div>
                  </div>
                </div>
              </div>

              {/* Number of floors, Number of underground floors, Floors (AddFloor) moved here */}
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
                <div>
                  <label style={labelStyle}>{fieldIcon(Calendar)} Active From {requiredAsterisk}</label>
                  <DatePicker
                    locale={enAU}
                    selected={parseISOToDate(form.activeFrom)}
                    onChange={date => updateField('activeFrom', formatDateToISO(date))}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="spacespot-datepicker"
                    wrapperClassName="spacespot-datepicker-wrapper"
                    popperClassName="spacespot-datepicker-popper"
                    style={{ width: '100%' }}
                    customInput={
                      <input
                        style={{
                          ...inputStyle,
                          padding: '7px 10px',
                          fontSize: '13px',
                          color: '#1f2937',
                          backgroundColor: '#f9fbfc',
                          border: '1px solid #cfd7e2',
                          borderRadius: '6px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    }
                    autoComplete="off"
                    onChangeRaw={e => {
                      const val = e.target.value;
                      const parsed = parseToDate(val);
                      if (parsed) updateField('activeFrom', formatDateToISO(parsed));
                    }}
                    dateFormatCalendar="eee"
                    formatWeekDay={name => name.replace(/[^A-Z]/g, '').slice(0, 2)}
                    renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 8px 8px' }}>
                        <button type="button" className="react-datepicker__navigation" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} aria-label="Previous Month">
                          <ChevronLeft className="spacespot-datepicker-nav-icon" />
                        </button>
                        <span style={{ fontWeight: 700, fontSize: 16, color: '#1a2b3c' }}>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <button type="button" className="react-datepicker__navigation" onClick={increaseMonth} disabled={nextMonthButtonDisabled} aria-label="Next Month">
                          <ChevronRight className="spacespot-datepicker-nav-icon" />
                        </button>
                      </div>
                    )}
                  />
                  {errors.activeFrom && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors.activeFrom}</div>}
                </div>
                <div>
                  <label style={labelStyle}>{fieldIcon(Calendar)} Active To {requiredAsterisk}</label>
                  <DatePicker
                    locale={enAU}
                    selected={parseISOToDate(form.activeTo)}
                    onChange={date => updateField('activeTo', formatDateToISO(date))}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="spacespot-datepicker"
                    wrapperClassName="spacespot-datepicker-wrapper"
                    popperClassName="spacespot-datepicker-popper"
                    style={{ width: '100%' }}
                    customInput={
                      <input
                        style={{
                          ...inputStyle,
                          padding: '7px 10px',
                          fontSize: '13px',
                          color: '#1f2937',
                          backgroundColor: '#f9fbfc',
                          border: '1px solid #cfd7e2',
                          borderRadius: '6px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    }
                    autoComplete="off"
                    onChangeRaw={e => {
                      const val = e.target.value;
                      const parsed = parseToDate(val);
                      if (parsed) updateField('activeTo', formatDateToISO(parsed));
                    }}
                    dateFormatCalendar="eee"
                    formatWeekDay={name => name.replace(/[^A-Z]/g, '').slice(0, 2)}
                    renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 8px 8px' }}>
                        <button type="button" className="react-datepicker__navigation" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} aria-label="Previous Month">
                          <ChevronLeft className="spacespot-datepicker-nav-icon" />
                        </button>
                        <span style={{ fontWeight: 700, fontSize: 16, color: '#1a2b3c' }}>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <button type="button" className="react-datepicker__navigation" onClick={increaseMonth} disabled={nextMonthButtonDisabled} aria-label="Next Month">
                          <ChevronRight className="spacespot-datepicker-nav-icon" />
                        </button>
                      </div>
                    )}
                  />
                  {errors.activeTo && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2 }}>{errors.activeTo}</div>}
                </div>
              </div>


              {/* Removed Owner Representative (Space Owner) and Management fields as requested */}

              <div style={twoColStyle}>
                {textField('ABN', Info, 'abn', 'e.g., 12 345 678 901', true)}
                {textField('ACN', Info, 'acn', 'e.g., 123 456 789', true)}
              </div>


              <div style={twoColStyle}>
                {areaField('Net Lettable area(NLA)', 'netLettableArea', 'e.g., 5000')}
                {areaField('Long-term NLA', 'longTermNLA', 'e.g., 3800')}
              </div>

              <div style={twoColStyle}>
                {areaField('Casual Lettable Area(CLA)', 'casualLettableArea', 'e.g., 1200')}
                {textField('Expected Foot Traffic (per month)', Users, 'expectedFootTraffic', 'e.g., 10000')}
              </div>

              {textField('Expected Revenue for the Space (per month)', FileText, 'expectedRevenue', 'e.g., 100000')}

              {textField('Min. Public Liability Insurance (AUD)', Shield, 'minPLIValue', '1000000', true)}




              {/* AddFloor moved to Basic Information section above */}

              {/* Remove Space Summary from here if present (was previously below AddFloor) */}

              {/* Add Precincts field removed as requested */}
            </div>
          </div>

          {/* Lease Requirements */}
          <div style={{ ...sectionCardStyle, padding: '24px' }}>
            {sectionHeader(<Shield size={16} color="#fff" />, 'Lease Requirements')}
            <div style={{ display: 'grid', gap: '14px' }}>
              {/* Upload Space T&Cs for tenants - mandatory */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 12 }}>
                <div style={{ width: '100%' }}>
                  <label style={labelStyle}>Upload Space T&Cs for tenants {requiredAsterisk}</label>
                  <div style={{ border: '1px solid #cfd7e2', borderRadius: '6px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#f9fbfc', cursor: 'pointer' }}>
                    <Upload size={16} color="#8fafc4" />
                    <span style={{ fontSize: '12px', color: '#6b7e91', fontWeight: 500 }}>Upload Document</span>
                  </div>
                </div>
                <button
                  type="button"
                  style={{ background: CYAN, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 600, fontSize: 12, cursor: 'pointer', height: 38, alignSelf: 'end' }}
                  onClick={() => setForm(prev => ({ ...prev, termsUploaded: true }))}
                >
                  Generate using Spacespot templates
                </button>
                {errors.termsUploaded && <div style={{ color: '#e11d48', fontSize: '11px', marginTop: 2, gridColumn: '1 / span 2' }}>{errors.termsUploaded}</div>}
              </div>
              {uploadField('Upload Space Safety Guidelines for Tenants', 'safety')}
              {uploadField('Upload Additional Documents (If Any) for Tenants', 'additional')}

              {/* Use SpaceSpot Templates Dropdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 12 }}>
                <div style={{ width: '100%' }}>
                  <label style={labelStyle}>Use SpaceSpot Templates</label>
                  <select style={{ ...inputStyle, width: '100%' }}>
                    <option value="">Select a template</option>
                    <option value="template1">Lease Agreement Template</option>
                    <option value="template2">Safety Guidelines Template</option>
                    <option value="template3">General Terms Template</option>
                  </select>
                </div>
                <button
                  type="button"
                  style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 600, fontSize: 12, cursor: 'pointer', height: 38, alignSelf: 'end' }}
                  onClick={() => alert('Document saved to local')}
                >
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '4px' }}>
            <button type="button" onClick={() => navigate('/manage/spaces')} style={{ border: 'none', backgroundColor: '#9ca3af', color: '#fff', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>

        {/* —— Right Sidebar —— */}
        <aside style={{ position: 'sticky', top: '24px' }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid #dbe5ee', borderRadius: '10px', padding: '24px', fontSize: '13px', boxShadow: '0 2px 8px rgba(20, 216, 204, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <Building2 size={20} color={CYAN} />
              <span style={{ fontWeight: 700, fontSize: '16px', color: NAVY, letterSpacing: '0.01em' }}>Space Summary</span>
            </div>



            {/* Image placeholder - match Unit Summary style */}
            <div style={{ width: '100%', aspectRatio: '16 / 10', backgroundColor: '#17283e', borderRadius: '8px', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={22} color="#4a6a85" />
                <span style={{ fontSize: '10px', color: '#4a6a85', fontWeight: 500 }}>Space Main Image</span>
              </div>
            </div>


            {/* Name and category - match Unit Summary style */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--spacespot-cyan-pale)', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: CYAN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '14px', color: '#fff' }}>
                {form.spaceName ? form.spaceName.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '12px', color: NAVY }}>{form.spaceName || 'Space Name'}</div>
                <div style={{ fontSize: '10px', color: 'var(--spacespot-gray-500)', marginTop: '2px' }}>{form.category || 'Category'}</div>
              </div>
            </div>


            {/* All fields summary, matching Unit summary card spacing and layout */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
              {/* Space Website */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151', marginBottom: 0 }}>
                <Globe size={13} style={{ marginRight: 2 }} />
                <span style={{ fontWeight: 600 }}>Website:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.spaceWebsite || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              {/* Trading Hours - grouped summary */}
              <div style={{ fontSize: '12px', color: '#374151', marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <Clock size={13} style={{ marginRight: 2 }} />
                  <span style={{ fontWeight: 600 }}>Trading Hours:</span>
                </div>
                <div style={{ marginLeft: 22, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {form.tradingHoursObj
                    ? (() => {
                        const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
                        const to12 = t => {
                          if (!t) return '';
                          let [h, m] = t.split(':');
                          h = parseInt(h, 10);
                          const ampm = h >= 12 ? 'PM' : 'AM';
                          h = h % 12 || 12;
                          return `${h}.${m.padStart(2, '0')} ${ampm}`;
                        };
                        // Build array of {days: [..], str}
                        let groups = [];
                        let prev = null;
                        let group = null;
                        for (let i = 0; i < DAYS.length; i++) {
                          const day = DAYS[i];
                          const val = form.tradingHoursObj[day];
                          let str;
                          if (!val || !val.open || !val.close) {
                            str = 'Closed';
                          } else {
                            str = `${to12(val.open)} - ${to12(val.close)}`;
                          }
                          if (!group) {
                            group = { start: day, end: day, str };
                          } else if (group.str === str) {
                            group.end = day;
                          } else {
                            groups.push(group);
                            group = { start: day, end: day, str };
                          }
                        }
                        if (group) groups.push(group);
                        return groups.map((g, idx) => (
                          <div key={idx} style={{ color: g.str === 'Closed' ? '#b0bec5' : '#6b7e91', fontWeight: 500 }}>
                            <span style={{ width: 70, display: 'inline-block', fontWeight: 600, color: '#374151' }}>
                              {g.start === g.end ? g.start : `${g.start}-${g.end}`}:
                            </span> {g.str}
                          </div>
                        ));
                      })()
                    : <span style={{ color: '#b0bec5' }}>N/A</span>}
                </div>
              </div>
              {/* Managed By (Space Contributor) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151', marginBottom: 0 }}>
                <Mail size={13} style={{ marginRight: 2 }} />
                <span style={{ fontWeight: 600 }}>Managed By:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.managedByEmail || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              {/* Phone number (Manager) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151', marginBottom: 0 }}>
                <Phone size={13} style={{ marginRight: 2 }} />
                <span style={{ fontWeight: 600 }}>Manager Phone:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.managedByPhone || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              {/* Country */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151', marginBottom: 0 }}>
                <Globe size={13} style={{ marginRight: 2 }} />
                <span style={{ fontWeight: 600 }}>Country:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.country || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              {/* Space Address */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151', marginBottom: 0 }}>
                <MapPin size={13} style={{ marginRight: 2 }} />
                <span style={{ fontWeight: 600 }}>Address:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.spaceAddress || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              {/* Active From/To */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151', marginBottom: 0 }}>
                <Calendar size={13} style={{ marginRight: 2 }} />
                <span style={{ fontWeight: 600 }}>Active:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.activeFrom ? formatDateToDisplay(form.activeFrom) : <span style={{ color: '#b0bec5' }}>N/A</span>} - {form.activeTo ? formatDateToDisplay(form.activeTo) : <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              {/* Owner Representative (Space Owner) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151', marginBottom: 0 }}>
                <Building2 size={13} style={{ marginRight: 2 }} />
                <span style={{ fontWeight: 600 }}>Owner Rep:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.ownership || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              {/* Management */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151', marginBottom: 0 }}>
                <Users size={13} style={{ marginRight: 2 }} />
                <span style={{ fontWeight: 600 }}>Management:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.management || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              {/* ABN/ACN */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151', marginBottom: 0 }}>
                <Info size={13} style={{ marginRight: 2 }} />
                <span style={{ fontWeight: 600 }}>ABN:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.abn || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
                <span style={{ fontWeight: 600, marginLeft: 10 }}>ACN:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.acn || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              {/* Net Lettable Area, Long-term NLA, Casual Lettable Area */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151', marginBottom: 0 }}>
                <Maximize2 size={13} style={{ marginRight: 2 }} />
                <span style={{ fontWeight: 600 }}>NLA:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.netLettableArea || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
                <span style={{ fontWeight: 600, marginLeft: 10 }}>Long-term NLA:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.longTermNLA || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
                <span style={{ fontWeight: 600, marginLeft: 10 }}>CLA:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.casualLettableArea || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              {/* Expected Foot Traffic, Expected Revenue */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151', marginBottom: 0 }}>
                <Users size={13} style={{ marginRight: 2 }} />
                <span style={{ fontWeight: 600 }}>Foot Traffic:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.expectedFootTraffic || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
                <FileText size={13} style={{ marginLeft: 10, marginRight: 2 }} />
                <span style={{ fontWeight: 600 }}>Revenue:</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.expectedRevenue || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
              {/* Min. Public Liability Insurance */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#374151', marginBottom: 0 }}>
                <Shield size={13} style={{ marginRight: 2 }} />
                <span style={{ fontWeight: 600 }}>Min. PLI (AUD):</span>
                <span style={{ color: '#6b7e91', fontWeight: 500 }}>{form.minPLIValue || <span style={{ color: '#b0bec5' }}>N/A</span>}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {sidebarRow(MapPin, form.spaceAddress, 'No address')}
              {sidebarRow(Mail, form.managedByEmail, 'No email')}
              {sidebarRow(Phone, form.managedByPhone, 'No phone')}
            </div>

            {/* Floor info summary */}
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
