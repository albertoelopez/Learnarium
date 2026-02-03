'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PalaceTemplate } from '@/types/palace-template';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PalaceCreatorProps {
  onPalaceCreated: (palace: PalaceTemplate) => void;
}

export default function PalaceCreator({ onPalaceCreated }: PalaceCreatorProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please enter a description of your space');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-palace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate palace');
      }

      const palace = await response.json();
      onPalaceCreated(palace);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Describe Your Space</CardTitle>
          <CardDescription className="text-base">
            Describe a familiar space you know well - your home, office, or any place
            with distinct rooms and memorable objects. The AI will transform it into
            your personal memory palace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Example: My apartment has a living room with a red leather couch and wooden coffee table, a kitchen with a stainless steel fridge, and a bedroom with a large oak dresser..."
              className="min-h-[200px] text-base"
              data-testid="palace-description-input"
            />
            <p className="text-sm text-muted-foreground">
              Tip: Include specific details about rooms, furniture, colors, and unique
              objects. The more vivid your description, the better your memory palace.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Alert variant="destructive" data-testid="error-message">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading}
            size="lg"
            className="w-full text-base"
            data-testid="generate-palace-button"
          >
            {loading ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <span className="animate-spin">⚡</span>
                Generating Your Palace...
              </motion.span>
            ) : (
              'Generate My Palace'
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
