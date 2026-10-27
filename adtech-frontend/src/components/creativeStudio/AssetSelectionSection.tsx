import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Stack,
  Chip,
} from '@mui/material';
import AssetLibraryModal from './AssetLibraryModal';
import FileUploader from './FileUploader';

interface AssetSelectionSectionProps {
  selectedAssets: any[];
  onAssetSelectionChange: (assets: any[]) => void;
  onBack: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const AssetSelectionSection: React.FC<AssetSelectionSectionProps> = ({
  selectedAssets,
  onAssetSelectionChange,
  onBack,
  onGenerate,
  isGenerating,
}) => {
  const [tab, setTab] = useState(0); // 0: Use Existing, 1: Upload New
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [touched, setTouched] = useState(false);

  // Open asset library modal
  const handleOpenLibrary = () => setLibraryOpen(true);
  const handleCloseLibrary = () => setLibraryOpen(false);

  // Handle asset selection from library
  const handleLibrarySelect = (assets: any[]) => {
    setLibraryOpen(false);
    onAssetSelectionChange(assets);
  };

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    const newAssets = files.map((file, idx) => ({
      id: `upload-${Date.now()}-${idx}`,
      name: file.name,
      type: file.type.includes('pdf') ? 'brand-guideline' : file.type.includes('svg') ? 'logo' : 'product-image',
      url: '',
      thumbnailUrl: '',
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
      isSelected: true,
      file,
    }));
    onAssetSelectionChange([...selectedAssets, ...newAssets]);
  };

  // Remove asset
  const handleRemoveAsset = (id: string) => {
    const filtered = selectedAssets.filter(a => a.id !== id);
    onAssetSelectionChange(filtered);
  };

  // Validation
  const isValid = selectedAssets.length > 0;

  return (
    <Box sx={{ maxWidth: 540, mx: 'auto', mt: 4, background: '#23272f', borderRadius: 4, p: { xs: 2, md: 4 }, boxShadow: '0 2px 12px 0 #181c2022' }}>
      <Typography variant="h5" sx={{ color: '#e2e8f0', fontWeight: 700, mb: 2 }}>
        Asset Selection
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="inherit"
        indicatorColor="primary"
        sx={{ mb: 2, '& .MuiTab-root': { color: '#9ca3af', fontWeight: 600 }, '& .Mui-selected': { color: '#3b82f6' } }}
      >
        <Tab label="Use Existing Assets" />
        <Tab label="Upload New Assets" />
      </Tabs>
      {tab === 0 && (
        <Box>
          <Button
            variant="outlined"
            onClick={handleOpenLibrary}
            sx={{ color: '#d1d5db', borderColor: '#374151', fontWeight: 600, mb: 2, background: 'none', '&:hover': { borderColor: '#3b82f6', color: '#3b82f6', background: '#20232a' } }}
          >
            Select from Assets Library
          </Button>
          <AssetLibraryModal
            open={libraryOpen}
            onClose={handleCloseLibrary}
            onAssetSelect={assets => handleLibrarySelect(assets)}
            selectedAssets={selectedAssets}
          />
        </Box>
      )}
      {tab === 1 && (
        <Box>
          <FileUploader
            onFileUpload={handleFileUpload}
            acceptedFileTypes={["image/png", "image/jpeg", "image/svg+xml", "application/pdf"]}
            multiple
          />
        </Box>
      )}
      {/* Selected Assets Preview */}
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ color: '#9ca3af', fontWeight: 500, mb: 1 }}>
          Selected Assets
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {selectedAssets.length === 0 && (
            <Typography sx={{ color: '#64748b' }}>No assets selected yet.</Typography>
          )}
          {selectedAssets.map(asset => (
            <Chip
              key={asset.id}
              label={asset.name}
              variant="outlined"
              onDelete={() => handleRemoveAsset(asset.id)}
              sx={{
                background: '#20232a',
                color: '#e2e8f0',
                border: selectedAssets.some(a => a.id === asset.id) ? '2px solid #3b82f6' : '1px solid #374151',
                mb: 1,
                fontWeight: 500,
                fontSize: 15,
                '& .MuiChip-deleteIcon': {
                  color: '#64748b',
                  '&:hover': { color: '#ef4444' },
                },
              }}
            />
          ))}
        </Stack>
        {touched && !isValid && (
          <Typography color="error" sx={{ mt: 1, fontSize: 14 }}>Please select or upload at least one asset.</Typography>
        )}
      </Box>
      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" color="inherit" onClick={onBack} sx={{ color: '#9ca3af', borderColor: '#374151', fontWeight: 600, background: 'none', '&:hover': { borderColor: '#3b82f6', color: '#3b82f6', background: '#20232a' } }}>Back</Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setTouched(true);
            if (isValid) onGenerate();
          }}
          sx={{ background: isValid ? '#16a34a' : '#374151', color: '#fff', fontWeight: 700, '&:hover': { background: isValid ? '#15803d' : '#374151' } }}
          disabled={!isValid || isGenerating}
        >
          Generate Creatives
        </Button>
      </Box>
    </Box>
  );
};

export default AssetSelectionSection; 