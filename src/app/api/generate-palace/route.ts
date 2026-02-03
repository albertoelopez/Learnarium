import { NextRequest, NextResponse } from 'next/server';
import { generatePalaceFromDescription } from '@/chains/generate-palace';

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const palace = await generatePalaceFromDescription(description);

    return NextResponse.json(palace);
  } catch (error) {
    console.error('Error generating palace:', error);
    return NextResponse.json(
      { error: 'Failed to generate palace' },
      { status: 500 }
    );
  }
}
