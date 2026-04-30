import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Download,
  Eye,
  FileText,
  Pencil,
  Search,
  User,
} from 'lucide-react';

type LeaseStatus = 'Approved' | 'Pending' | 'Active' | 'Expired';

type Lease = {
  code: string;
  title: string;
  unit: string;
  tenant: string;
  tenantId: string;
  contact: string;
  period: string;
  amount: string;
  status: LeaseStatus;
};

const LEASES: Lease[] = [
  {
    code: 'LEASE-FMK-1235-56',
    title: 'Approved',
    unit: 'BEACH-L1-U2',
    tenant: 'ABC Phones',
    tenantId: 'TENANT-001',
    contact: 'John Phillip',
    period: '03/03/2024 - 03/03/2027',
    amount: '$1200 per day',
    status: 'Approved',
  },
  {
    code: 'LEASE-VY-769842',
    title: 'Pending Validation',
    unit: 'BEACH-L1-U9',
    tenant: '123 Blinds',
    tenantId: 'TENANT-009',
    contact: 'Sarah Mitchell',
    period: '03/03/2024 - 03/03/2026',
    amount: '$1000 per day',
    status: 'Pending',
  },
  {
    code: 'LEASE-BFI-345870',
    title: 'Active',
    unit: 'CITY-L2-U5',
    tenant: 'Super Supplements',
    tenantId: 'TENANT-015',
    contact: 'Mike Cohen',
    period: '03/03/2024 - 03/03/2028',
    amount: '$950 per day',
    status: 'Active',
  },
  {
    code: 'LEASE-MT-00734',
    title: 'Pending Review',
    unit: 'BAY-L1-U3',
    tenant: '123 Real Estate',
    tenantId: 'TENANT-022',
    contact: 'Thompson',
    period: '03/03/2024 - 03/03/2025',
    amount: '$800 per day',
    status: 'Pending',
  },
  {
    code: 'LEASE-RA-920184',
    title: 'Expired',
    unit: 'SUN-L3-U4',
    tenant: 'Fresh Bites',
    tenantId: 'TENANT-030',
    contact: 'David Wilson',
    period: '03/03/2021 - 03/03/2024',
    amount: '$700 per day',
    status: 'Expired',
  },
  {
    code: 'LEASE-MNO-234567',
    title: 'Active',
    unit: 'CITY-L1-U7',
    tenant: 'Retail Hub',
    tenantId: 'TENANT-031',
    contact: 'Sophie',
    period: '03/03/2024 - 03/03/2029',
    amount: '$1100 per day',
    status: 'Active',
  },
];

const cardBase: React.CSSProperties = {
  backgroundColor: 'var(--spacespot-white)',
  borderRadius: '12px',
  border: '1px solid var(--spacespot-cyan-300)',
  boxShadow: '0 2px 10px rgba(15, 23, 42, 0.06)',
};

const statusStyle = (status: LeaseStatus): React.CSSProperties => {
  if (status === 'Approved') {
    return { backgroundColor: '#eafaf2', color: 'var(--spacespot-success)', border: '1px solid #b9e9d2' };
  }
  if (status === 'Pending') {
    return { backgroundColor: '#fff6e6', color: 'var(--spacespot-warning)', border: '1px solid #f6ddaa' };
  }
  if (status === 'Active') {
    return { backgroundColor: '#e8fbf7', color: '#0ea5a1', border: '1px solid #b6ece5' };
  }
  return { backgroundColor: '#fef2f2', color: 'var(--spacespot-error)', border: '1px solid #fecaca' };
};

