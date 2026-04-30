import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, CheckCircle2, ChevronDown, Circle, Clock, Copy,
  Eye, MapPin, Pencil, Search, Square, Trash2, Upload,
} from 'lucide-react';

// ── Types ──

type ApprovalStatus = 'Approved' | 'Pending Approval' | 'Review Requested';

interface Space {
  id: string;
  name: string;
  location: string;
  type: string;
  floors: number;
  units: number;
  availableUnits: number;
  occupancy: number;
  status: 'Active' | 'Inactive';
  approvalStatus: ApprovalStatus;
}

// ── Mock Data ──

const SPACES: Space[] = [
  { id: 'SP/N-71', name: 'New Space', location: 'Not specified', type: 'Retail', floors: 0, units: 0, availableUnits: 0, occupancy: 0, status: 'Active', approvalStatus: 'Pending Approval' },
  { id: 'SP001', name: 'Downtown Office Complex', location: '123 Business Street, Sydney', type: 'Office', floors: 5, units: 4, availableUnits: 2, occupancy: 50, status: 'Active', approvalStatus: 'Approved' },
  { id: 'SP002', name: 'Tech Hub Building A', location: '45 Tech Avenue, Melbourne', type: 'Co-working', floors: 3, units: 3, availableUnits: 2, occupancy: 33, status: 'Active', approvalStatus: 'Approved' },
  { id: 'SP003', name: 'Riverside Business Park', location: '78 River Road, Brisbane', type: 'Mixed Use', floors: 4, units: 2, availableUnits: 0, occupancy: 100, status: 'Active', approvalStatus: 'Approved' },
  { id: 'SP004', name: 'Innovation Center', location: '90 Innovation Drive, Perth', type: 'Office', floors: 2, units: 0, availableUnits: 0, occupancy: 0, status: 'Inactive', approvalStatus: 'Pending Approval' },
  { id: 'SP005', name: 'Retail Plaza East Wing', location: '12 Retail Street, Adelaide', type: 'Retail', floors: 1, units: 2, availableUnits: 1, occupancy: 50, status: 'Active', approvalStatus: 'Approved' },
  { id: 'SP006', name: 'Healthcare Professional Suites', location: '56 Health Avenue, Canberra', type: 'Medical', floors: 3, units: 0, availableUnits: 0, occupancy: 0, status: 'Inactive', approvalStatus: 'Review Requested' },
  { id: 'SP007', name: 'Beachside Commercial Plaza', location: '88 Ocean Drive, Gold Coast', type: 'Retail', floors: 2, units: 0, availableUnits: 0, occupancy: 0, status: 'Inactive', approvalStatus: 'Pending Approval' },
];

// ── Style helpers ──

const CYAN = 'var(--spacespot-cyan-primary)';
const NAVY = 'var(--spacespot-navy-primary)';

const thStyle: React.CSSProperties = {
  padding: '10px 10px', textAlign: 'left', fontSize: '9px',
  color: 'var(--spacespot-gray-400)', fontWeight: 700, letterSpacing: '0.03em',
};

const typePillColors: Record<string, string> = {
  Office: 'var(--spacespot-cyan-pale, #e6fffe)',
  Commercial: 'var(--spacespot-info-light, #e0f2fe)',
  'Co-working': 'var(--spacespot-info-light, #e0f2fe)',
  'Mixed Use': 'var(--spacespot-warning-light, #fef3c7)',
  Retail: 'var(--spacespot-success-light, #d1fae5)',
  Medical: 'var(--spacespot-info-light, #e0f2fe)',
};

const approvalColors: Record<ApprovalStatus, { bg: string; border: string; color: string }> = {
  Approved: { bg: 'var(--spacespot-cyan-pale, #e6fffe)', border: 'var(--spacespot-cyan-300, #5eead4)', color: 'var(--spacespot-cyan-dark, #0d9488)' },
  'Pending Approval': { bg: '#fff7ed', border: '#fed7aa', color: '#c2410c' },
  'Review Requested': { bg: '#fef3c7', border: '#fcd34d', color: '#92400e' },
};

const statusColors: Record<string, { bg: string; border: string; color: string }> = {
  Active: { bg: 'var(--spacespot-cyan-pale, #e6fffe)', border: 'var(--spacespot-cyan-300, #5eead4)', color: 'var(--spacespot-cyan-dark, #0d9488)' },
  Inactive: { bg: 'var(--spacespot-gray-50, #f9fafb)', border: 'var(--spacespot-gray-300, #d1d5db)', color: 'var(--spacespot-gray-400, #9ca3af)' },
};

