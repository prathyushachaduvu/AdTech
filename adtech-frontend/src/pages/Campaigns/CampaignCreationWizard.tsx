import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import Step1CampaignFoundation from '../../components/campaigns/wizard/Step1CampaignFoundation';
import { useNavigate } from 'react-router-dom';
import Step2AssetUploadCreativeContext from '../../components/campaigns/wizard/Step2AssetUploadCreativeContext';
import Step3TargetingSetup from '../../components/campaigns/wizard/Step3TargetingSetup';
import Step4CreativeGeneration from '../../components/campaigns/wizard/Step4CreativeGeneration';
import Step5ReviewLaunch from '../../components/campaigns/wizard/Step5ReviewLaunch';
import { Dialog, DialogContent, DialogActions, Button as MuiButton, Typography as MuiTypography, Box as MuiBox } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const STEPS = [
  { id: 1, title: 'Campaign Foundation', description: 'Basic campaign setup and brand info' },
  { id: 2, title: 'Creative Assets', description: 'Upload images and creative guidelines' },
  { id: 3, title: 'Targeting & Audience', description: 'Define your target audience' },
  { id: 4, title: 'Ad Formats & Placement', description: 'Choose ad formats and placements' },
  { id: 5, title: 'Review & Launch', description: 'Review and launch your campaign' },
];

const CampaignCreationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<Record<number, any>>({});
  const navigate = useNavigate();
  const [isLaunching, setIsLaunching] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Handle step navigation
  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/campaigns');
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle step data updates
  const handleStepDataUpdate = (stepNumber: number, data: any) => {
    setStepData(prev => ({
      ...prev,
      [stepNumber]: data
    }));
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    if (currentStep === 1) {
      const step1Data = stepData[1];
      return step1Data && step1Data.isValid;
    }
    if (currentStep === 2) {
      const step2Data = stepData[2];
      return step2Data && step2Data.isValid;
    }
    if (currentStep === 3) {
      const step3Data = stepData[3];
      return step3Data && step3Data.isValid;
    }
    return true; // Other steps don't have validation yet
  };

  // Handler for editing a specific step from Step 5
  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  // Handler for launching the campaign
  const handleLaunch = () => {
    // Example validation: require at least one creative selected
    const creatives = stepData[4]?.formData?.creatives || [];
    if (!creatives.some((c: any) => c.selected)) {
      setValidationErrors(['Please select at least one creative.']);
      return;
    }
    setValidationErrors([]);
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      setShowSuccessDialog(true);
    }, 1500);
  };

  // Handler for saving as draft
  const handleSaveDraft = () => {
    alert('Draft saved! (MVP placeholder)');
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1CampaignFoundation 
            onDataUpdate={(data) => handleStepDataUpdate(1, data)}
            initialData={stepData[1]}
          />
        );
      case 2:
        return (
          <Step2AssetUploadCreativeContext
            onDataUpdate={(data) => handleStepDataUpdate(2, data)}
            initialData={stepData[2]}
            promoteType={stepData[1]?.formData?.promoteType}
          />
        );
      case 3:
        return (
          <Step3TargetingSetup
            onDataUpdate={(data) => handleStepDataUpdate(3, data)}
            initialData={stepData[3]}
          />
        );
      case 4:
        // Gather recap info from previous steps
        const campaignRecap = {
          name: stepData[1]?.formData?.campaignName || '',
          objective: stepData[1]?.formData?.objective || '',
          audience: stepData[3]?.formData?.audienceDesc || '',
          productImage: stepData[2]?.formData?.logoPreviewUrl || '',
        };
        return (
          <Step4CreativeGeneration
            onDataUpdate={(data) => handleStepDataUpdate(4, data)}
            initialData={stepData[4]}
            campaignRecap={campaignRecap}
            onEditRecap={() => setCurrentStep(1)}
            onBack={handleBack}
            onContinue={(data) => {
              handleStepDataUpdate(4, data);
              setCurrentStep(5);
            }}
          />
        );
      case 5:
        return (
          <Step5ReviewLaunch
            stepData={stepData}
            onEditStep={handleEditStep}
            onBack={handleBack}
            onLaunch={handleLaunch}
            onSaveDraft={handleSaveDraft}
            validationErrors={validationErrors}
            isLaunching={isLaunching}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#181c20', color: '#e2e8f0' }}>
      {/* Header */}
      <Box sx={{ borderBottom: '1px solid #23272f', background: '#23272f', px: 4, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Campaign Creation Wizard</Typography>
        <Typography variant="body2" sx={{ color: '#e2e8f0', fontSize: 15 }}>
          Step {currentStep} of {STEPS.length}
        </Typography>
      </Box>

      {/* Timeline Progress */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, mb: 2, px: 2 }}>
        <Typography variant="h5" sx={{ color: '#e2e8f0', mb: 2, textAlign: 'center', fontWeight: 600, letterSpacing: 0.2 }}>
          {STEPS[currentStep - 1].title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 4, textAlign: 'center', fontSize: 14 }}>
          {STEPS[currentStep - 1].description}
        </Typography>
        
        {/* Timeline */}
        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          height: 80, 
          mb: 4,
        }}>
          {/* Background connector line */}
          <Box sx={{
            position: 'absolute',
            top: '25%',
            left: '15%',
            right: '15%',
            height: 2,
            zIndex: 0,
            transform: 'translateY(-50%)',
            background: (() => {
              // Build a linear gradient for the connector line
              const n = STEPS.length;
              let stops = [];
              let percentPerStep = 100 / (n - 1);
              for (let i = 0; i < n - 1; ++i) {
                let color = i < currentStep - 1 ? '#3b82f6' : '#374151';
                stops.push(`${color} ${i * percentPerStep}% ${(i + 1) * percentPerStep}%`);
              }
              return `linear-gradient(to right, ${stops.join(', ')})`;
            })(),
            borderRadius: 1,
          }} />
          {/* Timeline circles and labels */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            position: 'relative',
            zIndex: 1,
            px: '10%'
          }}>
            {STEPS.map((step) => (
              <Box key={step.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 600,
                  border: '3px solid',
                  background: step.id < currentStep ? '#3b82f6' : 
                             step.id === currentStep ? '#3b82f6' : '#374151',
                  borderColor: step.id < currentStep ? '#3b82f6' : 
                               step.id === currentStep ? '#3b82f6' : '#4b5563',
                  color: step.id <= currentStep ? '#fff' : '#64748b',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}>
                  {step.id < currentStep ? '✓' : step.id}
                </Box>
                {/* Step Title */}
                <Typography variant="caption" sx={{ 
                  color: step.id <= currentStep ? '#bfc9d1' : '#64748b', 
                  mt: 1, 
                  textAlign: 'center',
                  maxWidth: 100,
                  fontSize: 11,
                  fontWeight: step.id === currentStep ? 600 : 400
                }}>
                  {step.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Step Content */}
      <Box sx={{ maxWidth: 1000, mx: 'auto', px: 2, py: 2 }}>
        {renderCurrentStep()}
      </Box>

      {/* Navigation */}
      <Box sx={{ 
        borderTop: '1px solid #23272f', 
        background: '#23272f', 
        px: 4, 
        py: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 4
      }}>
        <Button 
          variant="outlined" 
          onClick={handleBack}
          sx={{ 
            color: '#bfc9d1', 
            borderColor: '#374151',
            '&:disabled': { color: '#374151', borderColor: '#23272f' }
          }}
        >
          Back
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {currentStep < STEPS.length ? (
            !isCurrentStepValid() ? (
              <Tooltip title="Please fill all required fields." arrow>
                <span>
                  <Button 
                    variant="contained" 
                    onClick={handleNext}
                    disabled
                    sx={{ 
                      background: '#3b82f6', 
                      color: '#fff', 
                      fontWeight: 600,
                      '&:disabled': { background: '#374151', color: '#64748b' }
                    }}
                  >
                    Continue
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleNext}
                sx={{ 
                  background: '#3b82f6', 
                  color: '#fff', 
                  fontWeight: 600,
                  '&:disabled': { background: '#374151', color: '#64748b' }
                }}
              >
                Continue
              </Button>
            )
          ) : (
            <Button 
              variant="contained" 
              onClick={handleLaunch}
              disabled={!isCurrentStepValid() || isLaunching}
              sx={{ 
                background: '#10b981', 
                color: '#fff', 
                fontWeight: 600,
                '&:disabled': { background: '#374151', color: '#64748b' }
              }}
            >
              {isLaunching ? 'Launching...' : 'Launch Campaign'}
            </Button>
          )}
        </Box>
      </Box>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ background: '#23272f', textAlign: 'center', p: 4 }}>
          <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 60, mb: 1 }} />
            <MuiTypography variant="h5" sx={{ color: '#e2e8f0', fontWeight: 700, mb: 1 }}>Campaign launched successfully!</MuiTypography>
            <MuiTypography sx={{ color: '#bfc9d1', fontSize: 16, mb: 2 }}>
              Your campaign is now live and ready to perform.
            </MuiTypography>
          </MuiBox>
        </DialogContent>
        <DialogActions sx={{ background: '#23272f', justifyContent: 'center', pb: 3 }}>
          <MuiButton
            variant="outlined"
            sx={{ color: '#bfc9d1', borderColor: '#374151', borderRadius: 2, textTransform: 'none', bgcolor: '#181c20', '&:hover': { color: '#fff', borderColor: '#3b82f6', bgcolor: '#23272f' }, mr: 2 }}
            onClick={() => { setShowSuccessDialog(false); navigate('/campaigns'); }}
          >
            Back to Campaigns
          </MuiButton>
          <MuiButton
            variant="contained"
            sx={{ bgcolor: '#16a34a', color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, py: 1.2, boxShadow: 'none', '&:hover': { bgcolor: '#15803d' } }}
            onClick={() => { setShowSuccessDialog(false); navigate('/dashboard'); }}
          >
            Go to Dashboard
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CampaignCreationWizard; 