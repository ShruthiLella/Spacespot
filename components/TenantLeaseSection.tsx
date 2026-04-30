import React from 'react';

interface TenantLeaseSectionProps {
  form: any;
  updateField: (key: string, value: string) => void;
  inputStyle: React.CSSProperties;
  tenantDetailsLabelStyle: React.CSSProperties;
  sectionCard: React.CSSProperties;
}

const TenantLeaseSection: React.FC<TenantLeaseSectionProps> = ({
  form,
  updateField,
  inputStyle,
  tenantDetailsLabelStyle,
  sectionCard,
}) => (
  <div style={sectionCard}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)', lineHeight: 1 }}>Lease Details</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 12px' }}>
      <div>
        <label style={tenantDetailsLabelStyle}>Lease Start Date</label>
        <input style={inputStyle} value={form.leaseStartDate} onChange={(e) => updateField('leaseStartDate', e.target.value)} />
      </div>
    </div>
  </div>
);

export default TenantLeaseSection;
