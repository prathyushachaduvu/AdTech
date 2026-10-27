import React, { useState } from 'react';
import { Box, Typography, Chip, IconButton, Tooltip, Paper, Checkbox, Select, MenuItem } from '@mui/material';
import { Edit2, Pause, Play, Copy, Trash2, Sparkles, Save, X } from 'lucide-react';
import type { Campaign } from '../../types/campaign';

const statusColors: Record<string, string> = {
  active: '#16a34a',
  paused: '#facc15',
  completed: '#6b7280',
};

interface CampaignCardProps {
  campaign: Campaign;
  selected?: boolean;
  onSelectChange?: (checked: boolean) => void;
  onInlineEditSave?: (updated: Campaign) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, selected = false, onSelectChange, onInlineEditSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Partial<Campaign>>({});

  const handleEditClick = () => {
    setIsEditing(true);
    setEditValues({
      name: campaign.name,
      budget: campaign.budget,
      status: campaign.status,
    });
  };

  const handleEditChange = (field: keyof Campaign, value: any) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const handleEditSave = () => {
    if (onInlineEditSave) {
      onInlineEditSave({ ...campaign, ...editValues } as Campaign);
    }
    setIsEditing(false);
    setEditValues({});
  };

  return (
    <Paper elevation={3} sx={{
      p: 3,
      borderRadius: 3,
      background: '#23272f',
      border: '1px solid #2d323b',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      position: 'relative',
      transition: 'box-shadow 0.2s',
      width: '100%',
      minHeight: 380,
      '&:hover': { boxShadow: 8 },
    }}>
      {/* Floating Selection Checkbox (hover/selected only) */}
      {onSelectChange && (
        <Checkbox
          checked={selected}
          onChange={e => onSelectChange(e.target.checked)}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            color: '#818cf8',
            bgcolor: 'rgba(24,28,32,0.7)',
            borderRadius: 1,
            boxShadow: 2,
            opacity: selected ? 1 : 0,
            transition: 'opacity 0.2s',
            pointerEvents: selected ? 'auto' : 'none',
            '&:hover': { opacity: 1, pointerEvents: 'auto' },
            '.MuiPaper-root:hover &': { opacity: 1, pointerEvents: 'auto' },
          }}
        />
      )}
      {/* Title & Status */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        {isEditing ? (
          <>
            <input
              type="text"
              value={editValues.name ?? ''}
              onChange={e => handleEditChange('name', e.target.value)}
              style={{
                minWidth: 100,
                background: '#181c20',
                color: '#e2e8f0',
                fontWeight: 600,
                fontSize: 18,
                border: '1px solid #374151',
                borderRadius: 4,
                padding: '4px 8px',
                marginRight: 8,
                flex: 1,
              }}
            />
            <Select
              size="small"
              value={editValues.status ?? campaign.status}
              onChange={e => handleEditChange('status', e.target.value as string)}
              sx={{ minWidth: 90, background: '#181c20', color: '#e2e8f0', borderRadius: 1, fontWeight: 700, fontSize: 13, height: 32 }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, flex: 1, fontSize: 18 }}>
              {campaign.name}
            </Typography>
            <Chip
              label={campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              size="small"
              sx={{
                bgcolor: statusColors[campaign.status],
                color: '#181c20',
                fontWeight: 700,
                fontSize: 13,
                px: 1.2,
                height: 24,
              }}
            />
          </>
        )}
      </Box>
      {/* Objective */}
      <Typography variant="body2" sx={{ color: '#818cf8', fontWeight: 500, mb: 0.5 }}>
        {campaign.objective.charAt(0).toUpperCase() + campaign.objective.slice(1)}
      </Typography>
      {/* Budget, Spend, Timeline */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 0.5 }}>
        {isEditing ? (
          <>
            <Typography variant="body2" sx={{ color: '#d1d5db' }}>
              <b>Budget:</b>
            </Typography>
            <input
              type="number"
              value={editValues.budget ?? ''}
              onChange={e => handleEditChange('budget', Number(e.target.value))}
              style={{
                minWidth: 60,
                background: '#181c20',
                color: '#e2e8f0',
                fontWeight: 500,
                border: '1px solid #374151',
                borderRadius: 4,
                padding: '2px 6px',
                marginRight: 8,
              }}
            />
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              {campaign.startDate} - {campaign.endDate}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body2" sx={{ color: '#d1d5db' }}>
              <b>Budget:</b> ${campaign.budget.toLocaleString()} / ${campaign.spend.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              {campaign.startDate} - {campaign.endDate}
            </Typography>
          </>
        )}
      </Box>
      {/* Metrics */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 0.5 }}>
        <Typography variant="body2" sx={{ color: '#60a5fa' }}>
          CTR: <b>{campaign.metrics.ctr}%</b>
        </Typography>
        <Typography variant="body2" sx={{ color: '#fbbf24' }}>
          Impr: <b>{campaign.metrics.impressions.toLocaleString()}</b>
        </Typography>
        <Typography variant="body2" sx={{ color: '#34d399' }}>
          Conv: <b>{campaign.metrics.conversions}</b>
        </Typography>
      </Box>
      {/* AI Optimization Badge */}
      {campaign.hasAiSuggestion && campaign.aiOptimizationTip && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Sparkles size={16} color="#818cf8" />
          <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 500 }}>
            {campaign.aiOptimizationTip}
          </Typography>
        </Box>
      )}
      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
        {isEditing ? (
          <>
            <Tooltip title="Save">
              <IconButton size="small" sx={{ color: '#16a34a' }} onClick={handleEditSave}>
                <Save size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton size="small" sx={{ color: '#ef4444' }} onClick={handleEditCancel}>
                <X size={18} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title="Edit">
              <IconButton size="small" sx={{ color: '#60a5fa' }} onClick={handleEditClick}>
                <Edit2 size={18} />
              </IconButton>
            </Tooltip>
            {campaign.status === 'active' ? (
              <Tooltip title="Pause">
                <IconButton size="small" sx={{ color: '#facc15' }}>
                  <Pause size={18} />
                </IconButton>
              </Tooltip>
            ) : campaign.status === 'paused' ? (
              <Tooltip title="Resume">
                <IconButton size="small" sx={{ color: '#16a34a' }}>
                  <Play size={18} />
                </IconButton>
              </Tooltip>
            ) : null}
            <Tooltip title="Duplicate">
              <IconButton size="small" sx={{ color: '#818cf8' }}>
                <Copy size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" sx={{ color: '#ef4444' }}>
                <Trash2 size={18} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default CampaignCard; 