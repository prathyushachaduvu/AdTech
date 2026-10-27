import React from 'react';
import { Box, Paper, Typography, Button, Divider, Chip, IconButton, Tooltip } from '@mui/material';
import { InfoOutlined, Palette, GpsFixed, Image as ImageIcon, ListAlt, ArrowBack, Save, RocketLaunch, Edit } from '@mui/icons-material';

// Types for props (can be expanded as needed)
interface Step5ReviewLaunchProps {
  stepData: Record<number, any>;
  onEditStep: (step: number) => void;
  onBack: () => void;
  onLaunch: () => void;
  onSaveDraft: () => void;
  validationErrors?: string[];
  isLaunching?: boolean;
}

const Step5ReviewLaunch: React.FC<Step5ReviewLaunchProps> = ({
  stepData,
  onEditStep,
  onBack,
  onLaunch,
  onSaveDraft,
  validationErrors = [],
  isLaunching = false,
}) => {
  // Extract data from stepData (mock/placeholder for now)
  const campaign = stepData[1]?.formData || {};
  const assets = stepData[2]?.formData || {};
  const targeting = stepData[3]?.formData || {};
  const creatives = stepData[4]?.formData?.creatives || [];

  // Helper to format date range
  const formatTimeline = (start: string, end: string) => {
    if (!start && !end) return '-';
    if (start && end) return `${start} – ${end}`;
    return start || end;
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', my: 4, color: '#e2e8f0', background: '#181c20', p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: '#e2e8f0', letterSpacing: 0.2 }}>Review & Launch</Typography>
        <Typography variant="subtitle1" sx={{ color: '#bfc9d1', fontWeight: 400, fontSize: 16 }}>Confirm your campaign details before launching</Typography>
      </Box>

      {/* Progress Recap */}
      <Paper sx={{ background: '#23272f', p: { xs: 2, sm: 3 }, borderRadius: 3, mb: 5, border: '1px solid #30363d', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontWeight: 600, color: '#e2e8f0', fontSize: 20 }}>
          <ListAlt sx={{ mr: 1, color: '#64748b', fontSize: 24 }} /> Progress Recap
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { label: 'Campaign Details', step: 1 },
            { label: 'Brand & Asset Uploads', step: 2 },
            { label: 'Targeting Setup', step: 3 },
            { label: 'Creative Selection', step: 4 },
          ].map((item) => (
            <Box key={item.step} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoOutlined sx={{ color: '#64748b', mr: 1, fontSize: 20 }} />
                <Typography sx={{ color: '#bfc9d1', fontWeight: 500, fontSize: 15 }}>{item.label}</Typography>
              </Box>
              <Button size="small" variant="text" sx={{ color: '#bfc9d1', textTransform: 'none', fontWeight: 500, borderRadius: 2, px: 2, '&:hover': { color: '#fff', background: '#23272f', border: '1px solid #3b82f6' } }} onClick={() => onEditStep(item.step)}>
                Edit
              </Button>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Campaign Details */}
        <Paper sx={{ background: '#23272f', p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid #30363d', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontWeight: 600, color: '#e2e8f0', fontSize: 20 }}>
            <InfoOutlined sx={{ mr: 1, color: '#64748b', fontSize: 22 }} /> Campaign Details
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Campaign Name</Typography>
              <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 17 }}>{campaign.campaignName || '-'}</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Objective</Typography>
              <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 17 }}>{campaign.objective || '-'}</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Budget</Typography>
              <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 17 }}>{campaign.budget || '-'}</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Timeline</Typography>
              <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 17 }}>{formatTimeline(campaign.startDate, campaign.endDate)}</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Brand & Product Context */}
        <Paper sx={{ background: '#23272f', p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid #30363d', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontWeight: 600, color: '#e2e8f0', fontSize: 20 }}>
            <Palette sx={{ mr: 1, color: '#64748b', fontSize: 22 }} /> Brand & Product Context
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Brand Description</Typography>
            <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 16 }}>{campaign.brandDescription || '-'}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Brand Tones</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
              {(campaign.brandTones || []).map((tone: string, idx: number) => (
                <Chip key={idx} label={tone} sx={{ background: '#181c20', color: '#e2e8f0', border: '1px solid #374151', fontSize: 13, height: 24 }} />
              ))}
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Product Name</Typography>
            <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 16 }}>{campaign.productName || '-'}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Product Description</Typography>
            <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 16 }}>{campaign.productDescription || '-'}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Product Value Propositions</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
              {(assets.productValueProps || []).map((val: string, idx: number) => (
                <Chip key={idx} label={val} sx={{ background: '#181c20', color: '#e2e8f0', border: '1px solid #374151', fontSize: 13, height: 24 }} />
              ))}
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Product Features</Typography>
            <Typography sx={{ color: '#e2e8f0', fontWeight: 400, fontSize: 15, whiteSpace: 'pre-line' }}>{assets.productFeatures || '-'}</Typography>
          </Box>
          {/* Uploaded Assets (simple indicator) */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Uploaded Assets</Typography>
            {assets.logoFile && assets.logoFile.name && (
              <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Logo uploaded</Typography>
            )}
            {Array.isArray(assets.productImages) && assets.productImages.length > 0 && (
              <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>
                {assets.productImages.length} product image(s) uploaded
              </Typography>
            )}
          </Box>
        </Paper>

        {/* Targeting Parameters */}
        <Paper sx={{ background: '#23272f', p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid #30363d', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontWeight: 600, color: '#e2e8f0', fontSize: 20 }}>
            <GpsFixed sx={{ mr: 1, color: '#64748b', fontSize: 22 }} /> Targeting Parameters
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Audience Type</Typography>
              <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 16 }}>{targeting.audienceType || '-'}</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Age Range</Typography>
              <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 16 }}>{targeting.ageRange ? `${targeting.ageRange[0]} – ${targeting.ageRange[1]}` : '-'}</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Location</Typography>
              <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 16 }}>{Array.isArray(targeting.geoTargets) ? targeting.geoTargets.join(', ') : '-'}</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Interests</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                {Array.isArray(targeting.interests) && targeting.interests.length > 0
                  ? targeting.interests.map((interest: string, idx: number) => (
                      <Chip key={idx} label={interest.trim()} sx={{ background: '#181c20', color: '#e2e8f0', border: '1px solid #374151', fontSize: 13, height: 22 }} />
                    ))
                  : <Typography sx={{ color: '#bfc9d1', fontSize: 15 }}>-</Typography>}
              </Box>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Keywords</Typography>
            <Typography sx={{ color: '#e2e8f0', fontWeight: 400, fontSize: 15 }}>{targeting.keywords || '-'}</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 0.5 }}>Audience Description</Typography>
            <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 16 }}>{targeting.audienceDesc || '-'}</Typography>
          </Box>
        </Paper>

        {/* Selected Creatives */}
        <Paper sx={{ background: '#23272f', p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid #30363d', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontWeight: 600, color: '#e2e8f0', fontSize: 20 }}>
            <ImageIcon sx={{ mr: 1, color: '#64748b', fontSize: 22 }} /> Selected Creatives
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {creatives.filter((c: any) => c.selected).map((creative: any, idx: number) => (
              <Paper key={creative.id || idx} sx={{ background: '#181c20', borderRadius: 2, p: 2, border: '1px solid #374151', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
                <Box sx={{ width: 120, height: 120, bgcolor: '#23272f', borderRadius: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {creative.image ? (
                    <img src={creative.image} alt="Creative" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }} />
                  ) : (
                    <Typography sx={{ color: '#bfc9d1', fontSize: 14 }}>No Image</Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {(creative.tags || []).map((tag: string, i: number) => (
                    <Chip key={i} label={tag} size="small" sx={{ background: '#23272f', color: '#e2e8f0', border: '1px solid #374151', fontSize: 12, height: 22 }} />
                  ))}
                </Box>
                <Button size="small" variant="text" sx={{ color: '#bfc9d1', textTransform: 'none', fontWeight: 500, borderRadius: 2, px: 2, '&:hover': { color: '#fff', background: '#23272f', border: '1px solid #3b82f6' } }}>
                  Preview Full Size
                </Button>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Error Summary */}
      {validationErrors.length > 0 && (
        <Paper sx={{ background: '#2d1a1a', color: '#ef4444', p: 2, borderRadius: 2, mt: 4, border: '1px solid #ef4444', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.10)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, fontSize: 16 }}>Please fix the following errors before launching:</Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </Paper>
      )}
    </Box>
  );
};

export default Step5ReviewLaunch; 