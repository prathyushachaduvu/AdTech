import React from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { LayoutGrid, Table } from 'lucide-react';

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
];

const objectiveOptions = [
  { value: '', label: 'All Objectives' },
  { value: 'brand awareness', label: 'Brand Awareness' },
  { value: 'conversions', label: 'Conversions' },
  { value: 'traffic', label: 'Traffic' },
  { value: 'lead generation', label: 'Lead Generation' },
];

const sortOptions = [
  { value: 'createdAt', label: 'Creation Date' },
  { value: 'budget', label: 'Budget' },
  { value: 'ctr', label: 'CTR' },
  { value: 'cpa', label: 'CPA' },
];

interface CampaignsHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  objective: string;
  onObjectiveChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

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

const CampaignsHeader: React.FC<CampaignsHeaderProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  objective,
  onObjectiveChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', background: 'transparent', mb: 2 }}>
      {/* Search Bar */}
      <TextField
        size="small"
        variant="outlined"
        placeholder="Search campaigns..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
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
        }}
        InputLabelProps={{ style: { color: '#bfc9d1' } }}
      />
      {/* Status Filter */}
      <FormControl size="small" sx={selectSx}>
        <InputLabel sx={{ color: '#d1d5db' }}>Status</InputLabel>
        <Select
          value={status}
          label="Status"
          onChange={e => onStatusChange(e.target.value)}
          sx={{ color: status ? '#d1d5db' : '#bfc9d1' }}
          MenuProps={menuProps}
        >
          {statusOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value} sx={menuItemSx}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Objective Filter */}
      <FormControl size="small" sx={selectSx}>
        <InputLabel sx={{ color: '#d1d5db' }}>Objective</InputLabel>
        <Select
          value={objective}
          label="Objective"
          onChange={e => onObjectiveChange(e.target.value)}
          sx={{ color: objective ? '#d1d5db' : '#bfc9d1' }}
          MenuProps={menuProps}
        >
          {objectiveOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value} sx={menuItemSx}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Sort By */}
      <FormControl size="small" sx={selectSx}>
        <InputLabel sx={{ color: '#d1d5db' }}>Sort By</InputLabel>
        <Select
          value={sort}
          label="Sort By"
          onChange={e => onSortChange(e.target.value)}
          sx={{ color: sort ? '#d1d5db' : '#bfc9d1' }}
          MenuProps={menuProps}
        >
          {sortOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value} sx={menuItemSx}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* View Toggle */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, val) => val && onViewChange(val)}
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
          <ToggleButton value="list" aria-label="List View">
            <Table size={18} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default CampaignsHeader; 