export default function ManageLeases() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | LeaseStatus>('All');

  const filtered = useMemo(() => {
    return LEASES.filter((lease) => {
      const query = search.toLowerCase();
      const matchesSearch = [lease.code, lease.tenant, lease.unit].some((item) => item.toLowerCase().includes(query));
      const matchesFilter = filter === 'All' || lease.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const stats = useMemo(
    () => ({
      total: LEASES.length,
      approved: LEASES.filter((l) => l.status === 'Approved').length,
      pending: LEASES.filter((l) => l.status === 'Pending').length,
      active: LEASES.filter((l) => l.status === 'Active').length,
    }),
    []
  );

  return (
    <div style={{ padding: '20px 22px 28px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#f4f7fb', borderRadius: '14px', padding: '12px 12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--spacespot-cyan-primary)',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 6px 10px rgba(20, 216, 204, 0.2)',
                }}
              >
                <FileText size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Manage Leases</div>
                <div style={{ fontSize: '11px', color: 'var(--spacespot-gray-500)' }}>View and manage all lease agreements</div>
              </div>
            </div>
            <div style={{ width: '86px', height: '2px', backgroundColor: 'var(--spacespot-cyan-primary)', marginTop: '12px', borderRadius: '999px' }} />
          </div>

          <button
            type="button"
            style={{
              height: '30px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: 'var(--spacespot-navy-primary)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 600,
              padding: '0 12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            All Spaces <ChevronDown size={13} />
          </button>
        </div>

        <div style={{ ...cardBase, padding: '10px', marginBottom: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} color="var(--spacespot-gray-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Lease ID, Tenant, or Unit..."
                style={{
                  width: '100%',
                  height: '34px',
                  border: '1px solid var(--spacespot-gray-300)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--spacespot-white)',
                  fontSize: '11px',
                  color: 'var(--spacespot-navy-primary)',
                  padding: '0 12px 0 34px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['All', 'Approved', 'Pending', 'Active', 'Expired'].map((item) => {
                const active = item === filter;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item as 'All' | LeaseStatus)}
                    style={{
                      border: 'none',
                      height: '28px',
                      borderRadius: '8px',
                      padding: '0 12px',
                      fontSize: '10px',
                      cursor: 'pointer',
                      backgroundColor: active ? 'var(--spacespot-cyan-primary)' : '#f4f7fb',
                      color: active ? '#ffffff' : 'var(--spacespot-gray-500)',
                      fontWeight: 600,
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
          {[
            { label: 'Total Leases', value: stats.total, border: '#8be6df', icon: <FileText size={10} color="#16c8bd" /> },
            { label: 'Approved', value: stats.approved, border: '#8be6df', icon: <CheckCircle2 size={10} color="var(--spacespot-success)" /> },
            { label: 'Pending', value: stats.pending, border: '#f6d084', icon: <Clock3 size={10} color="var(--spacespot-warning)" /> },
            { label: 'Active', value: stats.active, border: '#8be6df', icon: <Circle size={10} color="var(--spacespot-success)" /> },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                ...cardBase,
                borderColor: stat.border,
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '9px', color: 'var(--spacespot-gray-500)', marginBottom: '6px' }}>{stat.label}</div>
                <div style={{ fontSize: '27px', lineHeight: 1, color: 'var(--spacespot-navy-primary)', fontWeight: 500 }}>{stat.value}</div>
              </div>
              <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: '#eef6f8', display: 'grid', placeItems: 'center' }}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          {filtered.map((lease) => (
            <div key={lease.code} style={{ ...cardBase, padding: '12px 14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '12px', alignItems: 'start' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: 'var(--spacespot-cyan-primary)', color: '#ffffff', display: 'grid', placeItems: 'center', fontSize: '8px', fontWeight: 700, marginTop: '2px' }}>
                  <FileText size={12} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>{lease.code}</span>
                    <span style={{ ...statusStyle(lease.status), fontSize: '8px', borderRadius: '999px', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Circle size={6} /> {lease.title}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '10px' }}>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}><Building2 size={10} /> {lease.unit}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}><User size={10} /> {lease.tenant}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}><FileText size={10} /> {lease.tenantId}</span>
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}><User size={10} /> {lease.contact}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--spacespot-gray-500)' }}><Calendar size={10} /> {lease.period}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '10px', color: 'var(--spacespot-navy-primary)', fontWeight: 500 }}>{lease.amount}</div>
                </div>

                <div style={{ display: 'grid', gap: '6px', justifyItems: 'end', minWidth: '100px' }}>
                  <button
                    type="button"
                    style={{
                      border: 'none',
                      borderRadius: '999px',
                      backgroundColor: 'var(--spacespot-cyan-primary)',
                      color: '#ffffff',
                      fontSize: '8px',
                      height: '26px',
                      minWidth: '98px',
                      padding: '0 10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    <Eye size={9} /> View Details
                  </button>

                  <button
                    type="button"
                    style={{
                      border: 'none',
                      borderRadius: '999px',
                      backgroundColor: lease.status === 'Pending' ? 'var(--spacespot-success)' : '#eef3f8',
                      color: lease.status === 'Pending' ? '#ffffff' : 'var(--spacespot-gray-500)',
                      fontSize: '8px',
                      height: '26px',
                      minWidth: '98px',
                      padding: '0 10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {lease.status === 'Pending' ? <CheckCircle2 size={9} /> : <Download size={9} />}{' '}
                    {lease.status === 'Pending' ? 'Approve' : 'Invoice'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/manage/edit-lease/${encodeURIComponent(lease.code)}`, {
                        state: { lease },
                      })
                    }
                    style={{
                      border: '1px solid #d5e1ee',
                      borderRadius: '999px',
                      backgroundColor: '#ffffff',
                      color: 'var(--spacespot-gray-500)',
                      fontSize: '8px',
                      height: '26px',
                      minWidth: '98px',
                      padding: '0 10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    <Pencil size={9} /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...cardBase, marginTop: '10px', padding: '9px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', color: '#8a99aa' }}>Showing {filtered.length} of {LEASES.length} leases</span>
          <div style={{ display: 'flex', gap: '10px', fontSize: '8px' }}>
            <span style={{ color: 'var(--spacespot-success)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Circle size={7} fill="var(--spacespot-success)" /> Approved</span>
            <span style={{ color: 'var(--spacespot-warning)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Circle size={7} fill="var(--spacespot-warning)" /> Pending</span>
            <span style={{ color: 'var(--spacespot-error)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Circle size={7} fill="var(--spacespot-error)" /> Expired</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}



