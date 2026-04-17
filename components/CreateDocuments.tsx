import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  FileCheck2,
  FileText,
  FileWarning,
  ReceiptText,
  Search,
  Shield,
  ShieldAlert,
  Store,
  TriangleAlert,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';

type DocumentCategory = 'Guidelines' | 'Safety' | 'Legal' | 'Insurance' | 'Template' | 'Finance' | 'Marketing';

interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  description: string;
  spaceId: string;
  unitScope: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

const DOCUMENTS: DocumentItem[] = [
  {
    id: 'DOC-001',
    title: 'Centre Rules & Guidelines',
    category: 'Guidelines',
    description: 'Comprehensive rules and guidelines for the centre',
    spaceId: 'SP001',
    unitScope: 'All Units',
    icon: BookOpen,
  },
  {
    id: 'DOC-002',
    title: 'Unit Guidelines & Rules',
    category: 'Guidelines',
    description: 'Specific guidelines and rules for individual units',
    spaceId: 'SP001',
    unitScope: 'All Units',
    icon: FileCheck2,
  },
  {
    id: 'DOC-003',
    title: 'Centre EHS Requirements',
    category: 'Safety',
    description: 'Environmental, Health & Safety requirements',
    spaceId: 'SP001',
    unitScope: 'All Units',
    icon: Shield,
  },
  {
    id: 'DOC-004',
    title: 'Centre Best Practice Guide',
    category: 'Guidelines',
    description: 'Best practices for centre operations',
    spaceId: 'SP001',
    unitScope: 'All Units',
    icon: BriefcaseBusiness,
  },
  {
    id: 'DOC-005',
    title: 'PLI Requirements Assessment',
    category: 'Insurance',
    description: 'Public Liability Insurance requirements',
    spaceId: 'SP001',
    unitScope: 'All Units',
    icon: Shield,
  },
  {
    id: 'DOC-006',
    title: 'Event Risk Assessment Template',
    category: 'Template',
    description: 'Template for assessing event-related risks',
    spaceId: 'SP001',
    unitScope: 'All Units',
    icon: ReceiptText,
  },
  {
    id: 'DOC-007',
    title: 'Notice to Vacate',
    category: 'Legal',
    description: 'Formal notice to vacate premises',
    spaceId: 'SP001',
    unitScope: 'All Units',
    icon: TriangleAlert,
  },
  {
    id: 'DOC-008',
    title: 'Notice to Cease Trade Due to Arrears',
    category: 'Legal',
    description: 'Notice for ceasing trade due to outstanding payments',
    spaceId: 'SP001',
    unitScope: 'All Units',
    icon: FileWarning,
  },
  {
    id: 'DOC-009',
    title: 'Rules and Guidelines for Advertising Space',
    category: 'Marketing',
    description: 'Guidelines for advertising within the centre',
    spaceId: 'SP001',
    unitScope: 'All Units',
    icon: Upload,
  },
  {
    id: 'DOC-010',
    title: 'Debt Reminder',
    category: 'Finance',
    description: 'Reminder notice for outstanding debts',
    spaceId: 'SP001',
    unitScope: 'All Units',
    icon: ReceiptText,
  },
  {
    id: 'DOC-011',
    title: 'POPUP SHOP Display Guidelines',
    category: 'Safety',
    description: 'Display and setup guidelines for popup shops',
    spaceId: 'SP001',
    unitScope: 'All Units',
    icon: Store,
  },
];

const INITIAL_SELECTED_UNITS: Record<string, string> = {
  'DOC-002': 'All Units',
};

