import React, { useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  List,
  ListItemAvatar,
  ListItemText,
  Checkbox,
  Avatar,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { getAssets } from '../../services/assetsApi';
import { getBrandGuidelines } from '../../services/brandGuidelinesApi';
import ListItemButton from '@mui/material/ListItemButton';

interface AssetLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onAssetSelect: (assets: any[]) => void;
  selectedAssets: any[];
}

const COMPANY_ID = 'company-123'; // Mock company id for brand guidelines
const DEFAULT_CAMPAIGN_ID = 'campaign-123'; // TODO: Replace with real campaign ID from context/props

const AssetLibraryModal: React.FC<AssetLibraryModalProps> = ({
  open,
  onClose,
  onAssetSelect,
  selectedAssets
}) => {
  const [tab, setTab] = useState(0); // 0: Assets, 1: Brand Guidelines
  const [assets, setAssets] = useState<any[]>([]);
  const [brandGuidelines, setBrandGuidelines] = useState<any>(null);
  const [selected, setSelected] = useState<any[]>(selectedAssets);

  useEffect(() => {
    if (open) {
      getAssets(DEFAULT_CAMPAIGN_ID)
        .then(setAssets)
        .catch((error) => {
          // Optionally show error notification
          console.error('Failed to load assets:', error);
        });
      getBrandGuidelines(COMPANY_ID)
        .then(setBrandGuidelines)
        .catch((error) => {
          // Optionally show error notification
          console.error('Failed to load brand guidelines:', error);
        });
    }
  }, [open]);

  // Handle select/deselect
  const handleToggle = (asset: any) => {
    setSelected(prev =>
      prev.some(a => a.id === asset.id)
        ? prev.filter(a => a.id !== asset.id)
        : [...prev, asset]
    );
  };

  // Confirm selection
  const handleConfirm = () => {
    onAssetSelect(selected);
    onClose();
  };

  // Asset tab content
  const renderAssetsTab = () => (
    <List dense>
      {assets.map(asset => (
        <ListItemButton
          key={asset.id}
          onClick={() => handleToggle(asset)}
          selected={selected.some(a => a.id === asset.id)}
          sx={{
            borderRadius: 2,
            mb: 1,
            background: selected.some(a => a.id === asset.id) ? '#23272f' : 'transparent',
            border: selected.some(a => a.id === asset.id) ? '2px solid #3b82f6' : '1px solid #374151',
            boxShadow: 'none',
            transition: 'border 0.15s',
          }}
        >
          <ListItemAvatar>
            <Avatar variant="rounded" sx={{ bgcolor: '#23272f', color: '#3b82f6', border: '1px solid #374151' }}>
              {asset.type === 'image' ? '🖼️' : asset.type === 'video' ? '🎬' : '📄'}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={asset.name}
            secondary={asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
            sx={{ color: '#e2e8f0' }}
          />
          <Checkbox
            edge="end"
            checked={selected.some(a => a.id === asset.id)}
            tabIndex={-1}
            disableRipple
            sx={{ color: '#16a34a' }}
          />
        </ListItemButton>
      ))}
    </List>
  );

  // Brand Guidelines tab content
  const renderBrandGuidelinesTab = () => (
    <Box>
      {brandGuidelines && (
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ color: '#9ca3af', fontWeight: 600, mb: 1 }}>Attachments</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {brandGuidelines.attachments.map((file: string, idx: number) => {
                const assetObj = {
                  id: `guideline-attachment-${idx}`,
                  name: file,
                  type: 'document',
                  fileType: file.split('.').pop(),
                  isGuideline: true,
                };
                return (
                  <Chip
                    key={file}
                    label={file}
                    variant="outlined"
                    onClick={() => handleToggle(assetObj)}
                    color={selected.some(a => a.id === assetObj.id) ? 'primary' : 'default'}
                    sx={{
                      mb: 1,
                      background: '#20232a',
                      color: '#e2e8f0',
                      border: selected.some(a => a.id === assetObj.id) ? '2px solid #3b82f6' : '1px solid #374151',
                      fontWeight: 500,
                      fontSize: 15,
                      cursor: 'pointer',
                    }}
                  />
                );
              })}
            </Stack>
          </Box>
          <Box>
            <Typography sx={{ color: '#9ca3af', fontWeight: 600, mb: 1 }}>Brand Colors</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {brandGuidelines.colors.map((color: any) => {
                const assetObj = {
                  id: `guideline-color-${color.id}`,
                  name: color.name,
                  type: 'color',
                  hexCode: color.hexCode,
                  isGuideline: true,
                };
                return (
                  <Chip
                    key={color.id}
                    label={color.name}
                    variant="outlined"
                    onClick={() => handleToggle(assetObj)}
                    avatar={<Avatar sx={{ bgcolor: color.hexCode, width: 24, height: 24, border: '1px solid #374151' }} />}
                    color={selected.some(a => a.id === assetObj.id) ? 'primary' : 'default'}
                    sx={{
                      mb: 1,
                      background: '#20232a',
                      color: '#e2e8f0',
                      border: selected.some(a => a.id === assetObj.id) ? '2px solid #3b82f6' : '1px solid #374151',
                      fontWeight: 500,
                      fontSize: 15,
                      cursor: 'pointer',
                    }}
                  />
                );
              })}
            </Stack>
          </Box>
          <Box>
            <Typography sx={{ color: '#9ca3af', fontWeight: 600, mb: 1 }}>Brand Fonts</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {brandGuidelines.fonts.map((font: any) => {
                const assetObj = {
                  id: `guideline-font-${font.id}`,
                  name: font.name,
                  type: 'font',
                  family: font.family,
                  isGuideline: true,
                };
                return (
                  <Chip
                    key={font.id}
                    label={font.name}
                    variant="outlined"
                    onClick={() => handleToggle(assetObj)}
                    color={selected.some(a => a.id === assetObj.id) ? 'primary' : 'default'}
                    sx={{
                      mb: 1,
                      background: '#20232a',
                      color: '#e2e8f0',
                      border: selected.some(a => a.id === assetObj.id) ? '2px solid #3b82f6' : '1px solid #374151',
                      fontWeight: 500,
                      fontSize: 15,
                      cursor: 'pointer',
                    }}
                  />
                );
              })}
            </Stack>
          </Box>
        </Stack>
      )}
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { background: '#23272f', color: '#e2e8f0', borderRadius: 3 } }}>
      <DialogTitle sx={{ color: '#e2e8f0', fontWeight: 700, fontSize: 22, pb: 1 }}>Select Assets</DialogTitle>
      <DialogContent dividers sx={{ minHeight: 320 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="inherit" indicatorColor="primary" sx={{ mb: 2, '& .MuiTab-root': { color: '#9ca3af', fontWeight: 600 }, '& .Mui-selected': { color: '#3b82f6' } }}>
          <Tab label="Assets" />
          <Tab label="Brand Guidelines" />
        </Tabs>
        {tab === 0 && renderAssetsTab()}
        {tab === 1 && renderBrandGuidelinesTab()}
      </DialogContent>
      <DialogActions sx={{ background: '#20232a', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
        <Button onClick={onClose} sx={{ color: '#9ca3af', fontWeight: 600, background: 'none', '&:hover': { color: '#3b82f6', background: '#23272f' } }}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" sx={{ background: '#16a34a', color: '#fff', fontWeight: 700, '&:hover': { background: '#15803d' } }}>Add Selected</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssetLibraryModal; 