import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CreativeStudioGallery: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#e2e8f0', mb: 2 }}>
        My Generated Creatives
      </Typography>
      <Paper sx={{ p: 3, background: '#23272f', color: '#e2e8f0' }}>
        <Typography variant="body1">
          Generated Creatives Gallery - Coming Soon
        </Typography>
        <Typography variant="body2" sx={{ color: '#9ca3af', mt: 1 }}>
          This page will display all your AI-generated creatives with preview gallery, 
          side-by-side comparison tools, and approval/rejection options.
        </Typography>
      </Paper>
    </Box>
  );
};

export default CreativeStudioGallery; 