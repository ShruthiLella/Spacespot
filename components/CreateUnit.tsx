import React, { useMemo, useState } from 'react';
import { ChevronRight, Search, Building2, MapPin, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Space {
  id: string;
  name: string;
  address: string;
  type: string;
  floors: number;
  units: number;
  image?: string;
}

const SPACES: Space[] = [
  {
    id: 'SP001',
    name: 'Downtown Office Complex',
    address: '123 Business Street, Sydney NSW 2-',
    type: 'Commercial',
    floors: 5,
    units: 4,
  },
  {
    id: 'SP002',
    name: 'Tech Hub Building A',
    address: '45 Tech Avenue, Melbourne VIC 3C',
    type: 'Technology',
    floors: 3,
    units: 3,
  },
  {
    id: 'SP003',
    name: 'Riverside Business Park',
    address: '78 River Road, Brisbane QLD 4C',
    type: 'Commercial',
    floors: 4,
    units: 2,
  },
  {
    id: 'SP004',
    name: 'Innovation Center',
    address: '90 Innovation Drive, Perth WA 60',
    type: 'Technology',
    floors: 2,
    units: 1,
  },
  {
    id: 'SP005',
    name: 'Retail Plaza East Wing',
    address: '12 Retail Street, Adelaide SA 50',
    type: 'Retail',
    floors: 3,
    units: 2,
  },
  {
    id: 'SP006',
    name: 'Healthcare Professional Suites',
    address: '56 Health Avenue, Canberra ACT 2t',
    type: 'Medical',
    floors: 3,
    units: 0,
  },
];

export default function CreateUnit() {
  const navigate = useNavigate();
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectSpace = (spaceId: string) => {
    setSelectedSpace(spaceId);
    navigate('/create/units/configure', { state: { spaceId } });
  };

  const filteredSpaces = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return SPACES.filter(
      (space) =>
        space.name.toLowerCase().includes(query) ||
        space.address.toLowerCase().includes(query) ||
        space.type.toLowerCase().includes(query) ||
        space.id.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Commercial: 'var(--spacespot-cyan-primary)',
      Technology: 'var(--spacespot-blue-primary)',
      Retail: 'var(--spacespot-orange-primary)',
      Medical: 'var(--spacespot-purple-primary)',
    };
    return colors[type] || 'var(--spacespot-cyan-primary)';
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

        <div
          style={{
            backgroundColor: '#f0f2f5',
            border: '1px solid #d6dde6',
            borderRadius: '2px',
            padding: '16px',
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <h1 style={{ fontSize: '11px', fontWeight: 600, color: '#223247', margin: 0 }}>
              Create Unit - Select a Space
            </h1>
            <p style={{ fontSize: '10px', color: '#7f8ea1', margin: '3px 0 0' }}>
              Choose a space from the list below to add new units
            </p>
          </div>

          <div style={{ position: 'relative', marginBottom: '14px', maxWidth: '340px' }}>
            <Search size={11} color="#9aa7b7" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by space name, location, type, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: '28px',
                border: '1px solid #9fb0c4',
                borderRadius: '6px',
                fontSize: '10px',
                color: '#203249',
                padding: '0 10px 0 28px',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
            {filteredSpaces.map((space) => (
              <button
                key={space.id}
                type="button"
                onClick={() => handleSelectSpace(space.id)}
                style={{
                  textAlign: 'left',
                  borderRadius: '6px',
                  border: selectedSpace === space.id ? '1px solid #16bfb6' : '1px solid #aebccc',
                  backgroundColor: '#ffffff',
                  padding: '9px',
                  cursor: 'pointer',
                  minHeight: '135px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '5px',
                      backgroundColor: '#dff9f7',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Building2 size={10} color="var(--spacespot-cyan-primary)" />
                  </div>
                  <span
                    style={{
                      fontSize: '7px',
                      color: '#8b99ab',
                      backgroundColor: '#f4f6f9',
                      border: '1px solid #e0e7ef',
                      borderRadius: '999px',
                      padding: '1px 5px',
                    }}
                  >
                    {space.id}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: '#21334a', marginBottom: '4px' }}>{space.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#7f8ea1', fontSize: '8px', marginBottom: '5px' }}>
                  <MapPin size={9} color="#9aa7b7" />
                  {space.address}
                </div>

                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '7px',
                    color: '#16bfb6',
                    border: '1px solid #bfece8',
                    backgroundColor: '#ecfbf9',
                    borderRadius: '999px',
                    padding: '1px 6px',
                    marginBottom: '6px',
                  }}
                >
                  {space.type}
                </span>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                  <div>
                    <div style={{ fontSize: '6px', color: '#9aa7b7', letterSpacing: '0.05em' }}>FLOORS</div>
                    <div style={{ fontSize: '8px', color: '#223247' }}>{space.floors}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '6px', color: '#9aa7b7', letterSpacing: '0.05em' }}>UNITS</div>
                    <div style={{ fontSize: '8px', color: '#223247' }}>{space.units}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '6px', color: '#9aa7b7' }}>Existing Units</div>
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '999px',
                      border: '1px solid #dbe3ec',
                      backgroundColor: '#f4f7fa',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <ChevronRight size={9} color="#99a7b7" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

