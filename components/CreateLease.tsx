import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  FileCheck,
  FileText,
  Info,
  Search,
} from 'lucide-react';

type LeaseFormData = {
  leaseId: string;
  leaseForUnitId: string;
  leasedTo: string;
  leasePrice: string;
  leasePeriodCount: string;
  leasePeriodUnit: string;
  leaseStartDate: string;
  leaseEndDate: string;
  spaceTncStatus: 'Accepted' | 'Pending';
  privacyAuthStatus: 'Received' | 'Pending';
  pliStatus: 'Received' | 'Pending';
  pliValidAmount: string;
  pliValidUntil: string;
  leaseInvoicePeriod: string;
  invoiceStatus: 'Generate Invoice' | 'Invoice generated' | 'Preview Invoice';
  advancePaymentReceived: 'Yes' | 'No';
  paymentStatus: 'Received' | 'Pending';
};

const sectionCard: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1.5px solid #9fe5df',
  borderRadius: '8px',
  padding: '10px',
};

const leaseDetailsCard: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1.5px solid #6f7b8d',
  borderRadius: '10px',
  padding: '12px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  color: 'var(--spacespot-navy-primary)',
  marginBottom: '6px',
  display: 'block',
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '30px',
  border: '1px solid #7f8ea1',
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  fontSize: '10px',
  color: '#203249',
  padding: '0 8px',
  boxSizing: 'border-box',
};

