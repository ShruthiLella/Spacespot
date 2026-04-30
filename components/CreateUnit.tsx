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
    <div style={{ backgroundColor: '#eef2f6', minHeight: '100vh', padding: '24px 0 32px' }}>
      <div style={{ maxWidth: '1342px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <button
            type="button"
            style={{
              border: '1.5px solid #9fe5df',
              backgroundColor: '#1e2f46',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '13px',
              height: '36px',
              padding: '0 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            All Spaces <ChevronDown size={15} />
          </button>
        </div>

        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #dbe5ee',
            borderRadius: '10px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(20, 216, 204, 0.06)',
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1a2b3c', margin: 0 }}>
              Create Unit - Select a Space
            </h1>
            <p style={{ fontSize: '13px', color: '#6b7e91', margin: '6px 0 0' }}>
              Choose a space from the list below to add new units
            </p>
          </div>

          <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '340px' }}>
            <Search size={13} color="#9aa7b7" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by space name, location, type, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                border: '1px solid #cfd7e2',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#1f2937',
                padding: '0 12px 0 36px',
                backgroundColor: '#f9fbfc',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px' }}>
            {filteredSpaces.map((space) => (
              <button
                key={space.id}
                type="button"
                onClick={() => handleSelectSpace(space.id)}
                style={{
                  textAlign: 'left',
                  borderRadius: '10px',
                  border: selectedSpace === space.id ? '1.5px solid #16bfb6' : '1px solid #dbe5ee',
                  backgroundColor: '#f9fbfc',
                  padding: '20px',
                  cursor: 'pointer',
                  minHeight: '150px',
                  boxShadow: selectedSpace === space.id ? '0 2px 8px rgba(20, 216, 204, 0.10)' : 'none',
                  transition: 'box-shadow 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      backgroundColor: '#eafaf8',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Building2 size={13} color="var(--spacespot-cyan-primary)" />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#8b99ab',
                      backgroundColor: '#f4f6f9',
                      border: '1px solid #e0e7ef',
                      borderRadius: '999px',
                      padding: '2px 8px',
                      fontWeight: 600,
                    }}
                  >
                    {space.id}
                  </span>
                </div>

                <div style={{ fontSize: '16px', fontWeight: 700, color: '#21334a', marginBottom: '6px' }}>{space.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7f8ea1', fontSize: '12px', marginBottom: '8px' }}>
                  <MapPin size={11} color="#9aa7b7" />
                  {space.address}
                </div>

                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    color: '#16bfb6',
                    border: '1px solid #bfece8',
                    backgroundColor: '#ecfbf9',
                    borderRadius: '999px',
                    padding: '2px 10px',
                    marginBottom: '10px',
                    fontWeight: 600,
                  }}
                >
                  {space.type}
                </span>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#9aa7b7', letterSpacing: '0.05em', fontWeight: 600 }}>FLOORS</div>
                    <div style={{ fontSize: '12px', color: '#223247', fontWeight: 700 }}>{space.floors}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#9aa7b7', letterSpacing: '0.05em', fontWeight: 600 }}>UNITS</div>
                    <div style={{ fontSize: '12px', color: '#223247', fontWeight: 700 }}>{space.units}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#9aa7b7', fontWeight: 600 }}>Existing Units</div>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '999px',
                      border: '1px solid #dbe3ec',
                      backgroundColor: '#f4f7fa',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <ChevronRight size={12} color="#99a7b7" />
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

