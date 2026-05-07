import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Building2, CheckCircle2, Circle, Check,
  LayoutGrid, LayoutList,
  MapPin, Pencil, Search, Square, Upload,
} from 'lucide-react';
import { COLORS, TYPE, LAYOUT } from '../styles/uiTheme';

const CYAN = COLORS.cyan;
const NAVY = COLORS.navy;

type ApprovalStatus = 'Approved' | 'Pending Approval' | 'To Review' | 'Draft';
type ViewMode = 'table' | 'card';
type UserRole = 'default' | 'spaceContributor' | 'spaceManager';

interface Space {
  id: string;
  name: string;
  location: string;
  type: string;
  floors: number;
  units: number;
  availableUnits: number;
  occupancy: number;
  status: 'Active' | 'Inactive' | 'Not Set';
  approvalStatus: ApprovalStatus;
  floorBreakdown?: { floor: string; units: number }[];
}

const SPACE_DRAFTS_STORAGE_KEY = 'spacespot.spaceDrafts';
const SUBMITTED_SPACES_STORAGE_KEY = 'spacespot.submittedSpaces';
const USER_ROLE_STORAGE_KEY = 'spacespot-user-role';

const SPACES: Space[] = [
  { id: 'SP/N-71', name: 'New Space', location: 'Not specified', type: 'Retail', floors: 0, units: 0, availableUnits: 0, occupancy: 0, status: 'Active', approvalStatus: 'Pending Approval' },
  { id: 'SP001', name: 'Downtown Office Complex', location: '123 Business Street, Sydney', type: 'Office', floors: 5, units: 4, availableUnits: 2, occupancy: 50, status: 'Active', approvalStatus: 'Approved', floorBreakdown: [{ floor: 'L1', units: 2 }, { floor: 'L2', units: 1 }, { floor: 'L3', units: 1 }, { floor: 'L4', units: 0 }, { floor: 'L5', units: 0 }] },
  { id: 'SP002', name: 'Tech Hub Building A', location: '45 Tech Avenue, Melbourne', type: 'Co-working', floors: 3, units: 3, availableUnits: 2, occupancy: 33, status: 'Active', approvalStatus: 'Approved', floorBreakdown: [{ floor: 'L1', units: 2 }, { floor: 'L2', units: 1 }, { floor: 'L3', units: 0 }] },
  { id: 'SP003', name: 'Riverside Business Park', location: '78 River Road, Brisbane', type: 'Mixed Use', floors: 4, units: 2, availableUnits: 0, occupancy: 100, status: 'Active', approvalStatus: 'Approved', floorBreakdown: [{ floor: 'L1', units: 1 }, { floor: 'L2', units: 1 }, { floor: 'L3', units: 0 }, { floor: 'L4', units: 0 }] },
  { id: 'SP004', name: 'Innovation Center', location: '90 Innovation Drive, Perth', type: 'Office', floors: 2, units: 0, availableUnits: 0, occupancy: 0, status: 'Active', approvalStatus: 'Pending Approval' },
  { id: 'SP005', name: 'Retail Plaza East Wing', location: '12 Retail Street, Adelaide', type: 'Retail', floors: 1, units: 2, availableUnits: 1, occupancy: 50, status: 'Active', approvalStatus: 'Approved', floorBreakdown: [{ floor: 'L1', units: 2 }] },
  { id: 'SP006', name: 'Healthcare Professional Suites', location: '56 Health Avenue, Canberra', type: 'Medical', floors: 3, units: 0, availableUnits: 0, occupancy: 0, status: 'Active', approvalStatus: 'To Review' },
  { id: 'SP007', name: 'Beachside Commercial Plaza', location: '88 Ocean Drive, Gold Coast', type: 'Retail', floors: 2, units: 0, availableUnits: 0, occupancy: 0, status: 'Active', approvalStatus: 'Pending Approval' },
];

const thStyle: React.CSSProperties = {
  padding: '10px 12px', textAlign: 'left', fontSize: '11px',
  color: 'var(--spacespot-gray-400)', fontWeight: 700, letterSpacing: '0.03em',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 12px', fontSize: '13px', color: NAVY, verticalAlign: 'middle',
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
  'To Review': { bg: '#fef3c7', border: '#fcd34d', color: '#92400e' },
  Draft: { bg: 'var(--spacespot-gray-50, #f9fafb)', border: 'var(--spacespot-gray-300, #d1d5db)', color: 'var(--spacespot-gray-500, #6b7280)' },
};

