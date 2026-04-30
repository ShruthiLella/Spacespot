import React from 'react';
import { Building2, Upload } from 'lucide-react';
import type { TenantFormData } from './EditTenant';

interface TenantDetailsSectionProps {
  form: TenantFormData;
  updateField: (key: string, value: string) => void;
  inputStyle: React.CSSProperties;
  tenantDetailsLabelStyle: React.CSSProperties;
  sectionCard: React.CSSProperties;
}

const TenantDetailsSection: React.FC<TenantDetailsSectionProps> = ({
  form,
  updateField,
  inputStyle,
  tenantDetailsLabelStyle,
  sectionCard,
}) => (
  <div style={sectionCard}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: '#dff9f7', display: 'grid', placeItems: 'center' }}>
        <Building2 size={10} color="var(--spacespot-cyan-primary)" />
      </div>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)', lineHeight: 1 }}>Tenant Details</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 12px' }}>
      <div>
        <label style={tenantDetailsLabelStyle}>Tenant Brand Name *</label>
        <input style={inputStyle} value={form.tenantBrandName} onChange={(e) => updateField('tenantBrandName', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Brand Category</label>
        <select style={inputStyle} value={form.brandCategory} onChange={(e) => updateField('brandCategory', e.target.value)}>
          <option>Retail</option>
          <option>Telecommunication</option>
          <option>Food & Beverage</option>
          <option>Health & Wellness</option>
        </select>
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Owner Name *</label>
        <input style={inputStyle} value={form.ownerName} onChange={(e) => updateField('ownerName', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Reference/Responsible Name</label>
        <input style={inputStyle} value={form.referenceName} onChange={(e) => updateField('referenceName', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Tenant Level</label>
        <input style={inputStyle} value={form.tenantLevel} onChange={(e) => updateField('tenantLevel', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Email *</label>
        <input style={inputStyle} value={form.email} onChange={(e) => updateField('email', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Phone Number (Primary)</label>
        <input style={inputStyle} value={form.primaryPhone} onChange={(e) => updateField('primaryPhone', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Phone Number (Secondary)</label>
        <input style={inputStyle} value={form.secondaryPhone} onChange={(e) => updateField('secondaryPhone', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Business Website</label>
        <input style={inputStyle} value={form.businessWebsite} onChange={(e) => updateField('businessWebsite', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Preferred Space-Unit</label>
        <input style={inputStyle} value={form.preferredSpaceUnit} onChange={(e) => updateField('preferredSpaceUnit', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Proposed Usage of the Unit</label>
        <input style={inputStyle} value={form.proposedUsage} onChange={(e) => updateField('proposedUsage', e.target.value)} />
      </div>
      <div />
      <div style={{ gridColumn: '1 / span 2' }}>
        <label style={tenantDetailsLabelStyle}>Address</label>
        <input style={inputStyle} value={form.address1} onChange={(e) => updateField('address1', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Brand Logo</label>
        <button type="button" style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px', cursor: 'pointer', backgroundColor: '#f8fbfd' }}>
          <Upload size={11} color="var(--spacespot-cyan-primary)" /> Upload image
        </button>
      </div>
    </div>
  </div>
);

export default TenantDetailsSection;
