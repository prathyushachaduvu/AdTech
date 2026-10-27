import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Chip,
  Button,
  Slider,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Stack,
  FormHelperText,
} from '@mui/material';
import AssetSelectionSection from './AssetSelectionSection';
import type { GenerationSettings, CreativeGoal, CreativeStyle, CreativeFormat, BrandVoice, Tone } from '../../types/creative';

const GOALS: { label: string; value: CreativeGoal }[] = [
  { label: 'Awareness', value: 'awareness' },
  { label: 'Conversions', value: 'conversions' },
  { label: 'Retargeting', value: 'retargeting' },
];
const STYLES: { label: string; value: CreativeStyle }[] = [
  { label: 'Modern', value: 'modern' },
  { label: 'Classic', value: 'classic' },
  { label: 'Bold', value: 'bold' },
  { label: 'Minimal', value: 'minimal' },
  { label: 'Playful', value: 'playful' },
];
const FORMATS: { label: string; value: CreativeFormat }[] = [
  { label: 'Display Ad', value: 'display-ad' },
  { label: 'Instagram Post', value: 'instagram-post' },
  { label: 'Story', value: 'story' },
  { label: 'Banner', value: 'banner' },
];
const BRAND_VOICES: { label: string; value: BrandVoice }[] = [
  { label: 'Professional', value: 'professional' },
  { label: 'Casual', value: 'casual' },
  { label: 'Friendly', value: 'friendly' },
  { label: 'Luxury', value: 'luxury' },
  { label: 'Playful', value: 'playful' },
];
const TONES: { label: string; value: Tone }[] = [
  { label: 'Formal', value: 'formal' },
  { label: 'Informal', value: 'informal' },
  { label: 'Enthusiastic', value: 'enthusiastic' },
  { label: 'Calm', value: 'calm' },
  { label: 'Urgent', value: 'urgent' },
];