const statusColors: Record<string, { bg: string; border: string; color: string }> = {
  Active: { bg: 'var(--spacespot-cyan-pale, #e6fffe)', border: 'var(--spacespot-cyan-300, #5eead4)', color: 'var(--spacespot-cyan-dark, #0d9488)' },
  Inactive: { bg: 'var(--spacespot-gray-50, #f9fafb)', border: 'var(--spacespot-gray-300, #d1d5db)', color: 'var(--spacespot-gray-400, #9ca3af)' },
  'Not Set': { bg: '#f8fafc', border: '#e2e8f0', color: '#64748b' },
};

const actionBtnStyle: React.CSSProperties = {
  border: '1px solid var(--spacespot-gray-200, #e5e7eb)',
  background: 'var(--spacespot-white, #fff)',
  borderRadius: '6px', width: '30px', height: '30px',
  display: 'grid', placeItems: 'center',
  color: 'var(--spacespot-gray-400)', cursor: 'pointer', padding: 0,
};

const FloorBreakdown = ({ floors, breakdown }: { floors: number; breakdown?: { floor: string; units: number }[] }) => {
  if (floors === 0) return <span style={{ ...TYPE.meta, color: 'var(--spacespot-gray-300)' }}>—</span>;

  const totalUnits = breakdown ? breakdown.reduce((s, b) => s + b.units, 0) : 0;

  return (
    <div style={{ ...TYPE.meta, color: NAVY }}>
      <span style={{ fontWeight: 600 }}>{floors}</span>
      <span style={{ color: 'var(--spacespot-gray-400)' }}> floor{floors !== 1 ? 's' : ''}</span>
      {totalUnits > 0 && (
        <>
          <span style={{ color: 'var(--spacespot-gray-300)' }}> · </span>
          <span style={{ fontWeight: 600 }}>{totalUnits}</span>
          <span style={{ color: 'var(--spacespot-gray-400)' }}> unit{totalUnits !== 1 ? 's' : ''}</span>
        </>
      )}
    </div>
  );
};