const actionBtnStyle: React.CSSProperties = {
  border: '1px solid var(--spacespot-gray-200, #e5e7eb)', background: 'var(--spacespot-white, #fff)',
  borderRadius: '6px', width: '26px', height: '26px', display: 'grid', placeItems: 'center',
  color: 'var(--spacespot-gray-400)', cursor: 'pointer', padding: 0,
};

// ── Component ──

export default function ManageSpaces() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  const filteredSpaces = useMemo(() => {
    return SPACES.filter((s) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.type.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
      const matchesFilter = activeFilter === 'All' || s.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const totals = useMemo(() => ({
    totalSpaces: SPACES.length,
    activeSpaces: SPACES.filter((s) => s.status === 'Active').length,
    totalUnits: SPACES.reduce((sum, s) => sum + s.units, 0),
    availableUnits: SPACES.reduce((sum, s) => sum + s.availableUnits, 0),
  }), []);

  const progressColor = (occ: number) => occ >= 100 ? CYAN : occ > 0 ? 'var(--spacespot-cyan-dark)' : 'var(--spacespot-gray-300)';

  const pill = (text: string, colors: { bg: string; border: string; color: string }) => (
    <span style={{
      fontSize: '8px', borderRadius: '999px', padding: '2px 8px', fontWeight: 600,
      border: `1px solid ${colors.border}`, color: colors.color, backgroundColor: colors.bg,
      display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap',
    }}>
      {text === 'Active' && <Circle size={6} fill={colors.color} stroke="none" />}
      {text}
    </span>
  );

  return (
    <div style={{ padding: '16px 18px 20px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: CYAN, display: 'grid', placeItems: 'center', boxShadow: '0 6px 10px rgba(20, 216, 204, 0.18)' }}>
              <Building2 size={17} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '13px', fontWeight: 700, color: NAVY, margin: 0 }}>Manage Spaces</h1>
              <p style={{ fontSize: '11px', color: 'var(--spacespot-gray-500)', margin: '2px 0 0' }}>View and manage all spaces</p>
              <div style={{ width: '56px', height: '2px', backgroundColor: CYAN, marginTop: '10px', borderRadius: '999px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <button type="button" style={{ border: 'none', backgroundColor: NAVY, borderRadius: '8px', color: '#fff', fontSize: '11px', height: '28px', padding: '0 9px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              All Spaces <ChevronDown size={14} />
            </button>
            <button type="button" onClick={() => navigate('/create-space')} style={{ border: 'none', backgroundColor: NAVY, borderRadius: '8px', color: '#fff', fontSize: '11px', height: '28px', padding: '0 12px', cursor: 'pointer', fontWeight: 600 }}>
              + Add New Space
            </button>
          </div>
        </div>

        {/* Search + Filter */}
        <div style={{ border: `1.5px solid ${CYAN}`, borderRadius: '8px', padding: '10px 12px', backgroundColor: '#fff', marginBottom: '10px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} color="var(--spacespot-gray-400)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text" placeholder="Search by space name, location, or type..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', height: '30px', border: '1px solid var(--spacespot-gray-300)', borderRadius: '7px', backgroundColor: '#fff', padding: '0 10px 0 30px', fontSize: '11px', color: NAVY }}
            />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['All', 'Active', 'Inactive'] as const).map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                borderRadius: '7px',
                border: activeFilter === f ? `1px solid ${CYAN}` : '1px solid var(--spacespot-gray-300)',
                backgroundColor: activeFilter === f ? CYAN : '#fff',
                color: activeFilter === f ? '#fff' : 'var(--spacespot-gray-500)',
                cursor: 'pointer', fontWeight: 600, fontSize: '10px', height: '30px', padding: '0 10px',
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginBottom: '10px' }}>
          {[
            { title: 'Total Spaces', value: totals.totalSpaces, icon: Building2, iconColor: CYAN },
            { title: 'Active', value: totals.activeSpaces, icon: CheckCircle2, iconColor: 'var(--spacespot-success, #22c55e)' },
            { title: 'Total Units', value: totals.totalUnits, icon: Square, iconColor: 'var(--spacespot-warning, #f59e0b)' },
            { title: 'Available Units', value: totals.availableUnits, icon: Building2, iconColor: CYAN },
          ].map((c) => (
            <div key={c.title} style={{ backgroundColor: '#fff', border: '1.5px solid var(--spacespot-cyan-300, #5eead4)', borderRadius: '8px', padding: '10px', minHeight: '56px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--spacespot-gray-500)', marginBottom: '6px' }}>{c.title}</div>
                <div style={{ fontSize: '27px', lineHeight: 1, fontWeight: 700, color: NAVY }}>{c.value}</div>
              </div>
              <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: 'var(--spacespot-cyan-pale, #e6fffe)', display: 'grid', placeItems: 'center' }}>
                <c.icon size={13} color={c.iconColor} />
              </div>
            </div>
          ))}
        </div>

        {/* Space Table */}
        <div style={{ backgroundColor: '#fff', border: `1.5px solid ${CYAN}`, borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid var(--spacespot-gray-200)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY }}>Space List ({filteredSpaces.length})</div>
            <button type="button" style={{ border: '1px solid var(--spacespot-gray-300)', backgroundColor: 'var(--spacespot-gray-50)', borderRadius: '8px', color: 'var(--spacespot-gray-600)', fontSize: '10px', height: '24px', padding: '0 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Upload size={12} /> Export
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--spacespot-gray-50)', borderBottom: '1px solid var(--spacespot-gray-200)' }}>
                  <th style={thStyle}>SPACE</th>
                  <th style={thStyle}>LOCATION &amp; TYPE</th>
                  <th style={thStyle}>STRUCTURE</th>
                  <th style={thStyle}>OCCUPANCY &amp; STATUS</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredSpaces.map((space) => {
                  const isApproved = space.approvalStatus === 'Approved';

                  return (
                    <tr key={space.id} style={{ borderBottom: '1px solid var(--spacespot-gray-100)' }}>
                      {/* SPACE */}
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: CYAN, color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                            {space.name.substring(0, 3).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: NAVY, fontWeight: 600 }}>{space.name}</div>
                            <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-400)' }}>{space.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* LOCATION & TYPE */}
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: 'var(--spacespot-gray-600)' }}>
                          <MapPin size={10} color="var(--spacespot-gray-400)" />
                          {space.location}
                        </div>
                        <span style={{
                          marginTop: '4px', display: 'inline-block', fontSize: '8px',
                          color: 'var(--spacespot-cyan-dark, #0d9488)',
                          border: '1px solid var(--spacespot-cyan-300, #5eead4)',
                          backgroundColor: typePillColors[space.type] || 'var(--spacespot-info-light)',
                          borderRadius: '999px', padding: '2px 6px',
                        }}>
                          {space.type}
                        </span>
                      </td>

                      {/* STRUCTURE */}
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ fontSize: '7px', color: 'var(--spacespot-gray-400)', letterSpacing: '0.04em' }}>FLOORS</div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '2px' }}>{space.floors}</div>
                        {isApproved ? (
                          <>
                            <div style={{ fontSize: '7px', color: 'var(--spacespot-gray-400)', letterSpacing: '0.04em' }}>UNITS</div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: NAVY }}>{space.units}</div>
                            <div style={{ fontSize: '8px', color: 'var(--spacespot-cyan-dark)', marginTop: '1px' }}>{space.availableUnits} Available</div>
                          </>
                        ) : (
                          <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-400)', marginTop: '2px', fontStyle: 'italic' }}></div>
                        )}
                      </td>

                      {/* OCCUPANCY & STATUS */}
                      <td style={{ padding: '8px 10px' }}>
                        {isApproved && (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-400)' }}></div>
                              <div style={{ fontSize: '8px', color: progressColor(space.occupancy), fontWeight: 700 }}>{space.occupancy}%</div>
                            </div>
                            <div style={{ height: '8px', borderRadius: '999px', backgroundColor: 'var(--spacespot-gray-100)', overflow: 'hidden', marginBottom: '5px' }}>
                              <div style={{ width: `${space.occupancy}%`, height: '100%', borderRadius: '999px', backgroundColor: progressColor(space.occupancy) }} />
                            </div>
                          </>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {pill(space.status, statusColors[space.status])}
                          {pill(space.approvalStatus, approvalColors[space.approvalStatus])}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                          <button type="button" style={actionBtnStyle}><Eye size={12} /></button>
                          <button type="button" onClick={() => navigate(`/manage/edit-space/${space.id}`)} style={actionBtnStyle}><Pencil size={12} /></button>
                          <button type="button" style={actionBtnStyle}><Copy size={12} /></button>
                          <button type="button" style={actionBtnStyle}><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
