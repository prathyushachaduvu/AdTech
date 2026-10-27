import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Chip, Button, Checkbox, Tooltip , IconButton, InputAdornment } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';

const TONE_OPTIONS = ['Friendly', 'Bold', 'Sophisticated', 'Humorous', 'Minimalist', 'Inspiring'];
const OBJECTIVE_OPTIONS = [
  { value: 'awareness', label: 'Awareness' },
  { value: 'conversions', label: 'Conversions' },
  { value: 'retargeting', label: 'Retargeting' },
  { value: 'engagement', label: 'Engagement' },
];
const PROMOTE_OPTIONS = [
  { value: 'product', label: 'Product' },
  { value: 'service', label: 'Service' },
];
const DRAFT_KEY = 'campaignWizardStep1Draft';

interface Step1CampaignFoundationProps {
  onDataUpdate?: (data: { isValid: boolean; formData: any }) => void;
  initialData?: any;
}

function isValidDate(date: string) {
  return !isNaN(Date.parse(date));
}

function daysBetween(start: string, end: string) {
  return (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24);
}

const Step1CampaignFoundation: React.FC<Step1CampaignFoundationProps> = ({ onDataUpdate, initialData }) => {
  // State for all fields
  const [campaignName, setCampaignName] = useState('');
  const [objective, setObjective] = useState('');
  const [budget, setBudget] = useState('');
  const [noBudgetCap, setNoBudgetCap] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [brandTones, setBrandTones] = useState<string[]>([]);
  const [brandValues, setBrandValues] = useState('');
  const [mission, setMission] = useState('');
  const [promoteType, setPromoteType] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [customTone, setCustomTone] = useState('');

  // Only show errors after submit attempt
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState('');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        setCampaignName(data.campaignName || '');
        setObjective(data.objective || '');
        setBudget(data.budget || '');
        setNoBudgetCap(!!data.noBudgetCap);
        setStartDate(data.startDate || '');
        setEndDate(data.endDate || '');
        setBrandDescription(data.brandDescription || '');
        setBrandTones(data.brandTones || []);
        setBrandValues(data.brandValues || '');
        setMission(data.mission || '');
        setPromoteType(data.promoteType || '');
        setProductName(data.productName || '');
        setProductDescription(data.productDescription || '');
        setTargetAudience(data.targetAudience || '');
        // Load last save time if available
        if (data.lastSaveTime) {
          setLastSaveTime(data.lastSaveTime);
        }
      } catch {}
    }
  }, []);

  // Auto-save functionality with debouncing
  const saveDraft = useCallback(() => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const draft = {
      campaignName,
      objective,
      budget,
      noBudgetCap,
      startDate,
      endDate,
      brandDescription,
      brandTones,
      brandValues,
      mission,
      promoteType,
      productName,
      productDescription,
      targetAudience,
      lastSaveTime: currentTime,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setIsAutoSaving(false);
    setLastSaveTime(currentTime);
  }, [campaignName, objective, budget, noBudgetCap, startDate, endDate, brandDescription, brandTones, brandValues, mission, promoteType, productName, productDescription, targetAudience]);

  // Debounced auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (campaignName || objective || budget || startDate || endDate || brandDescription || brandTones.length > 0 || brandValues || mission || promoteType || productName || productDescription || targetAudience) {
        setIsAutoSaving(true);
        saveDraft();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [campaignName, objective, budget, noBudgetCap, startDate, endDate, brandDescription, brandTones, brandValues, mission, promoteType, productName, productDescription, targetAudience, saveDraft]);

  // Validation
  const errors: Record<string, string> = {};
  if (!campaignName) errors.campaignName = 'Campaign name is required.';
  else if (campaignName.length > 80) errors.campaignName = 'Max 80 characters.';
  if (!objective) errors.objective = 'Objective is required.';
  if (!noBudgetCap) {
    if (!budget) errors.budget = 'Budget is required.';
    else if (isNaN(Number(budget)) || Number(budget) < 50) errors.budget = 'Minimum $50.';
  }
  if (!startDate) errors.startDate = 'Start date required.';
  else if (!isValidDate(startDate)) errors.startDate = 'Invalid date.';
  if (!endDate) errors.endDate = 'End date required.';
  else if (!isValidDate(endDate)) errors.endDate = 'Invalid date.';
  if (startDate && endDate && isValidDate(startDate) && isValidDate(endDate)) {
    if (new Date(startDate) < new Date(new Date().toDateString())) errors.startDate = 'Start date must be today or later.';
    if (new Date(endDate) <= new Date(startDate)) errors.endDate = 'End date must be after start date.';
    if (daysBetween(startDate, endDate) > 90) errors.endDate = 'Max 90 days.';
  }
  if (!promoteType) errors.promoteType = 'Select what you are promoting.';
  if (promoteType === 'product' && !productName) errors.productName = 'Product name required.';
  if (promoteType === 'product' && !productDescription) errors.productDescription = 'Product description required.';
  if (promoteType === 'service' && !productDescription) errors.productDescription = 'Service summary required.';
  if (!targetAudience) errors.targetAudience = 'Target audience required.';
  if (!brandDescription.trim()) errors.brandDescription = 'Brand description is required.';
  if (brandTones.length === 0) errors.brandTones = 'Select at least one brand tone.';
  if (!brandValues.trim()) errors.brandValues = 'Brand values are required.';

  const isValid = Object.keys(errors).length === 0;

  // Notify parent component of validation status
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({
        isValid,
        formData: {
          campaignName,
          objective,
          budget,
          noBudgetCap,
          startDate,
          endDate,
          brandDescription,
          brandTones,
          brandValues,
          mission,
          promoteType,
          productName,
          productDescription,
          targetAudience,
        }
      });
    }
  }, [isValid, campaignName, objective, budget, noBudgetCap, startDate, endDate, brandDescription, brandTones, brandValues, mission, promoteType, productName, productDescription, targetAudience, onDataUpdate]);

  // Tone chip toggle
  const handleToneToggle = (tone: string) => {
    setBrandTones(prev => prev.includes(tone) ? prev.filter(t => t !== tone) : [...prev, tone]);
  };

  // Handle Continue click
  const handleContinue = () => {
    setSubmitAttempted(true);
    // If valid, proceed to next step (not implemented yet)
  };

  // Clear draft functionality
  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setCampaignName('');
    setObjective('');
    setBudget('');
    setNoBudgetCap(false);
    setStartDate('');
    setEndDate('');
    setBrandDescription('');
    setBrandTones([]);
    setBrandValues('');
    setMission('');
    setPromoteType('');
    setProductName('');
    setProductDescription('');
    setTargetAudience('');
    setLastSaveTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setSnackbarOpen(true);
  };

  // Helper to add gray asterisk to required labels
  const requiredLabel = (label: string) => (
    <span>{label} <span style={{ color: '#bfc9d1' }}>*</span></span>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Campaign Metadata */}
      <Paper elevation={3} sx={{ 
        background: '#23272f', 
        p: 5, 
        borderRadius: 3, 
        border: '1px solid #30363d', 
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
        width: 1000,
        maxWidth: '100%',
        mx: 'auto',
        mb: 4
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 26, color: '#e2e8f0', mb: 3, letterSpacing: 0.2 }}>
          Campaign Metadata
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <TextField label={requiredLabel('Campaign Name')} fullWidth variant="filled"
            value={campaignName}
            onChange={e => setCampaignName(e.target.value)}
            error={!!errors.campaignName && submitAttempted}
            helperText={submitAttempted && errors.campaignName ? errors.campaignName : <span style={{ color: '#7b8794', fontSize: 12 }}>e.g. Summer Promo 2025</span>}
            inputProps={{ maxLength: 80 }}
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
          />
          <TextField label={requiredLabel('Objective')} select fullWidth variant="filled"
            value={objective}
            onChange={e => setObjective(e.target.value)}
            error={!!errors.objective && submitAttempted}
            helperText={submitAttempted && errors.objective ? errors.objective : <span style={{ color: '#7b8794', fontSize: 12 }}>Select campaign objective</span>}
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
          >
            {OBJECTIVE_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, mb: 1, alignItems: 'flex-start' }}>
          <TextField label={requiredLabel('Budget ($)')} fullWidth variant="filled"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            error={!!errors.budget && submitAttempted}
            helperText={submitAttempted && errors.budget ? errors.budget : <span style={{ color: '#7b8794', fontSize: 12 }}>Minimum $50</span>}
            disabled={noBudgetCap}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ ml: 1 }}>
                  <Checkbox
                    checked={noBudgetCap}
                    onChange={e => setNoBudgetCap(e.target.checked)}
                    sx={{ color: '#bfc9d1', p: 0.5 }}
                  />
                  <Typography sx={{ color: '#bfc9d1', fontSize: 14, whiteSpace: 'nowrap', ml: 0.5 }}>No budget cap</Typography>
                </InputAdornment>
              ),
            }}
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
          />
          <TextField label={requiredLabel('Start Date')} type="date" fullWidth variant="filled"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            error={!!errors.startDate && submitAttempted}
            helperText={submitAttempted && errors.startDate ? errors.startDate : ''}
            InputLabelProps={{ shrink: true }}
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
          />
          <TextField label={requiredLabel('End Date')} type="date" fullWidth variant="filled"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            error={!!errors.endDate && submitAttempted}
            helperText={submitAttempted && errors.endDate ? errors.endDate : ''}
            InputLabelProps={{ shrink: true }}
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
          />
        </Box>
      </Paper>
      {/* Brand Profile */}
      <Paper elevation={3} sx={{ background: '#23272f', p: 5, borderRadius: 3, border: '1px solid #30363d', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', width: 1000, maxWidth: '100%', mx: 'auto', mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 26, color: '#e2e8f0', mb: 3, letterSpacing: 0.2 }}>
          Brand Profile
        </Typography>
        <TextField label={requiredLabel('Brand Description')} fullWidth multiline minRows={2} maxRows={4} variant="filled"
          value={brandDescription}
          onChange={e => setBrandDescription(e.target.value)}
          error={!!errors.brandDescription && submitAttempted}
          helperText={submitAttempted && errors.brandDescription ? errors.brandDescription : <span style={{ color: '#7b8794', fontSize: 12 }}>Describe your brand in 2–3 sentences</span>}
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
            mb: 2
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {TONE_OPTIONS.map(tone => (
            <Chip
              key={tone}
              label={tone}
              clickable
              onClick={() => handleToneToggle(tone)}
              sx={{ background: brandTones.includes(tone) ? '#3b82f6' : '#181c20', color: brandTones.includes(tone) ? '#fff' : '#bfc9d1', fontWeight: 500 }}
            />
          ))}
          {brandTones.filter(tone => !TONE_OPTIONS.includes(tone)).map(tone => (
            <Chip
              key={tone}
              label={tone}
              clickable
              onClick={() => handleToneToggle(tone)}
              sx={{ background: '#3b82f6', color: '#fff', fontWeight: 500 }}
            />
          ))}
        </Box>
        <Typography variant="caption" sx={{ color: '#7b8794', mb: 1, display: 'block', fontSize: 13 }}>
          Select at least one brand tone <span style={{ color: '#bfc9d1' }}>(required)</span>. Brand tone helps define the personality and style of your messaging.
        </Typography>
        {submitAttempted && errors.brandTones && (
          <Typography variant="caption" sx={{ color: '#ef4444', mb: 1, display: 'block', fontSize: 13 }}>{errors.brandTones}</Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
          <TextField
            label="Custom Tone"
            variant="filled"
            size="small"
            value={customTone}
            onChange={e => setCustomTone(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && customTone.trim() && !brandTones.includes(customTone.trim())) {
                setBrandTones([...brandTones, customTone.trim()]);
                setCustomTone('');
              }
            }}
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
              width: 200
            }}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ ml: 1, background: '#3b82f6', color: '#fff', textTransform: 'none', boxShadow: 'none', borderRadius: 2, fontWeight: 500, '&:hover': { background: '#2563eb' } }}
                  disabled={!customTone.trim() || brandTones.includes(customTone.trim())}
                  onClick={() => {
                    if (customTone.trim() && !brandTones.includes(customTone.trim())) {
                      setBrandTones([...brandTones, customTone.trim()]);
                      setCustomTone('');
                    }
                  }}
                >
                  Add
                </Button>
              )
            }}
          />
        </Box>
        <TextField label={requiredLabel('Brand Values / Traits')} fullWidth variant="filled"
          value={brandValues}
          onChange={e => setBrandValues(e.target.value)}
          error={!!errors.brandValues && submitAttempted}
          helperText={submitAttempted && errors.brandValues ? errors.brandValues : <span style={{ color: '#7b8794', fontSize: 12 }}>e.g. Privacy-first, Sustainable, Tech-forward</span>}
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
            mb: 2
          }}
        />
        <TextField label="Mission or Tagline (optional)" fullWidth variant="filled"
          value={mission}
          onChange={e => setMission(e.target.value)}
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
            }
          }}
        />
      </Paper>
      {/* Product or Service Context */}
      <Paper elevation={3} sx={{ background: '#23272f', p: 5, borderRadius: 3, border: '1px solid #30363d', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', width: 1000, maxWidth: '100%', mx: 'auto', mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 26, color: '#e2e8f0', mb: 3, letterSpacing: 0.2 }}>
          Product or Service Context
        </Typography>
        <TextField label={requiredLabel('What are you promoting?')} select fullWidth variant="filled"
          value={promoteType}
          onChange={e => setPromoteType(e.target.value)}
          error={!!errors.promoteType && submitAttempted}
          helperText={submitAttempted && errors.promoteType ? errors.promoteType : <span style={{ color: '#7b8794', fontSize: 12 }}></span>}
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
            mb: 2
          }}
        >
          {PROMOTE_OPTIONS.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </TextField>
        {(promoteType === 'product' || promoteType === 'service') && (
          <TextField label={requiredLabel(promoteType === 'product' ? 'Product Name' : 'Service Name')} fullWidth variant="filled"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            error={!!errors.productName && submitAttempted}
            helperText={submitAttempted && errors.productName ? errors.productName : <span style={{ color: '#7b8794', fontSize: 12 }}></span>}
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
              mb: 2
            }}
          />
        )}
        {(promoteType === 'product' || promoteType === 'service') && (
          <TextField label={requiredLabel(promoteType === 'product' ? 'Product Description' : 'Service Summary')} fullWidth multiline minRows={2} maxRows={4} variant="filled"
            value={productDescription}
            onChange={e => setProductDescription(e.target.value)}
            error={!!errors.productDescription && submitAttempted}
            helperText={submitAttempted && errors.productDescription ? errors.productDescription : <span style={{ color: '#7b8794', fontSize: 12 }}></span>}
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
              mb: 2
            }}
          />
        )}
        <TextField label={requiredLabel('Target Audience Description')} fullWidth variant="filled"
          value={targetAudience}
          onChange={e => setTargetAudience(e.target.value)}
          error={!!errors.targetAudience && submitAttempted}
          helperText={submitAttempted && errors.targetAudience ? errors.targetAudience : <span style={{ color: '#7b8794', fontSize: 12 }}>e.g. Millennial professionals in tech</span>}
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
            }
          }}
        />
      </Paper>
      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Clear all form data and saved draft" arrow>
            <IconButton onClick={handleClearDraft} sx={{ color: '#64748b', '&:hover': { color: '#ef4444' } }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          {/* Fixed save status indicator */}
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

export default Step1CampaignFoundation; 