import React from 'react';
import { Box } from '@mui/material';

interface CreativeCardProps {
  creative: any;
  isSelected: boolean;
  onSelect: (creativeId: string, isSelected: boolean) => void;
  onRegenerate: (creativeId: string) => void;
  onDownload: (creativeId: string) => void;
}

const CreativeCard: React.FC<CreativeCardProps> = ({
  creative,
  isSelected,
  onSelect,
  onRegenerate,
  onDownload
}) => {
  return (
    <Box>
      {/* Creative card content will go here */}
    </Box>
  );
};

export default CreativeCard; 