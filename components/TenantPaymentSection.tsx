import React from 'react';

interface TenantPaymentSectionProps {
  form: any;
  updateField: (key: string, value: string) => void;
  inputStyle: React.CSSProperties;
  tenantDetailsLabelStyle: React.CSSProperties;
  sectionCard: React.CSSProperties;
}

const TenantPaymentSection: React.FC<TenantPaymentSectionProps> = ({
  form,
  updateField,
  inputStyle,
  tenantDetailsLabelStyle,
  sectionCard,
}) => (
  <div style={sectionCard}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)', lineHeight: 1 }}>Payment Details</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 12px' }}>
      <div>
        <label style={tenantDetailsLabelStyle}>Payment Method</label>
        <input style={inputStyle} value={form.paymentMethod} onChange={(e) => updateField('paymentMethod', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Payment Frequency</label>
        <input style={inputStyle} value={form.paymentFrequency} onChange={(e) => updateField('paymentFrequency', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Invoice Start Date</label>
        <input style={inputStyle} value={form.invoiceStartDate} onChange={(e) => updateField('invoiceStartDate', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Security Deposit</label>
        <input style={inputStyle} value={form.securityDeposit} onChange={(e) => updateField('securityDeposit', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Billing Address</label>
        <input style={inputStyle} value={form.billingAddress} onChange={(e) => updateField('billingAddress', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>GST Eligible</label>
        <input style={inputStyle} value={form.gstEligible} onChange={(e) => updateField('gstEligible', e.target.value)} />
      </div>
      <div>
        <label style={tenantDetailsLabelStyle}>Tax Authority Type</label>
        <input style={inputStyle} value={form.taxAuthorityType} onChange={(e) => updateField('taxAuthorityType', e.target.value)} />
      </div>
    </div>
  </div>
);

export default TenantPaymentSection;
