import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  Eye,
  MapPin,
  Pencil,
  Search,
  Square,
  Trash2,
  Upload,
} from 'lucide-react';

type UnitStatus = 'Leased' | 'Available Soon' | 'Proposed';
type UnitCategory = 'Permanent' | 'Proposed' | 'Temporary' | 'Kiosk';

interface Unit {
  id: string;
  code: string;
  name: string;
  location: string;
  precinct: string;
  category: UnitCategory;
  area: number;
  frontage: string;
  monthlyRate: number;
  status: UnitStatus;
}

const UNITS: Unit[] = [
  { id: 'UNIT-01', code: 'U01', name: 'Office Suite A1', location: 'Level-1', precinct: 'North Wing', category: 'Permanent', area: 120, frontage: '12m', monthlyRate: 2500, status: 'Leased' },
  { id: 'UNIT-02', code: 'U02', name: 'Office Suite A2', location: 'Level-1', precinct: 'North Wing', category: 'Permanent', area: 150, frontage: '15m', monthlyRate: 3000, status: 'Proposed' },
  { id: 'UNIT-03', code: 'U03', name: 'Executive Office B1', location: 'Level-3', precinct: 'South Wing', category: 'Permanent', area: 200, frontage: '20m', monthlyRate: 4500, status: 'Leased' },
  { id: 'UNIT-04', code: 'U04', name: 'Conference Room C1', location: 'Level-2', precinct: 'Central', category: 'Temporary', area: 80, frontage: '8m', monthlyRate: 1800, status: 'Available Soon' },
  { id: 'UNIT-05', code: 'U05', name: 'Co-working Space A', location: 'Level-1', precinct: 'Innovation Zone', category: 'Proposed', area: 60, frontage: '6m', monthlyRate: 900, status: 'Proposed' },
  { id: 'UNIT-06', code: 'U06', name: 'Private Office 2D', location: 'Level-2', precinct: 'East Side', category: 'Permanent', area: 45, frontage: '4m', monthlyRate: 850, status: 'Leased' },
  { id: 'UNIT-07', code: 'U07', name: 'Meeting Pod 3C', location: 'Level-3', precinct: 'Collaboration Hub', category: 'Temporary', area: 25, frontage: '2.5m', monthlyRate: 650, status: 'Available Soon' },
  { id: 'UNIT-08', code: 'U08', name: 'Retail Space R1', location: 'Ground', precinct: 'Riverside Promenade', category: 'Permanent', area: 180, frontage: '18m', monthlyRate: 3800, status: 'Leased' },
  { id: 'UNIT-09', code: 'U09', name: 'Food Court Stall F1', location: 'Level-1', precinct: 'Dining Quarter', category: 'Kiosk', area: 30, frontage: '3m', monthlyRate: 1100, status: 'Leased' },
  { id: 'UNIT-10', code: 'U10', name: 'Lab Space L1', location: 'Level-1', precinct: 'Research Wing', category: 'Permanent', area: 210, frontage: '21m', monthlyRate: 5200, status: 'Proposed' },
  { id: 'UNIT-11', code: 'U11', name: 'Boutique Store B1', location: 'Ground', precinct: 'Fashion District', category: 'Permanent', area: 90, frontage: '9m', monthlyRate: 3300, status: 'Leased' },
  { id: 'UNIT-12', code: 'U12', name: 'Pop-up Booth P1', location: 'Ground', precinct: 'Central Atrium', category: 'Proposed', area: 20, frontage: '2m', monthlyRate: 800, status: 'Available Soon' },
];

const getStatusTheme = (status: UnitStatus) => {
  if (status === 'Leased') {
    return {
      color: 'var(--spacespot-success)',
      background: 'var(--spacespot-success-light)',
      border: 'rgba(16, 185, 129, 0.28)',
    };
  }

  if (status === 'Proposed') {
    return {
      color: 'var(--spacespot-info)',
      background: 'var(--spacespot-info-light)',
      border: 'rgba(59, 130, 246, 0.26)',
    };
  }

  return {
    color: 'var(--spacespot-warning)',
    background: 'var(--spacespot-warning-light)',
    border: 'rgba(245, 158, 11, 0.26)',
  };
};

const getCategoryTheme = (category: UnitCategory) => {
  if (category === 'Permanent') {
    return {
      color: 'var(--spacespot-cyan-dark)',
      background: 'var(--spacespot-cyan-pale)',
      border: 'var(--spacespot-cyan-300)',
    };
  }

  if (category === 'Temporary') {
    return {
      color: 'var(--spacespot-warning)',
      background: 'var(--spacespot-warning-light)',
      border: 'rgba(245, 158, 11, 0.32)',
    };
  }

  if (category === 'Kiosk') {
    return {
      color: 'var(--spacespot-success)',
      background: 'var(--spacespot-success-light)',
      border: 'rgba(16, 185, 129, 0.28)',
    };
  }

  return {
    color: 'var(--spacespot-info)',
    background: 'var(--spacespot-info-light)',
    border: 'rgba(59, 130, 246, 0.26)',
  };
};

