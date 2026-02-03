import { NextRequest, NextResponse } from 'next/server';
import { mapConceptsToObjects } from '@/chains/map-concepts';
import { PalaceTemplate } from '@/types/palace-template';

export async function POST(request: NextRequest) {
  try {
    const { learningText, palace } = await request.json();

    if (!learningText || typeof learningText !== 'string') {
      return NextResponse.json(
        { error: 'Learning text is required' },
        { status: 400 }
      );
    }

    if (!palace || !palace.objects || palace.objects.length === 0) {
      return NextResponse.json(
        { error: 'Valid palace with objects is required' },
        { status: 400 }
      );
    }

    const mappings = await mapConceptsToObjects(
      learningText,
      palace as PalaceTemplate
    );

    return NextResponse.json({ mappings });
  } catch (error) {
    console.error('Error mapping concepts:', error);
    return NextResponse.json(
      { error: 'Failed to map concepts' },
      { status: 500 }
    );
  }
}
