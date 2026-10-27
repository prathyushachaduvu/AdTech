import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Checkbox, FormControlLabel, RadioGroup, Radio, IconButton, Tooltip, CircularProgress, Divider, Chip } from '@mui/material';
import { Pencil, Check, X } from 'lucide-react';

export interface PreferencesData {
  notificationPreferences: string[];
  dashboardLayout: string;
}

interface PreferencesSectionProps {
  data: PreferencesData;
  onSave: (data: PreferencesData) => void;
  loading?: boolean;
  editing?: boolean;
  onRequestEdit?: () => void;
  onEditEnd?: () => void;
}

const NOTIFICATION_OPTIONS = [
  { value: 'campaign', label: 'Receive campaign status updates' },
  { value: 'weekly', label: 'Weekly performance digest' },
  { value: 'security', label: 'Security and billing alerts' },
];
const LAYOUT_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'creative', label: 'Creative-First' },
];

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ data, onSave, loading = false, editing, onRequestEdit, onEditEnd }) => {
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const isEditing = editing !== undefined ? editing : isEditingLocal;
  const [formData, setFormData] = useState<PreferencesData>(data);

  const handleEdit = () => {
    setFormData(data);
    if (onRequestEdit) onRequestEdit();
    if (editing === undefined) setIsEditingLocal(true);
  };
  const handleCancel = () => {
    setFormData(data);
    if (editing === undefined) setIsEditingLocal(false);
    if (editing !== undefined && onEditEnd) onEditEnd();
  };
  const handleSave = () => {
    onSave(formData);
    if (editing === undefined) setIsEditingLocal(false);
    if (editing !== undefined && onEditEnd) onEditEnd();
  };
  const handleCheckbox = (value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      notificationPreferences: e.target.checked
        ? [...prev.notificationPreferences, value]
        : prev.notificationPreferences.filter(x => x !== value),
    }));
  };
  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, dashboardLayout: e.target.value }));
  };

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 4 }, mb: 4, background: '#23272f', borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', maxWidth: '100%', border: '1px solid #30363d' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: '#fff', fontSize: { xs: 18, sm: 20 }, letterSpacing: 0.3, mb: 0 }}>Preferences</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isEditing && (
            <Tooltip title="Edit Preferences">
              <IconButton
                onClick={handleEdit}
                sx={{ color: '#8b949e', transition: 'color 0.2s', ml: 1, '&:hover': { color: '#60a5fa', background: 'rgba(96,165,250,0.08)' } }}
                aria-label="Edit Preferences"
              >
                <Pencil size={18} />
              </IconButton>
            </Tooltip>
          )}
          {isEditing && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
                disabled={loading}
                startIcon={<Check size={16} />}
                sx={{ borderRadius: 2, fontWeight: 600, px: 2, py: 0.5, fontSize: 14, minWidth: 90, height: 36, mr: 1, boxShadow: 'none' }}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<X size={16} />}
                sx={{ borderRadius: 2, color: '#8b949e', borderColor: '#4b5563', px: 2, py: 0.5, fontSize: 14, minWidth: 90, height: 36, boxShadow: 'none' }}
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Box>
      {/* Notification Preferences */}
      {!isEditing ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
          <Box>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 1.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>Notification Preferences</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {data.notificationPreferences.map((pref, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4ade80' }} />
                  <Typography variant="body2" sx={{ color: '#e2e8f0', fontSize: 14, fontWeight: 400 }}>{pref}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 1.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>Dashboard Layout</Typography>
            <Chip 
              label={data.dashboardLayout} 
              size="small"
              sx={{ 
                bgcolor: 'rgba(96,165,250,0.1)', 
                color: '#60a5fa', 
                fontWeight: 500,
                fontSize: 13,
                height: 24
              }} 
            />
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3, ml: 2 }}>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 1.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>Notification Preferences</Typography>
            {NOTIFICATION_OPTIONS.map(opt => (
              <FormControlLabel
                key={opt.value}
                control={<Checkbox checked={formData.notificationPreferences.includes(opt.value)} onChange={handleCheckbox(opt.value)} size="medium" sx={{ color: '#60a5fa' }} />}
                label={<Typography sx={{ color: '#e2e8f0', fontWeight: 500 }}>{opt.label}</Typography>}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
          <Divider sx={{ background: '#30363d', my: 2 }} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 1.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>Dashboard Layout</Typography>
            <RadioGroup row value={formData.dashboardLayout} onChange={handleRadio}>
              {LAYOUT_OPTIONS.map(opt => (
                <FormControlLabel key={opt.value} value={opt.value} control={<Radio sx={{ color: '#60a5fa' }} />} label={<Typography sx={{ color: '#e2e8f0', fontWeight: 500 }}>{opt.label}</Typography>} sx={{ mr: 2 }} />
              ))}
            </RadioGroup>
          </Box>
        </>
      )}
      {loading && <CircularProgress size={12} sx={{ mt: 2 }} />}
    </Paper>
  );
};

export default PreferencesSection; 