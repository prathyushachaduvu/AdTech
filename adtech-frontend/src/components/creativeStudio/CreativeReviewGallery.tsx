import React from 'react';
import { Box } from '@mui/material';

interface CreativeReviewGalleryProps {
  creatives: any[];
  onCreativeSelect: (creativeId: string, isSelected: boolean) => void;
  onRegenerateCreative: (creativeId: string) => void;
  onRegenerateAll: () => void;
  onAddToLibrary: () => void;
  onAttachToCampaign: () => void;
  onDownload: () => void;
}

const CreativeReviewGallery: React.FC<CreativeReviewGalleryProps> = ({
  creatives,
  onCreativeSelect,
  onRegenerateCreative,
  onRegenerateAll,
  onAddToLibrary,
  onAttachToCampaign,
  onDownload
}) => {
  return (
    <Box>
      {/* Gallery content will go here */}
    </Box>
  );
};

export default CreativeReviewGallery; 