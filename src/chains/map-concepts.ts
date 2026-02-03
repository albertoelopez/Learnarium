import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { PalaceTemplate, PlacedObject } from '../types/palace-template';
import { ConceptMapping } from '../types/concept-mapping';
import { getModel } from '../lib/get-model';

const outputSchema = z.object({
  concepts: z.array(
    z.object({
      conceptText: z.string().describe('The key concept or fact to remember'),
      objectName: z
        .string()
        .describe('Name of the object to attach this concept to'),
      mnemonicHint: z
        .string()
        .describe(
          'Vivid, bizarre, or humorous connection between concept and object'
        ),
    })
  ),
});

const parser = StructuredOutputParser.fromZodSchema(outputSchema);

const prompt = PromptTemplate.fromTemplate(
  `You are an expert at creating memory palaces using the Method of Loci.
Given learning content and a list of objects in a memory palace, map key concepts
to specific objects using vivid, memorable connections.

MEMORY PALACE PRINCIPLES:
1. Extract 3-7 key concepts from the text (don't overload)
2. Match each concept to a distinctive object
3. Create BIZARRE, VIVID, EMOTIONAL connections (the stranger, the better)
4. Use all senses: sight, sound, touch, smell, taste
5. Make connections action-oriented and personal
6. Distribute concepts across different objects

Available objects in the palace:
{objects_list}

Learning content:
{learning_text}

{format_instructions}

Create memorable concept-to-object mappings:`
);

function formatObjectsList(objects: PlacedObject[]): string {
  return objects
    .map(
      (obj, idx) =>
        `${idx + 1}. ${obj.name} - ${obj.description} (ID: ${obj.id})`
    )
    .join('\n');
}

export async function mapConceptsToObjects(
  learningText: string,
  palace: PalaceTemplate
): Promise<ConceptMapping[]> {
  const model = getModel(0.8);

  const chain = prompt.pipe(model).pipe(parser);

  const result = await chain.invoke({
    learning_text: learningText,
    objects_list: formatObjectsList(palace.objects),
    format_instructions: parser.getFormatInstructions(),
  });

  const objectNameToId = new Map(
    palace.objects.map((o) => [o.name.toLowerCase(), o.id])
  );

  const mappings: ConceptMapping[] = result.concepts.map((concept, idx) => ({
    id: `mapping-${Date.now()}-${idx}`,
    conceptText: concept.conceptText,
    objectId:
      objectNameToId.get(concept.objectName.toLowerCase()) ||
      palace.objects[idx % palace.objects.length].id,
    mnemonicHint: concept.mnemonicHint,
  }));

  return mappings;
}
