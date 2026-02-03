'use client';

import dynamic from 'next/dynamic';
import { PalaceTemplate } from '@/types/palace-template';
import { ConceptMapping } from '@/types/concept-mapping';

const Palace3D = dynamic(() => import('./Palace3D'), {
  ssr: false,
  loading: () => <div>Loading 3D view...</div>,
});

interface PalaceViewerProps {
  palace: PalaceTemplate;
  mappings: ConceptMapping[];
}

export default function PalaceViewer({ palace, mappings }: PalaceViewerProps) {
  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ marginBottom: '1rem' }}>Step 4: Your Memory Palace</h2>
      <p style={{ marginBottom: '1rem', color: '#666' }}>
        Navigate your palace in 3D. Green objects have concepts attached.
        Use your mouse to orbit, zoom, and explore.
      </p>

      <div
        style={{
          width: '100%',
          height: '600px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
        data-testid="palace-viewer-3d"
      >
        <Palace3D palace={palace} mappings={mappings} />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Mapped Concepts</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {mappings.map((mapping) => {
            const obj = palace.objects.find((o) => o.id === mapping.objectId);
            return (
              <li
                key={mapping.id}
                style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  borderLeft: '4px solid #4CAF50',
                }}
                data-testid={`mapping-${mapping.id}`}
              >
                <strong>{mapping.conceptText}</strong>
                <br />
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                  @ {obj?.name}
                </span>
                <br />
                <span style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                  {mapping.mnemonicHint}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
