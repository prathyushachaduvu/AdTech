import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import CreativeGenerationForm from '../../components/creativeStudio/CreativeGenerationForm';
import GenerationProgress from '../../components/creativeStudio/GenerationProgress';
import CreativeReviewGallery from '../../components/creativeStudio/CreativeReviewGallery';
import AssetSelectionSection from '../../components/creativeStudio/AssetSelectionSection';
import type { GenerationSettings, Creative, GenerationProgress as ProgressType } from '../../types/creative';

const STEPS = [
  'Creative Details',
  'Asset Selection',
  'Review & Generate',
];

const CreativeStudioGenerate: React.FC = () => {
  const [step, setStep] = useState(0);
  const [creativeDetails, setCreativeDetails] = useState<Partial<GenerationSettings>>({});
  const [selectedAssets, setSelectedAssets] = useState<any[]>([]);
  const [generationProgress, setGenerationProgress] = useState<ProgressType | null>(null);
  const [generatedCreatives, setGeneratedCreatives] = useState<Creative[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleCreativeDetailsChange = (settings: Partial<GenerationSettings>) => {
    setCreativeDetails(settings);
  };

  const handleAssetSelectionChange = (assets: any[]) => {
    setSelectedAssets(assets);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setStep(2);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationProgress(null);
      setGeneratedCreatives([
        { id: '1', imageUrl: '', style: 'modern', format: 'display-ad', campaignName: creativeDetails.campaignName || '', goal: creativeDetails.goal || 'awareness', createdAt: new Date().toISOString(), isSelected: false },
        { id: '2', imageUrl: '', style: 'classic', format: 'instagram-post', campaignName: creativeDetails.campaignName || '', goal: creativeDetails.goal || 'awareness', createdAt: new Date().toISOString(), isSelected: false },
      ]);
    }, 1800);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <CreativeGenerationForm
            onSettingsChange={handleCreativeDetailsChange}
            onGenerate={handleNext}
            isGenerating={false}
          />
        );
      case 1:
        return (
          <AssetSelectionSection
            selectedAssets={selectedAssets}
            onAssetSelectionChange={handleAssetSelectionChange}
            onBack={handleBack}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        );
      case 2:
        if (isGenerating) {
          return (
            <GenerationProgress progress={generationProgress} isVisible={true} />
          );
        }
        return (
          <CreativeReviewGallery
            creatives={generatedCreatives}
            onCreativeSelect={() => {}}
            onRegenerateCreative={() => {}}
            onRegenerateAll={() => {}}
            onAddToLibrary={() => {}}
            onAttachToCampaign={() => {}}
            onDownload={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '70vh', background: '#181c20', py: 4 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
        <Stepper activeStep={step} alternativeLabel>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ color: '#e2e8f0', '& .MuiStepLabel-label': { color: '#e2e8f0' } }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {renderStepContent()}
    </Box>
  );
};

export default CreativeStudioGenerate; 