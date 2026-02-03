import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { PalaceTemplate, Room, PlacedObject } from '../types/palace-template';
import { getModel } from '../lib/get-model';

const outputSchema = z.object({
  name: z.string().describe('Short name for the palace'),
  description: z.string().describe('Brief description of the space'),
  rooms: z.array(
    z.object({
      name: z.string(),
      width: z.number().positive(),
      length: z.number().positive(),
      height: z.number().positive().default(3),
      x: z.number().default(0),
      y: z.number().default(0),
      z: z.number().default(0),
    })
  ),
  objects: z.array(
    z.object({
      name: z.string().describe('Specific, memorable name (e.g., "Red Leather Couch")'),
      description: z
        .string()
        .describe('Vivid description with sensory details for memory'),
      roomName: z.string().describe('Name of the room this object is in'),
      x: z.number(),
      y: z.number().default(0),
      z: z.number(),
    })
  ),
});

const parser = StructuredOutputParser.fromZodSchema(outputSchema);

const prompt = PromptTemplate.fromTemplate(
  `You are an expert at creating memory palaces. Given a user's description of a space,
extract the rooms and memorable objects to create a structured palace template.

IMPORTANT RULES:
1. Extract SPECIFIC objects with VIVID details (colors, textures, unique features)
2. Assign reasonable dimensions to rooms (typical rooms are 3-6 meters)
3. Position objects realistically within their rooms
4. Each object must have a memorable description that engages the senses
5. Objects should be stationary and distinctive (good: "Red Leather Couch", bad: "Book")

User's description:
{description}

{format_instructions}

Output the palace structure:`
);

export async function generatePalaceFromDescription(
  description: string
): Promise<PalaceTemplate> {
  const model = getModel(0.7);

  const chain = prompt.pipe(model).pipe(parser);

  const result = await chain.invoke({
    description,
    format_instructions: parser.getFormatInstructions(),
  });

  const rooms: Room[] = result.rooms.map((r, idx) => ({
    id: `room-${idx + 1}`,
    name: r.name,
    dimensions: {
      width: r.width,
      length: r.length,
      height: r.height,
    },
    position: {
      x: r.x,
      y: r.y,
      z: r.z,
    },
  }));

  const roomNameToId = new Map(rooms.map((r) => [r.name.toLowerCase(), r.id]));

  const objects: PlacedObject[] = result.objects.map((o, idx) => ({
    id: `obj-${idx + 1}`,
    name: o.name,
    description: o.description,
    roomId: roomNameToId.get(o.roomName.toLowerCase()) || rooms[0].id,
    position: {
      x: o.x,
      y: o.y,
      z: o.z,
    },
  }));

  const now = new Date().toISOString();

  return {
    id: `palace-${Date.now()}`,
    name: result.name,
    description: result.description,
    rooms,
    objects,
    createdAt: now,
    updatedAt: now,
  };
}
