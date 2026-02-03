import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PalaceCreator from '@/components/PalaceCreator';
import ConceptMapper from '@/components/ConceptMapper';
import PalaceEditor from '@/components/PalaceEditor';
import { PalaceTemplate } from '@/types/palace-template';

global.fetch = jest.fn();

describe('Edge Cases - PalaceCreator', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test('handles extremely long descriptions', async () => {
    const mockOnCreated = jest.fn();
    render(<PalaceCreator onPalaceCreated={mockOnCreated} />);

    const longDescription = 'A'.repeat(10000);
    const textarea = screen.getByTestId('palace-description-input');

    fireEvent.change(textarea, { target: { value: longDescription } });
    expect(textarea).toHaveValue(longDescription);
  });

  test('handles special characters and emojis', async () => {
    const mockOnCreated = jest.fn();
    render(<PalaceCreator onPalaceCreated={mockOnCreated} />);

    const specialText = '🏠 My "fancy" <palace> & symbols: @#$%^&*()';
    const textarea = screen.getByTestId('palace-description-input');

    fireEvent.change(textarea, { target: { value: specialText } });
    expect(textarea).toHaveValue(specialText);
  });

  test('handles whitespace-only input', async () => {
    const mockOnCreated = jest.fn();
    render(<PalaceCreator onPalaceCreated={mockOnCreated} />);

    const textarea = screen.getByTestId('palace-description-input');
    fireEvent.change(textarea, { target: { value: '   \n\t   ' } });

    const button = screen.getByTestId('generate-palace-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  test('handles API network errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const mockOnCreated = jest.fn();
    render(<PalaceCreator onPalaceCreated={mockOnCreated} />);

    const textarea = screen.getByTestId('palace-description-input');
    fireEvent.change(textarea, { target: { value: 'My apartment' } });

    const button = screen.getByTestId('generate-palace-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(/error/i);
    });
  });

  test('handles API timeout', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
    );

    const mockOnCreated = jest.fn();
    render(<PalaceCreator onPalaceCreated={mockOnCreated} />);

    const textarea = screen.getByTestId('palace-description-input');
    fireEvent.change(textarea, { target: { value: 'My apartment' } });

    const button = screen.getByTestId('generate-palace-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('handles malformed API responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ invalid: 'data' }),
    });

    const mockOnCreated = jest.fn();
    render(<PalaceCreator onPalaceCreated={mockOnCreated} />);

    const textarea = screen.getByTestId('palace-description-input');
    fireEvent.change(textarea, { target: { value: 'My apartment' } });

    const button = screen.getByTestId('generate-palace-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnCreated).toHaveBeenCalledWith({ invalid: 'data' });
    });
  });

  test('prevents double submission', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ id: 'test', name: 'Test Palace', rooms: [], objects: [] }),
      }), 1000))
    );

    const mockOnCreated = jest.fn();
    render(<PalaceCreator onPalaceCreated={mockOnCreated} />);

    const textarea = screen.getByTestId('palace-description-input');
    fireEvent.change(textarea, { target: { value: 'My apartment' } });

    const button = screen.getByTestId('generate-palace-button');

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnCreated).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });
  });

  test('handles rapid input changes', () => {
    const mockOnCreated = jest.fn();
    render(<PalaceCreator onPalaceCreated={mockOnCreated} />);

    const textarea = screen.getByTestId('palace-description-input');

    for (let i = 0; i < 100; i++) {
      fireEvent.change(textarea, { target: { value: `Value ${i}` } });
    }

    expect(textarea).toHaveValue('Value 99');
  });
});

