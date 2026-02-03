import { describe, test, expect } from '@jest/globals';
import { generatePalaceFromDescription } from '../chains/generate-palace';
import { validatePalaceTemplate } from '../types/palace-template';

describe('Generate Palace Chain', () => {
  test('generates valid palace template from simple description', async () => {
    const description = `My studio apartment: living area with red couch and coffee table,
    kitchen with stainless steel fridge, bathroom with blue shower curtain`;

    const palace = await generatePalaceFromDescription(description);

    expect(palace).toBeDefined();
    expect(palace.id).toBeDefined();
    expect(palace.name).toBeDefined();
    expect(palace.rooms.length).toBeGreaterThan(0);
    expect(palace.objects.length).toBeGreaterThan(0);

    const validation = validatePalaceTemplate(palace);
    expect(validation.valid).toBe(true);
  }, 30000);

  test('extracts objects with descriptive details', async () => {
    const description = `Two-room house: bedroom with large wooden dresser and queen bed,
    living room with green armchair facing window`;

    const palace = await generatePalaceFromDescription(description);

    const objects = palace.objects;
    expect(objects.length).toBeGreaterThanOrEqual(3);

    objects.forEach((obj) => {
      expect(obj.name.length).toBeGreaterThan(0);
      expect(obj.description.length).toBeGreaterThan(0);
      expect(obj.roomId).toBeDefined();
      expect(palace.rooms.some((r) => r.id === obj.roomId)).toBe(true);
    });
  }, 30000);

  test('assigns reasonable spatial positions', async () => {
    const description = `Single room: bedroom with bed, desk, and bookshelf`;

    const palace = await generatePalaceFromDescription(description);

    expect(palace.rooms.length).toBeGreaterThanOrEqual(1);
    const room = palace.rooms[0];

    expect(room.dimensions.width).toBeGreaterThan(0);
    expect(room.dimensions.length).toBeGreaterThan(0);
    expect(room.dimensions.height).toBeGreaterThan(0);

    palace.objects.forEach((obj) => {
      expect(obj.position.x).toBeGreaterThanOrEqual(0);
      expect(obj.position.y).toBeGreaterThanOrEqual(0);
      expect(obj.position.z).toBeGreaterThanOrEqual(0);
    });
  }, 30000);
});