export default function ManageSpaces() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Approved' | 'Pending Approval' | 'To Review' | 'Draft'>('All');
  const [statusView, setStatusView] = useState<'Active' | 'Inactive'>('Active');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [submittedSpaces, setSubmittedSpaces] = useState<Space[]>([]);
  const [approvalOverrides, setApprovalOverrides] = useState<Record<string, { approvalStatus: ApprovalStatus; status: Space['status'] }>>({});

  const userRole: UserRole = (localStorage.getItem(USER_ROLE_STORAGE_KEY) as UserRole) || 'default';
  const isSpaceManager = userRole === 'spaceManager';

  const draftSpaces = useMemo<Space[]>(() => {
    try {
      const raw = localStorage.getItem(SPACE_DRAFTS_STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw) as Partial<Space & { savedAt?: string }>[];
      const mapped = parsed.map((item): Space => ({
        id: item.id || `DRF-${Math.random().toString(36).slice(2, 8)}`,
        name: item.name || 'Untitled Draft Space',
        location: item.location || 'Not specified',
        type: item.type || 'Retail',
        floors: typeof item.floors === 'number' ? item.floors : 0,
        units: typeof item.units === 'number' ? item.units : 0,
        availableUnits: typeof item.availableUnits === 'number' ? item.availableUnits : 0,
        occupancy: typeof item.occupancy === 'number' ? item.occupancy : 0,
        status: 'Active',
        approvalStatus: 'Draft',
        floorBreakdown: item.floorBreakdown,
      }));

      return mapped;
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SUBMITTED_SPACES_STORAGE_KEY);
      if (!raw) {
        setSubmittedSpaces([]);
        return;
      }

      const parsed = JSON.parse(raw) as Partial<Space>[];
      const mapped = parsed.map((item): Space => ({
        id: item.id || `SP-${Math.random().toString(36).slice(2, 8)}`,
        name: item.name || 'Submitted Space',
        location: item.location || 'Not specified',
        type: item.type || 'Retail',
        floors: typeof item.floors === 'number' ? item.floors : 0,
        units: typeof item.units === 'number' ? item.units : 0,
        availableUnits: typeof item.availableUnits === 'number' ? item.availableUnits : 0,
        occupancy: typeof item.occupancy === 'number' ? item.occupancy : 0,
        status: item.approvalStatus === 'Pending Approval' || item.approvalStatus === 'To Review'
          ? 'Active'
          : item.status === 'Active'
            ? 'Active'
            : 'Inactive',
        approvalStatus: item.approvalStatus === 'Approved' ? 'Approved' : 'Pending Approval',
        floorBreakdown: item.floorBreakdown,
      }));

      setSubmittedSpaces(mapped);
    } catch {
      setSubmittedSpaces([]);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (isSpaceManager && params.get('view') === 'approvals') {
      setStatusView('Active');
      setActiveFilter('Pending Approval');
    }
  }, [isSpaceManager, location.search]);

  const allSpaces = useMemo(() => {
    const baseSpaces = [...draftSpaces, ...submittedSpaces, ...SPACES];
    return baseSpaces.map((space) => {
      const override = approvalOverrides[space.id];
      if (!override) return space;
      return {
        ...space,
        approvalStatus: override.approvalStatus,
        status: override.status,
      };
    });
  }, [draftSpaces, submittedSpaces, approvalOverrides]);

  const filteredSpaces = useMemo(() => allSpaces.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q);

    const matchesStatusView = s.status === statusView;

    const matchesFilter =
      activeFilter === 'All' ||
      s.approvalStatus === activeFilter;

    return matchesSearch && matchesStatusView && matchesFilter;
  }), [searchTerm, statusView, activeFilter, allSpaces]);

  const totals = useMemo(() => ({
    totalSpaces: allSpaces.length,
    activeSpaces: allSpaces.filter(s => s.status === 'Active').length,
    inactiveSpaces: allSpaces.filter(s => s.status === 'Inactive').length,
    totalUnits: allSpaces.reduce((sum, s) => sum + s.units, 0),
    availableUnits: allSpaces.reduce((sum, s) => sum + s.availableUnits, 0),
  }), [allSpaces]);

  const progressColor = (occ: number) =>
    occ >= 100 ? CYAN : occ > 0 ? 'var(--spacespot-cyan-dark)' : 'var(--spacespot-gray-300)';

  const handleEditSpace = (space: Space) => {
    if (space.approvalStatus === 'Draft') {
      navigate(`/create/space?draftId=${encodeURIComponent(space.id)}`);
      return;
    }
    navigate(`/manage/edit-space/${space.id}`);
  };

  const handleApproveSpace = (space: Space) => {
    if (!isSpaceManager || space.approvalStatus !== 'Pending Approval') return;

    const nextSpace = { ...space, approvalStatus: 'Approved' as const, status: 'Active' as const };

    setApprovalOverrides((prev) => ({
      ...prev,
      [space.id]: { approvalStatus: 'Approved', status: 'Active' },
    }));

    setSubmittedSpaces((prev) => {
      const updated = prev.map((item) => (item.id === space.id ? nextSpace : item));
      try {
        localStorage.setItem(SUBMITTED_SPACES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage write issues and keep in-memory state.
      }
      return updated;
    });
  };

  const pill = (text: string, colors: { bg: string; border: string; color: string }) => (
    <span style={{
      fontSize: '11px', borderRadius: '999px', padding: '3px 10px', fontWeight: 600,
      border: `1px solid ${colors.border}`, color: colors.color, backgroundColor: colors.bg,
      display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap',
    }}>
      {text === 'Active' && <Circle size={7} fill={colors.color} stroke="none" />}
      {text}
    </span>
  );

  return (
    <div style={LAYOUT.shell}>
      <div style={LAYOUT.container}>

        {/* ── Page Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: CYAN, display: 'grid', placeItems: 'center', boxShadow: '0 6px 10px rgba(20,216,204,0.18)' }}>
              <Building2 size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ ...TYPE.pageTitle, color: NAVY, margin: 0 }}>Manage Spaces</h1>
              <p style={{ ...TYPE.pageSubtitle, color: COLORS.subtitle, margin: '3px 0 0' }}>
                {isSpaceManager ? 'Space Manager View: approve submitted space requests' : 'View and manage all spaces'}
              </p>
              <div style={{ width: '56px', height: '2px', backgroundColor: CYAN, marginTop: '8px', borderRadius: '999px' }} />
            </div>
          </div>
          <button type="button" onClick={() => navigate('/create-space')} style={{ border: 'none', backgroundColor: NAVY, borderRadius: '8px', color: '#fff', ...TYPE.tableBody, height: '36px', padding: '0 16px', cursor: 'pointer', fontWeight: 600 }}>
            + Add New Space
          </button>
        </div>

        {/* ── Search + Filter + View Toggle ── */}
        <div style={{ border: `1.5px solid ${CYAN}`, borderRadius: '8px', padding: '10px 14px', backgroundColor: '#fff', marginBottom: '14px', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="var(--spacespot-gray-400)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search by space name, location, or type..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', height: '34px', border: '1px solid var(--spacespot-gray-300)', borderRadius: '7px', backgroundColor: '#fff', padding: '0 10px 0 32px', ...TYPE.tableBody, color: NAVY }} />
          </div>

          {/* Status Filters */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {([
              { label: 'All',               color: NAVY },
              { label: 'Approved',          color: 'var(--spacespot-cyan-dark, #0d9488)' },
              { label: 'Pending Approval',  color: '#c2410c' },
              { label: 'Draft',             color: 'var(--spacespot-gray-500, #6b7280)' },
              { label: 'To Review',         color: '#92400e' },
            ] as const).map((f) => {
              const isActive = activeFilter === f.label;
              return (
                <button
                  key={f.label}
                  onClick={() => setActiveFilter(f.label)}
                  style={{
                    borderRadius: '7px',
                    border: isActive ? `1.5px solid ${f.color}` : '1px solid var(--spacespot-gray-300)',
                    backgroundColor: isActive ? f.color : '#fff',
                    color: isActive ? '#fff' : f.color,
                    cursor: 'pointer',
                    fontWeight: 600,
                    ...TYPE.meta,
                    height: '34px',
                    padding: '0 12px',
                    transition: 'all 0.15s',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* View Toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--spacespot-gray-300)', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              type="button"
              title="Table View"
              onClick={() => setViewMode('table')}
              style={{ width: '34px', height: '34px', display: 'grid', placeItems: 'center', border: 'none', cursor: 'pointer', backgroundColor: viewMode === 'table' ? CYAN : '#fff', color: viewMode === 'table' ? '#fff' : 'var(--spacespot-gray-400)', transition: 'background 0.2s' }}
            >
              <LayoutList size={15} />
            </button>
            <button
              type="button"
              title="Card View"
              onClick={() => setViewMode('card')}
              style={{ width: '34px', height: '34px', display: 'grid', placeItems: 'center', border: 'none', borderLeft: '1px solid var(--spacespot-gray-300)', cursor: 'pointer', backgroundColor: viewMode === 'card' ? CYAN : '#fff', color: viewMode === 'card' ? '#fff' : 'var(--spacespot-gray-400)', transition: 'background 0.2s' }}
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '14px' }}>
          <div style={{ backgroundColor: '#fff', border: '1.5px solid var(--spacespot-cyan-300, #5eead4)', borderRadius: '8px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ ...TYPE.meta, color: 'var(--spacespot-gray-500)', marginBottom: '6px' }}>Total Spaces</div>
              <div style={{ fontSize: '28px', lineHeight: 1, fontWeight: 700, color: NAVY }}>{totals.totalSpaces}</div>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'var(--spacespot-cyan-pale, #e6fffe)', display: 'grid', placeItems: 'center' }}>
              <Building2 size={14} color={CYAN} />
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: `1.5px solid ${statusView === 'Active' ? 'var(--spacespot-success, #22c55e)' : 'var(--spacespot-gray-400, #9ca3af)'}`, borderRadius: '8px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ ...TYPE.meta, color: 'var(--spacespot-gray-500)', marginBottom: '6px' }}>Space State</div>
              <div style={{ fontSize: '28px', lineHeight: 1, fontWeight: 700, color: NAVY }}>
                {statusView === 'Active' ? totals.activeSpaces : totals.inactiveSpaces}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', alignSelf: 'center' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: 'var(--spacespot-cyan-pale, #e6fffe)', display: 'grid', placeItems: 'center', alignSelf: 'flex-end' }}>
                <CheckCircle2 size={13} color={statusView === 'Active' ? 'var(--spacespot-success, #22c55e)' : 'var(--spacespot-gray-500, #6b7280)'} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', border: '1px solid var(--spacespot-gray-300)', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setStatusView('Active')}
                style={{ border: 'none', backgroundColor: statusView === 'Active' ? 'var(--spacespot-success, #22c55e)' : '#fff', color: statusView === 'Active' ? '#fff' : 'var(--spacespot-gray-600)', fontSize: '10px', fontWeight: 700, padding: '4px 10px', cursor: 'pointer' }}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusView('Inactive')}
                style={{ border: 'none', borderTop: '1px solid var(--spacespot-gray-300)', backgroundColor: statusView === 'Inactive' ? 'var(--spacespot-gray-500, #6b7280)' : '#fff', color: statusView === 'Inactive' ? '#fff' : 'var(--spacespot-gray-600)', fontSize: '10px', fontWeight: 700, padding: '4px 10px', cursor: 'pointer' }}
              >
                Inactive
              </button>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1.5px solid var(--spacespot-cyan-300, #5eead4)', borderRadius: '8px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ ...TYPE.meta, color: 'var(--spacespot-gray-500)', marginBottom: '6px' }}>Total Units</div>
              <div style={{ fontSize: '28px', lineHeight: 1, fontWeight: 700, color: NAVY }}>{totals.totalUnits}</div>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'var(--spacespot-cyan-pale, #e6fffe)', display: 'grid', placeItems: 'center' }}>
              <Square size={14} color="var(--spacespot-warning, #f59e0b)" />
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1.5px solid var(--spacespot-cyan-300, #5eead4)', borderRadius: '8px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ ...TYPE.meta, color: 'var(--spacespot-gray-500)', marginBottom: '6px' }}>Available Units</div>
              <div style={{ fontSize: '28px', lineHeight: 1, fontWeight: 700, color: NAVY }}>{totals.availableUnits}</div>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'var(--spacespot-cyan-pale, #e6fffe)', display: 'grid', placeItems: 'center' }}>
              <Building2 size={14} color={CYAN} />
            </div>
          </div>
        </div>

        {/* ── TABLE VIEW ── */}
        {viewMode === 'table' && (
          <div style={{ backgroundColor: '#fff', border: `1.5px solid ${CYAN}`, borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--spacespot-gray-200)' }}>
              <div style={{ ...TYPE.tableBody, fontWeight: 700, color: NAVY }}>Space List ({filteredSpaces.length})</div>
              <button type="button" style={{ border: '1px solid var(--spacespot-gray-300)', backgroundColor: 'var(--spacespot-gray-50)', borderRadius: '8px', color: 'var(--spacespot-gray-600)', ...TYPE.meta, height: '28px', padding: '0 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Upload size={13} /> Export
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--spacespot-gray-50)', borderBottom: '1px solid var(--spacespot-gray-200)' }}>
                    <th style={thStyle}>SPACE</th>
                    <th style={thStyle}>LOCATION &amp; TYPE</th>
                    <th style={thStyle}>STRUCTURE</th>
                    <th style={thStyle}>OCCUPANCY</th>
                    <th style={thStyle}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpaces.map((space) => {
                    const isApproved = space.approvalStatus === 'Approved';
                    const canEditFromStatus =
                      space.approvalStatus !== 'Pending Approval' || isSpaceManager;
                    const appStatusColors = approvalColors[space.approvalStatus];
                    return (
                      <tr key={space.id} style={{ borderBottom: '1px solid var(--spacespot-gray-100)' }}>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: CYAN, color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                              {space.name.substring(0, 3).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ ...TYPE.tableBody, fontWeight: 600, color: NAVY }}>{space.name}</div>
                              <div style={{ ...TYPE.meta, color: 'var(--spacespot-gray-400)' }}>{space.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', ...TYPE.meta, color: 'var(--spacespot-gray-600)' }}>
                            <MapPin size={12} color="var(--spacespot-gray-400)" />{space.location}
                          </div>
                          <span style={{ marginTop: '5px', display: 'inline-block', ...TYPE.meta, color: 'var(--spacespot-cyan-dark, #0d9488)', border: '1px solid var(--spacespot-cyan-300, #5eead4)', backgroundColor: typePillColors[space.type] || 'var(--spacespot-info-light)', borderRadius: '999px', padding: '2px 8px' }}>
                            {space.type}
                          </span>
                        </td>
                        <td style={tdStyle}><FloorBreakdown floors={space.floors} breakdown={space.floorBreakdown} /></td>
                        <td style={tdStyle}>
                          {isApproved && (
                            <>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
                                <div style={{ ...TYPE.meta, color: progressColor(space.occupancy), fontWeight: 700 }}>{space.occupancy}%</div>
                              </div>
                              <div style={{ height: '8px', borderRadius: '999px', backgroundColor: 'var(--spacespot-gray-100)', overflow: 'hidden', marginBottom: '6px' }}>
                                <div style={{ width: `${space.occupancy}%`, height: '100%', borderRadius: '999px', backgroundColor: progressColor(space.occupancy) }} />
                              </div>
                            </>
                          )}
                          {!isApproved && (
                            <span style={{ ...TYPE.meta, color: 'var(--spacespot-gray-300)' }}>—</span>
                          )}
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => canEditFromStatus && handleEditSpace(space)}
                              disabled={!canEditFromStatus}
                              style={{
                                border: `1px solid ${appStatusColors.border}`,
                                backgroundColor: canEditFromStatus ? appStatusColors.bg : 'var(--spacespot-gray-50, #f9fafb)',
                                color: canEditFromStatus ? appStatusColors.color : 'var(--spacespot-gray-400, #9ca3af)',
                                borderRadius: '999px',
                                padding: '4px 10px',
                                fontSize: '11px',
                                fontWeight: 600,
                                lineHeight: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: canEditFromStatus ? 'pointer' : 'not-allowed',
                                transition: 'all 0.15s ease',
                                opacity: canEditFromStatus ? 1 : 0.7,
                                whiteSpace: 'nowrap',
                              }}
                              aria-label={`Open ${space.name} from application status`}
                              title={canEditFromStatus ? 'Open space details' : 'Editing unavailable while pending approval'}
                            >
                              {space.approvalStatus}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CARD VIEW ── */}
        {viewMode === 'card' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {filteredSpaces.map((space) => {
              const isApproved = space.approvalStatus === 'Approved';
              return (
                <div key={space.id} style={{ backgroundColor: '#fff', border: `1.5px solid ${CYAN}`, borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                  {/* Card Header */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--spacespot-gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: CYAN, color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                        {space.name.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ ...TYPE.tableBody, fontWeight: 700, color: NAVY }}>{space.name}</div>
                        <div style={{ ...TYPE.meta, color: 'var(--spacespot-gray-400)' }}>{space.id}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {isSpaceManager && space.approvalStatus === 'Pending Approval' && (
                        <button
                          type="button"
                          onClick={() => handleApproveSpace(space)}
                          style={{ ...actionBtnStyle, width: 'auto', padding: '0 8px', color: 'var(--spacespot-cyan-dark, #0d9488)' }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700 }}>
                            <Check size={11} /> Approve
                          </span>
                        </button>
                      )}
                      {(space.approvalStatus !== 'Pending Approval' || isSpaceManager) && (
                        <button type="button" onClick={() => handleEditSpace(space)} style={actionBtnStyle}><Pencil size={13} /></button>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>

                    {/* Location */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', ...TYPE.meta, color: 'var(--spacespot-gray-600)' }}>
                      <MapPin size={12} color="var(--spacespot-gray-400)" style={{ flexShrink: 0, marginTop: 1 }} />
                      {space.location}
                    </div>

                    {/* Type pill */}
                    <span style={{ alignSelf: 'flex-start', ...TYPE.meta, color: 'var(--spacespot-cyan-dark, #0d9488)', border: '1px solid var(--spacespot-cyan-300, #5eead4)', backgroundColor: typePillColors[space.type] || 'var(--spacespot-info-light)', borderRadius: '999px', padding: '2px 8px' }}>
                      {space.type}
                    </span>

                    {/* Floor breakdown */}
                    <FloorBreakdown floors={space.floors} breakdown={space.floorBreakdown} />

                    {/* Occupancy */}
                    {isApproved && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ ...TYPE.meta, color: 'var(--spacespot-gray-400)' }}>Occupancy</span>
                          <span style={{ ...TYPE.meta, fontWeight: 700, color: progressColor(space.occupancy) }}>{space.occupancy}%</span>
                        </div>
                        <div style={{ height: '8px', borderRadius: '999px', backgroundColor: 'var(--spacespot-gray-100)', overflow: 'hidden' }}>
                          <div style={{ width: `${space.occupancy}%`, height: '100%', borderRadius: '999px', backgroundColor: progressColor(space.occupancy) }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div style={{ padding: '10px 16px', borderTop: '1px solid var(--spacespot-gray-100)', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {pill(space.status, statusColors[space.status])}
                    {pill(space.approvalStatus, approvalColors[space.approvalStatus])}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