describe('Edge Cases - ConceptMapper', () => {
  const mockPalace: PalaceTemplate = {
    id: 'test-palace',
    name: 'Test Palace',
    description: 'A test palace',
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
        name: 'Couch',
        description: 'Red leather couch',
        roomId: 'room-1',
        position: { x: 1, y: 0, z: 1 },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test('handles extremely long learning text', () => {
    const mockOnMappingsCreated = jest.fn();
    render(
      <ConceptMapper palace={mockPalace} onMappingsCreated={mockOnMappingsCreated} />
    );

    const longText = 'Learning content. '.repeat(1000);
    const textarea = screen.getByTestId('learning-text-input');

    fireEvent.change(textarea, { target: { value: longText } });
    expect(textarea).toHaveValue(longText);
  });

  test('handles unicode and international characters', () => {
    const mockOnMappingsCreated = jest.fn();
    render(
      <ConceptMapper palace={mockPalace} onMappingsCreated={mockOnMappingsCreated} />
    );

    const unicodeText = '学习中文 🎓 Apprendre français Учить русский';
    const textarea = screen.getByTestId('learning-text-input');

    fireEvent.change(textarea, { target: { value: unicodeText } });
    expect(textarea).toHaveValue(unicodeText);
  });

  test('handles empty palace with no objects', async () => {
    const emptyPalace: PalaceTemplate = {
      ...mockPalace,
      objects: [],
    };

    const mockOnMappingsCreated = jest.fn();
    render(
      <ConceptMapper palace={emptyPalace} onMappingsCreated={mockOnMappingsCreated} />
    );

    const textarea = screen.getByTestId('learning-text-input');
    fireEvent.change(textarea, { target: { value: 'Learning content' } });

    expect(screen.getByText(/0 objects available/i)).toBeInTheDocument();
  });

  test('handles code snippets in learning text', () => {
    const mockOnMappingsCreated = jest.fn();
    render(
      <ConceptMapper palace={mockPalace} onMappingsCreated={mockOnMappingsCreated} />
    );

    const codeText = 'function test() {\n  return <div>Hello</div>;\n}';
    const textarea = screen.getByTestId('learning-text-input');

    fireEvent.change(textarea, { target: { value: codeText } });
    expect(textarea).toHaveValue(codeText);
  });
});

describe('Edge Cases - PalaceEditor', () => {
  const mockPalace: PalaceTemplate = {
    id: 'test-palace',
    name: 'Test Palace',
    description: 'A test palace',
    rooms: [],
    objects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  test('handles palace with no rooms', () => {
    const mockOnSave = jest.fn();
    render(<PalaceEditor palace={mockPalace} onSave={mockOnSave} />);

    expect(screen.getByText(/0 rooms/i)).toBeInTheDocument();
    expect(screen.getByText(/0 objects/i)).toBeInTheDocument();
  });

  test('handles palace with many rooms', () => {
    const manyRoomsPalace: PalaceTemplate = {
      ...mockPalace,
      rooms: Array.from({ length: 50 }, (_, i) => ({
        id: `room-${i}`,
        name: `Room ${i}`,
        dimensions: { width: 5, length: 6, height: 3 },
        position: { x: i * 10, y: 0, z: 0 },
      })),
    };

    const mockOnSave = jest.fn();
    render(<PalaceEditor palace={manyRoomsPalace} onSave={mockOnSave} />);

    expect(screen.getByText(/50 rooms/i)).toBeInTheDocument();
  });

  test('handles palace with extremely long names', () => {
    const longNamePalace: PalaceTemplate = {
      ...mockPalace,
      name: 'A'.repeat(1000),
      rooms: [
        {
          id: 'room-1',
          name: 'B'.repeat(500),
          dimensions: { width: 5, length: 6, height: 3 },
          position: { x: 0, y: 0, z: 0 },
        },
      ],
    };

    const mockOnSave = jest.fn();
    render(<PalaceEditor palace={longNamePalace} onSave={mockOnSave} />);

    expect(screen.getByText(/1 room/i)).toBeInTheDocument();
  });

  test('save button updates timestamp', () => {
    const mockOnSave = jest.fn();
    render(<PalaceEditor palace={mockPalace} onSave={mockOnSave} />);

    const button = screen.getByTestId('save-palace-button');
    fireEvent.click(button);

    expect(mockOnSave).toHaveBeenCalled();
    const savedPalace = mockOnSave.mock.calls[0][0];
    expect(savedPalace.updatedAt).not.toBe(mockPalace.updatedAt);
  });
});
