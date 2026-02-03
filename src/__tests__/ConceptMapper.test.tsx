import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, jest } from '@jest/globals';
import ConceptMapper from '../components/ConceptMapper';
import { PalaceTemplate } from '../types/palace-template';

global.fetch = jest.fn() as jest.Mock;

const mockPalace: PalaceTemplate = {
  id: 'palace-1',
  name: 'Test Apartment',
  description: 'Test',
  rooms: [
    {
      id: 'room-1',
      name: 'Living Room',
      dimensions: { width: 5, length: 6, height: 3 },
      position: { x: 0, y: 0, z: 0 },
    },
  ],
  objects: [
    {
      id: 'obj-1',
      name: 'Red Couch',
      description: 'Large red couch',
      roomId: 'room-1',
      position: { x: 1, y: 0, z: 2 },
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('ConceptMapper Component', () => {
  test('renders learning text input and map button', () => {
    const mockOnMappings = jest.fn();
    render(<ConceptMapper palace={mockPalace} onMappingsCreated={mockOnMappings} />);

    expect(screen.getByTestId('learning-text-input')).toBeInTheDocument();
    expect(screen.getByTestId('map-concepts-button')).toBeInTheDocument();
  });

  test('shows error when learning text is empty', async () => {
    const mockOnMappings = jest.fn();
    render(<ConceptMapper palace={mockPalace} onMappingsCreated={mockOnMappings} />);

    const button = screen.getByTestId('map-concepts-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    expect(mockOnMappings).not.toHaveBeenCalled();
  });

  test('calls API and triggers callback on successful mapping', async () => {
    const mockMappings = [
      {
        id: 'mapping-1',
        conceptText: 'Python is a language',
        objectId: 'obj-1',
        mnemonicHint: 'Imagine a python on the couch',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ mappings: mockMappings }),
    });

    const mockOnMappings = jest.fn();
    render(<ConceptMapper palace={mockPalace} onMappingsCreated={mockOnMappings} />);

    const input = screen.getByTestId('learning-text-input');
    const button = screen.getByTestId('map-concepts-button');

    fireEvent.change(input, {
      target: { value: 'Python is a programming language' },
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnMappings).toHaveBeenCalledWith(mockMappings);
    });
  });
});
