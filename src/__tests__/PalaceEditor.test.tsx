import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, jest } from '@jest/globals';
import PalaceEditor from '../components/PalaceEditor';
import { PalaceTemplate } from '../types/palace-template';

const mockPalace: PalaceTemplate = {
  id: 'palace-1',
  name: 'Test Apartment',
  description: 'A test apartment',
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
      description: 'Large red leather couch',
      roomId: 'room-1',
      position: { x: 1, y: 0, z: 2 },
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('PalaceEditor Component', () => {
  test('renders palace name and description', () => {
    const mockOnSave = jest.fn();
    render(<PalaceEditor palace={mockPalace} onSave={mockOnSave} />);

    expect(screen.getByText(/Test Apartment/)).toBeInTheDocument();
    expect(screen.getByText(/A test apartment/)).toBeInTheDocument();
  });

  test('displays all rooms', () => {
    const mockOnSave = jest.fn();
    render(<PalaceEditor palace={mockPalace} onSave={mockOnSave} />);

    expect(screen.getByTestId('room-room-1')).toBeInTheDocument();
    const roomName = screen.getByTestId('room-room-1');
    expect(roomName).toHaveTextContent(/Living Room/);
  });

  test('displays all objects with their rooms', () => {
    const mockOnSave = jest.fn();
    render(<PalaceEditor palace={mockPalace} onSave={mockOnSave} />);

    expect(screen.getByTestId('object-obj-1')).toBeInTheDocument();
    expect(screen.getByText(/Red Couch/)).toBeInTheDocument();
    expect(screen.getByText(/Large red leather couch/)).toBeInTheDocument();
  });

  test('calls onSave when save button is clicked', () => {
    const mockOnSave = jest.fn();
    render(<PalaceEditor palace={mockPalace} onSave={mockOnSave} />);

    const saveButton = screen.getByTestId('save-palace-button');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'palace-1',
        name: 'Test Apartment',
      })
    );
  });
});