const getCategoryTheme = (category: DocumentCategory) => {
  switch (category) {
    case 'Guidelines':
      return {
        border: 'var(--spacespot-cyan-300)',
        pillBg: 'var(--spacespot-cyan-pale)',
        pillText: 'var(--spacespot-cyan-dark)',
        iconColor: 'var(--spacespot-cyan-primary)',
      };
    case 'Safety':
      return {
        border: 'var(--spacespot-warning)',
        pillBg: 'var(--spacespot-warning-light)',
        pillText: 'var(--spacespot-warning)',
        iconColor: 'var(--spacespot-warning)',
      };
    case 'Legal':
      return {
        border: 'var(--spacespot-error)',
        pillBg: 'var(--spacespot-error-light)',
        pillText: 'var(--spacespot-error)',
        iconColor: 'var(--spacespot-error)',
      };
    case 'Insurance':
      return {
        border: 'var(--spacespot-info)',
        pillBg: 'var(--spacespot-info-light)',
        pillText: 'var(--spacespot-info)',
        iconColor: 'var(--spacespot-info)',
      };
    case 'Template':
      return {
        border: 'var(--spacespot-warning)',
        pillBg: 'var(--spacespot-warning-light)',
        pillText: 'var(--spacespot-warning)',
        iconColor: 'var(--spacespot-warning)',
      };
    case 'Finance':
      return {
        border: 'var(--spacespot-warning)',
        pillBg: 'var(--spacespot-warning-light)',
        pillText: 'var(--spacespot-warning)',
        iconColor: 'var(--spacespot-warning)',
      };
    default:
      return {
        border: 'var(--spacespot-info)',
        pillBg: 'var(--spacespot-info-light)',
        pillText: 'var(--spacespot-info)',
        iconColor: 'var(--spacespot-info)',
      };
  }
};

