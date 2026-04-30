import React from 'react';
import { Building2, Edit3, Layers, MapPin, Wand2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

type LocationState = {
  spaceId?: string;
};

const SPACE_LOOKUP: Record<string, { name: string; type: string; location: string }> = {
  SP001: { name: 'Downtown Office Complex', type: 'Commercial', location: '123 Business Street, Sydney NSW 2000' },
  SP002: { name: 'Tech Hub Building A', type: 'Commercial', location: '45 Tech Avenue, Melbourne VIC 3000' },
  SP003: { name: 'Riverside Business Park', type: 'Commercial', location: '78 River Road, Brisbane QLD 4000' },
  SP004: { name: 'Innovation Center', type: 'Technology', location: '90 Innovation Drive, Perth WA 6000' },
  SP005: { name: 'Retail Plaza East Wing', type: 'Retail', location: '12 Retail Street, Adelaide SA 5000' },
  SP006: { name: 'Healthcare Professional Suites', type: 'Medical', location: '56 Health Avenue, Canberra ACT 2600' },
};

export default function AddUnits() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const selectedId = state.spaceId || 'SP003';
  const selectedSpace = SPACE_LOOKUP[selectedId] || SPACE_LOOKUP.SP003;

  return (
    <div style={{ backgroundColor: '#eef2f6', minHeight: '100vh', padding: '24px 0 32px' }}>
      <div style={{ maxWidth: '1342px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              backgroundColor: 'var(--spacespot-cyan-primary)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 6px 10px rgba(20, 216, 204, 0.2)',
            }}
          >
            <Building2 size={16} color="#ffffff" />
          </div>
          <div style={{ fontSize: '22px', color: 'var(--spacespot-navy-primary)', fontWeight: 600 }}>Add Units to Space</div>
        </div>
        <div style={{ width: '56px', height: '2px', backgroundColor: '#8adfd7', marginBottom: '18px', borderRadius: '999px' }} />

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #9fe5df',
            borderRadius: '10px',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>SPACE ID</div>
            <div style={{ fontSize: '22px', lineHeight: 1, color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>{selectedId}</div>
          </div>

          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>SPACE NAME</div>
            <div style={{ fontSize: '16px', color: 'var(--spacespot-navy-primary)', fontWeight: 600 }}>{selectedSpace.name}</div>
          </div>

          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>TYPE</div>
            <span
              style={{
                display: 'inline-block',
                fontSize: '10px',
                color: '#16bfb6',
                border: '1px solid #c9ebe7',
                backgroundColor: '#ecfbf9',
                borderRadius: '999px',
                padding: '2px 8px',
                fontWeight: 600,
              }}
            >
              {selectedSpace.type}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>LOCATION</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#6b7e91' }}>
              <MapPin size={10} color="#9aacc0" />
              {selectedSpace.location}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '30px', color: 'var(--spacespot-navy-primary)', fontWeight: 500 }}>Choose Your Approach</div>
          <div style={{ fontSize: '11px', color: '#8ea0b4', marginTop: '6px' }}>
            Select how you'd like to add units to this space
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '980px', margin: '0 auto' }}>
          <button
            type="button"
            onClick={() => navigate('/create/units/bulk', { state: { spaceId: selectedId } })}
            style={{
              textAlign: 'left',
              backgroundColor: '#ffffff',
              border: '1.5px solid #9fe5df',
              borderRadius: '10px',
              padding: '24px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(20, 216, 204, 0.06)',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'var(--spacespot-cyan-primary)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '10px',
                boxShadow: '0 8px 12px rgba(20, 216, 204, 0.2)',
              }}
            >
              <Layers size={19} color="#ffffff" />
            </div>
            <div style={{ fontSize: '22px', color: 'var(--spacespot-navy-primary)', fontWeight: 700, marginBottom: '8px' }}>Bulk Units</div>
            <div style={{ fontSize: '12px', color: '#90a0b2', lineHeight: 1.5, marginBottom: '12px' }}>
              Add multiple units at once by specifying count, naming patterns, and shared attributes.
            </div>
            <div style={{ display: 'grid', gap: '6px', marginBottom: '12px' }}>
              {[
                'Create many units at once',
                'Configurable naming patterns',
                'Shared attributes across units',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--spacespot-gray-500)', fontSize: '10px' }}>
                  <Layers size={11} color="var(--spacespot-cyan-primary)" />
                  {item}
                </div>
              ))}
            </div>
            <div style={{ fontSize: '13px', color: '#16bfb6', fontWeight: 700 }}>Get Started →</div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/create/units/manual-add', { state: { spaceId: selectedId } })}
            style={{
              textAlign: 'left',
              backgroundColor: '#ffffff',
              border: '1.5px solid #9fe5df',
              borderRadius: '10px',
              padding: '24px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(20, 216, 204, 0.06)',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'var(--spacespot-navy-primary)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '10px',
                boxShadow: '0 8px 12px rgba(31, 47, 69, 0.22)',
              }}
            >
              <Edit3 size={19} color="#ffffff" />
            </div>
            <div style={{ fontSize: '22px', color: 'var(--spacespot-navy-primary)', fontWeight: 700, marginBottom: '8px' }}>Manually Add Units</div>
            <div style={{ fontSize: '12px', color: '#90a0b2', lineHeight: 1.5, marginBottom: '12px' }}>
              Create units individually with complete control over every detail and specification.
            </div>
            <div style={{ display: 'grid', gap: '6px', marginBottom: '12px' }}>
              {[
                'Full control over details',
                'Customizable specifications',
                'Perfect for unique spaces',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--spacespot-gray-500)', fontSize: '10px' }}>
                  <Wand2 size={11} color="var(--spacespot-cyan-primary)" />
                  {item}
                </div>
              ))}
            </div>
            <div style={{ fontSize: '13px', color: '#16bfb6', fontWeight: 700 }}>Get Started →</div>
          </button>
        </div>
      </div>
    </div>
  );
}

