import { describe, test, expect } from '@jest/globals';
import { mapConceptsToObjects } from '../chains/map-concepts';
import { PalaceTemplate } from '../types/palace-template';

const testPalace: PalaceTemplate = {
  id: 'test-palace',
  name: 'Test Apartment',
  description: 'Test space',
  rooms: [
    {
      id: 'room-1',
      name: 'Living Room',
      dimensions: { width: 5, length: 6, height: 3 },
      position: { x: 0, y: 0, z: 0 },
    },
    {
      id: 'room-2',
      name: 'Kitchen',
      dimensions: { width: 4, length: 4, height: 3 },
      position: { x: 5, y: 0, z: 0 },
    },
  ],
  objects: [
    {
      id: 'obj-1',
      name: 'Red Leather Couch',
      description: 'Large red leather couch with worn armrests',
      roomId: 'room-1',
      position: { x: 1, y: 0, z: 2 },
    },
    {
      id: 'obj-2',
      name: 'Wooden Coffee Table',
      description: 'Round oak table with scratches',
      roomId: 'room-1',
      position: { x: 2.5, y: 0, z: 2.5 },
    },
    {
      id: 'obj-3',
      name: 'Stainless Steel Fridge',
      description: 'Tall silver fridge with ice maker',
      roomId: 'room-2',
      position: { x: 6, y: 0, z: 0.5 },
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('Map Concepts Chain', () => {
  test('maps concepts to palace objects', async () => {
    const learningText = `
      Python is a high-level programming language.
      Variables store data.
      Functions encapsulate reusable code.
    `;

    const mappings = await mapConceptsToObjects(learningText, testPalace);

    expect(mappings).toBeDefined();
    expect(mappings.length).toBeGreaterThan(0);
    expect(mappings.length).toBeLessThanOrEqual(testPalace.objects.length);

    mappings.forEach((mapping) => {
      expect(mapping.id).toBeDefined();
      expect(mapping.conceptText).toBeDefined();
      expect(mapping.objectId).toBeDefined();
      expect(mapping.mnemonicHint).toBeDefined();
      expect(testPalace.objects.some((o) => o.id === mapping.objectId)).toBe(
        true
      );
    });
  }, 30000);

  test('creates memorable mnemonic hints', async () => {
    const learningText = `
      The mitochondria is the powerhouse of the cell.
      DNA contains genetic information.
    `;

    const mappings = await mapConceptsToObjects(learningText, testPalace);

    expect(mappings.length).toBeGreaterThan(0);

    mappings.forEach((mapping) => {
      expect(mapping.mnemonicHint.length).toBeGreaterThan(10);
      expect(mapping.mnemonicHint.toLowerCase()).toContain(
        mapping.conceptText.toLowerCase().split(' ')[0]
      );
    });
  }, 30000);

  test('distributes concepts across available objects', async () => {
    const learningText = `
      Concept 1: First idea to remember.
      Concept 2: Second idea to remember.
      Concept 3: Third idea to remember.
      Concept 4: Fourth idea to remember.
    `;

    const mappings = await mapConceptsToObjects(learningText, testPalace);

    const usedObjectIds = new Set(mappings.map((m) => m.objectId));
    expect(usedObjectIds.size).toBeGreaterThan(1);
  }, 30000);
});
