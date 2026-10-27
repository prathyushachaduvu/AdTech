import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  Box,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit2, Pause, Play, Copy, Trash2, Save, X } from 'lucide-react';
import type { Campaign, CampaignStatus } from '../../types/campaign';

const statusColors: Record<string, string> = {
  active: '#16a34a',
  paused: '#facc15',
  completed: '#6b7280',
};

interface CampaignTableProps {
  campaigns: Campaign[];
  selectedIds: string[];
  onSelectChange: (ids: string[]) => void;
  onInlineEditSave: (updated: Campaign) => void;
}

const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns, selectedIds, onSelectChange, onInlineEditSave }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Campaign>>({});

  const allIds = campaigns.map(c => c.id);
  const allSelected = selectedIds.length === allIds.length && allIds.length > 0;
  const someSelected = selectedIds.length > 0 && selectedIds.length < allIds.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectChange(allIds);
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      onSelectChange([...selectedIds, id]);
    } else {
      onSelectChange(selectedIds.filter(selId => selId !== id));
    }
  };

  const handleEditClick = (campaign: Campaign) => {
    setEditingId(campaign.id);
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
    setEditingId(null);
    setEditValues({});
  };

  const handleEditSave = (campaign: Campaign) => {
    onInlineEditSave({ ...campaign, ...editValues } as Campaign);
    setEditingId(null);
    setEditValues({});
  };

  return (
    <TableContainer component={Paper} sx={{ background: '#23272f', borderRadius: 3 }}>
      <Table size="small" sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow sx={{ background: '#20232a' }}>
            <TableCell padding="checkbox">
              <Checkbox
                sx={{ color: '#818cf8' }}
                indeterminate={someSelected}
                checked={allSelected}
                onChange={e => handleSelectAll(e.target.checked)}
              />
            </TableCell>
            <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Name</TableCell>
            <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Status</TableCell>
            <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Budget / Spend</TableCell>
            <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Dates</TableCell>
            <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>CTR</TableCell>
            <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>CPA</TableCell>
            <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Last Modified</TableCell>
            <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {campaigns.map((campaign) => {
            const isEditing = editingId === campaign.id;
            return (
              <TableRow key={campaign.id} hover sx={{ background: '#23272f', '&:nth-of-type(even)': { background: '#20232a' } }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    sx={{ color: '#818cf8' }}
                    checked={selectedIds.includes(campaign.id)}
                    onChange={e => handleSelectRow(campaign.id, e.target.checked)}
                  />
                </TableCell>
                {/* Name */}
                <TableCell sx={{ color: '#fff', fontWeight: 500 }}>
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={editValues.name ?? ''}
                      onChange={e => handleEditChange('name', e.target.value)}
                      sx={{ minWidth: 120, background: '#181c20', borderRadius: 1 }}
                      inputProps={{ style: { color: '#e2e8f0', fontWeight: 500 } }}
                    />
                  ) : (
                    campaign.name
                  )}
                </TableCell>
                {/* Status */}
                <TableCell>
                  {isEditing ? (
                    <Select
                      size="small"
                      value={editValues.status ?? campaign.status}
                      onChange={e => handleEditChange('status', e.target.value as CampaignStatus)}
                      sx={{ minWidth: 110, background: '#181c20', color: '#e2e8f0', borderRadius: 1 }}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="paused">Paused</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  ) : (
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
                  )}
                </TableCell>
                {/* Budget / Spend */}
                <TableCell sx={{ color: '#d1d5db' }}>
                  {isEditing ? (
                    <TextField
                      size="small"
                      type="number"
                      value={editValues.budget ?? ''}
                      onChange={e => handleEditChange('budget', Number(e.target.value))}
                      sx={{ minWidth: 90, background: '#181c20', borderRadius: 1 }}
                      inputProps={{ style: { color: '#e2e8f0', fontWeight: 500 }, min: 0 }}
                    />
                  ) : (
                    `$${campaign.budget.toLocaleString()} / $${campaign.spend.toLocaleString()}`
                  )}
                </TableCell>
                {/* Dates */}
                <TableCell sx={{ color: '#9ca3af' }}>
                  {campaign.startDate} - {campaign.endDate}
                </TableCell>
                {/* CTR */}
                <TableCell sx={{ color: '#60a5fa' }}>
                  {campaign.metrics.ctr}%
                </TableCell>
                {/* CPA */}
                <TableCell sx={{ color: '#fbbf24' }}>
                  ${campaign.metrics.cpa}
                </TableCell>
                {/* Last Modified */}
                <TableCell sx={{ color: '#9ca3af' }}>
                  {new Date(campaign.metrics.lastModified).toLocaleDateString()}
                </TableCell>
                {/* Actions */}
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {isEditing ? (
                      <>
                        <Tooltip title="Save">
                          <IconButton size="small" sx={{ color: '#16a34a' }} onClick={() => handleEditSave(campaign)}>
                            <Save size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton size="small" sx={{ color: '#ef4444' }} onClick={handleEditCancel}>
                            <X size={16} />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton size="small" sx={{ color: '#60a5fa' }} onClick={() => handleEditClick(campaign)}>
                            <Edit2 size={16} />
                          </IconButton>
                        </Tooltip>
                        {campaign.status === 'active' ? (
                          <Tooltip title="Pause">
                            <IconButton size="small" sx={{ color: '#facc15' }}>
                              <Pause size={16} />
                            </IconButton>
                          </Tooltip>
                        ) : campaign.status === 'paused' ? (
                          <Tooltip title="Resume">
                            <IconButton size="small" sx={{ color: '#16a34a' }}>
                              <Play size={16} />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                        <Tooltip title="Duplicate">
                          <IconButton size="small" sx={{ color: '#818cf8' }}>
                            <Copy size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" sx={{ color: '#ef4444' }}>
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CampaignTable; 