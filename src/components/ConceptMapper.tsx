'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PalaceTemplate } from '@/types/palace-template';
import { ConceptMapping } from '@/types/concept-mapping';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface ConceptMapperProps {
  palace: PalaceTemplate;
  onMappingsCreated: (mappings: ConceptMapping[]) => void;
}

export default function ConceptMapper({
  palace,
  onMappingsCreated,
}: ConceptMapperProps) {
  const [learningText, setLearningText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMap = async () => {
    if (!learningText.trim()) {
      setError('Please enter the content you want to learn');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/map-concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learningText, palace }),
      });

      if (!response.ok) {
        throw new Error('Failed to map concepts');
      }

      const data = await response.json();
      onMappingsCreated(data.mappings);
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">Map Your Learning Content</CardTitle>
              <CardDescription className="text-base mt-2">
                Paste the content you want to learn. The AI will extract key concepts
                and map them to objects in your palace with memorable connections.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="ml-4">
              {palace.objects.length} objects available
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={learningText}
              onChange={(e) => setLearningText(e.target.value)}
              placeholder="Example: Python is a high-level programming language. Variables store data in memory. Functions encapsulate reusable code blocks. Classes define object blueprints with properties and methods..."
              className="min-h-[250px] text-base"
              data-testid="learning-text-input"
            />
            <p className="text-sm text-muted-foreground">
              Tip: The AI will automatically identify key concepts and create vivid
              mental associations with objects in your {palace.name}.
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
            onClick={handleMap}
            disabled={loading}
            size="lg"
            className="w-full text-base"
            data-testid="map-concepts-button"
          >
            {loading ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <span className="animate-spin">🧠</span>
                Mapping Concepts to Your Palace...
              </motion.span>
            ) : (
              'Map to My Palace'
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
