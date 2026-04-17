import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  Circle,
  Eye,
  MapPin,
  Pencil,
  Search,
  Square,
  Trash2,
  Upload,
} from 'lucide-react';

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
}

const SPACES: Space[] = [
  {
    id: 'SP001',
    name: 'Downtown Office Complex',
    location: '123 Business Street, Sydney',
    type: 'Office',
    floors: 5,
    units: 5,
    availableUnits: 2,
    occupancy: 50,
    status: 'Active',
  },
  {
    id: 'SP002',
    name: 'Tech Hub Building A',
    location: '45 Tech Avenue, Melbourne',
    type: 'Commercial',
    floors: 3,
    units: 3,
    availableUnits: 2,
    occupancy: 33,
    status: 'Active',
  },
  {
    id: 'SP003',
    name: 'Riverside Business Park',
    location: '78 River Road, Brisbane',
    type: 'Mixed Use',
    floors: 4,
    units: 2,
    availableUnits: 1,
    occupancy: 100,
    status: 'Active',
  },
  {
    id: 'SP004',
    name: 'Innovation Centre',
    location: '90 Innovation Drive, Perth',
    type: 'Office',
    floors: 2,
    units: 1,
    availableUnits: 0,
    occupancy: 0,
    status: 'Inactive',
  },
  {
    id: 'SP005',
    name: 'Retail Plaza East Wing',
    location: '12 Retail Street, Adelaide',
    type: 'Retail',
    floors: 1,
    units: 1,
    availableUnits: 1,
    occupancy: 50,
    status: 'Active',
  },
  {
    id: 'SP006',
    name: 'Healthcare Professional Suites',
    location: '56 Health Avenue, Canberra',
    type: 'Medical',
    floors: 3,
    units: 0,
    availableUnits: 0,
    occupancy: 0,
    status: 'Inactive',
  },
];

