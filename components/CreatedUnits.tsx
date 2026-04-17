import React from 'react';
import { Building2, CheckCircle2, ChevronDown, ListChecks, MapPin, Plus, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

type LocationState = {
  spaceId?: string;
  spaceName?: string;
  unit?: {
    id?: string;
    name?: string;
    floor?: string;
    area?: string;
    status?: string;
  };
};

export default function CreatedUnits() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const spaceId = state.spaceId || 'SC-001';
  const spaceName = state.spaceName || 'Beachside Canberra Mall';
  const unit = {
    id: state.unit?.id || 'UNIT-001',
    name: state.unit?.name || 'Pop-up Store Space A',
    floor: state.unit?.floor || 'Level 1',
    area: state.unit?.area || '25 Sq M',
    status: state.unit?.status || 'Proposed for creation',
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
            backgroundColor: '#ffffff',
            border: '1.5px solid #9fe5df',
            borderRadius: '8px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <CheckCircle2 size={14} color="var(--spacespot-cyan-primary)" />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Unit Created Successfully</div>
            <div style={{ fontSize: '9px', color: '#7f8ea1' }}>Review your created units and add more if needed</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #9fe5df',
            borderRadius: '8px',
            padding: '10px 12px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>SPACE ID</div>
            <div style={{ fontSize: '22px', lineHeight: 1, color: 'var(--spacespot-navy-primary)', fontWeight: 700 }}>{spaceId}</div>
          </div>
          <div>
            <div style={{ fontSize: '8px', color: '#8ea0b4', marginBottom: '4px', letterSpacing: '0.04em' }}>SPACE NAME</div>
            <div style={{ fontSize: '20px', color: 'var(--spacespot-navy-primary)', fontWeight: 600 }}>{spaceName}</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #9fe5df',
            borderRadius: '8px',
            padding: '10px 12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
            <ListChecks size={12} color="var(--spacespot-cyan-primary)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>Created Units (1)</span>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #dce5ee', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '750px' }}>
              <thead>
                <tr style={{ backgroundColor: '#fbfdff', borderBottom: '1px solid #e4edf5' }}>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '8px', color: '#95a4b6', fontWeight: 700 }}>UNIT ID</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '8px', color: '#95a4b6', fontWeight: 700 }}>Unit Name</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '8px', color: '#95a4b6', fontWeight: 700 }}>Floor</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '8px', color: '#95a4b6', fontWeight: 700 }}>Ownership</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '8px', color: '#95a4b6', fontWeight: 700 }}>Category</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '8px', color: '#95a4b6', fontWeight: 700 }}>Area</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '8px', color: '#95a4b6', fontWeight: 700 }}>Price/SqM</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '8px', color: '#95a4b6', fontWeight: 700 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', fontSize: '10px', color: 'var(--spacespot-navy-primary)', borderBottom: '1px solid #edf2f7' }}>{unit.id}</td>
                  <td style={{ padding: '8px', fontSize: '10px', color: 'var(--spacespot-navy-primary)', borderBottom: '1px solid #edf2f7' }}>{unit.name}</td>
                  <td style={{ padding: '8px', fontSize: '10px', color: 'var(--spacespot-navy-primary)', borderBottom: '1px solid #edf2f7' }}>{unit.floor}</td>
                  <td style={{ padding: '8px', fontSize: '10px', color: 'var(--spacespot-navy-primary)', borderBottom: '1px solid #edf2f7' }}>Water Front</td>
                  <td style={{ padding: '8px', fontSize: '10px', color: 'var(--spacespot-navy-primary)', borderBottom: '1px solid #edf2f7' }}>
                    <span
                      style={{
                        fontSize: '9px',
                        color: '#16bfb6',
                        border: '1px solid #c9ebe7',
                        backgroundColor: '#ecfbf9',
                        borderRadius: '999px',
                        padding: '1px 7px',
                      }}
                    >
                      Pop-up Space
                    </span>
                  </td>
                  <td style={{ padding: '8px', fontSize: '10px', color: 'var(--spacespot-navy-primary)', borderBottom: '1px solid #edf2f7' }}>{unit.area}</td>
                  <td style={{ padding: '8px', fontSize: '10px', color: 'var(--spacespot-navy-primary)', borderBottom: '1px solid #edf2f7' }}>$500</td>
                  <td style={{ padding: '8px', fontSize: '10px', color: 'var(--spacespot-navy-primary)', borderBottom: '1px solid #edf2f7' }}>
                    <span
                      style={{
                        fontSize: '9px',
                        color: '#22c55e',
                        border: '1px solid #bfe8ca',
                        backgroundColor: '#ecfdf2',
                        borderRadius: '999px',
                        padding: '1px 7px',
                      }}
                    >
                      {unit.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => navigate('/create/units/manual-add', { state: { spaceId } })}
              style={{
                border: '1px solid #cdd7e3',
                backgroundColor: '#f8fafd',
                borderRadius: '6px',
                color: '#4d5f75',
                fontSize: '10px',
                height: '26px',
                padding: '0 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={11} /> Add More Units
            </button>
            <button
              type="button"
              onClick={() => navigate('/manage/spaces')}
              style={{
                border: 'none',
                backgroundColor: 'var(--spacespot-navy-primary)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '10px',
                height: '26px',
                padding: '0 12px',
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

