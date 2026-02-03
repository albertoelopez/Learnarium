import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, jest } from '@jest/globals';
import PalaceCreator from '../components/PalaceCreator';

global.fetch = jest.fn() as jest.Mock;

describe('PalaceCreator Component', () => {
  test('renders description input and generate button', () => {
    const mockOnCreated = jest.fn();
    render(<PalaceCreator onPalaceCreated={mockOnCreated} />);

    expect(screen.getByTestId('palace-description-input')).toBeInTheDocument();
    expect(screen.getByTestId('generate-palace-button')).toBeInTheDocument();
  });

  test('shows error when description is empty', async () => {
    const mockOnCreated = jest.fn();
    render(<PalaceCreator onPalaceCreated={mockOnCreated} />);

    const button = screen.getByTestId('generate-palace-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    expect(mockOnCreated).not.toHaveBeenCalled();
  });

  test('calls API and triggers callback on successful generation', async () => {
    const mockPalace = {
      id: 'test-palace',
      name: 'Test Palace',
      description: 'Test',
      rooms: [],
      objects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPalace,
    });

    const mockOnCreated = jest.fn();
    render(<PalaceCreator onPalaceCreated={mockOnCreated} />);

    const input = screen.getByTestId('palace-description-input');
    const button = screen.getByTestId('generate-palace-button');

    fireEvent.change(input, {
      target: { value: 'My apartment with living room' },
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnCreated).toHaveBeenCalledWith(mockPalace);
    });
  });
});