export default function ManageSpaces() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'AI' | 'Active' | 'Inactive'>('AI');

  const filteredSpaces = useMemo(() => {
    return SPACES.filter((space) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        space.name.toLowerCase().includes(query) ||
        space.location.toLowerCase().includes(query) ||
        space.type.toLowerCase().includes(query) ||
        space.id.toLowerCase().includes(query);
      const matchesFilter = activeFilter === 'AI' || space.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const totals = useMemo(() => {
    const totalSpaces = SPACES.length;
    const activeSpaces = SPACES.filter((space) => space.status === 'Active').length;
    const totalUnits = SPACES.reduce((sum, space) => sum + space.units, 0);
    const availableUnits = SPACES.reduce((sum, space) => sum + space.availableUnits, 0);
    return { totalSpaces, activeSpaces, totalUnits, availableUnits };
  }, []);

  const getProgressColor = (occupancy: number) => {
    if (occupancy >= 100) return 'var(--spacespot-cyan-primary)';
    if (occupancy > 0) return 'var(--spacespot-cyan-dark)';
    return 'var(--spacespot-gray-300)';
  };

  const getTypePillColor = (type: string) => {
    if (type === 'Office') return 'var(--spacespot-cyan-pale)';
    if (type === 'Commercial') return 'var(--spacespot-info-light)';
    if (type === 'Mixed Use') return 'var(--spacespot-warning-light)';
    if (type === 'Retail') return 'var(--spacespot-success-light)';
    return 'var(--spacespot-info-light)';
  };

  return (
    <div style={{ padding: '16px 18px 20px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto' }}>
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
              <Building2 size={17} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--spacespot-navy-primary)', margin: 0 }}>Manage Spaces</h1>
              <p style={{ fontSize: '11px', color: 'var(--spacespot-gray-500)', margin: '2px 0 0' }}>View and manage all spaces</p>
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
              + Add New Space
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
              placeholder="Search by space name, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            {(['AI', 'Active', 'Inactive'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  borderRadius: '7px',
                  border: activeFilter === filter ? '1px solid var(--spacespot-cyan-primary)' : '1px solid var(--spacespot-gray-300)',
                  backgroundColor: activeFilter === filter ? 'var(--spacespot-cyan-primary)' : 'var(--spacespot-white)',
                  color: activeFilter === filter ? 'var(--spacespot-white)' : 'var(--spacespot-gray-500)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '10px',
                  height: '30px',
                  padding: '0 10px',
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginBottom: '10px' }}>
          {[
            { title: 'Total Spaces', value: totals.totalSpaces, border: 'var(--spacespot-cyan-300)', icon: Building2, iconColor: 'var(--spacespot-cyan-primary)' },
            { title: 'Active', value: totals.activeSpaces, border: 'var(--spacespot-cyan-300)', icon: Circle, iconColor: 'var(--spacespot-success)' },
            { title: 'Total Units', value: totals.totalUnits, border: 'var(--spacespot-warning-border)', icon: Square, iconColor: 'var(--spacespot-warning)' },
            { title: 'Available Units', value: totals.availableUnits, border: 'var(--spacespot-cyan-300)', icon: Building2, iconColor: 'var(--spacespot-cyan-primary)' },
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
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Space List ({filteredSpaces.length})</div>

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
                  <th style={{ padding: '10px 10px', textAlign: 'left', fontSize: '9px', color: 'var(--spacespot-gray-400)', fontWeight: 700 }}>SPACE</th>
                  <th style={{ padding: '10px 10px', textAlign: 'left', fontSize: '9px', color: 'var(--spacespot-gray-400)', fontWeight: 700 }}>LOCATION & TYPE</th>
                  <th style={{ padding: '10px 10px', textAlign: 'left', fontSize: '9px', color: 'var(--spacespot-gray-400)', fontWeight: 700 }}>STRUCTURE</th>
                  <th style={{ padding: '10px 10px', textAlign: 'left', fontSize: '9px', color: 'var(--spacespot-gray-400)', fontWeight: 700 }}>OCCUPANCY & STATUS</th>
                  <th style={{ padding: '10px 10px', textAlign: 'center', fontSize: '9px', color: 'var(--spacespot-gray-400)', fontWeight: 700 }}>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredSpaces.map((space) => (
                  <tr key={space.id} style={{ borderBottom: '1px solid var(--spacespot-gray-100)' }}>
                    <td style={{ padding: '8px 10px' }}>
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
                          }}
                        >
                          <Building2 size={10} />
                        </div>

                        <div>
                          <div style={{ fontSize: '10px', color: 'var(--spacespot-navy-primary)', fontWeight: 600 }}>{space.name}</div>
                          <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-400)' }}>{space.id}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '8px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: 'var(--spacespot-gray-600)' }}>
                        <MapPin size={10} color="var(--spacespot-gray-400)" />
                        {space.location}
                      </div>
                      <span
                        style={{
                          marginTop: '4px',
                          display: 'inline-block',
                          fontSize: '8px',
                          color: 'var(--spacespot-cyan-dark)',
                          border: '1px solid var(--spacespot-cyan-300)',
                          backgroundColor: getTypePillColor(space.type),
                          borderRadius: '999px',
                          padding: '2px 6px',
                        }}
                      >
                        {space.type}
                      </span>
                    </td>

                    <td style={{ padding: '8px 10px' }}>
                      <div style={{ fontSize: '7px', color: 'var(--spacespot-gray-400)', letterSpacing: '0.04em' }}>FLOORS</div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--spacespot-navy-primary)', marginBottom: '2px' }}>{space.floors}</div>
                      <div style={{ fontSize: '7px', color: 'var(--spacespot-gray-400)', letterSpacing: '0.04em' }}>UNITS</div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>{space.units}</div>
                      <div style={{ fontSize: '8px', color: 'var(--spacespot-cyan-dark)', marginTop: '1px' }}>{space.availableUnits} Available</div>
                    </td>

                    <td style={{ padding: '8px 10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ fontSize: '8px', color: 'var(--spacespot-gray-400)' }}>Occupancy</div>
                        <div style={{ fontSize: '8px', color: getProgressColor(space.occupancy), fontWeight: 700 }}>{space.occupancy}%</div>
                      </div>
                      <div style={{ height: '8px', borderRadius: '999px', backgroundColor: 'var(--spacespot-gray-100)', overflow: 'hidden', marginBottom: '5px' }}>
                        <div
                          style={{
                            width: `${space.occupancy}%`,
                            height: '100%',
                            borderRadius: '999px',
                            backgroundColor: getProgressColor(space.occupancy),
                          }}
                        />
                      </div>

                      <span
                        style={{
                          fontSize: '8px',
                          borderRadius: '999px',
                          padding: '2px 8px',
                          border: '1px solid var(--spacespot-gray-300)',
                          color: space.status === 'Active' ? 'var(--spacespot-cyan-dark)' : 'var(--spacespot-gray-400)',
                          backgroundColor: space.status === 'Active' ? 'var(--spacespot-cyan-pale)' : 'var(--spacespot-gray-50)',
                        }}
                      >
                        {space.status}
                      </span>
                    </td>

                    <td style={{ padding: '8px 10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button type="button" style={{ border: 'none', background: 'transparent', padding: 0, color: 'var(--spacespot-gray-400)', cursor: 'pointer' }}>
                          <Eye size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/manage/edit-space/${space.id}`)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