export default function ManageUnits() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | UnitStatus>('All');

  const filteredUnits = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return UNITS.filter((unit) => {
      const matchesSearch =
        query.length === 0 ||
        unit.name.toLowerCase().includes(query) ||
        unit.code.toLowerCase().includes(query) ||
        unit.location.toLowerCase().includes(query) ||
        unit.precinct.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || unit.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      total: UNITS.length,
      leased: UNITS.filter((unit) => unit.status === 'Leased').length,
      availableSoon: UNITS.filter((unit) => unit.status === 'Available Soon').length,
      proposed: UNITS.filter((unit) => unit.status === 'Proposed').length,
    }),
    [],
  );

  return (
    <div style={{ padding: '16px 18px 22px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--spacespot-cyan-primary)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 6px 10px rgba(20, 216, 204, 0.18)',
              }}
            >
              <Building2 size={17} color="var(--spacespot-white)" />
            </div>
            <div>
              <h1 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--spacespot-navy-primary)', margin: 0 }}>Manage Units</h1>
              <p style={{ fontSize: '11px', color: 'var(--spacespot-gray-500)', margin: '2px 0 0' }}>View and manage all units</p>
              <div style={{ width: '56px', height: '2px', backgroundColor: 'var(--spacespot-cyan-primary)', marginTop: '10px', borderRadius: '999px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <button
              type="button"
              style={{
                border: 'none',
                backgroundColor: 'var(--spacespot-navy-primary)',
                borderRadius: '8px',
                color: 'var(--spacespot-white)',
                fontSize: '11px',
                height: '28px',
                padding: '0 9px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              All Spaces <ChevronDown size={14} />
            </button>

            <button
              type="button"
              onClick={() => navigate('/create/units')}
              style={{
                border: 'none',
                backgroundColor: 'var(--spacespot-navy-primary)',
                borderRadius: '8px',
                color: 'var(--spacespot-white)',
                fontSize: '11px',
                height: '28px',
                padding: '0 12px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              + Add New Unit
            </button>
          </div>
        </div>

        <div
          style={{
            border: '1.5px solid var(--spacespot-cyan-primary)',
            borderRadius: '8px',
            padding: '10px 12px',
            backgroundColor: 'var(--spacespot-white)',
            marginBottom: '10px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative' }}>
            <Search size={13} color="var(--spacespot-gray-400)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by unit name, ID, floor, or precinct..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              style={{
                width: '100%',
                height: '30px',
                border: '1px solid var(--spacespot-gray-300)',
                borderRadius: '7px',
                backgroundColor: 'var(--spacespot-white)',
                padding: '0 10px 0 30px',
                fontSize: '11px',
                color: 'var(--spacespot-navy-primary)',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {(['All', 'Leased', 'Proposed', 'Available Soon'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                style={{
                  borderRadius: '7px',
                  border: statusFilter === filter ? '1px solid var(--spacespot-cyan-primary)' : '1px solid var(--spacespot-gray-300)',
                  backgroundColor: statusFilter === filter ? 'var(--spacespot-cyan-primary)' : 'var(--spacespot-white)',
                  color: statusFilter === filter ? 'var(--spacespot-white)' : 'var(--spacespot-gray-500)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '9px',
                  height: '30px',
                  padding: '0 10px',
                  whiteSpace: 'nowrap',
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginBottom: '10px' }}>
          {[
            { title: 'Total Units', value: stats.total, border: 'var(--spacespot-cyan-300)', icon: Building2, iconColor: 'var(--spacespot-cyan-primary)' },
            { title: 'Leased', value: stats.leased, border: 'var(--spacespot-cyan-300)', icon: Building2, iconColor: 'var(--spacespot-success)' },
            { title: 'Available Soon', value: stats.availableSoon, border: 'var(--spacespot-warning)', icon: Square, iconColor: 'var(--spacespot-warning)' },
            { title: 'Proposed', value: stats.proposed, border: 'var(--spacespot-cyan-300)', icon: Building2, iconColor: 'var(--spacespot-cyan-primary)' },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                backgroundColor: 'var(--spacespot-white)',
                border: `1.5px solid ${card.border}`,
                borderRadius: '8px',
                padding: '10px',
                minHeight: '56px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '10px', color: 'var(--spacespot-gray-500)', marginBottom: '6px' }}>{card.title}</div>
                <div style={{ fontSize: '27px', lineHeight: 1, fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>{card.value}</div>
              </div>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--spacespot-cyan-pale)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <card.icon size={13} color={card.iconColor} />
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            backgroundColor: 'var(--spacespot-white)',
            border: '1.5px solid var(--spacespot-cyan-primary)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              borderBottom: '1px solid var(--spacespot-gray-200)',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Unit List ({filteredUnits.length})</div>

            <button
              type="button"
              style={{
                border: '1px solid var(--spacespot-gray-300)',
                backgroundColor: 'var(--spacespot-gray-50)',
                borderRadius: '8px',
                color: 'var(--spacespot-gray-600)',
                fontSize: '10px',
                height: '24px',
                padding: '0 9px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Upload size={12} /> Export
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--spacespot-gray-50)', borderBottom: '1px solid var(--spacespot-gray-200)' }}>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '9px', color: 'var(--spacespot-gray-400)', fontWeight: 700 }}>UNIT</th>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '9px', color: 'var(--spacespot-gray-400)', fontWeight: 700 }}>LOCATION</th>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '9px', color: 'var(--spacespot-gray-400)', fontWeight: 700 }}>CATEGORY</th>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '9px', color: 'var(--spacespot-gray-400)', fontWeight: 700 }}>DETAILS</th>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '9px', color: 'var(--spacespot-gray-400)', fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '10px', textAlign: 'center', fontSize: '9px', color: 'var(--spacespot-gray-400)', fontWeight: 700 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((unit) => {
                  const statusTheme = getStatusTheme(unit.status);
                  const categoryTheme = getCategoryTheme(unit.category);

                  return (
                    <tr key={unit.id} style={{ borderBottom: '1px solid var(--spacespot-gray-100)' }}>
                      <td style={{ padding: '8px 10px', minWidth: '190px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--spacespot-cyan-primary)',
                              color: 'var(--spacespot-white)',
                              display: 'grid',
                              placeItems: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Building2 size={10} />
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: 'var(--spacespot-navy-primary)', fontWeight: 600 }}>{unit.name}</div>
                            <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-400)' }}>{unit.id}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '8px 10px', minWidth: '150px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: 'var(--spacespot-gray-600)' }}>
                          <MapPin size={10} color="var(--spacespot-gray-400)" />
                          {unit.location}
                        </div>
                        <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-400)', marginTop: '3px' }}>{unit.precinct}</div>
                      </td>

                      <td style={{ padding: '8px 10px', minWidth: '105px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            height: '18px',
                            padding: '0 7px',
                            borderRadius: '999px',
                            border: `1px solid ${categoryTheme.border}`,
                            backgroundColor: categoryTheme.background,
                            color: categoryTheme.color,
                            fontSize: '8px',
                            fontWeight: 600,
                          }}
                        >
                          {unit.category}
                        </span>
                      </td>

                      <td style={{ padding: '8px 10px', minWidth: '125px' }}>
                        <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-400)' }}>/ {unit.area} m2</div>
                        <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--spacespot-navy-primary)', marginTop: '2px' }}>/ {unit.frontage}</div>
                        <div style={{ fontSize: '8px', color: 'var(--spacespot-success)', marginTop: '2px' }}>$ {unit.monthlyRate.toFixed(2)}</div>
                      </td>

                      <td style={{ padding: '8px 10px', minWidth: '118px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            height: '19px',
                            padding: '0 8px',
                            borderRadius: '999px',
                            border: `1px solid ${statusTheme.border}`,
                            backgroundColor: statusTheme.background,
                            color: statusTheme.color,
                            fontSize: '8px',
                            fontWeight: 600,
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '999px', backgroundColor: statusTheme.color, display: 'inline-block' }} />
                          {unit.status}
                        </span>
                      </td>

                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button type="button" style={{ border: 'none', background: 'transparent', padding: 0, color: 'var(--spacespot-gray-400)', cursor: 'pointer' }}>
                            <Eye size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/manage/edit-unit/${unit.id}`, {
                                state: {
                                  unit,
                                },
                              })
                            }
                            style={{ border: 'none', background: 'transparent', padding: 0, color: 'var(--spacespot-gray-400)', cursor: 'pointer' }}
                          >
                            <Pencil size={12} />
                          </button>
                          <button type="button" style={{ border: 'none', background: 'transparent', padding: 0, color: 'var(--spacespot-gray-400)', cursor: 'pointer' }}>
                            <Trash2 size={12} />
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
      </div>
    </div>
  );
}

