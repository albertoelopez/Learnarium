export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Dimensions {
  width: number;
  length: number;
  height: number;
}

export interface Room {
  id: string;
  name: string;
  dimensions: Dimensions;
  position: Position3D;
}

export interface PlacedObject {
  id: string;
  name: string;
  description: string;
  roomId: string;
  position: Position3D;
}

export interface PalaceTemplate {
  id: string;
  name: string;
  description: string;
  rooms: Room[];
  objects: PlacedObject[];
  createdAt: string;
  updatedAt: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePalaceTemplate(template: PalaceTemplate): ValidationResult {
  const errors: string[] = [];

  if (!template.id || typeof template.id !== 'string') {
    errors.push('Template must have a valid id');
  }

  if (!template.name || typeof template.name !== 'string') {
    errors.push('Template must have a valid name');
  }

  if (!template.description || typeof template.description !== 'string') {
    errors.push('Template must have a valid description');
  }

  if (!Array.isArray(template.rooms)) {
    errors.push('Template must have a rooms array');
  }

  if (!Array.isArray(template.objects)) {
    errors.push('Template must have an objects array');
  }

  if (!template.createdAt || !template.updatedAt) {
    errors.push('Template must have createdAt and updatedAt timestamps');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const roomIds = new Set(template.rooms.map(r => r.id));

  for (const obj of template.objects) {
    if (!obj.name || obj.name.trim() === '') {
      errors.push(`Object ${obj.id} must have a name`);
    }

    if (!obj.description || obj.description.trim() === '') {
      errors.push(`Object ${obj.id} must have a description`);
    }

    if (!roomIds.has(obj.roomId)) {
      errors.push(`Object ${obj.id} references non-existent room ${obj.roomId}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
