import React from 'react';

interface TenantVerificationSectionProps {
  form: any;
  updateField: (key: string, value: string) => void;
  inputStyle: React.CSSProperties;
  tenantDetailsLabelStyle: React.CSSProperties;
  sectionCard: React.CSSProperties;
}

const TenantVerificationSection: React.FC<TenantVerificationSectionProps> = ({
  form,
  updateField,
  inputStyle,
  tenantDetailsLabelStyle,
  sectionCard,
}) => (
  <div style={sectionCard}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)', lineHeight: 1 }}>Verification & Checks</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 12px' }}>
      <div>
        <label style={tenantDetailsLabelStyle}>Verification Status</label>
        <input style={inputStyle} value={form.verificationStatus} onChange={(e) => updateField('verificationStatus', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Insurance Check Status</label>
        <input style={inputStyle} value={form.insuranceCheckStatus} onChange={(e) => updateField('insuranceCheckStatus', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Identity Check Status</label>
        <input style={inputStyle} value={form.identityCheckStatus} onChange={(e) => updateField('identityCheckStatus', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Financial Check Status</label>
        <input style={inputStyle} value={form.financialCheckStatus} onChange={(e) => updateField('financialCheckStatus', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Terms Acceptance Status</label>
        <input style={inputStyle} value={form.tcAcceptanceStatus} onChange={(e) => updateField('tcAcceptanceStatus', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Advance Payment Status</label>
        <input style={inputStyle} value={form.advancePaymentStatus} onChange={(e) => updateField('advancePaymentStatus', e.target.value)} />
      </div>
    </div>
  </div>
);

export default TenantVerificationSection;