interface CreativeGenerationFormProps {
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const CreativeGenerationForm: React.FC<CreativeGenerationFormProps> = ({
  onSettingsChange,
  onGenerate,
  isGenerating
}) => {
  const [campaignName, setCampaignName] = useState('');
  const [goal, setGoal] = useState<CreativeGoal>('awareness');
  const [styles, setStyles] = useState<CreativeStyle[]>([]);
  const [formats, setFormats] = useState<CreativeFormat[]>([]);
  const [variationQuantity, setVariationQuantity] = useState(3);
  const [brandVoice, setBrandVoice] = useState<BrandVoice>('professional');
  const [tone, setTone] = useState<Tone>('formal');
  const [optionalPrompt, setOptionalPrompt] = useState('');
  // Placeholder for asset selection
  const [selectedAssets, setSelectedAssets] = useState<any[]>([]);
  const [touched, setTouched] = useState(false);

  // Validation
  const isValid =
    campaignName.trim().length > 0 &&
    styles.length > 0 &&
    formats.length > 0 &&
    variationQuantity >= 1 &&
    variationQuantity <= 10;

  // Notify parent of changes
  React.useEffect(() => {
    onSettingsChange({
      campaignName,
      goal,
      styles,
      formats,
      variationQuantity,
      brandVoice,
      tone,
      optionalPrompt,
      selectedAssets,
    });
    // eslint-disable-next-line
  }, [campaignName, goal, styles, formats, variationQuantity, brandVoice, tone, optionalPrompt, selectedAssets]);

  return (
    <Box
      sx={{
        maxWidth: 540,
        mx: 'auto',
        mt: 4,
        background: '#23272f',
        borderRadius: 4,
        p: { xs: 2, md: 4 },
        boxShadow: '0 2px 12px 0 #181c2022',
      }}
    >
      <Typography variant="h5" sx={{ color: '#e2e8f0', fontWeight: 700, mb: 2 }}>
        Creative Input
      </Typography>
      <Stack spacing={3}>
        {/* Campaign/Product Name */}
        <TextField
          label="Campaign or Product Name"
          value={campaignName}
          onChange={e => setCampaignName(e.target.value)}
          fullWidth
          required
          variant="outlined"
          sx={{ input: { color: '#e2e8f0' }, label: { color: '#9ca3af' } }}
          InputProps={{ style: { background: '#20232a', color: '#e2e8f0' } }}
        />
        {/* Creative Goal */}
        <FormControl fullWidth>
          <InputLabel sx={{ color: '#9ca3af' }}>Creative Goal</InputLabel>
          <Select
            value={goal}
            onChange={e => setGoal(e.target.value as CreativeGoal)}
            label="Creative Goal"
            sx={{ color: '#e2e8f0', background: '#20232a' }}
          >
            {GOALS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Style Selection */}
        <FormControl fullWidth>
          <InputLabel shrink sx={{ color: '#9ca3af' }}>Style</InputLabel>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {STYLES.map(opt => (
              <Chip
                key={opt.value}
                label={opt.label}
                color={styles.includes(opt.value) ? 'success' : 'default'}
                variant={styles.includes(opt.value) ? 'filled' : 'outlined'}
                onClick={() =>
                  setStyles(styles.includes(opt.value)
                    ? styles.filter(s => s !== opt.value)
                    : [...styles, opt.value])
                }
                sx={{
                  color: styles.includes(opt.value) ? '#fff' : '#9ca3af',
                  background: styles.includes(opt.value) ? '#16a34a' : '#20232a',
                  borderColor: '#374151',
                  fontWeight: 500,
                  fontSize: 15,
                  px: 2,
                  '&:hover': { background: '#15803d', color: '#fff' },
                }}
              />
            ))}
          </Box>
          {touched && styles.length === 0 && (
            <FormHelperText error>Please select at least one style.</FormHelperText>
          )}
        </FormControl>
        {/* Format Selection */}
        <FormControl fullWidth>
          <InputLabel shrink sx={{ color: '#9ca3af' }}>Format</InputLabel>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {FORMATS.map(opt => (
              <Chip
                key={opt.value}
                label={opt.label}
                color={formats.includes(opt.value) ? 'primary' : 'default'}
                variant={formats.includes(opt.value) ? 'filled' : 'outlined'}
                onClick={() =>
                  setFormats(formats.includes(opt.value)
                    ? formats.filter(f => f !== opt.value)
                    : [...formats, opt.value])
                }
                sx={{
                  color: formats.includes(opt.value) ? '#fff' : '#9ca3af',
                  background: formats.includes(opt.value) ? '#3b82f6' : '#20232a',
                  borderColor: '#374151',
                  fontWeight: 500,
                  fontSize: 15,
                  px: 2,
                  '&:hover': { background: '#2563eb', color: '#fff' },
                }}
              />
            ))}
          </Box>
          {touched && formats.length === 0 && (
            <FormHelperText error>Please select at least one format.</FormHelperText>
          )}
        </FormControl>
        {/* Variation Quantity */}
        <Box>
          <Typography sx={{ color: '#9ca3af', mb: 1, fontWeight: 500 }}>
            Variation Quantity: <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{variationQuantity}</span>
          </Typography>
          <Slider
            value={variationQuantity}
            min={1}
            max={10}
            step={1}
            onChange={(_, val) => setVariationQuantity(val as number)}
            sx={{ color: '#16a34a' }}
            marks={[{ value: 1, label: '1' }, { value: 10, label: '10' }]}
            valueLabelDisplay="auto"
          />
        </Box>
        {/* Brand Voice & Tone */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#9ca3af' }}>Brand Voice</InputLabel>
            <Select
              value={brandVoice}
              onChange={e => setBrandVoice(e.target.value as BrandVoice)}
              label="Brand Voice"
              sx={{ color: '#e2e8f0', background: '#20232a' }}
            >
              {BRAND_VOICES.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#9ca3af' }}>Tone</InputLabel>
            <Select
              value={tone}
              onChange={e => setTone(e.target.value as Tone)}
              label="Tone"
              sx={{ color: '#e2e8f0', background: '#20232a' }}
            >
              {TONES.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        {/* Optional Prompt */}
        <TextField
          label="Optional Prompt (Describe tone, theme, or special instructions)"
          value={optionalPrompt}
          onChange={e => setOptionalPrompt(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          variant="outlined"
          sx={{ input: { color: '#e2e8f0' }, label: { color: '#9ca3af' } }}
          InputProps={{ style: { background: '#20232a', color: '#e2e8f0' } }}
        />
        {/* Generate Button */}
        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          sx={{
            fontWeight: 700,
            fontSize: 17,
            py: 1.3,
            borderRadius: 2,
            mt: 2,
            background: isValid ? '#16a34a' : '#374151',
            color: '#fff',
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': {
              background: isValid ? '#15803d' : '#374151',
            },
          }}
          disabled={!isValid || isGenerating}
          onClick={() => {
            setTouched(true);
            if (isValid) onGenerate();
          }}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default CreativeGenerationForm; 