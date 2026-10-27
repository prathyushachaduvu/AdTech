import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Stack, 
  Chip, 
  IconButton, 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import type { BrandGuidelines, BrandColor, BrandFont } from '../services/brandGuidelinesApi';
import { getBrandGuidelines, saveBrandGuidelines } from '../services/brandGuidelinesApi';

export default function BrandGuidelines() {
  const navigate = useNavigate();
  const [guidelines, setGuidelines] = useState<BrandGuidelines | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingUsageGuidelines, setEditingUsageGuidelines] = useState(false);
  const [usageGuidelinesDraft, setUsageGuidelinesDraft] = useState('');

  // Modal states
  const [addColorModalOpen, setAddColorModalOpen] = useState(false);
  const [addFontModalOpen, setAddFontModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  // Form data states
  const [newColor, setNewColor] = useState<Partial<BrandColor>>({
    name: '',
    hexCode: '#000000',
    description: '',
    category: 'primary'
  });
  
  const [newFont, setNewFont] = useState<Partial<BrandFont>>({
    name: '',
    family: '',
    weights: ['400'],
    usage: ''
  });

  const [newAttachment, setNewAttachment] = useState<{
    file: File | null;
    name: string;
    description: string;
  }>({
    file: null,
    name: '',
    description: ''
  });

  useEffect(() => {
    const loadGuidelines = async () => {
      try {
        const data = await getBrandGuidelines('company-123');
        setGuidelines(data);
      } catch (error) {
        console.error('Failed to load brand guidelines:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGuidelines();
  }, []);

  const handleSave = async () => {
    if (!guidelines) return;
    
    setSaving(true);
    try {
      await saveBrandGuidelines(guidelines);
      // TODO: Show success notification
    } catch (error) {
      console.error('Failed to save brand guidelines:', error);
      // TODO: Show error notification
    } finally {
      setSaving(false);
    }
  };

  // Usage Guidelines edit handlers
  const handleEditUsageGuidelines = () => {
    if (!guidelines) return;
    setUsageGuidelinesDraft(guidelines.usageGuidelines);
    setEditingUsageGuidelines(true);
  };
  const handleCancelUsageGuidelines = () => {
    setEditingUsageGuidelines(false);
    setUsageGuidelinesDraft('');
  };
  const handleSaveUsageGuidelines = () => {
    if (!guidelines) return;
    setGuidelines({ ...guidelines, usageGuidelines: usageGuidelinesDraft });
    setEditingUsageGuidelines(false);
  };

  // Modal handlers
  const handleOpenAddColorModal = () => {
    setNewColor({
      name: '',
      hexCode: '#000000',
      description: '',
      category: 'primary'
    });
    setAddColorModalOpen(true);
  };

  const handleCloseAddColorModal = () => {
    setAddColorModalOpen(false);
    setNewColor({
      name: '',
      hexCode: '#000000',
      description: '',
      category: 'primary'
    });
  };

  const handleSaveNewColor = () => {
    if (!guidelines || !newColor.name || !newColor.hexCode || !newColor.category) return;
    
    const colorToAdd: BrandColor = {
      id: `color-${Date.now()}`,
      name: newColor.name,
      hexCode: newColor.hexCode,
      description: newColor.description || '',
      category: newColor.category
    };
    
    setGuidelines({
      ...guidelines,
      colors: [...guidelines.colors, colorToAdd]
    });
    handleCloseAddColorModal();
  };

  const handleOpenAddFontModal = () => {
    setNewFont({
      name: '',
      family: '',
      weights: ['400'],
      usage: ''
    });
    setAddFontModalOpen(true);
  };

  const handleCloseAddFontModal = () => {
    setAddFontModalOpen(false);
    setNewFont({
      name: '',
      family: '',
      weights: ['400'],
      usage: ''
    });
  };

  const handleSaveNewFont = () => {
    if (!guidelines || !newFont.name || !newFont.family || !newFont.usage) return;
    
    const fontToAdd: BrandFont = {
      id: `font-${Date.now()}`,
      name: newFont.name,
      family: newFont.family,
      weights: newFont.weights || ['400'],
      usage: newFont.usage
    };
    
    setGuidelines({
      ...guidelines,
      fonts: [...guidelines.fonts, fontToAdd]
    });
    handleCloseAddFontModal();
  };

  // Upload modal handlers
  const handleOpenUploadModal = () => {
    setNewAttachment({
      file: null,
      name: '',
      description: ''
    });
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setNewAttachment({
      file: null,
      name: '',
      description: ''
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewAttachment({
        ...newAttachment,
        file,
        name: file.name
      });
    }
  };

  const handleSaveNewAttachment = () => {
    if (!guidelines || !newAttachment.file || !newAttachment.name) return;
    
    // In a real app, you'd upload the file to a server here
    // For now, we'll just add the filename to the attachments list
    const attachmentName = newAttachment.name.endsWith('.pdf') || 
                          newAttachment.name.endsWith('.zip') || 
                          newAttachment.name.endsWith('.sketch') 
                          ? newAttachment.name 
                          : `${newAttachment.name}.${newAttachment.file.name.split('.').pop()}`;
    
    setGuidelines({
      ...guidelines,
      attachments: [...guidelines.attachments, attachmentName]
    });
    handleCloseUploadModal();
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#000000', color: '#e2e8f0', p: { xs: 1, sm: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading brand guidelines...</Typography>
      </Box>
    );
  }

  if (!guidelines) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#000000', color: '#e2e8f0', p: { xs: 1, sm: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Failed to load brand guidelines</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#000000', color: '#e2e8f0', p: { xs: 1, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: '#9ca3af', mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#e2e8f0' }}>
            Brand Guidelines
          </Typography>
          <Typography variant="subtitle2" sx={{ color: '#9ca3af', fontWeight: 500, mt: 1 }}>
            Colors, Fonts & Usage
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={saving}
          onClick={handleSave}
          sx={{
            background: '#1a1a1a',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            boxShadow: 'none',
            '&:hover': {
              background: '#333333',
              boxShadow: 'none',
            },
            '&:disabled': {
              background: '#0a0a0a',
              color: '#6b7280',
            },
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {/* Main Content Grid Skeleton */}
      <Grid container spacing={3}>
        <Grid size={{xs:12, md:8}}>
          {/* Brand Color Palette Section */}
          <Box sx={{ background: '#0a0a0a', borderRadius: 2, border: '1px solid #1a1a1a', p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#e2e8f0', fontSize: 18 }}>
                Brand Color Palette
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Typography sx={{ color: '#9ca3af', fontSize: 16, fontWeight: 300 }}>+</Typography>}
                onClick={handleOpenAddColorModal}
                sx={{
                  borderColor: '#333333',
                  color: '#e2e8f0',
                  background: 'rgba(0,0,0,0.3)',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  minWidth: 'auto',
                  '&:hover': {
                    background: '#1a1a1a',
                    borderColor: '#4a4a4a',
                  },
                }}
              >
                Add Color
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {guidelines.colors.map((color) => (
                <Grid size={{xs:12, sm:6, md:4}} key={color.id}>
                  <Box sx={{ 
                    background: '#1a1a1a', 
                    borderRadius: 2, 
                    p: 2, 
                    border: '1px solid #333333',
                    transition: 'border-color 0.2s',
                    '&:hover': {
                      borderColor: '#4a4a4a',
                    }
                  }}>
                    {/* Color Swatch */}
                    <Box sx={{
                      width: '100%',
                      height: 60,
                      background: color.hexCode,
                      borderRadius: 1,
                      mb: 2,
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Color overlay for better text visibility */}
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%)',
                        opacity: 0.3
                      }} />
                    </Box>
                    
                    {/* Color Info */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#e2e8f0', mb: 1 }}>
                      {color.name}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: '#9ca3af', mb: 1, fontFamily: 'monospace' }}>
                      {color.hexCode}
                    </Typography>
                    
                    {color.description && (
                      <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                        {color.description}
                      </Typography>
                    )}
                    
                    <Chip 
                      label={color.category} 
                      size="small" 
                      sx={{ 
                        fontSize: 11, 
                        height: 20, 
                        bgcolor: '#333333', 
                        color: '#9ca3af',
                        textTransform: 'capitalize'
                      }} 
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid size={{xs:12, md:4}}>
          {/* Brand Fonts Section */}
          <Box sx={{ background: '#0a0a0a', borderRadius: 2, border: '1px solid #1a1a1a', p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#e2e8f0', fontSize: 18 }}>
                Brand Fonts
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Typography sx={{ color: '#9ca3af', fontSize: 16, fontWeight: 300 }}>+</Typography>}
                onClick={handleOpenAddFontModal}
                sx={{
                  borderColor: '#333333',
                  color: '#e2e8f0',
                  background: 'rgba(0,0,0,0.3)',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  minWidth: 'auto',
                  '&:hover': {
                    background: '#1a1a1a',
                    borderColor: '#4a4a4a',
                  },
                }}
              >
                Add Font
              </Button>
            </Box>
            
            <Stack spacing={3}>
              {guidelines.fonts.map((font) => (
                <Box key={font.id} sx={{ 
                  background: '#1a1a1a', 
                  borderRadius: 2, 
                  p: 2.5, 
                  border: '1px solid #333333',
                  transition: 'border-color 0.2s',
                  '&:hover': {
                    borderColor: '#4a4a4a',
                  }
                }}>
                  {/* Font Name */}
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#e2e8f0', 
                      mb: 1, 
                      fontSize: 16,
                      fontFamily: font.family
                    }}
                  >
                    {font.name}
                  </Typography>
                  
                  {/* Font Family */}
                  <Typography variant="body2" sx={{ color: '#9ca3af', mb: 2, fontFamily: 'monospace', fontSize: 13 }}>
                    {font.family}
                  </Typography>
                  
                  {/* Font Weights */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Available Weights
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {font.weights.map((weight) => (
                        <Chip 
                          key={weight} 
                          label={weight} 
                          size="small" 
                          sx={{ 
                            fontSize: 10, 
                            height: 18, 
                            bgcolor: '#333333', 
                            color: '#9ca3af',
                            fontFamily: font.family,
                            fontWeight: parseInt(weight)
                          }} 
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  {/* Usage */}
                  <Box>
                    <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Usage
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.4 }}>
                      {font.usage}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {/* Usage Guidelines Section */}
      <Box sx={{ background: '#0a0a0a', borderRadius: 2, border: '1px solid #1a1a1a', p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#e2e8f0', fontSize: 18 }}>
            Usage Guidelines
          </Typography>
          {!editingUsageGuidelines && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              sx={{
                borderColor: '#333333',
                color: '#e2e8f0',
                background: 'rgba(0,0,0,0.3)',
                fontWeight: 500,
                borderRadius: 2,
                px: 2,
                py: 0.5,
                minWidth: 'auto',
                '&:hover': {
                  background: '#1a1a1a',
                  borderColor: '#4a4a4a',
                },
              }}
              onClick={handleEditUsageGuidelines}
            >
              Edit
            </Button>
          )}
        </Box>
        <Box sx={{ 
          background: '#1a1a1a', 
          borderRadius: 2, 
          p: 3, 
          border: '1px solid #333333',
          minHeight: 120
        }}>
          {editingUsageGuidelines ? (
            <>
              <TextField
                multiline
                minRows={4}
                fullWidth
                value={usageGuidelinesDraft}
                onChange={e => setUsageGuidelinesDraft(e.target.value)}
                variant="outlined"
                sx={{
                  background: '#18181b',
                  borderRadius: 2,
                  '& .MuiInputBase-root': {
                    color: '#e2e8f0',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#333333',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4a4a4a',
                  },
                }}
                inputProps={{ style: { color: '#e2e8f0' } }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveUsageGuidelines}
                  sx={{
                    background: '#2563eb',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2.5,
                    boxShadow: 'none',
                    '&:hover': {
                      background: '#1e40af',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCancelUsageGuidelines}
                  sx={{
                    borderColor: '#333333',
                    color: '#e2e8f0',
                    background: 'rgba(0,0,0,0.3)',
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    minWidth: 'auto',
                    '&:hover': {
                      background: '#1a1a1a',
                      borderColor: '#4a4a4a',
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body1" sx={{ 
              color: '#e2e8f0', 
              lineHeight: 1.6,
              fontSize: 14,
              whiteSpace: 'pre-wrap'
            }}>
              {guidelines.usageGuidelines}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Attachments Section */}
      <Box sx={{ background: '#0a0a0a', borderRadius: 2, border: '1px solid #1a1a1a', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#e2e8f0', fontSize: 18 }}>
            Brand Assets & Attachments
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CloudUploadIcon />}
            onClick={handleOpenUploadModal}
            sx={{
              borderColor: '#333333',
              color: '#e2e8f0',
              background: 'rgba(0,0,0,0.3)',
              fontWeight: 500,
              borderRadius: 2,
              px: 2,
              py: 0.5,
              minWidth: 'auto',
              '&:hover': {
                background: '#1a1a1a',
                borderColor: '#4a4a4a',
              },
            }}
          >
            Upload
          </Button>
        </Box>
        
        <Grid container spacing={2}>
          {guidelines.attachments.map((attachment, index) => (
            <Grid size={{xs:12, sm:6, md:4}} key={index}>
              <Box sx={{ 
                background: '#1a1a1a', 
                borderRadius: 2, 
                p: 2, 
                border: '1px solid #333333',
                transition: 'border-color 0.2s',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: '#4a4a4a',
                  background: '#0f0f0f',
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    background: '#333333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5
                  }}>
                    <Typography sx={{ color: '#9ca3af', fontSize: 14 }}>📄</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 13 }}>
                    {attachment}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: 11 }}>
                  Brand asset • Click to download
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Add Color Modal */}
      <Dialog 
        open={addColorModalOpen} 
        onClose={handleCloseAddColorModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: '#0a0a0a',
            border: '1px solid #1a1a1a',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#e2e8f0', 
          borderBottom: '1px solid #1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Color
          </Typography>
          <IconButton onClick={handleCloseAddColorModal} sx={{ color: '#9ca3af' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Color Name"
              value={newColor.name}
              onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
              fullWidth
              required
              sx={{
                '& .MuiInputLabel-root': { color: '#9ca3af' },
                '& .MuiInputBase-root': { color: '#e2e8f0' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4a4a4a' },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
              }}
            />
            <TextField
              label="Hex Code"
              value={newColor.hexCode}
              onChange={(e) => setNewColor({ ...newColor, hexCode: e.target.value })}
              fullWidth
              required
              placeholder="#000000"
              sx={{
                '& .MuiInputLabel-root': { color: '#9ca3af' },
                '& .MuiInputBase-root': { color: '#e2e8f0' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4a4a4a' },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
              }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#9ca3af' }}>Category</InputLabel>
              <Select
                value={newColor.category}
                label="Category"
                onChange={(e) => setNewColor({ ...newColor, category: e.target.value as any })}
                sx={{
                  color: '#e2e8f0',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4a4a4a' },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                }}
              >
                <MenuItem value="primary" sx={{ color: '#e2e8f0' }}>Primary</MenuItem>
                <MenuItem value="secondary" sx={{ color: '#e2e8f0' }}>Secondary</MenuItem>
                <MenuItem value="accent" sx={{ color: '#e2e8f0' }}>Accent</MenuItem>
                <MenuItem value="neutral" sx={{ color: '#e2e8f0' }}>Neutral</MenuItem>
                <MenuItem value="semantic" sx={{ color: '#e2e8f0' }}>Semantic</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description (Optional)"
              value={newColor.description}
              onChange={(e) => setNewColor({ ...newColor, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
              sx={{
                '& .MuiInputLabel-root': { color: '#9ca3af' },
                '& .MuiInputBase-root': { color: '#e2e8f0' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4a4a4a' },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
              }}
            />
            {/* Color Preview */}
            <Box>
              <Typography variant="body2" sx={{ color: '#9ca3af', mb: 1 }}>
                Preview:
              </Typography>
              <Box sx={{
                width: '100%',
                height: 60,
                background: newColor.hexCode || '#000000',
                borderRadius: 1,
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Typography sx={{ 
                  color: newColor.hexCode === '#000000' ? '#fff' : '#000',
                  fontWeight: 600,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  {newColor.name || 'Color Preview'}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseAddColorModal}
            sx={{
              color: '#9ca3af',
              borderColor: '#333333',
              '&:hover': {
                borderColor: '#4a4a4a',
                background: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveNewColor}
            disabled={!newColor.name || !newColor.hexCode}
            variant="contained"
            sx={{
              background: '#2563eb',
              color: '#fff',
              '&:hover': {
                background: '#1e40af',
              },
              '&:disabled': {
                background: '#1a1a1a',
                color: '#6b7280',
              },
            }}
          >
            Add Color
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Font Modal */}
      <Dialog 
        open={addFontModalOpen} 
        onClose={handleCloseAddFontModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: '#0a0a0a',
            border: '1px solid #1a1a1a',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#e2e8f0', 
          borderBottom: '1px solid #1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Font
          </Typography>
          <IconButton onClick={handleCloseAddFontModal} sx={{ color: '#9ca3af' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Font Name"
              value={newFont.name}
              onChange={(e) => setNewFont({ ...newFont, name: e.target.value })}
              fullWidth
              required
              sx={{
                '& .MuiInputLabel-root': { color: '#9ca3af' },
                '& .MuiInputBase-root': { color: '#e2e8f0' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4a4a4a' },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
              }}
            />
            <TextField
              label="Font Family"
              value={newFont.family}
              onChange={(e) => setNewFont({ ...newFont, family: e.target.value })}
              fullWidth
              required
              placeholder="e.g., Inter, sans-serif"
              sx={{
                '& .MuiInputLabel-root': { color: '#9ca3af' },
                '& .MuiInputBase-root': { color: '#e2e8f0' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4a4a4a' },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
              }}
            />
            <TextField
              label="Usage Description"
              value={newFont.usage}
              onChange={(e) => setNewFont({ ...newFont, usage: e.target.value })}
              fullWidth
              required
              multiline
              rows={2}
              placeholder="e.g., Primary font for all UI text"
              sx={{
                '& .MuiInputLabel-root': { color: '#9ca3af' },
                '& .MuiInputBase-root': { color: '#e2e8f0' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4a4a4a' },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
              }}
            />
            {/* Font Preview */}
            {newFont.family && (
              <Box>
                <Typography variant="body2" sx={{ color: '#9ca3af', mb: 1 }}>
                  Preview:
                </Typography>
                <Box sx={{
                  p: 2,
                  background: '#1a1a1a',
                  borderRadius: 1,
                  border: '1px solid #333333'
                }}>
                  <Typography sx={{ 
                    color: '#e2e8f0',
                    fontFamily: newFont.family,
                    fontSize: 18,
                    fontWeight: 600,
                    mb: 1
                  }}>
                    {newFont.name || 'Font Preview'}
                  </Typography>
                  <Typography sx={{ 
                    color: '#9ca3af',
                    fontFamily: newFont.family,
                    fontSize: 14
                  }}>
                    The quick brown fox jumps over the lazy dog
                  </Typography>
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseAddFontModal}
            sx={{
              color: '#9ca3af',
              borderColor: '#333333',
              '&:hover': {
                borderColor: '#4a4a4a',
                background: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveNewFont}
            disabled={!newFont.name || !newFont.family || !newFont.usage}
            variant="contained"
            sx={{
              background: '#2563eb',
              color: '#fff',
              '&:hover': {
                background: '#1e40af',
              },
              '&:disabled': {
                background: '#1a1a1a',
                color: '#6b7280',
              },
            }}
          >
            Add Font
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Modal */}
      <Dialog 
        open={uploadModalOpen} 
        onClose={handleCloseUploadModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: '#0a0a0a',
            border: '1px solid #1a1a1a',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#e2e8f0', 
          borderBottom: '1px solid #1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Upload Brand Asset
          </Typography>
          <IconButton onClick={handleCloseUploadModal} sx={{ color: '#9ca3af' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            {/* File Upload Area */}
            <Box>
              <Typography variant="body2" sx={{ color: '#9ca3af', mb: 2 }}>
                Select File:
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #333333',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  background: '#1a1a1a',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#4a4a4a',
                    background: '#0f0f0f',
                  },
                }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  accept=".pdf,.zip,.sketch,.png,.jpg,.jpeg,.svg,.ai,.psd"
                />
                {newAttachment.file ? (
                  <Box>
                    <Typography sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>
                      {newAttachment.file.name}
                    </Typography>
                    <Typography sx={{ color: '#9ca3af', fontSize: 14 }}>
                      {(newAttachment.file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
                    <Typography sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>
                      Click to select file
                    </Typography>
                    <Typography sx={{ color: '#9ca3af', fontSize: 14 }}>
                      PDF, ZIP, Sketch, Images, or Design files
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* File Name */}
            <TextField
              label="File Name"
              value={newAttachment.name}
              onChange={(e) => setNewAttachment({ ...newAttachment, name: e.target.value })}
              fullWidth
              required
              disabled={!newAttachment.file}
              sx={{
                '& .MuiInputLabel-root': { color: '#9ca3af' },
                '& .MuiInputBase-root': { color: '#e2e8f0' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4a4a4a' },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                '& .Mui-disabled': {
                  background: '#1a1a1a',
                  '& .MuiInputBase-root': { color: '#6b7280' },
                },
              }}
            />

            {/* Description */}
            <TextField
              label="Description (Optional)"
              value={newAttachment.description}
              onChange={(e) => setNewAttachment({ ...newAttachment, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
              disabled={!newAttachment.file}
              sx={{
                '& .MuiInputLabel-root': { color: '#9ca3af' },
                '& .MuiInputBase-root': { color: '#e2e8f0' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4a4a4a' },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                '& .Mui-disabled': {
                  background: '#1a1a1a',
                  '& .MuiInputBase-root': { color: '#6b7280' },
                },
              }}
            />

            {/* File Preview */}
            {newAttachment.file && (
              <Box>
                <Typography variant="body2" sx={{ color: '#9ca3af', mb: 1 }}>
                  File Preview:
                </Typography>
                <Box sx={{
                  p: 2,
                  background: '#1a1a1a',
                  borderRadius: 1,
                  border: '1px solid #333333',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    background: '#333333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography sx={{ color: '#9ca3af', fontSize: 16 }}>
                      {newAttachment.file.name.includes('.pdf') ? '📄' :
                       newAttachment.file.name.includes('.zip') ? '📦' :
                       newAttachment.file.name.includes('.sketch') ? '🎨' :
                       newAttachment.file.name.match(/\.(png|jpg|jpeg|svg)$/i) ? '🖼️' :
                       newAttachment.file.name.match(/\.(ai|psd)$/i) ? '🎨' : '📄'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}>
                      {newAttachment.file.name}
                    </Typography>
                    <Typography sx={{ color: '#9ca3af', fontSize: 12 }}>
                      {(newAttachment.file.size / 1024 / 1024).toFixed(2)} MB • {newAttachment.file.type || 'Unknown type'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseUploadModal}
            sx={{
              color: '#9ca3af',
              borderColor: '#333333',
              '&:hover': {
                borderColor: '#4a4a4a',
                background: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveNewAttachment}
            disabled={!newAttachment.file || !newAttachment.name}
            variant="contained"
            sx={{
              background: '#2563eb',
              color: '#fff',
              '&:hover': {
                background: '#1e40af',
              },
              '&:disabled': {
                background: '#1a1a1a',
                color: '#6b7280',
              },
            }}
          >
            Upload Asset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 