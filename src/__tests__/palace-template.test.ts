import { describe, test, expect } from '@jest/globals';
import { PalaceTemplate, Room, PlacedObject, validatePalaceTemplate } from '../types/palace-template';

describe('PalaceTemplate Schema', () => {
  test('validates a complete palace template', () => {
    const template: PalaceTemplate = {
      id: 'palace-1',
      name: 'My Apartment',
      description: 'My 2-bedroom apartment',
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
          name: 'Red Couch',
          description: 'Large red leather couch facing the TV',
          roomId: 'room-1',
          position: { x: 1, y: 0, z: 2 },
        },
        {
          id: 'obj-2',
          name: 'Wooden Coffee Table',
          description: 'Small round wooden table with scratches',
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

    const result = validatePalaceTemplate(template);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('rejects template with missing required fields', () => {
    const incomplete = {
      id: 'palace-1',
      rooms: [],
    } as unknown as PalaceTemplate;

    const result = validatePalaceTemplate(incomplete);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('rejects objects referencing non-existent rooms', () => {
    const template: PalaceTemplate = {
      id: 'palace-1',
      name: 'Test Palace',
      description: 'Test',
      rooms: [
        {
          id: 'room-1',
          name: 'Room 1',
          dimensions: { width: 5, length: 5, height: 3 },
          position: { x: 0, y: 0, z: 0 },
        },
      ],
      objects: [
        {
          id: 'obj-1',
          name: 'Object',
          description: 'Test object',
          roomId: 'room-999',
          position: { x: 0, y: 0, z: 0 },
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = validatePalaceTemplate(template);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Object obj-1 references non-existent room room-999');
  });

  test('requires descriptive object names and descriptions', () => {
    const template: PalaceTemplate = {
      id: 'palace-1',
      name: 'Test Palace',
      description: 'Test',
      rooms: [
        {
          id: 'room-1',
          name: 'Room 1',
          dimensions: { width: 5, length: 5, height: 3 },
          position: { x: 0, y: 0, z: 0 },
        },
      ],
      objects: [
        {
          id: 'obj-1',
          name: '',
          description: '',
          roomId: 'room-1',
          position: { x: 0, y: 0, z: 0 },
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = validatePalaceTemplate(template);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('name'))).toBe(true);
  });
});