export default function CreateLease() {
  const navigate = useNavigate();
  const [isInvoiceGenerated, setIsInvoiceGenerated] = useState(false);
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);

  const [form, setForm] = useState<LeaseFormData>({
    leaseId: 'LEASE-S8W-879940',
    leaseForUnitId: '',
    leasedTo: '',
    leasePrice: '',
    leasePeriodCount: '',
    leasePeriodUnit: 'Select an option',
    leaseStartDate: '',
    leaseEndDate: '',
    spaceTncStatus: 'Accepted',
    privacyAuthStatus: 'Pending',
    pliStatus: 'Received',
    pliValidAmount: 'e.g., $10,000',
    pliValidUntil: '',
    leaseInvoicePeriod: 'Select an option',
    invoiceStatus: 'Preview Invoice',
    advancePaymentReceived: 'No',
    paymentStatus: 'Pending',
  });

  const updateField = <K extends keyof LeaseFormData>(key: K, value: LeaseFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleConfirmLease = () => {
    toast.success('Lease created successfully');
    navigate('/manage/leases');
  };

  const handleGenerateInvoice = () => {
    setIsInvoiceGenerated(true);
    updateField('invoiceStatus', 'Invoice generated');
    toast.success('Invoice generated');
  };

  return (
    <div style={{ padding: '12px 10px 20px', backgroundColor: '#eef2f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button
            type="button"
            style={{
              border: '1px solid #d0dae5',
              backgroundColor: '#1e2f46',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '11px',
              height: '28px',
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            All Spaces <ChevronDown size={13} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '10px', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '8px', paddingRight: '250px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#1fc8bf',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 6px 10px rgba(20, 216, 204, 0.2)',
                }}
              >
                <FileText size={15} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '20px', color: 'var(--spacespot-navy-primary)', fontWeight: 700, lineHeight: 1.1 }}>Create Lease</div>
                <div style={{ fontSize: '11px', color: 'var(--spacespot-gray-500)', marginTop: '2px' }}>Set up a new lease agreement</div>
              </div>
            </div>

            <div style={leaseDetailsCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: '#dff9f7', display: 'grid', placeItems: 'center' }}>
                  <Calendar size={10} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Lease Details</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 12px' }}>
                <div>
                  <label style={labelStyle}>Lease ID *</label>
                  <input style={inputStyle} value={form.leaseId} onChange={(e) => updateField('leaseId', e.target.value)} />
                </div>

                <div>
                  <label style={labelStyle}>Lease For (Unit ID) *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px' }}>
                    <input style={inputStyle} value={form.leaseForUnitId} onChange={(e) => updateField('leaseForUnitId', e.target.value)} placeholder="Select unit" />
                    <button type="button" style={{ height: '30px', border: 'none', borderRadius: '4px', backgroundColor: '#6b7788', color: '#ffffff', fontSize: '10px', padding: '0 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Search size={11} /> Lookup
                    </button>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Leased To (Customer) *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px' }}>
                    <input style={inputStyle} value={form.leasedTo} onChange={(e) => updateField('leasedTo', e.target.value)} placeholder="Select customer" />
                    <button type="button" style={{ height: '30px', border: 'none', borderRadius: '4px', backgroundColor: '#6b7788', color: '#ffffff', fontSize: '10px', padding: '0 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Search size={11} /> Lookup
                    </button>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Lease Price <span style={{ color: 'var(--spacespot-gray-500)' }}>(Auto-populated or overwrite)</span></label>
                  <input style={inputStyle} value={form.leasePrice} onChange={(e) => updateField('leasePrice', e.target.value)} placeholder="e.g., $1000 per day" />
                </div>

                <div>
                  <label style={labelStyle}>Lease Period</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <input style={inputStyle} value={form.leasePeriodCount} onChange={(e) => updateField('leasePeriodCount', e.target.value)} placeholder="Number" />
                    <select style={inputStyle} value={form.leasePeriodUnit} onChange={(e) => updateField('leasePeriodUnit', e.target.value)}>
                      <option>Select an option</option>
                      <option>Month</option>
                      <option>Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Lease Start Date</label>
                  <input style={inputStyle} value={form.leaseStartDate} onChange={(e) => updateField('leaseStartDate', e.target.value)} placeholder="mm/dd/yyyy" />
                </div>

                <div>
                  <label style={labelStyle}>Lease End Date</label>
                  <input style={inputStyle} value={form.leaseEndDate} onChange={(e) => updateField('leaseEndDate', e.target.value)} placeholder="mm/dd/yyyy" />
                </div>
              </div>
            </div>

            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '5px', backgroundColor: '#dff9f7', display: 'grid', placeItems: 'center' }}>
                  <FileCheck size={9} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Terms & Conditions Documents</span>
              </div>

              <div style={{ display: 'grid', gap: '9px' }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Space T&C's (Guidelines)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#f2f4f7', borderRadius: '999px', padding: '2px' }}>
                    {['Accepted', 'Pending'].map((status) => {
                      const active = form.spaceTncStatus === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateField('spaceTncStatus', status as 'Accepted' | 'Pending')}
                          style={{
                            border: 'none',
                            borderRadius: '999px',
                            height: '16px',
                            fontSize: '7px',
                            cursor: 'pointer',
                            backgroundColor: active ? 'var(--spacespot-success)' : 'transparent',
                            color: active ? '#ffffff' : 'var(--spacespot-gray-400)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                          }}
                        >
                          {!active && <Clock3 size={7} />} {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Privacy & Authorization</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#f2f4f7', borderRadius: '999px', padding: '2px' }}>
                    {['Received', 'Pending'].map((status) => {
                      const active = form.privacyAuthStatus === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateField('privacyAuthStatus', status as 'Received' | 'Pending')}
                          style={{
                            border: 'none',
                            borderRadius: '999px',
                            height: '16px',
                            fontSize: '7px',
                            cursor: 'pointer',
                            backgroundColor: active ? (status === 'Pending' ? 'var(--spacespot-warning)' : '#9ca3af') : 'transparent',
                            color: active ? '#ffffff' : 'var(--spacespot-gray-400)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                          }}
                        >
                          {!active && <Clock3 size={7} />} {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Unit Terms & Conditions</label>
                  <button
                    type="button"
                    style={{
                      ...inputStyle,
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '8px', color: '#7f8ea1' }}>
                      <CheckCircle2 size={9} color="var(--spacespot-cyan-primary)" /> Upload Signed Copy
                    </span>
                    <span style={{ fontSize: '7px', color: 'var(--spacespot-gray-400)' }}>Not set</span>
                  </button>
                </div>

                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Lease confirmation form</label>
                  <button
                    type="button"
                    style={{
                      ...inputStyle,
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '8px', color: '#7f8ea1' }}>
                      <CheckCircle2 size={9} color="var(--spacespot-cyan-primary)" /> Upload Signed Copy
                    </span>
                    <span style={{ fontSize: '7px', color: 'var(--spacespot-gray-400)' }}>Not set</span>
                  </button>
                </div>
              </div>
            </div>

            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '5px', backgroundColor: '#dff9f7', display: 'grid', placeItems: 'center' }}>
                  <CreditCard size={9} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Payment</span>
              </div>

              <div style={{ display: 'grid', gap: '9px' }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>PLI</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#f2f4f7', borderRadius: '999px', padding: '2px' }}>
                    {['Received', 'Pending'].map((status) => {
                      const active = form.pliStatus === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            updateField('pliStatus', status as 'Received' | 'Pending');
                            if (status === 'Received') {
                              updateField('advancePaymentReceived', 'No');
                              updateField('paymentStatus', 'Pending');
                            }
                          }}
                          style={{
                            border: 'none',
                            borderRadius: '999px',
                            height: '16px',
                            fontSize: '7px',
                            cursor: 'pointer',
                            backgroundColor: active ? (status === 'Received' ? 'var(--spacespot-success)' : 'var(--spacespot-warning)') : 'transparent',
                            color: active ? '#ffffff' : 'var(--spacespot-gray-400)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                          }}
                        >
                          {!active && <Clock3 size={7} />} {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {form.pliStatus === 'Received' && (
                  <div style={{ border: '1px solid #14D8CC', borderRadius: '6px', padding: '8px', backgroundColor: '#d9edf0' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, color: 'var(--spacespot-navy-primary)', marginBottom: '6px' }}>PLI Valid</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '2px' }}>
                      <div style={{ fontSize: '6px', color: '#66788d' }}>Amount</div>
                      <div style={{ fontSize: '6px', color: '#66788d' }}>Valid Until</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <input style={{ ...inputStyle, height: '24px', fontSize: '8px' }} value={form.pliValidAmount} onChange={(e) => updateField('pliValidAmount', e.target.value)} placeholder="e.g., $10,000" />
                      <input style={{ ...inputStyle, height: '24px', fontSize: '8px' }} value={form.pliValidUntil} onChange={(e) => updateField('pliValidUntil', e.target.value)} placeholder="mm/dd/yyyy" />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Lease Invoice Period</label>
                  <select style={{ ...inputStyle, height: '26px', fontSize: '8px' }} value={form.leaseInvoicePeriod} onChange={(e) => updateField('leaseInvoicePeriod', e.target.value)}>
                    <option>Select an option</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                  </select>
                </div>

                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Invoice</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleGenerateInvoice}
                      style={{
                        border: 'none',
                        borderRadius: '6px',
                        height: '26px',
                        minWidth: '120px',
                        padding: '0 12px',
                        fontSize: '8px',
                        cursor: 'pointer',
                        backgroundColor: '#6b7280',
                        color: '#ffffff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle2 size={9} /> Generate Invoice <FileText size={9} />
                    </button>

                    {isInvoiceGenerated && (
                      <button
                        type="button"
                        onClick={() => {
                          updateField('invoiceStatus', 'Preview Invoice');
                          setIsInvoicePreviewOpen(true);
                        }}
                        style={{
                          border: 'none',
                          borderRadius: '6px',
                          height: '26px',
                          minWidth: '105px',
                          padding: '0 12px',
                          fontSize: '8px',
                          cursor: 'pointer',
                          backgroundColor: '#16c8bd',
                          color: '#ffffff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontWeight: 600,
                        }}
                      >
                        <FileText size={9} /> Preview Invoice
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f3f5f8', borderRadius: '6px', padding: '8px' }}>
                  <div style={{ fontSize: '8px', color: 'var(--spacespot-navy-primary)', marginBottom: '5px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Bell size={8} color="var(--spacespot-cyan-primary)" /> Setup Email Reminder to Customer
                  </div>
                  <div style={{ display: 'grid', gap: '2px', fontSize: '7px', color: 'var(--spacespot-gray-500)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '7px', height: '7px', backgroundColor: '#3f3f46', display: 'inline-block' }} /> A week before the payment date</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '7px', height: '7px', backgroundColor: '#3f3f46', display: 'inline-block' }} /> 3 days before the payment date</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '7px', height: '7px', backgroundColor: '#3f3f46', display: 'inline-block' }} /> A day before the payment date</span>
                  </div>
                </div>

                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Advance Payment Received <span style={{ color: 'var(--spacespot-gray-500)' }}>(7 days before commencement)</span></label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#f2f4f7', borderRadius: '999px', padding: '2px' }}>
                    {['Yes', 'No'].map((status) => {
                      const active = form.advancePaymentReceived === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateField('advancePaymentReceived', status as 'Yes' | 'No')}
                          style={{
                            border: 'none',
                            borderRadius: '999px',
                            height: '16px',
                            fontSize: '7px',
                            cursor: 'pointer',
                            backgroundColor: active ? (status === 'Yes' ? 'var(--spacespot-success)' : 'var(--spacespot-warning)') : 'transparent',
                            color: active ? '#ffffff' : 'var(--spacespot-gray-400)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                          }}
                        >
                          {!active && <Clock3 size={7} />} {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>Payment</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#f2f4f7', borderRadius: '999px', padding: '2px' }}>
                    {['Received', 'Pending'].map((status) => {
                      const active = form.paymentStatus === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateField('paymentStatus', status as 'Received' | 'Pending')}
                          style={{
                            border: 'none',
                            borderRadius: '999px',
                            height: '16px',
                            fontSize: '7px',
                            cursor: 'pointer',
                            backgroundColor: active ? (status === 'Received' ? '#9ca3af' : 'var(--spacespot-warning)') : 'transparent',
                            color: active ? '#ffffff' : 'var(--spacespot-gray-400)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                          }}
                        >
                          {!active && <Clock3 size={7} />} {status}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...sectionCard, borderColor: '#f4c978' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: '#fff7e8', display: 'grid', placeItems: 'center' }}>
                  <Info size={10} color="var(--spacespot-warning)" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Administration Actions</span>
              </div>

              <button
                type="button"
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#6b7280',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: 600,
                  height: '24px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                }}
              >
                Send T&C's to Customer
              </button>

              <div style={{ fontSize: '8px', color: '#8a99aa', lineHeight: 1.4, backgroundColor: 'var(--spacespot-gray-50)', borderRadius: '6px', padding: '8px' }}>
                Pending Leases to Approve
                <br />
                This lease will be sent to Administration for approval. Approved leases will be created automatically.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                style={{
                  border: '1px solid #cdd7e3',
                  backgroundColor: '#f8fafd',
                  borderRadius: '6px',
                  color: '#4d5f75',
                  fontSize: '10px',
                  height: '26px',
                  padding: '0 12px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>

          <aside
            style={{
              position: 'fixed',
              top: '96px',
              right: '32px',
              width: '230px',
              zIndex: 20,
              display: 'grid',
              gap: '8px',
            }}
          >
            <div style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '6px', backgroundColor: '#dff9f7', display: 'grid', placeItems: 'center' }}>
                  <FileText size={9} color="var(--spacespot-cyan-primary)" />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Lease Summary</span>
              </div>

              <div style={{ backgroundColor: '#d9edf0', borderRadius: '6px', padding: '8px', marginBottom: '8px' }}>
                <div style={{ fontSize: '7px', color: 'var(--spacespot-gray-500)' }}>Lease ID</div>
                <div style={{ fontSize: '9px', color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>{form.leaseId}</div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#e4edf5', margin: '7px 0' }} />
              <div style={{ fontSize: '10px', color: 'var(--spacespot-navy-primary)', fontWeight: 600, marginBottom: '7px' }}>Document Status</div>
              <div style={{ display: 'grid', gap: '6px', marginBottom: '8px' }}>
                {[
                  "Space T&C's",
                  'Privacy & Auth',
                  "Unit T&C's",
                  'Lease Confirmation',
                  'Advance Payment',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '9px', color: 'var(--spacespot-gray-500)' }}>{item}</span>
                    <Clock3 size={10} color="#6f7b8d" />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleConfirmLease}
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: 'var(--spacespot-navy-primary)',
                  color: '#ffffff',
                  fontSize: '11px',
                  height: '34px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Calendar size={12} /> Confirm Lease
              </button>
            </div>

            <div style={{ ...sectionCard, padding: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                <Info size={9} color="var(--spacespot-cyan-primary)" />
                <span style={{ fontSize: '8px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Required Fields</span>
              </div>
              <div style={{ fontSize: '7px', color: '#8a99aa', lineHeight: 1.4 }}>
                Lease ID, Unit ID, and Customer are required to create a lease.
              </div>
            </div>
          </aside>

          {isInvoicePreviewOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.45)',
                display: 'grid',
                placeItems: 'center',
                zIndex: 140,
              }}
            >
              <div
                style={{
                  width: '560px',
                  maxWidth: 'calc(100vw - 24px)',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  overflow: 'hidden',
                  border: '1px solid #d5e2ee',
                }}
              >
                <div style={{ background: 'linear-gradient(90deg, #14D8CC 0%, #19a7a0 100%)', padding: '12px 16px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.1 }}>Invoice Preview</div>
                    <div style={{ fontSize: '11px', opacity: 0.9 }}>Generated on {new Date().toLocaleDateString()}</div>
                  </div>
                  <button onClick={() => setIsInvoicePreviewOpen(false)} style={{ border: 'none', backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
                </div>

                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '24px', color: '#16bfb6', fontWeight: 700 }}>SpaceSpot</div>
                      <div style={{ fontSize: '12px', color: 'var(--spacespot-gray-500)' }}>Venue & Space Management</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>INVOICE</div>
                      <div style={{ fontSize: '11px', color: 'var(--spacespot-gray-500)' }}>Invoice #: {form.leaseId}</div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #e4edf5', margin: '10px 0' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ backgroundColor: '#f5f7fa', borderRadius: '8px', padding: '10px' }}>
                      <div style={{ fontSize: '11px', color: '#16bfb6', fontWeight: 700, marginBottom: '6px' }}>BILL TO</div>
                      <div style={{ fontSize: '14px', color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>{form.leasedTo || 'ABC Phones'}</div>
                    </div>
                    <div style={{ backgroundColor: '#f5f7fa', borderRadius: '8px', padding: '10px' }}>
                      <div style={{ fontSize: '11px', color: '#16bfb6', fontWeight: 700, marginBottom: '6px' }}>LEASE DETAILS</div>
                      <div style={{ fontSize: '14px', color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>{form.leaseForUnitId || 'Beach Plaza - Level 1 - Unit 2'}</div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#d9edf0', borderRadius: '8px', padding: '8px 10px', marginBottom: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--spacespot-gray-500)' }}>Lease Start Date</div>
                      <div style={{ fontSize: '12px', color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>{form.leaseStartDate || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--spacespot-gray-500)' }}>Lease End Date</div>
                      <div style={{ fontSize: '12px', color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>{form.leaseEndDate || 'N/A'}</div>
                    </div>
                  </div>

                  <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5ecf4', marginBottom: '12px' }}>
                    <div style={{ backgroundColor: 'var(--spacespot-navy-primary)', color: '#ffffff', display: 'grid', gridTemplateColumns: '1.2fr .8fr .8fr', fontSize: '12px', fontWeight: 700 }}>
                      <div style={{ padding: '10px' }}>Description</div>
                      <div style={{ padding: '10px' }}>Period</div>
                      <div style={{ padding: '10px' }}>Amount</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr .8fr', fontSize: '12px', color: 'var(--spacespot-navy-primary)' }}>
                      <div style={{ padding: '10px' }}>Lease Payment</div>
                      <div style={{ padding: '10px' }}>N/A</div>
                      <div style={{ padding: '10px', fontWeight: 700 }}>{form.leasePrice || '$1200 per day'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
                    {['Print Invoice', 'Download PDF', 'Close Preview'].map((action) => (
                      <button key={action} type="button" onClick={() => action === 'Close Preview' && setIsInvoicePreviewOpen(false)} style={{ height: '34px', border: 'none', borderRadius: '8px', backgroundColor: action === 'Close Preview' ? 'var(--spacespot-navy-primary)' : '#6b7280', color: '#ffffff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        {action}
                      </button>
                    ))}
                  </div>

                  <div style={{ backgroundColor: '#f5f7fa', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--spacespot-navy-primary)', marginBottom: '6px' }}>Payment Information</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--spacespot-gray-500)' }}>Invoice Period:</div>
                        <div style={{ fontSize: '12px', color: 'var(--spacespot-navy-primary)' }}>{form.leaseInvoicePeriod === 'Select an option' ? 'Not Set' : form.leaseInvoicePeriod}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--spacespot-gray-500)' }}>Payment Status:</div>
                        <div style={{ fontSize: '12px', color: 'var(--spacespot-warning)', fontWeight: 700 }}>{form.paymentStatus}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



