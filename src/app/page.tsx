'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PalaceCreator from '@/components/PalaceCreator';
import PalaceEditor from '@/components/PalaceEditor';
import ConceptMapper from '@/components/ConceptMapper';
import PalaceViewer from '@/components/PalaceViewer';
import { PalaceTemplate } from '@/types/palace-template';
import { ConceptMapping } from '@/types/concept-mapping';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type Step = 'create' | 'edit' | 'map' | 'view';

const steps = [
  { id: 'create', label: 'Create Palace', number: 1 },
  { id: 'edit', label: 'Edit Palace', number: 2 },
  { id: 'map', label: 'Map Concepts', number: 3 },
  { id: 'view', label: 'View in 3D', number: 4 },
] as const;

export default function Home() {
  const [step, setStep] = useState<Step>('create');
  const [palace, setPalace] = useState<PalaceTemplate | null>(null);
  const [mappings, setMappings] = useState<ConceptMapping[] | null>(null);

  const canAccessStep = (stepId: Step) => {
    if (stepId === 'create') return true;
    if (stepId === 'edit' || stepId === 'map') return palace !== null;
    if (stepId === 'view') return mappings !== null;
    return false;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Vizloci
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-Powered Memory Palace Learning
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Harness the ancient method of loci with modern AI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="mb-8 border-2">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {steps.map((s, index) => {
                  const isActive = step === s.id;
                  const isAccessible = canAccessStep(s.id as Step);
                  const isCompleted =
                    (s.id === 'create' && palace !== null) ||
                    (s.id === 'edit' && palace !== null && step !== 'create') ||
                    (s.id === 'map' && mappings !== null);

                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Button
                        onClick={() => setStep(s.id as Step)}
                        disabled={!isAccessible || isActive}
                        variant={isActive ? 'default' : 'outline'}
                        size="lg"
                        className="relative"
                      >
                        <Badge
                          variant={isCompleted ? 'default' : 'secondary'}
                          className="absolute -top-2 -left-2 h-6 w-6 rounded-full p-0 flex items-center justify-center"
                        >
                          {s.number}
                        </Badge>
                        <span className="ml-2">{s.label}</span>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          {step === 'create' && (
            <PalaceCreator
              onPalaceCreated={(newPalace) => {
                setPalace(newPalace);
                setStep('edit');
              }}
            />
          )}

          {step === 'edit' && palace && (
            <PalaceEditor
              palace={palace}
              onSave={(updatedPalace) => {
                setPalace(updatedPalace);
                setStep('map');
              }}
            />
          )}

          {step === 'map' && palace && (
            <ConceptMapper
              palace={palace}
              onMappingsCreated={(newMappings) => {
                setMappings(newMappings);
                setStep('view');
              }}
            />
          )}

          {step === 'view' && palace && mappings && (
            <PalaceViewer palace={palace} mappings={mappings} />
          )}
        </motion.div>
      </div>
    </main>
  );
}
