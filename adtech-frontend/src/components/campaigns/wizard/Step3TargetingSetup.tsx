import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Button, TextField,  MenuItem, Slider, Chip, Autocomplete, IconButton, Tooltip, Snackbar } from '@mui/material';
import { Search, Close, Lightbulb, AutoAwesome, Delete as DeleteIcon } from '@mui/icons-material';

const audienceTypes = [
  { value: 'general', label: 'General' },
  { value: 'niche', label: 'Niche' },
  { value: 'retargeting', label: 'Retargeting' },
  { value: 'lookalike', label: 'Lookalike' },
  { value: 'custom', label: 'Custom' },
];

const DRAFT_KEY = 'campaignWizardStep3Draft';

type Step3TargetingSetupProps = {
  onDataUpdate: (data: { isValid: boolean; formData: any }) => void;
  initialData?: any;
};

const Step3TargetingSetup: React.FC<Step3TargetingSetupProps> = ({ onDataUpdate, initialData }) => {
  // State for all fields
  const [audienceType, setAudienceType] = useState('');
  const [ageRange, setAgeRange] = useState<[number, number]>([25, 45]);
  const [geoTargets, setGeoTargets] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [keywords, setKeywords] = useState('');
  const [audienceDesc, setAudienceDesc] = useState('');

  // Autosave and draft
  const [lastSaveTime, setLastSaveTime] = useState('');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // AI Suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<{ 
    interests: string[];
    ageRange: boolean;
    audienceType: boolean;
    keywords: boolean;
  }>({ 
    interests: [], 
    ageRange: false, 
    audienceType: false, 
    keywords: false 
  });
  
  const aiSuggestions = {
    interests: ['Eco-friendly products', 'Sustainable living', 'Health & wellness', 'Technology', 'Urban lifestyle'],
    keywords: 'eco-conscious, sustainable products, green living, environmentally friendly',
    ageRange: [25, 40],
    audienceType: 'niche'
  };

  // Age range presets
  const agePresets = [
    { label: 'Young Adults', range: [18, 25], description: 'Gen Z & Young Millennials' },
    { label: 'Millennials', range: [25, 40], description: 'Digital Natives' },
    { label: 'Gen X', range: [40, 55], description: 'Established Professionals' },
    { label: 'Older Adults', range: [55, 70], description: 'Mature Consumers' },
    { label: 'All Adults', range: [18, 70], description: 'Complete Age Range' },
  ];

  // Geographic presets and popular locations
  const geoPresets = [
    { label: 'North America', locations: ['United States', 'Canada', 'Mexico'] },
    { label: 'Europe', locations: ['United Kingdom', 'Germany', 'France', 'Spain', 'Italy'] },
    { label: 'Asia-Pacific', locations: ['Japan', 'South Korea', 'Australia', 'Singapore', 'India'] },
  ];

  const popularLocations = [
    // Countries
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway',
    'Japan', 'South Korea', 'Australia', 'New Zealand', 'Singapore', 'India', 'China', 'Brazil', 'Mexico', 'Argentina',
    // Major US Cities
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
    'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
    // Major International Cities
    'London, UK', 'Paris, France', 'Berlin, Germany', 'Madrid, Spain', 'Rome, Italy', 'Amsterdam, Netherlands', 'Stockholm, Sweden', 'Oslo, Norway',
    'Tokyo, Japan', 'Seoul, South Korea', 'Sydney, Australia', 'Melbourne, Australia', 'Singapore', 'Mumbai, India', 'Delhi, India', 'Beijing, China', 'Shanghai, China',
    'São Paulo, Brazil', 'Mexico City, Mexico', 'Buenos Aires, Argentina',
    // US States
    'California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois', 'Ohio', 'Georgia', 'North Carolina', 'Michigan',
    'New Jersey', 'Virginia', 'Washington', 'Arizona', 'Massachusetts', 'Tennessee', 'Indiana', 'Missouri', 'Maryland', 'Colorado',
    'Wisconsin', 'Minnesota', 'South Carolina', 'Alabama', 'Louisiana', 'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Utah',
    'Iowa', 'Nevada', 'Arkansas', 'Mississippi', 'Kansas', 'New Mexico', 'Nebraska', 'West Virginia', 'Idaho', 'Hawaii',
    'New Hampshire', 'Maine', 'Montana', 'Rhode Island', 'Delaware', 'South Dakota', 'North Dakota', 'Alaska', 'Vermont', 'Wyoming'
  ];

  // Handle age preset selection
  const handleAgePreset = (preset: typeof agePresets[0]) => {
    setAgeRange(preset.range as [number, number]);
  };

  // Handle manual age input
  const handleAgeInputChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 18;
    const clampedValue = Math.max(18, Math.min(70, numValue));
    
    if (index === 0) {
      setAgeRange([clampedValue, Math.max(clampedValue + 5, ageRange[1])]);
    } else {
      setAgeRange([ageRange[0], Math.max(ageRange[0] + 5, clampedValue)]);
    }
  };

  // Handle geographic preset selection
  const handleGeoPreset = (preset: typeof geoPresets[0]) => {
    setGeoTargets(prev => {
      const newTargets = [...prev];
      preset.locations.forEach(location => {
        if (!newTargets.includes(location)) {
          newTargets.push(location);
        }
      });
      return newTargets;
    });
  };

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        setAudienceType(data.audienceType || '');
        setAgeRange(data.ageRange || [25, 45]);
        setGeoTargets(data.geoTargets || []);
        setInterests(data.interests || []);
        setKeywords(data.keywords || '');
        setAudienceDesc(data.audienceDesc || '');
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
      audienceType,
      ageRange,
      geoTargets,
      interests,
      keywords,
      audienceDesc,
      lastSaveTime: currentTime,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setIsAutoSaving(false);
    setLastSaveTime(currentTime);
  }, [audienceType, ageRange, geoTargets, interests, keywords, audienceDesc]);

  // Debounced auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (audienceType || ageRange[0] !== 25 || ageRange[1] !== 45 || geoTargets.length > 0 || interests.length > 0 || keywords || audienceDesc) {
        setIsAutoSaving(true);
        saveDraft();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [audienceType, ageRange, geoTargets, interests, keywords, audienceDesc, saveDraft]);

  // Validation
  const errors: Record<string, string> = {};
  if (!audienceType) errors.audienceType = 'Audience type is required.';
  if (ageRange[1] - ageRange[0] < 5) errors.ageRange = 'Age range must be at least 5 years.';
  if (interests.length > 10) errors.interests = 'Maximum 10 interests allowed.';
  if (keywords.length > 500) errors.keywords = 'Keywords must be under 500 characters.';

  const isValid = Object.keys(errors).length === 0;

  // Notify parent component of validation status
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({
        isValid,
        formData: {
          audienceType,
          ageRange,
          geoTargets,
          interests,
          keywords,
          audienceDesc,
        }
      });
    }
  }, [isValid, audienceType, ageRange, geoTargets, interests, keywords, audienceDesc, onDataUpdate]);

  // Clear draft functionality
  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setAudienceType('');
    setAgeRange([25, 45]);
    setGeoTargets([]);
    setInterests([]);
    setKeywords('');
    setAudienceDesc('');
    setLastSaveTime('');
    setSnackbarOpen(true);
  };

  // Helper function for required labels
  const requiredLabel = (label: string) => (
    <span>{label} <span style={{ color: '#bfc9d1' }}>*</span></span>
  );

  // AI Suggestions handlers
  const toggleInterestSelection = (interest: string) => {
    setSelectedSuggestions(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const applyAllSuggestions = () => {
    setAudienceType('niche');
    setAgeRange([25, 40]);
    setInterests(aiSuggestions.interests);
    setKeywords(aiSuggestions.keywords);
    setShowSuggestions(false);
  };

  const applySelectedSuggestions = () => {
    let applied = false;
    
    if (selectedSuggestions.interests.length > 0) {
      setInterests(prev => [...prev, ...selectedSuggestions.interests]);
      applied = true;
    }
    
    if (selectedSuggestions.ageRange) {
      setAgeRange(aiSuggestions.ageRange as [number, number]);
      applied = true;
    }
    
    if (selectedSuggestions.audienceType) {
      setAudienceType(aiSuggestions.audienceType);
      applied = true;
    }
    
    if (selectedSuggestions.keywords) {
      setKeywords(aiSuggestions.keywords);
      applied = true;
    }
    
    if (applied) {
      setSelectedSuggestions({ 
        interests: [], 
        ageRange: false, 
        audienceType: false, 
        keywords: false 
      });
    }
  };

  const getSelectedCount = () => {
    return selectedSuggestions.interests.length + 
           (selectedSuggestions.ageRange ? 1 : 0) + 
           (selectedSuggestions.audienceType ? 1 : 0) + 
           (selectedSuggestions.keywords ? 1 : 0);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Manual Targeting Configuration */}
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
          Manual Targeting Configuration
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Audience Type */}
          <Box>
            <TextField 
              label={requiredLabel('Audience Type')} 
              select 
              fullWidth 
              variant="filled"
              value={audienceType}
              onChange={e => setAudienceType(e.target.value)}
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
              {audienceTypes.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5 }}>Define the scope of your target audience</Typography>
          </Box>

          {/* Age Range */}
          <Box>
            <Typography sx={{ color: '#bfc9d1', fontWeight: 500, mb: 1 }}>{requiredLabel('Target Age Range')}</Typography>
            
            {/* Age Presets */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block' }}>Quick Select:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {agePresets.map((preset) => (
                  <Chip
                    key={preset.label}
                    label={preset.label}
                    clickable
                    onClick={() => handleAgePreset(preset)}
                    sx={{ 
                      background: ageRange[0] === preset.range[0] && ageRange[1] === preset.range[1] ? '#3b82f6' : '#181c20', 
                      color: ageRange[0] === preset.range[0] && ageRange[1] === preset.range[1] ? '#fff' : '#bfc9d1', 
                      fontWeight: 500,
                      '&:hover': {
                        background: ageRange[0] === preset.range[0] && ageRange[1] === preset.range[1] ? '#2563eb' : '#23272f'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Manual Age Input */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
              <TextField
                key={`min-age-${ageRange[0]}-${ageRange[1]}`}
                label="Min Age"
                type="number"
                variant="filled"
                size="small"
                value={ageRange[0]}
                onChange={(e) => handleAgeInputChange(0, e.target.value)}
                inputProps={{ min: 18, max: ageRange[1] - 5 }}
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
                  width: 120
                }}
              />
              <Typography sx={{ color: '#64748b', fontWeight: 500 }}>to</Typography>
              <TextField
                key={`max-age-${ageRange[0]}-${ageRange[1]}`}
                label="Max Age"
                type="number"
                variant="filled"
                size="small"
                value={ageRange[1]}
                onChange={(e) => handleAgeInputChange(1, e.target.value)}
                                 inputProps={{ min: ageRange[0] + 5, max: 70 }}
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
                  width: 120
                }}
              />
              
            </Box>

            {/* Enhanced Slider */}
            <Box sx={{ px: 2, py: 2 }}>
              <Slider
                key={`slider-${ageRange[0]}-${ageRange[1]}`}
                value={ageRange}
                min={18}
                max={70}
                onChange={(_, v) => setAgeRange(v as [number, number])}
                valueLabelDisplay="auto"
                sx={{ 
                  color: '#3b82f6',
                  '& .MuiSlider-thumb': {
                    width: 20,
                    height: 20,
                    backgroundColor: '#3b82f6',
                    border: '2px solid #fff',
                    '&:hover': {
                      boxShadow: '0 0 0 8px rgba(59, 130, 246, 0.16)'
                    }
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#3b82f6',
                    border: 'none'
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#374151'
                  },
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: '#3b82f6',
                    color: '#fff'
                  }
                }}
              />
                             <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, color: '#64748b', fontSize: 12 }}>
                 <span>18</span>
                 <span>25</span>
                 <span>35</span>
                 <span>45</span>
                 <span>55</span>
                 <span>70</span>
               </Box>
            </Box>

            {/* Age Range Summary */}
            <Box 
              key={`summary-${ageRange[0]}-${ageRange[1]}`}
              sx={{ 
                bgcolor: '#181c20', 
                p: 2, 
                borderRadius: 2, 
                border: '1px solid #374151',
                mt: 2
              }}
            >
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                Selected Age Range
              </Typography>
              <Typography sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: 18 }}>
                {ageRange[0]} - {ageRange[1]} years old
              </Typography>
                             <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                 {ageRange[1] - ageRange[0]} year span • {ageRange[0] >= 18 && ageRange[0] <= 25 ? 'Young Adults' : 
                  ageRange[0] >= 25 && ageRange[0] <= 40 ? 'Millennials' : 
                  ageRange[0] >= 40 && ageRange[0] <= 55 ? 'Gen X' : 
                  ageRange[0] >= 55 ? 'Older Adults' : 'Mixed'} demographic
               </Typography>
            </Box>
          </Box>

          {/* Geographic Targeting */}
          <Box>
            <Typography sx={{ color: '#bfc9d1', fontWeight: 500, mb: 1 }}>Geographic Targeting</Typography>
            


            {/* Location Input with Suggestions */}
            <Autocomplete
              key={geoTargets.length} // Force re-render when geoTargets are cleared
              multiple
              freeSolo
              options={popularLocations}
              value={geoTargets}
              onChange={(_, v) => setGeoTargets(v)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="filled"
                    label={option}
                    {...getTagProps({ index })}
                    sx={{ 
                      bgcolor: '#181c20', 
                      color: '#e2e8f0', 
                      border: '1px solid #374151', 
                      fontWeight: 500,
                      '& .MuiChip-deleteIcon': {
                        color: '#e2e8f0 !important',
                        '&:hover': {
                          color: '#fff !important'
                        }
                      }
                    }}
                    deleteIcon={<Close />}
                  />
                ))
              }
              renderInput={params => (
                <TextField
                  {...params}
                  variant="filled"
                  placeholder="Type country, region, or city..."
                  InputProps={{ ...params.InputProps, endAdornment: <Search sx={{ color: '#64748b' }} /> }}
                  sx={{ 
                    input: { color: '#e2e8f0' }, 
                    background: 'transparent', 
                    borderRadius: 2,
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
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#e2e8f0', fontSize: 14 }}>
                      {option}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: 11 }}>
                      {option.includes(',') ? 'City' : option.length > 15 ? 'Country' : 'State/Region'}
                    </Typography>
                  </Box>
                </Box>
              )}
              ListboxProps={{
                sx: {
                  bgcolor: '#23272f',
                  border: '1px solid #374151',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  '& .MuiAutocomplete-option': {
                    color: '#e2e8f0',
                    '&:hover': {
                      bgcolor: '#181c20'
                    },
                    '&.Mui-focused': {
                      bgcolor: '#181c20'
                    }
                  }
                }
              }}
            />
            
            {/* Geographic Summary */}
            {geoTargets.length > 0 && (
              <Box 
                key={`geo-summary-${geoTargets.length}`}
                sx={{ 
                  bgcolor: '#181c20', 
                  p: 2, 
                  borderRadius: 2, 
                  border: '1px solid #374151',
                  mt: 2
                }}
              >
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                  Selected Locations
                </Typography>
                <Typography sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}>
                  {geoTargets.length} location{geoTargets.length !== 1 ? 's' : ''} selected
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                  {geoTargets.slice(0, 3).join(', ')}{geoTargets.length > 3 ? ` +${geoTargets.length - 3} more` : ''}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Interests / Tags */}
          <Box>
            <Typography sx={{ color: '#bfc9d1', fontWeight: 500, mb: 1 }}>Interests / Tags</Typography>
            <Autocomplete
              key={interests.length} // Force re-render when interests are cleared
              multiple
              freeSolo
              options={[]}
              value={interests}
              onChange={(_, v) => setInterests(v)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="filled"
                    label={option}
                    {...getTagProps({ index })}
                    sx={{ 
                      bgcolor: '#181c20', 
                      color: '#e2e8f0', 
                      border: '1px solid #374151', 
                      fontWeight: 500,
                      '& .MuiChip-deleteIcon': {
                        color: '#e2e8f0 !important',
                        '&:hover': {
                          color: '#fff !important'
                        }
                      }
                    }}
                    deleteIcon={<Close />}
                  />
                ))
              }
              renderInput={params => (
                <TextField
                  {...params}
                  variant="filled"
                  placeholder="Type and press Enter to add interests..."
                  sx={{ 
                    input: { color: '#e2e8f0' }, 
                    background: 'transparent', 
                    borderRadius: 2,
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
              )}
            />
            <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5 }}>Up to 10 interests allowed</Typography>
          </Box>

          {/* Keywords / Contextual Triggers */}
          <Box>
            <Typography sx={{ color: '#bfc9d1', fontWeight: 500, mb: 1 }}>Keywords / Contextual Triggers</Typography>
            <TextField
              fullWidth
              variant="filled"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. eco-conscious, remote work, budget-friendly"
              sx={{ 
                input: { color: '#e2e8f0' }, 
                background: 'transparent', 
                borderRadius: 2,
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
            <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5 }}>Comma-separated keywords for contextual targeting</Typography>
          </Box>

          {/* Audience Description */}
          <Box>
            <Typography sx={{ color: '#bfc9d1', fontWeight: 500, mb: 1 }}>Target Audience Description (Optional)</Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              variant="filled"
              value={audienceDesc}
              onChange={(e) => setAudienceDesc(e.target.value)}
              placeholder="Describe your ideal audience in your own words..."
              sx={{ 
                input: { color: '#e2e8f0' }, 
                textarea: { color: '#e2e8f0' },
                background: 'transparent', 
                borderRadius: 2,
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
            <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5 }}>Example: "Young parents in urban areas who care about health and sustainability"</Typography>
          </Box>
        </Box>
      </Paper>

      {/* AI-Powered Targeting Suggestions */}
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
          AI-Powered Targeting Suggestions
        </Typography>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Button 
            variant="contained" 
            onClick={() => setShowSuggestions(true)}
            disabled={showSuggestions}
            sx={{ 
              bgcolor: showSuggestions ? '#374151' : '#3b82f6', 
              color: '#fff', 
              borderRadius: 2, 
              px: 4, 
              py: 1.5, 
              fontWeight: 600, 
              boxShadow: 'none', 
              '&:hover': { bgcolor: showSuggestions ? '#374151' : '#2563eb' },
              '&:disabled': { bgcolor: '#374151', color: '#64748b' }
            }}
          >
            <AutoAwesome sx={{ mr: 1 }} /> 
            {showSuggestions ? 'Suggestions Generated' : 'Generate Suggested Targeting'}
          </Button>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
            {showSuggestions ? 'AI suggestions ready to apply' : 'Based on your brand tone and product details from previous steps'}
          </Typography>
        </Box>
        
        {/* Suggestion Panel */}
        {showSuggestions && (
          <Paper sx={{ border: '1.5px solid #818cf8', background: '#23272f', borderRadius: 2, p: 4, boxShadow: 6, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#e2e8f0', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Lightbulb sx={{ mr: 1, color: '#818cf8' }} /> AI Suggestions
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Generated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 2 }}>
              <Box>
                <Typography sx={{ color: '#bfc9d1', fontWeight: 500, mb: 0.5 }}>Suggested Age Range</Typography>
                <Box 
                  onClick={() => setSelectedSuggestions(prev => ({ ...prev, ageRange: !prev.ageRange }))}
                  sx={{ 
                    bgcolor: selectedSuggestions.ageRange ? '#3b82f6' : '#181c20', 
                    px: 2, 
                    py: 1, 
                    borderRadius: 1, 
                    color: selectedSuggestions.ageRange ? '#fff' : '#e2e8f0', 
                    fontSize: 15,
                    cursor: 'pointer',
                    border: selectedSuggestions.ageRange ? '1px solid #3b82f6' : '1px solid #374151',
                    '&:hover': {
                      bgcolor: selectedSuggestions.ageRange ? '#2563eb' : '#23272f'
                    }
                  }}
                >
                  {aiSuggestions.ageRange[0]} - {aiSuggestions.ageRange[1]}
                </Box>
              </Box>
              <Box>
                <Typography sx={{ color: '#bfc9d1', fontWeight: 500, mb: 0.5 }}>Audience Type</Typography>
                <Box 
                  onClick={() => setSelectedSuggestions(prev => ({ ...prev, audienceType: !prev.audienceType }))}
                  sx={{ 
                    bgcolor: selectedSuggestions.audienceType ? '#3b82f6' : '#181c20', 
                    px: 2, 
                    py: 1, 
                    borderRadius: 1, 
                    color: selectedSuggestions.audienceType ? '#fff' : '#e2e8f0', 
                    fontSize: 15,
                    cursor: 'pointer',
                    border: selectedSuggestions.audienceType ? '1px solid #3b82f6' : '1px solid #374151',
                    '&:hover': {
                      bgcolor: selectedSuggestions.audienceType ? '#2563eb' : '#23272f'
                    }
                  }}
                >
                  {aiSuggestions.audienceType.charAt(0).toUpperCase() + aiSuggestions.audienceType.slice(1)}
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: '#bfc9d1', fontWeight: 500, mb: 0.5 }}>Suggested Interests</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {aiSuggestions.interests.map((interest, index) => (
                  <Chip 
                    key={index}
                    label={interest} 
                    sx={{ 
                      bgcolor: selectedSuggestions.interests.includes(interest) ? '#3b82f6' : '#181c20', 
                      color: selectedSuggestions.interests.includes(interest) ? '#fff' : '#e2e8f0', 
                      border: '1px solid #374151', 
                      fontWeight: 500,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: selectedSuggestions.interests.includes(interest) ? '#2563eb' : '#23272f'
                      }
                    }}
                    onClick={() => toggleInterestSelection(interest)}
                  />
                ))}
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: '#bfc9d1', fontWeight: 500, mb: 0.5 }}>Suggested Keywords</Typography>
              <Box 
                onClick={() => setSelectedSuggestions(prev => ({ ...prev, keywords: !prev.keywords }))}
                sx={{ 
                  bgcolor: selectedSuggestions.keywords ? '#3b82f6' : '#181c20', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 1, 
                  color: selectedSuggestions.keywords ? '#fff' : '#e2e8f0', 
                  fontSize: 15,
                  cursor: 'pointer',
                  border: selectedSuggestions.keywords ? '1px solid #3b82f6' : '1px solid #374151',
                  '&:hover': {
                    bgcolor: selectedSuggestions.keywords ? '#2563eb' : '#23272f'
                  }
                }}
              >
                {aiSuggestions.keywords}
              </Box>
            </Box>
            
            <Box sx={{ bgcolor: '#181c20', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography sx={{ color: '#bfc9d1', fontWeight: 500, mb: 0.5 }}>AI Reasoning</Typography>
              <Typography variant="body2" sx={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.5 }}>
                Based on your brand's focus on sustainability and eco-friendly products, we suggest targeting environmentally conscious consumers aged 25-40 who are interested in sustainable living and urban lifestyle choices.
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                size="small" 
                onClick={applyAllSuggestions}
                sx={{ bgcolor: '#16a34a', color: '#fff', '&:hover': { bgcolor: '#15803d' } }}
              >
                Apply All Suggestions
              </Button>
                             <Button 
                 variant="outlined" 
                 size="small" 
                 onClick={applySelectedSuggestions}
                 disabled={getSelectedCount() === 0}
                 sx={{ 
                   color: getSelectedCount() > 0 ? '#64748b' : '#374151', 
                   borderColor: getSelectedCount() > 0 ? '#374151' : '#374151', 
                   '&:hover': { 
                     borderColor: getSelectedCount() > 0 ? '#64748b' : '#374151' 
                   },
                   '&:disabled': { color: '#374151', borderColor: '#374151' }
                 }}
               >
                 Apply Selected ({getSelectedCount()})
               </Button>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => setShowSuggestions(false)}
                sx={{ color: '#64748b', borderColor: '#374151', '&:hover': { borderColor: '#64748b' } }}
              >
                Dismiss
              </Button>
            </Box>
          </Paper>
        )}
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

      {/* Snackbar for clear draft notification */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Draft cleared successfully"
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: '#23272f',
            color: '#e2e8f0',
            border: '1px solid #374151'
          }
        }}
      />
    </Box>
  );
};

export default Step3TargetingSetup; 