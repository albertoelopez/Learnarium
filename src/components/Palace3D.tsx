'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { PalaceTemplate, Room, PlacedObject } from '@/types/palace-template';
import { ConceptMapping } from '@/types/concept-mapping';

interface Palace3DProps {
  palace: PalaceTemplate;
  mappings: ConceptMapping[];
}

function RoomMesh({ room }: { room: Room }) {
  return (
    <mesh position={[room.position.x, 0, room.position.z]}>
      <boxGeometry
        args={[room.dimensions.width, 0.1, room.dimensions.length]}
      />
      <meshStandardMaterial color="#e0e0e0" />

      <Text
        position={[0, 0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
        color="#333"
      >
        {room.name}
      </Text>
    </mesh>
  );
}

function ObjectMesh({
  obj,
  mapping,
}: {
  obj: PlacedObject;
  mapping?: ConceptMapping;
}) {
  return (
    <group position={[obj.position.x, 0.5, obj.position.z]}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={mapping ? '#4CAF50' : '#2196F3'}
          emissive={mapping ? '#2E7D32' : '#1565C0'}
          emissiveIntensity={0.3}
        />
      </mesh>

      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="#fff"
        anchorY="bottom"
      >
        {obj.name}
      </Text>

      {mapping && (
        <>
          <Text
            position={[0, 0.9, 0]}
            fontSize={0.25}
            color="#FFD700"
            anchorY="bottom"
          >
            {mapping.conceptText}
          </Text>
          <Text
            position={[0, 1.2, 0]}
            fontSize={0.2}
            color="#FFF"
            anchorY="bottom"
            maxWidth={2}
          >
            {mapping.mnemonicHint}
          </Text>
        </>
      )}
    </group>
  );
}

export default function Palace3D({ palace, mappings }: Palace3DProps) {
  const mappingsByObjectId = new Map(mappings.map((m) => [m.objectId, m]));

  return (
    <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, 10, -5]} intensity={0.5} />

      {palace.rooms.map((room) => (
        <RoomMesh key={room.id} room={room} />
      ))}

      {palace.objects.map((obj) => (
        <ObjectMesh
          key={obj.id}
          obj={obj}
          mapping={mappingsByObjectId.get(obj.id)}
        />
      ))}

      <OrbitControls />
    </Canvas>
  );
}
