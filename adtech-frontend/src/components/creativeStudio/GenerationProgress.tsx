import React from 'react';
import { Box } from '@mui/material';

interface GenerationProgressProps {
  progress: any;
  isVisible: boolean;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({
  progress,
  isVisible
}) => {
  if (!isVisible) return null;
  
  return (
    <Box>
      {/* Progress content will go here */}
    </Box>
  );
};

export default GenerationProgress; 