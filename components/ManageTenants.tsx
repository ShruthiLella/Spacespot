import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  CircleCheck,
  CircleDot,
  Clock3,
  Download,
  Eye,
  FolderSearch,
  Mail,
  Pencil,
  Phone,
  Search,
  Trash2,
  User,
  Plus,
} from 'lucide-react';

type TenantStatus = 'Verified' | 'Pending' | 'Initiated';

type Tenant = {
  id: string;
  brandName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  level: string;
  status: TenantStatus;
  joinedDate: string;
};

const TENANTS: Tenant[] = [
  {
    id: 'A',
    brandName: 'ABC Phones',
    ownerName: 'John Phillip',
    email: 'admin@abcphones.com',
    phone: '412356789',
    category: 'Telecommunication',
    level: 'Premium',
    status: 'Verified',
    joinedDate: 'Jan 14, 2026',
  },
  {
    id: '1',
    brandName: '123 Blinds',
    ownerName: 'Sarah Mitchell',
    email: 'sarah@123blinds.com',
    phone: '412987654',
    category: 'Retail',
    level: 'Small business',
    status: 'Verified',
    joinedDate: 'Jan 19, 2026',
  },
  {
    id: 'S',
    brandName: 'Super Supplements',
    ownerName: 'Mike Cohen',
    email: 'info@supersupplements.com',
    phone: '412345678',
    category: 'Health & Wellness',
    level: 'Premium',
    status: 'Pending',
    joinedDate: 'Feb 9, 2026',
  },
  {
    id: '123',
    brandName: '123 Real Estate',
    ownerName: 'Thompson',
    email: 'contact@123realestate.com',
    phone: '412567890',
    category: 'Real Estate',
    level: 'Basic',
    status: 'Verified',
    joinedDate: 'Feb 4, 2026',
  },
  {
    id: 'F',
    brandName: 'Fresh Bites Cafe',
    ownerName: 'David Wilson',
    email: 'hello@freshbitescafe.com',
    phone: '412234567',
    category: 'Food & Beverage',
    level: 'Small business',
    status: 'Initiated',
    joinedDate: 'Feb 17, 2026',
  },
];

const cardBase: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #9fe5df',
  boxShadow: '0 1px 6px rgba(15, 23, 42, 0.08)',
};

const chipStyle = (status: TenantStatus): React.CSSProperties => {
  if (status === 'Verified') {
    return { backgroundColor: '#eafaf2', color: 'var(--spacespot-success)', border: '1px solid #b9e9d2' };
  }
  if (status === 'Pending') {
    return { backgroundColor: '#fff6e6', color: 'var(--spacespot-warning)', border: '1px solid #f6ddaa' };
  }
  return { backgroundColor: '#edf2ff', color: '#3b82f6', border: '1px solid #c7d8ff' };
};

const levelStyle = (level: string): React.CSSProperties => {
  if (level === 'Premium') {
    return { backgroundColor: '#e8fbf7', color: '#0ea5a1', border: '1px solid #b6ece5' };
  }
  if (level === 'Small business') {
    return { backgroundColor: '#edf2ff', color: '#3b82f6', border: '1px solid #c7d8ff' };
  }
  return { backgroundColor: '#f3f5f8', color: '#64748b', border: '1px solid #e2e8f0' };
};

