import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, Stack, TextField, InputAdornment, Select, MenuItem, IconButton, FormControl, InputLabel, Grid, Card, CardContent, Chip, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress, Alert, Snackbar, Checkbox, FormControlLabel } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import TopNav from '../components/TopNav';
import SidebarLayout from '../layouts/SidebarLayout';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { LayoutGrid, Table, UploadCloud, Download, FileImage, FileVideo, FileText, File, X, CheckCircle, AlertCircle, Trash2, FileArchive, FileCode, FileSpreadsheet, Check } from 'lucide-react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAssets } from '../services/assetsApi';
import CircularProgress from '@mui/material/CircularProgress';
import type { Asset } from '../types/asset';
import { Link } from 'react-router-dom';

const selectSx = {
  minWidth: 140,
  background: '#181c20',
  borderRadius: 1,
  color: '#d1d5db',
  '.MuiSelect-icon': { color: '#d1d5db' },
  '.MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
  '& .MuiInputLabel-root': { color: '#d1d5db' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#374151',
    },
    '&:hover fieldset': {
      borderColor: '#d1d5db',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#d1d5db',
    },
  },
};

const menuProps = {
  PaperProps: {
    sx: {
      background: '#23272f',
      color: '#d1d5db',
    },
  },
};

const menuItemSx = {
  color: '#d1d5db !important',
  background: '#23272f',
  outline: 'none !important',
  '&.Mui-selected': {
    backgroundColor: '#374151 !important',
    color: '#d1d5db !important',
    outline: 'none !important',
  },
  '&.Mui-selected:hover': {
    backgroundColor: '#4b5563 !important',
    color: '#d1d5db !important',
    outline: 'none !important',
  },
  '&:hover': {
    backgroundColor: '#374151 !important',
    color: '#d1d5db !important',
    outline: 'none !important',
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#374151 !important',
    color: '#d1d5db !important',
    outline: 'none !important',
  },
  '&.Mui-selected.Mui-focusVisible': {
    backgroundColor: '#374151 !important',
    color: '#d1d5db !important',
    outline: 'none !important',
  },
};

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fileType, setFileType] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const PAGE_SIZE = 4;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  // Asset details state
  const [assetCategory, setAssetCategory] = useState('');
  const [assetLicense, setAssetLicense] = useState('internal');
  const [assetTags, setAssetTags] = useState<string[]>([]);
  const [assetTagInput, setAssetTagInput] = useState('');
  const [assetDescription, setAssetDescription] = useState('');
  const [assetNeedsReview, setAssetNeedsReview] = useState(false);

  // File validation
  const validateFile = (file: File): string | null => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'video/mp4', 'application/pdf'];

    if (file.size > maxSize) {
      return 'File size exceeds 50MB limit';
    }
    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported';
    }
    return null;
  };

  // Handle file selection (from input or drop)
  const handleFiles = (files: FileList | null, append = false) => {
    if (!files) return;
    let fileArray = Array.from(files);
    if (append) {
      // Filter out duplicates by name
      const existingNames = new Set(selectedFiles.map(f => f.name));
      fileArray = fileArray.filter(f => !existingNames.has(f.name));
      fileArray = [...selectedFiles, ...fileArray];
    }
    // Validate files
    const errors: { [key: string]: string } = {};
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors[file.name] = error;
      }
    });
    setUploadErrors(errors);
    setSelectedFiles(fileArray);
    setUploadModalOpen(true);
  };

  // Drag-and-drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Remove a file from the selected files list
  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles(files => files.filter(f => f.name !== fileName));
    setUploadErrors(errors => {
      const newErrors = { ...errors };
      delete newErrors[fileName];
      return newErrors;
    });
    setUploadProgress(progress => {
      const newProgress = { ...progress };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const DEFAULT_CAMPAIGN_ID = 'campaign-123'; // TODO: Replace with real campaign ID from context/props

  useEffect(() => {
    setLoading(true);
    getAssets(DEFAULT_CAMPAIGN_ID)
      .then((data: Asset[]) => {
        setAssets(data);
        setLoading(false);
        setVisibleCount(PAGE_SIZE); // Reset pagination on reload
      })
      .catch((error) => {
        setLoading(false);
        // Optionally show error notification
        console.error('Failed to load assets:', error);
      });
  }, []);

  // Reset pagination when filters/search change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, fileType, status, sort]);

  // Filtering logic
  let filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesType = fileType === 'all' || asset.type === fileType;
    const matchesStatus = status === 'all' || asset.status === status;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sorting logic
  filteredAssets = filteredAssets.sort((a, b) => {
    if (sort === 'newest') {
      // Sort by date descending (assuming date is in a parseable format)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sort === 'az') {
      return a.name.localeCompare(b.name);
    } else if (sort === 'size') {
      // Sort by size (convert to bytes for comparison)
      const parseSize = (size: string) => {
        const [num, unit] = size.split(' ');
        const n = parseFloat(num);
        if (unit === 'KB') return n * 1024;
        if (unit === 'MB') return n * 1024 * 1024;
        return n;
      };
      return parseSize(b.size) - parseSize(a.size);
    }
    return 0;
  });

  const visibleAssets = filteredAssets.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAssets.length;

  // Upload modal handlers
  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedFiles([]);
    setUploadProgress({});
    setUploadErrors({});
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Always reset file input when selectedFiles is empty
  useEffect(() => {
    if (selectedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedFiles]);

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadProgress({});
    setUploadSuccess(false);

    // Simulate upload progress for each file
    for (const file of selectedFiles) {
      if (uploadErrors[file.name]) continue; // Skip files with errors

      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => ({ ...prev, [file.name]: i }));
      }
    }

    // Simulate completion
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      // TODO: Refresh assets list
    }, 500);
  };

  return (
    <SidebarLayout currentPage="assets">
      <TopNav currentPage="assets" />
      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        {/* Header Section */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Brand Assets
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              {filteredAssets.length} assets
            </Typography>
          </Stack>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{
              background: '#16a34a',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              py: 1.2,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                background: '#15803d',
                boxShadow: 'none',
              },
            }}
            onClick={() => {
              setSelectedFiles([]);
              setUploadModalOpen(true);
            }}
          >
            Upload Assets
          </Button>
        </Stack>
        {/* Filters/Search Bar */}
        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', background: 'transparent', mb: 2 }}>
          {/* Search Bar */}
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{
              minWidth: 220,
              background: '#181c20',
              borderRadius: 1,
              color: '#d1d5db',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#374151',
                },
                '&:hover fieldset': {
                  borderColor: '#d1d5db',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#d1d5db',
                },
              },
              '& .MuiInputBase-input': {
                color: '#d1d5db',
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#bfc9d1',
                opacity: 1,
              },
            }}
            InputProps={{
              style: { color: '#d1d5db' },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ style: { color: '#bfc9d1' } }}
          />
          {/* File Type Filter */}
          <FormControl size="small" sx={selectSx}>
            <InputLabel sx={{ color: '#d1d5db' }}>Type</InputLabel>
            <Select
              value={fileType}
              label="Type"
              onChange={e => setFileType(e.target.value)}
              sx={{ color: fileType !== 'all' ? '#d1d5db' : '#bfc9d1' }}
              MenuProps={menuProps}
            >
              <MenuItem value="all" sx={menuItemSx}>All Types</MenuItem>
              <MenuItem value="image" sx={menuItemSx}>Images</MenuItem>
              <MenuItem value="video" sx={menuItemSx}>Videos</MenuItem>
              <MenuItem value="document" sx={menuItemSx}>Documents</MenuItem>
            </Select>
          </FormControl>
          {/* Status Filter */}
          <FormControl size="small" sx={selectSx}>
            <InputLabel sx={{ color: '#d1d5db' }}>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={e => setStatus(e.target.value)}
              sx={{ color: status !== 'all' ? '#d1d5db' : '#bfc9d1' }}
              MenuProps={menuProps}
            >
              <MenuItem value="all" sx={menuItemSx}>All Status</MenuItem>
              <MenuItem value="approved" sx={menuItemSx}>Approved</MenuItem>
              <MenuItem value="pending" sx={menuItemSx}>Pending</MenuItem>
            </Select>
          </FormControl>
          {/* Sort By */}
          <FormControl size="small" sx={selectSx}>
            <InputLabel sx={{ color: '#d1d5db' }}>Sort By</InputLabel>
            <Select
              value={sort}
              label="Sort By"
              onChange={e => setSort(e.target.value)}
              sx={{ color: sort !== 'newest' ? '#d1d5db' : '#bfc9d1' }}
              MenuProps={menuProps}
            >
              <MenuItem value="newest" sx={menuItemSx}>Newest</MenuItem>
              <MenuItem value="az" sx={menuItemSx}>A-Z</MenuItem>
              <MenuItem value="size" sx={menuItemSx}>Size</MenuItem>
            </Select>
          </FormControl>
          {/* View Toggle */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, val) => val && setView(val)}
              size="small"
              sx={{
                background: '#23272c',
                borderRadius: 2,
                p: 0.5,
                '.MuiToggleButton-root': {
                  color: '#94a3b8',
                  border: 'none',
                  transition: 'background 0.15s, color 0.15s',
                  '&.Mui-selected': {
                    color: '#fff',
                    backgroundColor: '#334155',
                    '&:hover': {
                      backgroundColor: '#475569',
                    },
                  },
                  '&:not(.Mui-selected):hover': {
                    backgroundColor: '#1e293b',
                    color: '#cbd5e1',
                  },
                  '&:first-of-type': {
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                  },
                  '&:last-of-type': {
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                  },
                  minWidth: 44,
                  minHeight: 36,
                },
              }}
            >
              <ToggleButton value="grid" aria-label="Grid View">
                <LayoutGrid size={18} />
              </ToggleButton>
              <ToggleButton value="list" aria-label="List View" disabled>
                <Table size={18} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
        {/* Drag-and-Drop Upload Zone */}
        <Box
          sx={{
            border: '2px dashed #374151',
            borderRadius: 3,
            background: '#23272f',
            p: 6,
            mb: 4,
            textAlign: 'center',
            transition: 'border-color 0.2s',
            '&:hover': {
              borderColor: '#bfc9d1',
              background: '#23272f',
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            key={fileInputKey}
            type="file"
            multiple
            hidden
            ref={fileInputRef}
            onChange={e => {
              handleFiles(e.target.files);
              setFileInputKey(k => k + 1);
            }}
            accept=".jpg,.jpeg,.png,.svg,.mp4,.pdf"
          />
          <Box
            sx={{
              width: 64,
              height: 64,
              background: '#374151',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <UploadCloud size={36} color="#9ca3af" />
          </Box>
          <Typography variant="h6" sx={{ color: '#e5e7eb', mb: 0.5 }}>
            Drag & drop assets here
          </Typography>
          <Typography variant="body2" sx={{ color: '#9ca3af', mb: 1 }}>
            or click to browse files
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            Supports JPG, PNG, SVG, MP4, PDF
          </Typography>
        </Box>
        {/* Upload Modal */}
        <Dialog
          open={uploadModalOpen}
          onClose={handleCloseUploadModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: '#181c20 !important', // match app panels
              color: '#e5e7eb',
              borderRadius: 2,
              boxShadow: 24,
            },
          }}
        >
          <DialogTitle sx={{ backgroundColor: '#181c20 !important', borderBottom: '1px solid #23272f', pb: 2, color: '#e5e7eb' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#e5e7eb' }}>Upload Assets</Typography>
              <IconButton onClick={handleCloseUploadModal} sx={{ color: '#9ca3af' }}>
                <X size={20} />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 3, backgroundColor: '#181c20 !important', color: '#e5e7eb' }}>
            {/* Modal Drop Zone */}
            <Box
              sx={{
                border: '2px dashed #374151',
                borderRadius: 3,
                backgroundColor: '#181c20',
                p: 4,
                mb: 3,
                textAlign: 'center',
                transition: 'border-color 0.2s, background 0.2s',
                '&:hover': {
                  borderColor: '#bfc9d1',
                  backgroundColor: '#23272f',
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
              onDrop={e => {
                e.preventDefault();
                e.stopPropagation();
                handleFiles(e.dataTransfer.files, true);
              }}
              onDragOver={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <input
                type="file"
                multiple
                hidden
                ref={fileInputRef}
                onChange={e => handleFiles(e.target.files, true)}
                accept=".jpg,.jpeg,.png,.svg,.mp4,.pdf"
              />
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  background: '#23272f',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                }}
              >
                <UploadCloud size={28} color="#9ca3af" />
              </Box>
              <Typography variant="body2" sx={{ color: '#e5e7eb', mb: 0.5 }}>
                Drag & drop your files here
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', mb: 1 }}>
                or
              </Typography>
              <Button
                variant="contained"
                onClick={e => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                sx={{
                  background: '#23272f',
                  color: '#e5e7eb',
                  fontWeight: 500,
                  boxShadow: 'none',
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  mb: 1,
                  '&:hover': {
                    background: '#bfc9d1',
                    color: '#181c20',
                  },
                }}
              >
                Browse Files
              </Button>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                Supported formats: JPG, PNG, SVG, MP4, PDF. Max file size: 50MB each.
              </Typography>
            </Box>
            {/* End Modal Drop Zone */}
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 2 }}>
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected for upload
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {selectedFiles.map((file, index) => {
                const error = uploadErrors[file.name];
                const progress = uploadProgress[file.name] || 0;
                const isUploading = progress > 0 && progress < 100;
                const isComplete = progress === 100;
                // File type icon logic
                let FileIcon = File;
                if (file.type.startsWith('image/')) FileIcon = FileImage;
                else if (file.type.startsWith('video/')) FileIcon = FileVideo;
                else if (file.type === 'application/pdf') FileIcon = FileText;
                else if (file.type.includes('zip') || file.name.endsWith('.zip')) FileIcon = FileArchive;
                else if (file.type.includes('spreadsheet') || file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) FileIcon = FileSpreadsheet;
                else if (file.type.includes('code') || file.name.endsWith('.js') || file.name.endsWith('.ts')) FileIcon = FileCode;

                return (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      backgroundColor: '#181c20',
                      borderRadius: 2,
                      border: error ? '1px solid #ef4444' : '1px solid #23272f',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'background 0.15s, border 0.15s',
                      '&:hover': {
                        backgroundColor: '#23272f',
                        borderColor: '#3b82f6',
                      },
                    }}
                  >
                    {/* File type icon */}
                    <Box sx={{
                      width: 40,
                      height: 40,
                      background: '#23272f',
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}>
                      <FileIcon size={22} color="#9ca3af" />
                    </Box>
                    {/* File info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ color: '#e5e7eb', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {file.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                      {isUploading && (
                        <Box sx={{ width: '100%', mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              background: '#23272f',
                              '& .MuiLinearProgress-bar': {
                                background: '#3b82f6',
                              },
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#9ca3af', mt: 0.5, display: 'block' }}>
                            {progress}% uploaded
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    {error && <AlertCircle size={16} color="#ef4444" style={{ marginLeft: 8 }} />}
                    {isComplete && <CheckCircle size={16} color="#10b981" style={{ marginLeft: 8 }} />}
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(file.name)}
                      sx={{ ml: 1, color: '#9ca3af', '&:hover': { color: '#ef4444', background: 'rgba(239,68,68,0.08)' } }}
                      disabled={isUploading || isComplete}
                      aria-label={`Remove ${file.name}`}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
            {/* Asset Details Section */}
            <Box sx={{ mt: 4, mb: 3, p: { xs: 2, sm: 4 }, backgroundColor: '#181c20', borderRadius: 3, border: '1px solid #23272f' }}>
              <Typography variant="subtitle1" sx={{ color: '#e5e7eb', mb: 3, fontWeight: 700, fontSize: 18 }}>
                Asset Details
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth size="small" sx={{ mb: 0 }}>
                    <InputLabel sx={{ color: '#bfc9d1', fontWeight: 500 }}>Category</InputLabel>
                    <Select
                      value={assetCategory}
                      label="Category"
                      onChange={e => setAssetCategory(e.target.value)}
                      sx={{ color: '#e5e7eb', background: '#23272f', borderRadius: 2, fontWeight: 500 }}
                      MenuProps={menuProps}
                    >
                      <MenuItem value="" sx={menuItemSx}>Select category…</MenuItem>
                      <MenuItem value="logo" sx={menuItemSx}>Logo</MenuItem>
                      <MenuItem value="video" sx={menuItemSx}>Video</MenuItem>
                      <MenuItem value="document" sx={menuItemSx}>Document</MenuItem>
                      <MenuItem value="guideline" sx={menuItemSx}>Guideline</MenuItem>
                      <MenuItem value="other" sx={menuItemSx}>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth size="small" sx={{ mb: 0 }}>
                    <InputLabel sx={{ color: '#bfc9d1', fontWeight: 500 }}>Licensing</InputLabel>
                    <Select
                      value={assetLicense}
                      label="Licensing"
                      onChange={e => setAssetLicense(e.target.value)}
                      sx={{ color: '#e5e7eb', background: '#23272f', borderRadius: 2, fontWeight: 500 }}
                      MenuProps={menuProps}
                    >
                      <MenuItem value="internal" sx={menuItemSx}>Internal Use Only</MenuItem>
                      <MenuItem value="public" sx={menuItemSx}>Public Use</MenuItem>
                      <MenuItem value="restricted" sx={menuItemSx}>Restricted</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    size="small"
                    label="Tags"
                    value={assetTagInput}
                    onChange={e => setAssetTagInput(e.target.value)}
                    onKeyDown={e => {
                      if ((e.key === 'Enter' || e.key === ',') && assetTagInput.trim()) {
                        setAssetTags(tags => [...tags, assetTagInput.trim()]);
                        setAssetTagInput('');
                        e.preventDefault();
                      }
                    }}
                    sx={{ background: '#23272f', borderRadius: 2, color: '#e5e7eb', fontWeight: 500 }}
                    InputProps={{
                      style: { color: '#e5e7eb' },
                    }}
                    InputLabelProps={{ style: { color: '#bfc9d1', fontWeight: 500 } }}
                    helperText={assetTags.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {assetTags.map((tag, idx) => (
                          <Chip
                            key={tag + idx}
                            label={tag}
                            size="small"
                            onDelete={() => setAssetTags(tags => tags.filter((t, i) => i !== idx))}
                            sx={{ background: '#181c20', color: '#e5e7eb', fontWeight: 500 }}
                          />
                        ))}
                      </Box>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 8, md: 8 }}>
                  <TextField
                    size="small"
                    label="Description"
                    value={assetDescription}
                    onChange={e => setAssetDescription(e.target.value)}
                    multiline
                    minRows={2}
                    maxRows={4}
                    fullWidth
                    sx={{ background: '#23272f', borderRadius: 2, color: '#e5e7eb', fontWeight: 500 }}
                    InputProps={{ style: { color: '#e5e7eb' } }}
                    InputLabelProps={{ style: { color: '#bfc9d1', fontWeight: 500 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4, md: 4 }} sx={{ display: 'flex', alignItems: 'center', pl: { sm: 2, xs: 0 }, pt: { xs: 2, sm: 0 } }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={assetNeedsReview}
                        onChange={e => setAssetNeedsReview(e.target.checked)}
                        sx={{ color: '#bfc9d1', '&.Mui-checked': { color: '#3b82f6' } }}
                      />
                    }
                    label={<Typography variant="body2" sx={{ color: '#bfc9d1', fontWeight: 500 }}>Make asset be reviewed before appearing in the library</Typography>}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          {/* Overall Upload Progress */}
          {isUploading && (
            <Box sx={{ px: 4, pb: 2, pt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={
                  selectedFiles.length > 0
                    ? (Object.values(uploadProgress).filter(p => p === 100).length / selectedFiles.length) * 100
                    : 0
                }
                sx={{
                  height: 6,
                  borderRadius: 2,
                  background: '#23272f',
                  '& .MuiLinearProgress-bar': {
                    background: '#3b82f6',
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" sx={{ color: '#e5e7eb' }}>
                  {Object.values(uploadProgress).filter(p => p === 100).length} of {selectedFiles.length} files complete
                </Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                  Uploading assets… {Math.round(
                    selectedFiles.length > 0
                      ? (Object.values(uploadProgress).reduce((a, b) => a + b, 0) /
                        (selectedFiles.length * 100) * 100
                      )
                      : 0
                  )}% complete
                </Typography>
              </Box>
            </Box>
          )}
          {/* Upload Success State */}
          {uploadSuccess && !isUploading && (
            <Box sx={{ px: 4, pb: 2, pt: 2, textAlign: 'center' }}>
              <Check size={40} color="#10b981" style={{ marginBottom: 8 }} />
              <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700, mb: 1 }}>
                Upload Complete!
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} uploaded successfully.
              </Typography>
            </Box>
          )}
          <DialogActions sx={{ backgroundColor: '#181c20 !important', borderTop: '1px solid #23272f', pt: 2 }}>
            <Button
              onClick={handleCloseUploadModal}
              disabled={isUploading || uploadSuccess}
              sx={{ color: '#9ca3af', display: uploadSuccess ? 'none' : 'inline-flex' }}
            >
              Cancel
            </Button>
            {!uploadSuccess && (
              <Button
                onClick={handleUpload}
                disabled={isUploading || Object.keys(uploadErrors).length === selectedFiles.length}
                variant="contained"
                sx={{
                  background: '#3b82f6',
                  '&:hover': { background: '#2563eb' },
                  '&:disabled': { background: '#6b7280' },
                  color: '#fff',
                }}
              >
                {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}`}
              </Button>
            )}
            {uploadSuccess && !isUploading && (
              <Button
                onClick={handleCloseUploadModal}
                variant="contained"
                sx={{
                  background: '#10b981',
                  '&:hover': { background: '#059669' },
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                Done
              </Button>
            )}
          </DialogActions>
        </Dialog>
        {/* Success Notification */}
        <Snackbar
          open={uploadSuccess}
          autoHideDuration={4000}
          onClose={() => setUploadSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setUploadSuccess(false)}
            severity="success"
            sx={{
              background: '#10b981',
              color: '#fff',
              '& .MuiAlert-icon': { color: '#fff' },
            }}
          >
            Assets uploaded successfully!
          </Alert>
        </Snackbar>
        {/* Loading Spinner */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {/* Asset Grid */}
        {!loading && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {visibleAssets.map(asset => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={asset.id}>
                <Link
                  to={`/assets/${asset.id}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <Card
                    sx={{
                      background: '#23272f',
                      borderRadius: 3,
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                      '&:hover, &:focus': {
                        boxShadow: '0 4px 16px 0 rgba(59,130,246,0.10)',
                        borderColor: '#60a5fa',
                        outline: '2px solid #60a5fa',
                        outlineOffset: 0,
                      },
                      border: '1px solid #23272f',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: 260,
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s, border 0.2s, outline 0.2s',
                    }}
                    tabIndex={0}
                  >
                    {/* Thumbnail/Icon */}
                    <Box
                      sx={{
                        aspectRatio: '16/9',
                        background: asset.type === 'image' ? '#374151' : asset.type === 'video' ? '#4b5563' : '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {asset.type === 'image' && <FileImage size={32} color="#9ca3af" />}
                      {asset.type === 'video' && <FileVideo size={32} color="#9ca3af" />}
                      {asset.type === 'document' && <FileText size={32} color="#9ca3af" />}
                      {!['image', 'video', 'document'].includes(asset.type) && <File size={32} color="#9ca3af" />}
                    </Box>
                    <CardContent sx={{ flex: 1, pb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600, fontSize: 16, flex: 1, pr: 1 }} noWrap>
                          {asset.name}
                        </Typography>
                        <Chip
                          label={asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                          size="small"
                          sx={{
                            background: asset.status === 'approved' ? '#e0f2fe' : '#fef9c3',
                            color: asset.status === 'approved' ? '#0284c7' : '#b45309',
                            fontWeight: 600,
                            borderRadius: 1,
                            px: 1,
                            height: 22,
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: 13, mb: 1 }}>
                        <span>{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</span>
                        <span>{asset.size}</span>
                        <span>{asset.date}</span>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                        {asset.tags.map((tag: string) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              background: '#374151',
                              color: '#e5e7eb',
                              fontWeight: 500,
                              borderRadius: 1,
                              height: 20,
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', pt: 0, pb: 1 }}>
                      <IconButton size="small" sx={{ color: '#9ca3af' }}><VisibilityIcon fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: '#9ca3af' }}><Download fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: '#9ca3af' }}><MoreVertIcon fontSize="small" /></IconButton>
                    </CardActions>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        )}
        {/* Load More Button */}
        {hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button
              variant="outlined"
              sx={{
                color: '#e5e7eb',
                borderColor: '#374151',
                borderRadius: 2,
                px: 4,
                py: 1.2,
                fontWeight: 600,
                background: '#23272f',
                '&:hover': {
                  background: '#181c20',
                  borderColor: '#60a5fa',
                  color: '#60a5fa',
                },
              }}
              disabled={loadingMore}
              onClick={() => {
                setLoadingMore(true);
                setTimeout(() => {
                  setVisibleCount(c => Math.min(c + PAGE_SIZE, filteredAssets.length));
                  setLoadingMore(false);
                }, 500);
              }}
            >
              {loadingMore ? <CircularProgress size={22} sx={{ color: '#60a5fa' }} /> : 'Load More Assets'}
            </Button>
          </Box>
        )}

      </Box>
    </SidebarLayout>
  );
};

export default Assets; 