export default function CreateDocuments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | DocumentCategory>('All');
  const [spaceFilter, setSpaceFilter] = useState('SP001');
  const [selectedUnitById, setSelectedUnitById] = useState(INITIAL_SELECTED_UNITS);

  const filteredDocuments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return DOCUMENTS.filter((document) => {
      const matchesSearch =
        query.length === 0 ||
        document.title.toLowerCase().includes(query) ||
        document.description.toLowerCase().includes(query) ||
        document.category.toLowerCase().includes(query);

      const matchesCategory = categoryFilter === 'All' || document.category === categoryFilter;
      const matchesSpace = spaceFilter === 'All' || document.spaceId === spaceFilter;

      return matchesSearch && matchesCategory && matchesSpace;
    });
  }, [categoryFilter, searchTerm, spaceFilter]);

  const stats = useMemo(() => {
    return {
      total: DOCUMENTS.length,
      guidelines: DOCUMENTS.filter((document) => document.category === 'Guidelines').length,
      safety: DOCUMENTS.filter((document) => document.category === 'Safety').length,
      legal: DOCUMENTS.filter((document) => document.category === 'Legal').length,
    };
  }, []);

  const handleGenerate = (document: DocumentItem) => {
    const selectedUnit = selectedUnitById[document.id] ?? document.unitScope;
    toast.success(`${document.title} is being generated`, {
      description: `${spaceFilter} • ${selectedUnit}`,
    });
  };

  return (
    <div style={{ padding: '18px 20px 24px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--spacespot-cyan-primary)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 10px 18px rgba(20, 216, 204, 0.18)',
              }}
            >
              <FileText size={18} color="var(--spacespot-white)" />
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--spacespot-navy-primary)', marginBottom: '2px' }}>Generate Documents</div>
              <div style={{ fontSize: '10px', color: 'var(--spacespot-gray-500)' }}>Create professional documents for your spaces and units</div>
            </div>
          </div>

          <button
            type="button"
            style={{
              border: 'none',
              backgroundColor: 'var(--spacespot-navy-primary)',
              color: 'var(--spacespot-white)',
              borderRadius: '8px',
              padding: '0 12px',
              height: '30px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            All Spaces <ChevronDown size={14} />
          </button>
        </div>

        <div
          style={{
            backgroundColor: 'var(--spacespot-white)',
            border: '1.5px solid var(--spacespot-gray-300)',
            borderRadius: '10px',
            padding: '12px',
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr 1fr',
            gap: '10px',
            marginBottom: '14px',
          }}
        >
          <div style={{ position: 'relative' }}>
            <Search size={13} color="var(--spacespot-gray-400)" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              style={{
                width: '100%',
                height: '32px',
                padding: '0 12px 0 32px',
                border: '1px solid var(--spacespot-gray-300)',
                borderRadius: '7px',
                backgroundColor: 'var(--spacespot-white)',
                color: 'var(--spacespot-navy-primary)',
                fontSize: '11px',
              }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as 'All' | DocumentCategory)}
            style={{
              height: '32px',
              border: '1px solid var(--spacespot-gray-300)',
              borderRadius: '7px',
              backgroundColor: 'var(--spacespot-white)',
              padding: '0 10px',
              fontSize: '11px',
            }}
          >
            <option value="All">All</option>
            <option value="Guidelines">Guidelines</option>
            <option value="Safety">Safety</option>
            <option value="Legal">Legal</option>
            <option value="Insurance">Insurance</option>
            <option value="Template">Template</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </select>

          <select
            value={spaceFilter}
            onChange={(event) => setSpaceFilter(event.target.value)}
            style={{
              height: '32px',
              border: '1px solid var(--spacespot-gray-300)',
              borderRadius: '7px',
              backgroundColor: 'var(--spacespot-white)',
              padding: '0 10px',
              fontSize: '11px',
            }}
          >
            <option value="SP001">SP001</option>
            <option value="All">All Spaces</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginBottom: '16px' }}>
          {[
            { title: 'Total Documents', value: stats.total, icon: FileText, accent: 'var(--spacespot-cyan-300)', iconColor: 'var(--spacespot-cyan-primary)' },
            { title: 'Guidelines', value: stats.guidelines, icon: BookOpen, accent: 'var(--spacespot-cyan-300)', iconColor: 'var(--spacespot-success)' },
            { title: 'Safety', value: stats.safety, icon: ShieldAlert, accent: 'var(--spacespot-warning)', iconColor: 'var(--spacespot-warning)' },
            { title: 'Legal', value: stats.legal, icon: TriangleAlert, accent: 'var(--spacespot-error)', iconColor: 'var(--spacespot-error)' },
          ].map((stat) => (
            <div
              key={stat.title}
              style={{
                backgroundColor: 'var(--spacespot-white)',
                border: `1.5px solid ${stat.accent}`,
                borderRadius: '10px',
                padding: '10px 12px',
                minHeight: '62px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <div style={{ fontSize: '9px', color: 'var(--spacespot-gray-400)', marginBottom: '7px' }}>{stat.title}</div>
                <div style={{ fontSize: '27px', lineHeight: 1, fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>{stat.value}</div>
              </div>

              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--spacespot-gray-50)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <stat.icon size={13} color={stat.iconColor} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
          {filteredDocuments.map((document) => {
            const theme = getCategoryTheme(document.category);
            const Icon = document.icon;
            const selectedUnit = selectedUnitById[document.id] ?? document.unitScope;

            return (
              <div
                key={document.id}
                style={{
                  backgroundColor: 'var(--spacespot-white)',
                  border: '1px solid var(--spacespot-gray-200)',
                  borderRadius: '10px',
                  boxShadow: 'var(--spacespot-shadow-sm)',
                  padding: '12px',
                  minHeight: '136px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--spacespot-gray-50)',
                      border: `1px solid ${theme.border}`,
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={14} color={theme.iconColor} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, lineHeight: 1.35, color: 'var(--spacespot-navy-primary)', marginBottom: '4px' }}>
                      {document.title}
                    </div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '18px',
                        padding: '0 6px',
                        borderRadius: '999px',
                        backgroundColor: theme.pillBg,
                        color: theme.pillText,
                        fontSize: '7px',
                        fontWeight: 700,
                      }}
                    >
                      {document.category}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '8px', lineHeight: 1.45, color: 'var(--spacespot-gray-500)', marginBottom: '10px', minHeight: '24px' }}>
                  {document.description}
                </div>

                {document.id === 'DOC-002' && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '7px', color: 'var(--spacespot-gray-400)', marginBottom: '4px' }}>Select Unit</div>
                    <select
                      value={selectedUnit}
                      onChange={(event) => setSelectedUnitById((current) => ({ ...current, [document.id]: event.target.value }))}
                      style={{
                        width: '100%',
                        height: '30px',
                        border: '1px solid var(--spacespot-gray-300)',
                        borderRadius: '7px',
                        backgroundColor: 'var(--spacespot-white)',
                        padding: '0 9px',
                        fontSize: '10px',
                      }}
                    >
                      <option value="All Units">All Units</option>
                      <option value="Unit 01">Unit 01</option>
                      <option value="Unit 02">Unit 02</option>
                    </select>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleGenerate(document)}
                  style={{
                    marginTop: 'auto',
                    width: '100%',
                    height: '30px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: 'var(--spacespot-navy-primary)',
                    color: 'var(--spacespot-white)',
                    fontSize: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Upload size={11} /> Generate Document
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

