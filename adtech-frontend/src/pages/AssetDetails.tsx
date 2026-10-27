import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Button, Chip, IconButton, CircularProgress, Paper, Stack, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import { FileImage, FileVideo, FileText, File } from 'lucide-react';
import { getAssets } from '../services/assetsApi';
import type { Asset } from '../types/asset';
import Snackbar from '@mui/material/Snackbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const DEFAULT_CAMPAIGN_ID = 'campaign-123'; // TODO: Replace with real campaign ID from context/props

const AssetDetails: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  // Editable state for asset info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Brand Identity');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  // Actions button state
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // More menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);
  // Editable state for licensing
  const [licenseType, setLicenseType] = useState('Internal Use Only');
  const [licenseDescription, setLicenseDescription] = useState('Usage limited to AdTech Org marketing and branding. Contact legal@adtech.com for external use.');
  const [licensingDirty, setLicensingDirty] = useState(false);
  const [licensingSaveSuccess, setLicensingSaveSuccess] = useState(false);
  // Version history menu state
  const [versionMenuAnchorEl, setVersionMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [versionMenuIdx, setVersionMenuIdx] = useState<number | null>(null);
  const versionMenuOpen = Boolean(versionMenuAnchorEl);
  const handleVersionMenuOpen = (event: React.MouseEvent<HTMLElement>, idx: number) => {
    setVersionMenuAnchorEl(event.currentTarget);
    setVersionMenuIdx(idx);
  };
  const handleVersionMenuClose = () => {
    setVersionMenuAnchorEl(null);
    setVersionMenuIdx(null);
  };
  const handleVersionRename = () => {
    setSnackbar({ open: true, message: 'Rename version!' });
    handleVersionMenuClose();
  };
  const handleVersionArchive = () => {
    setSnackbar({ open: true, message: 'Version archived!' });
    handleVersionMenuClose();
  };
  const handleVersionRestore = () => {
    setSnackbar({ open: true, message: 'Version restored!' });
    handleVersionMenuClose();
  };

  useEffect(() => {
    setLoading(true);
    getAssets(DEFAULT_CAMPAIGN_ID)
      .then((assets) => {
        const found = assets.find(a => String(a.id) === String(assetId));
        setAsset(found || null);
        setLoading(false);
        if (found) {
          setName(found.name);
          setDescription('Primary brand logo file for all marketing materials and digital platforms.');
          setCategory('Brand Identity');
          setTags(found.tags);
        }
      })
      .catch((error) => {
        setLoading(false);
        // Optionally show error notification
        console.error('Failed to load assets:', error);
      });
  }, [assetId]);

  // Track if any field has changed
  const isDirty = asset && (
    name !== asset.name ||
    description !== 'Primary brand logo file for all marketing materials and digital platforms.' ||
    category !== 'Brand Identity' ||
    JSON.stringify(tags) !== JSON.stringify(asset.tags)
  );

  // Track if licensing fields have changed
  useEffect(() => {
    setLicensingDirty(
      licenseType !== 'Internal Use Only' ||
      licenseDescription !== 'Usage limited to AdTech Org marketing and branding. Contact legal@adtech.com for external use.'
    );
  }, [licenseType, licenseDescription]);

  // Save licensing (mock)
  const handleLicensingSave = () => {
    setLicensingSaveSuccess(true);
    setTimeout(() => setLicensingSaveSuccess(false), 2000);
  };

  // Tag add/remove logic
  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput('');
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Save logic (mock)
  const handleSave = () => {
    if (!asset) return;
    setAsset({ ...asset, name, tags });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Preview logic (reuse from grid)
  const renderPreview = () => {
    if (!asset) return null;
    if (asset.type === 'image') {
      // Use a placeholder image for mock
      return (
        <Box sx={{ width: '100%', aspectRatio: '16/9', bgcolor: '#23272f', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
          <FileImage size={64} color="#60a5fa" />
        </Box>
      );
    }
    if (asset.type === 'video') {
      return (
        <Box sx={{ width: '100%', aspectRatio: '16/9', bgcolor: '#23272f', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
          <FileVideo size={64} color="#f59e42" />
        </Box>
      );
    }
    if (asset.type === 'document') {
      return (
        <Box sx={{ width: '100%', aspectRatio: '16/9', bgcolor: '#23272f', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
          <FileText size={64} color="#a78bfa" />
        </Box>
      );
    }
    return (
      <Box sx={{ width: '100%', aspectRatio: '16/9', bgcolor: '#23272f', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
        <File size={64} color="#9ca3af" />
      </Box>
    );
  };

  // Actions handlers
  const handleDownload = () => {
    // Mock download: just show snackbar
    setSnackbar({ open: true, message: 'Download started!' });
  };
  const handleDuplicate = () => {
    setSnackbar({ open: true, message: 'Asset duplicated!' });
  };
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setSnackbar({ open: true, message: 'Link copied!' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to copy link.' });
    }
  };
  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    setSnackbar({ open: true, message: 'Asset deleted!' });
    // Optionally, redirect or update state
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // More menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  const handleArchive = () => {
    setSnackbar({ open: true, message: 'Asset archived!' });
    handleMenuClose();
  };
  const handleDownloadZip = () => {
    setSnackbar({ open: true, message: 'Download as ZIP started!' });
    handleMenuClose();
  };
  const handleRestoreVersion = () => {
    setSnackbar({ open: true, message: 'Version restored!' });
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!asset) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography variant="h6" color="text.secondary">Asset not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: '#181c20', minHeight: '100vh' }}>
      {/* Top Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: '#9ca3af', mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, flex: 1 }}>
          Asset Details
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{
            background: '#3b82f6',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            mr: 1,
            '&:hover': { background: '#2563eb' },
          }}
          onClick={handleDownload}
        >
          Download
        </Button>
        <IconButton sx={{ color: '#9ca3af' }} onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              background: '#23272f',
              color: '#e5e7eb',
              borderRadius: 2,
              boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
              minWidth: 180,
            },
          }}
        >
          <MenuItem onClick={handleDownloadZip}>
            <ListItemIcon><FolderZipIcon fontSize="small" sx={{ color: '#bfc9d1' }} /></ListItemIcon>
            <ListItemText>Download as ZIP</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleArchive}>
            <ListItemIcon><ArchiveIcon fontSize="small" sx={{ color: '#bfc9d1' }} /></ListItemIcon>
            <ListItemText>Archive</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleRestoreVersion}>
            <ListItemIcon><RestoreIcon fontSize="small" sx={{ color: '#bfc9d1' }} /></ListItemIcon>
            <ListItemText>Restore Version</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Left: Preview, Info, Version History */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Preview + Info Card */}
          <Paper sx={{ background: '#23272f', borderRadius: 3, p: 0, mb: 3, boxShadow: 'none' }}>
            {/* Preview Area */}
            <Box sx={{
              px: 0, pt: 0, pb: 0,
              borderBottom: '1px solid #23272f',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: '#20232a',
              borderTopLeftRadius: 12, borderTopRightRadius: 12,
            }}>
              <Box sx={{
                width: '100%',
                maxWidth: 'none',
                minHeight: 480,
                aspectRatio: '16/9',
                bgcolor: '#23272f',
                borderRadius: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mb: 1,
                position: 'relative',
                overflow: 'hidden',
                margin: '4px',
              }}>
                {/* Fullscreen icon */}
                <Tooltip title="View Fullscreen">
                  <IconButton size="small" sx={{ position: 'absolute', top: 12, right: 12, color: '#64748b', bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}>
                    <FullscreenIcon fontSize="medium" />    
                  </IconButton>
                </Tooltip>
                {renderPreview()}
                {/* Optionally, overlay asset name for mock */}
                <Typography variant="subtitle1" sx={{ color: '#64748b', position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', opacity: 0.7, fontWeight: 600 }}>
                  {asset.name}
                </Typography>
              </Box>
              {/* File Info Row */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 520, mt: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>
                    {asset.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, color: '#9ca3af', fontSize: 15, mt: 0.5 }}>
                    <span>{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</span>
                    <span>{asset.size}</span>
                    <span>{asset.date}</span>
                  </Box>
                </Box>
                <Chip
                  label={asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                  size="small"
                  sx={{
                    background: asset.status === 'approved' ? '#e0f2fe' : '#fef9c3',
                    color: asset.status === 'approved' ? '#0284c7' : '#b45309',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 1.5,
                    height: 28,
                    fontSize: 15,
                  }}
                />
              </Box>
            </Box>
            {/* Version History Section */}
            <Box sx={{ px: 4, py: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#d1d5db', fontWeight: 700, mb: 2, fontSize: 18 }}>
                Version History
              </Typography>
              <Paper sx={{ background: '#181c20', borderRadius: 2, boxShadow: 'none', p: 0, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Mock version list */}
                  {[0, 1, 2].map((v, idx) => (
                    <Box key={v} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, borderBottom: idx < 2 ? '1px solid #23272f' : 'none', gap: 2 }}>
                      <Box sx={{ mr: 2, color: idx === 0 ? '#10b981' : '#9ca3af', display: 'flex', alignItems: 'center' }}>
                        {idx === 0 ? <FileImage size={22} /> : <FileImage size={20} />}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: idx === 0 ? '#fff' : '#d1d5db', fontWeight: idx === 0 ? 600 : 500, fontSize: 15 }}>
                          {asset.name}
                        </Typography>
                        <Typography sx={{ color: '#9ca3af', fontSize: 13 }}>
                          {idx === 0 ? 'Current version' : `Version ${3-idx}`}, Jan 1{3-idx}, 2025 at 10:00 AM
                        </Typography>
                      </Box>
                      <Chip
                        label={idx === 0 ? 'Current' : `v${3-idx}`}
                        size="small"
                        sx={{
                          background: idx === 0 ? '#10b981' : '#374151',
                          color: idx === 0 ? '#fff' : '#e5e7eb',
                          fontWeight: 600,
                          borderRadius: 1,
                          height: 22,
                          fontSize: 13,
                          mr: 1,
                        }}
                      />
                      <IconButton size="small" sx={{ color: '#9ca3af' }}><DownloadIcon fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: '#bfc9d1' }} onClick={e => handleVersionMenuOpen(e, idx)}><MoreVertIcon fontSize="small" /></IconButton>
                      {/* Version More menu */}
                      {versionMenuIdx === idx && (
                        <Menu
                          anchorEl={versionMenuAnchorEl}
                          open={versionMenuOpen}
                          onClose={handleVersionMenuClose}
                          PaperProps={{
                            sx: {
                              background: '#23272f',
                              color: '#e5e7eb',
                              borderRadius: 2,
                              boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
                              minWidth: 180,
                            },
                          }}
                        >
                          <MenuItem onClick={handleVersionRename}>
                            <ListItemIcon><EditIcon fontSize="small" sx={{ color: '#bfc9d1' }} /></ListItemIcon>
                            <ListItemText>Rename</ListItemText>
                          </MenuItem>
                          <MenuItem onClick={handleVersionArchive}>
                            <ListItemIcon><ArchiveIcon fontSize="small" sx={{ color: '#bfc9d1' }} /></ListItemIcon>
                            <ListItemText>Archive</ListItemText>
                          </MenuItem>
                          <MenuItem onClick={handleVersionRestore}>
                            <ListItemIcon><RestoreIcon fontSize="small" sx={{ color: '#bfc9d1' }} /></ListItemIcon>
                            <ListItemText>Restore Version</ListItemText>
                          </MenuItem>
                        </Menu>
                      )}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Paper>
        </Grid>
        {/* Right: Metadata, Licensing, Actions */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* Asset Information - Campaign Wizard Style */}
          <Paper elevation={3} sx={{
            background: '#23272f',
            p: 5,
            borderRadius: 3,
            border: '1px solid #30363d',
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
            width: '100%',
            mb: 4
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 22, color: '#e2e8f0', mb: 3, letterSpacing: 0.2 }}>
              Asset Information
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Filename"
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                size="small"
                variant="filled"
                sx={{
                  input: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                  textarea: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                  label: { color: '#bfc9d1', fontWeight: 500 },
                  select: { background: 'transparent' },
                  '.MuiFilledInput-root': {
                    background: 'transparent',
                    borderRadius: 2,
                    border: '1px solid #374151',
                    boxShadow: 'none',
                    '&:hover': { background: 'transparent', borderColor: '#525c6b' },
                    '&.Mui-focused': { background: 'transparent', borderColor: '#525c6b' }
                  },
                  mb: 0
                }}
                InputLabelProps={{ style: { color: '#bfc9d1', fontWeight: 500 } }}
              />
              <TextField
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                fullWidth
                size="small"
                multiline
                minRows={2}
                variant="filled"
                sx={{
                  input: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                  textarea: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                  label: { color: '#bfc9d1', fontWeight: 500 },
                  select: { background: 'transparent' },
                  '.MuiFilledInput-root': {
                    background: 'transparent',
                    borderRadius: 2,
                    border: '1px solid #374151',
                    boxShadow: 'none',
                    '&:hover': { background: 'transparent', borderColor: '#525c6b' },
                    '&.Mui-focused': { background: 'transparent', borderColor: '#525c6b' }
                  },
                  mb: 0
                }}
                InputLabelProps={{ style: { color: '#bfc9d1', fontWeight: 500 } }}
              />
              <TextField
                label="Category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                fullWidth
                size="small"
                select
                variant="filled"
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        background: '#23272f',
                        color: '#e2e8f0',
                        borderRadius: 2,
                      },
                    },
                  },
                }}
                sx={{
                  input: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                  label: { color: '#bfc9d1', fontWeight: 500 },
                  select: { background: 'transparent' },
                  '.MuiFilledInput-root': {
                    background: 'transparent',
                    borderRadius: 2,
                    border: '1px solid #374151',
                    boxShadow: 'none',
                    '&:hover': { background: 'transparent', borderColor: '#525c6b' },
                    '&.Mui-focused': { background: 'transparent', borderColor: '#525c6b' }
                  },
                  mb: 0
                }}
                InputLabelProps={{ style: { color: '#bfc9d1', fontWeight: 500 } }}
              >
                <MenuItem value="Brand Identity">Brand Identity</MenuItem>
                <MenuItem value="Product">Product</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
              </TextField>
              {/* Tag Input with Chips */}
              <Box>
                <Typography variant="body2" sx={{ color: '#bfc9d1', mb: 0.5, fontWeight: 500 }}>Tags</Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1 }}>
                  {tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" sx={{ background: '#181c20', color: '#bfc9d1', fontWeight: 500, borderRadius: 1, height: 24 }} onDelete={() => handleRemoveTag(tag)} />
                  ))}
                </Stack>
                <TextField
                  placeholder="Add tags..."
                  size="small"
                  variant="filled"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  sx={{
                    input: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                    label: { color: '#bfc9d1', fontWeight: 500 },
                    '.MuiFilledInput-root': {
                      background: 'transparent',
                      borderRadius: 2,
                      border: '1px solid #374151',
                      boxShadow: 'none',
                      '&:hover': { background: 'transparent', borderColor: '#525c6b' },
                      '&.Mui-focused': { background: 'transparent', borderColor: '#525c6b' }
                    },
                    mb: 0
                  }}
                  InputProps={{ disableUnderline: true }}
                />
              </Box>
              <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={!isDirty}
                  sx={{
                    background: '#f3f4f6',
                    color: '#23272f',
                    fontWeight: 700,
                    borderRadius: 2,
                    py: 1.1,
                    px: 3,
                    fontSize: 16,
                    letterSpacing: 0.5,
                    border: '1.5px solid #e5e7eb',
                    boxShadow: 'none',
                    textTransform: 'none',
                    flex: '1 1 auto',
                    maxWidth: '350px',
                    minWidth: '120px',
                    '&:hover': {
                      background: '#e5e7eb',
                      color: '#181c20',
                      borderColor: '#d1d5db',
                    },
                    '&.Mui-disabled': {
                      color: '#bfc9d1',
                    },
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="text"
                  sx={{
                    color: '#bfc9d1',
                    fontWeight: 500,
                    fontSize: 16,
                    minWidth: '80px',
                    px: 2,
                    py: 1.1,
                    textTransform: 'none',
                    ml: 2,
                    border: '1px solid #d1d5db',
                    height: '100%',
                    flex: '0 0 auto',
                    '&:hover': {
                      color: '#fff',
                      background: 'rgba(55,65,81,0.08)',
                    },
                  }}
                  onClick={() => {
                    if (asset) {
                      setName(asset.name);
                      setDescription('Primary brand logo file for all marketing materials and digital platforms.');
                      setCategory('Brand Identity');
                      setTags(asset.tags);
                    }
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
            <Snackbar
              open={saveSuccess}
              autoHideDuration={2000}
              onClose={() => setSaveSuccess(false)}
              message="Changes saved!"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
          </Paper>
          {/* Licensing Section */}
          <Paper elevation={3} sx={{
            background: '#23272f',
            p: 5,
            borderRadius: 3,
            border: '1px solid #30363d',
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
            width: '100%',
            mb: 4
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 22, color: '#e2e8f0', mb: 3, letterSpacing: 0.2 }}>
              Licensing
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="License Type"
                value={licenseType}
                onChange={e => setLicenseType(e.target.value)}
                fullWidth
                size="small"
                select
                variant="filled"
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        background: '#23272f',
                        color: '#e2e8f0',
                        borderRadius: 2,
                      },
                    },
                  },
                }}
                sx={{
                  input: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                  label: { color: '#bfc9d1', fontWeight: 500 },
                  select: { background: 'transparent' },
                  '.MuiFilledInput-root': {
                    background: 'transparent',
                    borderRadius: 2,
                    border: '1px solid #374151',
                    boxShadow: 'none',
                    '&:hover': { background: 'transparent', borderColor: '#525c6b' },
                    '&.Mui-focused': { background: 'transparent', borderColor: '#525c6b' }
                  },
                  mb: 0
                }}
                InputLabelProps={{ style: { color: '#bfc9d1', fontWeight: 500 } }}
              >
                <MenuItem value="Internal Use Only">Internal Use Only</MenuItem>
                <MenuItem value="Commercial">Commercial</MenuItem>
                <MenuItem value="Creative Commons">Creative Commons</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </TextField>
              <TextField
                label="License Description"
                value={licenseDescription}
                onChange={e => setLicenseDescription(e.target.value)}
                fullWidth
                size="small"
                multiline
                minRows={2}
                variant="filled"
                sx={{
                  input: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                  textarea: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                  label: { color: '#bfc9d1', fontWeight: 500 },
                  '.MuiFilledInput-root': {
                    background: 'transparent',
                    borderRadius: 2,
                    border: '1px solid #374151',
                    boxShadow: 'none',
                    '&:hover': { background: 'transparent', borderColor: '#525c6b' },
                    '&.Mui-focused': { background: 'transparent', borderColor: '#525c6b' }
                  },
                  mb: 0
                }}
                InputLabelProps={{ style: { color: '#bfc9d1', fontWeight: 500 } }}
              />
              <Button
                variant="contained"
                onClick={handleLicensingSave}
                disabled={!licensingDirty}
                sx={{
                  background: '#f3f4f6',
                  color: '#23272f',
                  fontWeight: 700,
                  borderRadius: 2,
                  py: 1.1,
                  px: 3,
                  fontSize: 16,
                  letterSpacing: 0.5,
                  border: '1.5px solid #e5e7eb',
                  boxShadow: 'none',
                  textTransform: 'none',
                  maxWidth: '220px',
                  minWidth: '120px',
                  mt: 1,
                  '&:hover': {
                    background: '#e5e7eb',
                    color: '#181c20',
                    borderColor: '#d1d5db',
                  },
                  '&.Mui-disabled': {
                    color: '#bfc9d1',
                  },
                }}
              >
                Save Licensing
              </Button>
              <Snackbar
                open={licensingSaveSuccess}
                autoHideDuration={2000}
                onClose={() => setLicensingSaveSuccess(false)}
                message="Licensing saved!"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              />
            </Stack>
          </Paper>
          {/* Actions Section */}
          <Paper elevation={3} sx={{
            background: '#23272f',
            p: 5,
            borderRadius: 3,
            border: '1px solid #30363d',
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
            width: '100%',
            mb: 4
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 22, color: '#e2e8f0', mb: 3, letterSpacing: 0.2 }}>
              Actions
            </Typography>
            <Stack spacing={1.5}>
              <Button
                fullWidth
                startIcon={<DownloadIcon sx={{ color: '#64748b' }} />}
                onClick={handleDownload}
                sx={{
                  background: '#23272f',
                  color: '#e5e7eb',
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 16,
                  py: 1.2,
                  border: '1.5px solid #30363d',
                  boxShadow: 'none',
                  textTransform: 'none',
                  '&:hover': {
                    background: '#30363d',
                    color: '#fff',
                    borderColor: '#374151',
                  },
                }}
              >
                Download Original
              </Button>
              <Button
                fullWidth
                startIcon={<ContentCopyIcon sx={{ color: '#64748b' }} />}
                onClick={handleDuplicate}
                sx={{
                  background: '#23272f',
                  color: '#e5e7eb',
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 16,
                  py: 1.2,
                  border: '1.5px solid #30363d',
                  boxShadow: 'none',
                  textTransform: 'none',
                  '&:hover': {
                    background: '#30363d',
                    color: '#fff',
                    borderColor: '#374151',
                  },
                }}
              >
                Duplicate Asset
              </Button>
              <Button
                fullWidth
                startIcon={<ShareIcon sx={{ color: '#64748b' }} />}
                onClick={handleShare}
                sx={{
                  background: '#23272f',
                  color: '#e5e7eb',
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 16,
                  py: 1.2,
                  border: '1.5px solid #30363d',
                  boxShadow: 'none',
                  textTransform: 'none',
                  '&:hover': {
                    background: '#30363d',
                    color: '#fff',
                    borderColor: '#374151',
                  },
                }}
              >
                Share Link
              </Button>
              <Button
                fullWidth
                startIcon={<DeleteIcon sx={{ color: '#ef4444' }} />}
                onClick={handleDelete}
                sx={{
                  background: '#23272f',
                  color: '#ef4444',
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 16,
                  py: 1.2,
                  border: '1.5px solid #ef4444',
                  boxShadow: 'none',
                  textTransform: 'none',
                  '&:hover': {
                    background: '#2d1517',
                    color: '#fff',
                    borderColor: '#b91c1c',
                  },
                }}
              >
                Delete Asset
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      {/* Delete confirmation dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            background: '#23272f',
            color: '#e5e7eb',
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 600, pb: 1 }}>
          Delete Asset?
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography sx={{ color: '#d1d5db' }}>
            Are you sure you want to delete this asset? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{
              color: '#9ca3af',
              '&:hover': {
                background: 'rgba(156, 163, 175, 0.08)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            sx={{
              background: '#dc2626',
              color: '#fff',
              '&:hover': {
                background: '#b91c1c',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for actions */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default AssetDetails; 