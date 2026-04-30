import React from 'react';

interface TenantLegalSectionProps {
  form: any;
  updateField: (key: string, value: string) => void;
  inputStyle: React.CSSProperties;
  tenantDetailsLabelStyle: React.CSSProperties;
  sectionCard: React.CSSProperties;
}

const TenantLegalSection: React.FC<TenantLegalSectionProps> = ({
  form,
  updateField,
  inputStyle,
  tenantDetailsLabelStyle,
  sectionCard,
}) => (
  <div style={sectionCard}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)', lineHeight: 1 }}>Legal Details</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 12px' }}>
      <div>
        <label style={tenantDetailsLabelStyle}>ABN</label>
        <input style={inputStyle} value={form.abn} onChange={(e) => updateField('abn', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>ACN</label>
        <input style={inputStyle} value={form.acn} onChange={(e) => updateField('acn', e.target.value)} />
      </div>
    </div>
  </div>
);

export default TenantLegalSection;
