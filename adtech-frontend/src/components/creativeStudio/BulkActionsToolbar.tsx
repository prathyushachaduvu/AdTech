import React from 'react';
import { Box } from '@mui/material';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onAddToLibrary: () => void;
  onAttachToCampaign: () => void;
  onDownload: () => void;
  onRegenerateAll: () => void;
}

const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  onAddToLibrary,
  onAttachToCampaign,
  onDownload,
  onRegenerateAll
}) => {
  if (selectedCount === 0) return null;
  
  return (
    <Box>
      {/* Bulk actions content will go here */}
    </Box>
  );
};

export default BulkActionsToolbar; 