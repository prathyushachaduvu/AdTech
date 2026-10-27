import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Paper, Typography, Button, TextField, IconButton, Tooltip, Divider, Snackbar, LinearProgress, Checkbox, Dialog, DialogContent
} from '@mui/material';
import { InfoOutlined, AutoAwesome, Refresh, CheckCircle, ArrowBack, ArrowForward, Save, Edit, Delete as DeleteIcon, Campaign, Flag, Group } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

// Types
interface Creative {
  id: string;
  image?: string; // URL or base64, fallback to placeholder
  description: string;
  selected: boolean;
}

interface Step4CreativeGenerationProps {
  onDataUpdate?: (data: { isValid: boolean; formData: any }) => void;
  initialData?: any;
  campaignRecap: {
    name: string;
    objective: string;
    audience: string;
    productImage?: string;
  };
  onEditRecap?: () => void;
  onBack: () => void;
  onContinue: (data: any) => void;
}

const DRAFT_KEY = 'campaignWizardStep4Draft';

const mockCreatives = (): Creative[] => [
  {
    id: 'creative-1',
    image: '/mock-creatives/1.jpeg',
    description: 'Product hero shot with summer vibes and tech elements',
    selected: true,
  },
  {
    id: 'creative-2',
    image: '/mock-creatives/2.jpeg',
    description: 'Lifestyle image with professionals using product in modern office',
    selected: false,
  },
  {
    id: 'creative-3',
    image: '/mock-creatives/3.jpeg',
    description: 'Abstract tech pattern with product logo and summer color scheme',
    selected: false,
  },
];

const RecapItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
    <Box sx={{ color: '#3b82f6', display: 'flex', alignItems: 'center' }}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ color: '#bfc9d1', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, mb: 0.5 }}>{label}</Typography>
      <Typography sx={{ color: '#e2e8f0', fontWeight: 700, fontSize: 17, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</Typography>
    </Box>
  </Box>
);

const Step4CreativeGeneration: React.FC<Step4CreativeGenerationProps> = ({
  onDataUpdate,
  initialData,
  campaignRecap,
  onEditRecap,
  onBack,
  onContinue,
}) => {
  // State
  const [prompt, setPrompt] = useState(initialData?.prompt || '');
  const [creatives, setCreatives] = useState<Creative[]>(() => initialData?.creatives || mockCreatives());
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [previewCreative, setPreviewCreative] = useState<Creative | null>(null);

  // Autosave draft
  const saveDraft = useCallback(() => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const draft = {
      prompt,
      creatives,
      lastSaveTime: currentTime,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setIsAutoSaving(false);
    setLastSaveTime(currentTime);
  }, [prompt, creatives]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsAutoSaving(true);
      saveDraft();
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [prompt, creatives, saveDraft]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        setPrompt(data.prompt || '');
        setCreatives(data.creatives || mockCreatives());
        if (data.lastSaveTime) setLastSaveTime(data.lastSaveTime);
      } catch {}
    }
  }, []);

  // Validation
  const isValid = creatives.some(c => c.selected);

  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({ isValid, formData: { prompt, creatives } });
    }
  }, [isValid, prompt, creatives, onDataUpdate]);

  // Handlers
  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 300) setPrompt(e.target.value);
  };

  const handleSelectCreative = (id: string) => {
    setCreatives(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  };

  const handleRegenerateAll = () => {
    setRegenerating(true);
    setTimeout(() => {
      setCreatives(mockCreatives());
      setRegenerating(false);
    }, 1200);
  };

  const handleRegenerateOne = (id: string) => {
    setCreatives(prev => prev.map(c =>
      c.id === id
        ? { ...mockCreatives().find(m => m.id === id)!, selected: false }
        : c
    ));
  };

  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setPrompt('');
    setCreatives(mockCreatives());
    setLastSaveTime('');
    setSnackbarOpen(true);
  };

  // UI
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Campaign Recap */}
      <Paper elevation={3} sx={{ background: '#23272f', p: 5, borderRadius: 3, border: '1px solid #30363d', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', maxWidth: 1000, mx: 'auto', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <InfoOutlined sx={{ color: '#64748b', mr: 1 }} />
          <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: 22, flex: 1 }}>Campaign Recap</Typography>
          {onEditRecap && (
            <Button onClick={onEditRecap} startIcon={<Edit />} size="small" sx={{ color: '#bfc9d1', borderColor: '#374151', ml: 2, borderRadius: 2, textTransform: 'none', '&:hover': { color: '#fff', borderColor: '#3b82f6' } }} variant="outlined">Edit</Button>
          )}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
          <Box sx={{ bgcolor: '#181c20', borderRadius: 2, p: 2 }}>
            <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Campaign Name</Typography>
            <Typography sx={{ color: '#e2e8f0', fontWeight: 500 }}>{campaignRecap.name}</Typography>
          </Box>
          <Box sx={{ bgcolor: '#181c20', borderRadius: 2, p: 2 }}>
            <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Objective</Typography>
            <Typography sx={{ color: '#e2e8f0', fontWeight: 500 }}>{campaignRecap.objective}</Typography>
          </Box>
          <Box sx={{ bgcolor: '#181c20', borderRadius: 2, p: 2 }}>
            <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Target Audience</Typography>
            <Typography sx={{ color: '#e2e8f0', fontWeight: 500 }}>{campaignRecap.audience}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* AI-Generated Creatives */}
      <Paper elevation={3} sx={{ background: '#23272f', p: 5, borderRadius: 3, border: '1px solid #30363d', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', maxWidth: 1000, mx: 'auto', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AutoAwesome sx={{ color: '#818cf8', mr: 1 }} />
            <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: 22 }}>AI-Generated Creatives</Typography>
          </Box>
          <Button onClick={handleRegenerateAll} startIcon={<Refresh />} disabled={regenerating} sx={{ color: '#818cf8', borderColor: '#374151', borderRadius: 2, textTransform: 'none', '&:hover': { color: '#fff', borderColor: '#818cf8' } }} variant="outlined">
            Regenerate All
          </Button>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {creatives.map((creative, idx) => (
            <Paper key={creative.id} elevation={creative.selected ? 8 : 2} sx={{
              background: '#181c20',
              borderRadius: 3,
              border: creative.selected ? '2px solid #3b82f6' : '1px solid #374151',
              boxShadow: creative.selected ? '0 4px 24px 0 rgba(129,140,248,0.10)' : '0 2px 8px 0 rgba(0,0,0,0.10)',
              p: 3,
              position: 'relative',
              transition: 'box-shadow 0.2s, border 0.2s',
              minHeight: 340,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              cursor: 'pointer',
              '&:hover': { boxShadow: '0 6px 32px 0 rgba(129,140,248,0.18)' }
            }}>
              {/* Visual Placeholder with floating Use This checkbox */}
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Box
                  sx={{ width: '100%', height: 260, bgcolor: 'transparent', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px 0 rgba(59,130,246,0.10)', position: 'relative', cursor: 'zoom-in' }}
                  onClick={() => setPreviewCreative(creative)}
                >
                  {creative.image ? (
                    <img src={creative.image} alt="Creative visual" style={{ maxWidth: '100%', maxHeight: 250, borderRadius: 12 }} />
                  ) : (
                    <Typography sx={{ color: '#e2e8f0', fontSize: 18, textAlign: 'center', px: 2 }}>{creative.description}</Typography>
                  )}
                  {/* Floating Use This checkbox */}
                  <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, bgcolor: 'rgba(24,28,32,0.85)', borderRadius: '50%' }}>
                    <Checkbox
                      checked={creative.selected}
                      onChange={() => handleSelectCreative(creative.id)}
                      sx={{ color: creative.selected ? '#3b82f6' : '#64748b', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5 }}
                      icon={<CheckCircle sx={{ fontSize: 28, color: '#64748b' }} />}
                      checkedIcon={<CheckCircle sx={{ fontSize: 28, color: '#3b82f6' }} />}
                      onClick={e => e.stopPropagation()}
                    />
                  </Box>
                </Box>
              </Box>
              {/* Regenerate button below image */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Button onClick={() => handleRegenerateOne(creative.id)} startIcon={<Refresh />} size="small" sx={{ color: '#818cf8', borderColor: '#374151', borderRadius: 2, textTransform: 'none', '&:hover': { color: '#fff', borderColor: '#818cf8' } }} variant="outlined">
                  Regenerate
                </Button>
              </Box>
              {/* Optional: Small caption/description below image */}
              <Box sx={{ minHeight: 24 }}>
                <Typography sx={{ color: '#bfc9d1', fontSize: 13, textAlign: 'center' }}>AI-generated preview</Typography>
              </Box>
            </Paper>
          ))}
        </Box>
        {/* Image Preview Dialog */}
        <Dialog
          open={!!previewCreative}
          onClose={() => setPreviewCreative(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: '#181c20',
              borderRadius: 3,
              boxShadow: '0 8px 40px 0 rgba(59,130,246,0.18)',
              p: 0,
              maxWidth: '90vw',
              maxHeight: '90vh',
              m: 0
            }
          }}
        >
          <DialogContent sx={{ p: 0, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#181c20' }}>
            <IconButton
              aria-label="close"
              onClick={() => setPreviewCreative(null)}
              sx={{ position: 'absolute', top: 12, right: 12, color: '#bfc9d1', zIndex: 10 }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
            {previewCreative && (
              <>
                <Box sx={{ width: '100%', maxWidth: 700, maxHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4, mb: 2, overflow: 'auto' }}>
                  {previewCreative.image ? (
                    <img src={previewCreative.image} alt="Creative preview" style={{ maxWidth: '100%', maxHeight: '70vh', width: 'auto', height: 'auto', borderRadius: 16, boxShadow: '0 4px 32px 0 rgba(59,130,246,0.18)', display: 'block', margin: '0 auto' }} />
                  ) : (
                    <Typography sx={{ color: '#e2e8f0', fontSize: 22, textAlign: 'center', px: 4 }}>{previewCreative.description}</Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                  <Checkbox
                    checked={previewCreative.selected}
                    onChange={() => {
                      handleSelectCreative(previewCreative.id);
                      setPreviewCreative({ ...previewCreative, selected: !previewCreative.selected });
                    }}
                    sx={{ color: previewCreative.selected ? '#3b82f6' : '#64748b', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5 }}
                    icon={<CheckCircle sx={{ fontSize: 32, color: '#64748b' }} />}
                    checkedIcon={<CheckCircle sx={{ fontSize: 32, color: '#3b82f6' }} />}
                  />
                  <Typography sx={{ color: '#bfc9d1', fontSize: 18 }}>Use This</Typography>
                  <Button onClick={() => { handleRegenerateOne(previewCreative.id); setPreviewCreative(null); }} startIcon={<Refresh />} size="medium" sx={{ color: '#818cf8', borderColor: '#374151', borderRadius: 2, textTransform: 'none', '&:hover': { color: '#fff', borderColor: '#818cf8' }, ml: 2 }} variant="outlined">
                    Regenerate
                  </Button>
                </Box>
                <Typography sx={{ color: '#bfc9d1', fontSize: 15, textAlign: 'center', mb: 2 }}>AI-generated preview</Typography>
              </>
            )}
          </DialogContent>
        </Dialog>
        {/* Context Info */}
        <Box sx={{ mt: 4, p: 3, bgcolor: '#23272f', border: '1px solid #374151', borderRadius: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <InfoOutlined sx={{ color: '#818cf8', mt: 0.5 }} />
          <Box>
            <Typography sx={{ color: '#bfc9d1', fontSize: 15, fontWeight: 600, mb: 0.5 }}>Creative Generation Context</Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: 13 }}>
              These creatives are generated using your brand tone, product description, and target audience. Each variant explores different visual approaches while maintaining brand alignment.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Clear all form data and saved draft" arrow>
            <IconButton onClick={handleClearDraft} sx={{ color: '#64748b', '&:hover': { color: '#ef4444' } }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#64748b',
            fontSize: 12,
            fontWeight: 400,
            background: 'rgba(100, 116, 139, 0.1)',
            border: '1px solid rgba(100, 116, 139, 0.2)',
            borderRadius: 1,
            px: 2,
            py: 0.5
          }}>
            {isAutoSaving ? (
              <>
                <Box sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#3b82f6',
                  animation: 'pulse 1.5s infinite'
                }} />
                Saving...
              </>
            ) : (
              <>
                ✓ Last saved {lastSaveTime || 'never'}
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Snackbar for clear draft notification */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Draft cleared"
      />
    </Box>
  );
};

export default Step4CreativeGeneration; 