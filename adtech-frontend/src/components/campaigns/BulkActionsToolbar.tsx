import React, { useState } from 'react';
import { Typography, IconButton, Tooltip, Paper, Menu, MenuItem } from '@mui/material';
import { Pause, Play, Trash2, Copy, Download } from 'lucide-react';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onAction: (action: string) => void;
  onExport: (format: 'csv' | 'json') => void;
}

const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({ selectedCount, onAction, onExport }) => {
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchor(event.currentTarget);
  };
  const handleExportClose = () => {
    setExportAnchor(null);
  };
  const handleExportFormat = (format: 'csv' | 'json') => {
    onExport(format);
    setExportAnchor(null);
  };

  return (
    <Paper elevation={6} sx={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1200,
      background: '#23272f',
      borderRadius: 0,
      px: 3,
      py: 1.5,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
      borderBottom: '1px solid #23272f',
    }}>
      <Typography sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: 16 }}>
        {selectedCount} selected
      </Typography>
      <Tooltip title="Pause">
        <IconButton onClick={() => onAction('pause')} sx={{ color: '#facc15' }}>
          <Pause size={18} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Resume">
        <IconButton onClick={() => onAction('resume')} sx={{ color: '#16a34a' }}>
          <Play size={18} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton onClick={() => onAction('delete')} sx={{ color: '#ef4444' }}>
          <Trash2 size={18} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Duplicate">
        <IconButton onClick={() => onAction('duplicate')} sx={{ color: '#818cf8' }}>
          <Copy size={18} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Export (CSV/JSON)">
        <IconButton onClick={handleExportClick} sx={{ color: '#60a5fa' }}>
          <Download size={18} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={exportAnchor}
        open={Boolean(exportAnchor)}
        onClose={handleExportClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem onClick={() => handleExportFormat('csv')}>Export as CSV</MenuItem>
        <MenuItem onClick={() => handleExportFormat('json')}>Export as JSON</MenuItem>
      </Menu>
    </Paper>
  );
};

export default BulkActionsToolbar; 