export default function ManageTenants() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | TenantStatus>('All');

  const filteredTenants = useMemo(() => {
    return TENANTS.filter((tenant) => {
      const query = search.toLowerCase();
      const matchesSearch = [
        tenant.brandName,
        tenant.ownerName,
        tenant.email,
        tenant.category,
      ].some((item) => item.toLowerCase().includes(query));
      const matchesFilter = filter === 'All' || tenant.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const stats = useMemo(
    () => ({
      total: TENANTS.length,
      verified: TENANTS.filter((c) => c.status === 'Verified').length,
      pending: TENANTS.filter((c) => c.status === 'Pending').length,
      initiated: TENANTS.filter((c) => c.status === 'Initiated').length,
    }),
    []
  );

  return (
    <div style={{ padding: '10px 10px 20px', backgroundColor: '#eef2f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#17cfc4',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 6px 10px rgba(20, 216, 204, 0.2)',
                }}
              >
                <User size={15} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Manage Tenants</div>
                <div style={{ fontSize: '10px', color: 'var(--spacespot-gray-500)' }}>View and manage tenant information</div>
              </div>
            </div>
            <div style={{ width: '86px', height: '2px', backgroundColor: 'var(--spacespot-cyan-primary)', marginTop: '10px' }} />
          </div>

          <div style={{ display: 'grid', justifyItems: 'end', gap: '8px' }}>
            <button
              type="button"
              style={{
                height: '24px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'var(--spacespot-navy-primary)',
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: 600,
                padding: '0 10px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              All Spaces <ChevronDown size={10} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/create/tenant')}
              style={{
                height: '28px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'var(--spacespot-navy-primary)',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 600,
                padding: '0 12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Plus size={10} /> Add New Tenant
            </button>
          </div>
        </div>

        <div style={{ ...cardBase, padding: '10px', marginBottom: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={12} color="var(--spacespot-gray-400)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by brand name, owner, email, or category..."
                style={{
                  width: '100%',
                  height: '30px',
                  border: '1px solid #b8c6d7',
                  borderRadius: '6px',
                  backgroundColor: '#f8fbfd',
                  fontSize: '10px',
                  color: '#23374d',
                  padding: '0 10px 0 30px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['All', 'Verified', 'Pending', 'Initiated'].map((item) => {
                const active = item === filter;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item as 'All' | TenantStatus)}
                    style={{
                      border: 'none',
                      height: '24px',
                      borderRadius: '6px',
                      padding: '0 10px',
                      fontSize: '9px',
                      cursor: 'pointer',
                      backgroundColor: active ? '#16c8bd' : '#f2f5f8',
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '10px' }}>
          {[
            {
              label: 'Total Tenants',
              value: stats.total,
              border: '#8be6df',
              icon: <User size={10} color="#16c8bd" />,
            },
            {
              label: 'Verified',
              value: stats.verified,
              border: '#8be6df',
              icon: <CircleCheck size={10} color="#22c55e" />,
            },
            {
              label: 'Pending',
              value: stats.pending,
              border: '#f6d084',
              icon: <Clock3 size={10} color="var(--spacespot-warning)" />,
            },
            {
              label: 'Initiated',
              value: stats.initiated,
              border: '#9bb8ff',
              icon: <CircleDot size={10} color="#3b82f6" />,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                ...cardBase,
                borderColor: stat.border,
                padding: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '8px', color: '#8fa0b2', marginBottom: '3px' }}>{stat.label}</div>
                <div style={{ fontSize: '28px', lineHeight: 0.95, color: 'var(--spacespot-navy-primary)', fontWeight: 500 }}>{stat.value}</div>
              </div>
              <div style={{ width: '20px', height: '20px', borderRadius: '6px', backgroundColor: '#eef6f8', display: 'grid', placeItems: 'center' }}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...cardBase, padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Tenant List ({filteredTenants.length})</div>
            <button
              type="button"
              style={{
                border: 'none',
                height: '24px',
                borderRadius: '6px',
                backgroundColor: '#6e7f93',
                color: '#ffffff',
                fontSize: '9px',
                padding: '0 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
              }}
            >
              <Download size={10} /> Export
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e6edf4' }}>
                  {['TENANT', 'CONTACT', 'CATEGORY', 'LEVEL', 'STATUS', 'JOINED', 'ACTIONS'].map((head) => (
                    <th
                      key={head}
                      style={{
                        textAlign: head === 'ACTIONS' ? 'center' : 'left',
                        padding: '8px 6px',
                        fontSize: '8px',
                        color: '#8b9caf',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.email} style={{ borderBottom: '1px solid #eef3f8' }}>
                    <td style={{ padding: '9px 6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: '#17cfc4', color: '#ffffff', display: 'grid', placeItems: 'center', fontSize: '9px', fontWeight: 700 }}>
                          {tenant.id}
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', color: 'var(--spacespot-navy-primary)', fontWeight: 600 }}>{tenant.brandName}</div>
                          <div style={{ fontSize: '8px', color: '#95a4b5' }}>{tenant.ownerName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '9px 6px' }}>
                      <div style={{ fontSize: '8px', color: '#95a4b5', display: 'grid', gap: '2px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={8} /> {tenant.email}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={8} /> {tenant.phone}</span>
                      </div>
                    </td>
                    <td style={{ padding: '9px 6px' }}>
                      <span style={{ fontSize: '9px', color: '#3c536d', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Building2 size={8} color="var(--spacespot-cyan-primary)" /> {tenant.category}
                      </span>
                    </td>
                    <td style={{ padding: '9px 6px' }}>
                      <span style={{ ...levelStyle(tenant.level), fontSize: '7px', borderRadius: '4px', padding: '1px 4px' }}>
                        {tenant.level}
                      </span>
                    </td>
                    <td style={{ padding: '9px 6px' }}>
                      <span style={{ ...chipStyle(tenant.status), fontSize: '8px', borderRadius: '999px', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                        <CircleCheck size={8} /> {tenant.status}
                      </span>
                    </td>
                    <td style={{ padding: '9px 6px', fontSize: '8px', color: '#7e8ea0', lineHeight: 1.2, whiteSpace: 'pre-line' }}>
                      {tenant.joinedDate.replace(', ', ',\n')}
                    </td>
                    <td style={{ padding: '9px 6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button type="button" style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#718399', padding: 0 }}><Eye size={11} /></button>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/manage/edit-tenant/${tenant.id}`, {
                              state: { tenant },
                            })
                          }
                          style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#718399', padding: 0 }}
                        >
                          <Pencil size={11} />
                        </button>
                        <button type="button" style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#718399', padding: 0 }}><Trash2 size={11} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTenants.length === 0 && (
            <div style={{ padding: '24px 0', display: 'grid', placeItems: 'center', color: '#92a2b4' }}>
              <FolderSearch size={24} />
              <div style={{ marginTop: '8px', fontSize: '10px' }}>No tenants match the selected filters.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



