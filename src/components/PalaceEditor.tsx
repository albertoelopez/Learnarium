'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PalaceTemplate } from '@/types/palace-template';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PalaceEditorProps {
  palace: PalaceTemplate;
  onSave: (palace: PalaceTemplate) => void;
}

export default function PalaceEditor({ palace: initialPalace, onSave }: PalaceEditorProps) {
  const [palace, setPalace] = useState(initialPalace);

  const handleSave = () => {
    onSave({
      ...palace,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <Card className="border-2 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-3xl">{palace.name}</CardTitle>
          <CardDescription className="text-base">
            {palace.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Rooms</h3>
              <Badge variant="secondary">{palace.rooms.length} rooms</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {palace.rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className="hover:shadow-md transition-shadow"
                    data-testid={`room-${room.id}`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {room.dimensions.width}m × {room.dimensions.length}m
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Objects</h3>
              <Badge variant="secondary">{palace.objects.length} objects</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {palace.objects.map((obj, index) => {
                const room = palace.rooms.find((r) => r.id === obj.roomId);
                return (
                  <motion.div
                    key={obj.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <Card
                      className="hover:shadow-md transition-shadow"
                      data-testid={`object-${obj.id}`}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center justify-between">
                          {obj.name}
                          <Badge variant="outline" className="ml-2">
                            {room?.name}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {obj.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              size="lg"
              className="text-base"
              data-testid="save-palace-button"
            >
              Continue to Concept Mapping
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
