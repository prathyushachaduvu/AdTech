import React, { useState } from 'react';
import { Drawer, Box, Typography, IconButton, Tabs, Tab, Button, TextField, MenuItem, Select, FormControl, InputLabel, Chip, Divider, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { X, DollarSign, Calendar, Clock, TrendingUp, History, Lightbulb } from 'lucide-react';
import type { Campaign, CampaignStatus } from '../../types/campaign';

interface CampaignSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  mode: 'single' | 'bulk';
  onSave?: (updates: {
    name?: string;
    status?: string;
    budget?: number;
    bidStrategy?: string;
    maxBid?: number;
    targetCPA?: number;
    targetROAS?: number;
    startDate?: string;
    endDate?: string;
    timezone?: string;
    dayparting?: string;
  }) => void;
}

const TAB_LABELS = [
  'General',
  'Budget & Bids',
  'Schedule',
  'Version History',
  'AI Suggestions',
];

const CAMPAIGN_STATUSES = [
  'active',
  'paused',
  'completed',
];

const BID_STRATEGIES = [
  'manual',
  'auto',
  'target_cpa',
  'target_roas',
];

const CampaignSettingsDrawer: React.FC<CampaignSettingsDrawerProps> = ({ open, onClose, campaigns, mode, onSave }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  
  // General tab state
  const [name, setName] = useState(campaigns[0]?.name || '');
  const [status, setStatus] = useState(campaigns[0]?.status || '');
  const [bulkStatus, setBulkStatus] = useState('');
  
  // Budget & Bids tab state
  const [dailyBudget, setDailyBudget] = useState(campaigns[0]?.budget?.toString() || '');
  const [bidStrategy, setBidStrategy] = useState('manual');
  const [maxBid, setMaxBid] = useState('1.00');
  const [targetCPA, setTargetCPA] = useState('10.00');
  const [targetROAS, setTargetROAS] = useState('3.0');
  
  // Schedule tab state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [dayparting, setDayparting] = useState('all_day');

  // Reset fields when campaigns or mode changes
  React.useEffect(() => {
    if (campaigns.length > 0 && mode === 'single') {
      const campaign = campaigns[0];
      setName(campaign.name || '');
      setStatus(campaign.status || '');
      setDailyBudget(campaign.budget?.toString() || '');
      setStartDate(campaign.startDate || '');
      setEndDate(campaign.endDate || '');
      // Keep default values for fields not in campaign data
      setBidStrategy('manual');
      setMaxBid('1.00');
      setTargetCPA('10.00');
      setTargetROAS('3.0');
      setTimezone('UTC');
      setDayparting('all_day');
    } else {
      // Reset all fields for bulk mode or no campaigns
      setName('');
      setStatus('active' as CampaignStatus);
      setDailyBudget('');
      setStartDate('');
      setEndDate('');
      setBidStrategy('manual');
      setMaxBid('1.00');
      setTargetCPA('10.00');
      setTargetROAS('3.0');
      setTimezone('UTC');
      setDayparting('all_day');
    }
    setBulkStatus('');
  }, [campaigns, mode, open]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Check if there are any changes in any tab
  const hasChanges = () => {
    if (!campaigns[0]) return false;
    const campaign = campaigns[0];
    
    // General tab changes
    if (name !== campaign.name || status !== campaign.status) return true;
    
    // Budget & Bids tab changes
    if (dailyBudget !== campaign.budget?.toString()) return true;
    
    // Schedule tab changes
    if (startDate !== campaign.startDate || endDate !== campaign.endDate) return true;
    
    return false;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (mode === 'single') {
        const updates: any = {};
        
        // General tab updates
        if (name !== campaigns[0]?.name) updates.name = name;
        if (status !== campaigns[0]?.status) updates.status = status;
        
        // Budget & Bids tab updates
        if (dailyBudget !== campaigns[0]?.budget?.toString()) {
          updates.budget = parseFloat(dailyBudget) || 0;
        }
        if (bidStrategy) updates.bidStrategy = bidStrategy;
        if (maxBid) updates.maxBid = parseFloat(maxBid) || 0;
        if (targetCPA) updates.targetCPA = parseFloat(targetCPA) || 0;
        if (targetROAS) updates.targetROAS = parseFloat(targetROAS) || 0;
        
        // Schedule tab updates
        if (startDate) updates.startDate = startDate;
        if (endDate) updates.endDate = endDate;
        if (timezone) updates.timezone = timezone;
        if (dayparting) updates.dayparting = dayparting;
        
        await onSave?.(updates);
      } else {
        // Bulk mode - only status can be updated
        await onSave?.({ status: bulkStatus });
      }
    } catch (error) {
      console.error('Error saving campaign settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = () => {
    if (tabIndex !== 0) return renderOtherTabs();
    // General tab
    if (mode === 'bulk') {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ color: '#bfc9d1', mb: 2 }}>
            Bulk edit: You can update the status for all selected campaigns.
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: '#bfc9d1' }}>Status</InputLabel>
            <Select
              label="Status"
              value={bulkStatus}
              onChange={e => setBulkStatus(e.target.value)}
              sx={{ color: '#e2e8f0', background: '#23272f', '.MuiSvgIcon-root': { color: '#bfc9d1' } }}
            >
              {CAMPAIGN_STATUSES.map(status => (
                <MenuItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      );
    }
    // Single mode
    return (
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Campaign Name"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            input: { color: '#e2e8f0', background: '#23272f' },
            label: { color: '#bfc9d1' },
            fieldset: { borderColor: '#23272f' },
          }}
        />
        <FormControl fullWidth>
          <InputLabel sx={{ color: '#bfc9d1' }}>Status</InputLabel>
          <Select
            label="Status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            sx={{ color: '#e2e8f0', background: '#23272f', '.MuiSvgIcon-root': { color: '#bfc9d1' } }}
          >
            {CAMPAIGN_STATUSES.map(status => (
              <MenuItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  };

  const renderBudgetAndBidsTab = () => {
    if (mode === 'bulk') {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ color: '#bfc9d1', mb: 2 }}>
            Bulk edit: Budget and bid settings can only be modified for individual campaigns.
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: 14 }}>
            Select a single campaign to modify budget and bid settings.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <DollarSign size={18} color="#bfc9d1" />
          <Typography variant="subtitle2" sx={{ color: '#bfc9d1', fontWeight: 600 }}>
            Budget Settings
          </Typography>
        </Box>
        
        <TextField
          label="Daily Budget ($)"
          value={dailyBudget}
          onChange={e => setDailyBudget(e.target.value)}
          fullWidth
          variant="outlined"
          type="number"
          InputProps={{ startAdornment: <Typography sx={{ color: '#bfc9d1', mr: 1 }}>$</Typography> }}
          sx={{
            input: { color: '#e2e8f0', background: '#23272f' },
            label: { color: '#bfc9d1' },
            fieldset: { borderColor: '#23272f' },
          }}
        />

        <Divider sx={{ borderColor: '#23272f', my: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TrendingUp size={18} color="#bfc9d1" />
          <Typography variant="subtitle2" sx={{ color: '#bfc9d1', fontWeight: 600 }}>
            Bid Strategy
          </Typography>
        </Box>

        <FormControl fullWidth>
          <InputLabel sx={{ color: '#bfc9d1' }}>Bid Strategy</InputLabel>
          <Select
            label="Bid Strategy"
            value={bidStrategy}
            onChange={e => setBidStrategy(e.target.value)}
            sx={{ color: '#e2e8f0', background: '#23272f', '.MuiSvgIcon-root': { color: '#bfc9d1' } }}
          >
            {BID_STRATEGIES.map(strategy => (
              <MenuItem key={strategy} value={strategy}>
                {strategy.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {bidStrategy === 'manual' && (
          <TextField
            label="Maximum Bid ($)"
            value={maxBid}
            onChange={e => setMaxBid(e.target.value)}
            fullWidth
            variant="outlined"
            type="number"
            InputProps={{ startAdornment: <Typography sx={{ color: '#bfc9d1', mr: 1 }}>$</Typography> }}
            sx={{
              input: { color: '#e2e8f0', background: '#23272f' },
              label: { color: '#bfc9d1' },
              fieldset: { borderColor: '#23272f' },
            }}
          />
        )}

        {bidStrategy === 'target_cpa' && (
          <TextField
            label="Target CPA ($)"
            value={targetCPA}
            onChange={e => setTargetCPA(e.target.value)}
            fullWidth
            variant="outlined"
            type="number"
            InputProps={{ startAdornment: <Typography sx={{ color: '#bfc9d1', mr: 1 }}>$</Typography> }}
            sx={{
              input: { color: '#e2e8f0', background: '#23272f' },
              label: { color: '#bfc9d1' },
              fieldset: { borderColor: '#23272f' },
            }}
          />
        )}

        {bidStrategy === 'target_roas' && (
          <TextField
            label="Target ROAS"
            value={targetROAS}
            onChange={e => setTargetROAS(e.target.value)}
            fullWidth
            variant="outlined"
            type="number"
            InputProps={{ endAdornment: <Typography sx={{ color: '#bfc9d1', ml: 1 }}>x</Typography> }}
            sx={{
              input: { color: '#e2e8f0', background: '#23272f' },
              label: { color: '#bfc9d1' },
              fieldset: { borderColor: '#23272f' },
            }}
          />
        )}
      </Box>
    );
  };

  const renderScheduleTab = () => {
    if (mode === 'bulk') {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ color: '#bfc9d1', mb: 2 }}>
            Bulk edit: Schedule settings can only be modified for individual campaigns.
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: 14 }}>
            Select a single campaign to modify schedule settings.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Calendar size={18} color="#bfc9d1" />
          <Typography variant="subtitle2" sx={{ color: '#bfc9d1', fontWeight: 600 }}>
            Campaign Schedule
          </Typography>
        </Box>

        <TextField
          label="Start Date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          fullWidth
          variant="outlined"
          type="date"
          InputLabelProps={{ shrink: true }}
          sx={{
            input: { color: '#e2e8f0', background: '#23272f' },
            label: { color: '#bfc9d1' },
            fieldset: { borderColor: '#23272f' },
          }}
        />

        <TextField
          label="End Date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          fullWidth
          variant="outlined"
          type="date"
          InputLabelProps={{ shrink: true }}
          sx={{
            input: { color: '#e2e8f0', background: '#23272f' },
            label: { color: '#bfc9d1' },
            fieldset: { borderColor: '#23272f' },
          }}
        />

        <FormControl fullWidth>
          <InputLabel sx={{ color: '#bfc9d1' }}>Timezone</InputLabel>
          <Select
            label="Timezone"
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
            sx={{ color: '#e2e8f0', background: '#23272f', '.MuiSvgIcon-root': { color: '#bfc9d1' } }}
          >
            <MenuItem value="UTC">UTC</MenuItem>
            <MenuItem value="EST">Eastern Time</MenuItem>
            <MenuItem value="PST">Pacific Time</MenuItem>
            <MenuItem value="CST">Central Time</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ borderColor: '#23272f', my: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Clock size={18} color="#bfc9d1" />
          <Typography variant="subtitle2" sx={{ color: '#bfc9d1', fontWeight: 600 }}>
            Dayparting
          </Typography>
        </Box>

        <FormControl fullWidth>
          <InputLabel sx={{ color: '#bfc9d1' }}>Dayparting Strategy</InputLabel>
          <Select
            label="Dayparting Strategy"
            value={dayparting}
            onChange={e => setDayparting(e.target.value)}
            sx={{ color: '#e2e8f0', background: '#23272f', '.MuiSvgIcon-root': { color: '#bfc9d1' } }}
          >
            <MenuItem value="all_day">All Day (24/7)</MenuItem>
            <MenuItem value="business_hours">Business Hours (9 AM - 5 PM)</MenuItem>
            <MenuItem value="evening">Evening (6 PM - 12 AM)</MenuItem>
            <MenuItem value="custom">Custom Schedule</MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  };

  const renderVersionHistoryTab = () => {
    const mockHistory = [
      { id: 1, action: 'Budget updated', user: 'John Doe', timestamp: '2024-01-15 14:30', details: 'Daily budget changed from $50 to $75' },
      { id: 2, action: 'Status changed', user: 'Jane Smith', timestamp: '2024-01-14 09:15', details: 'Campaign status changed from paused to active' },
      { id: 3, action: 'Bid strategy updated', user: 'John Doe', timestamp: '2024-01-13 16:45', details: 'Bid strategy changed from manual to target CPA' },
      { id: 4, action: 'Campaign created', user: 'Jane Smith', timestamp: '2024-01-12 11:20', details: 'Campaign "Summer Sale 2024" created' },
    ];

    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <History size={18} color="#bfc9d1" />
          <Typography variant="subtitle2" sx={{ color: '#bfc9d1', fontWeight: 600 }}>
            Version History
          </Typography>
        </Box>
        
        <List sx={{ p: 0 }}>
          {mockHistory.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem sx={{ px: 0, py: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 14 }}>
                        {item.action}
                      </Typography>
                      <Typography sx={{ color: '#64748b', fontSize: 12 }}>
                        {item.timestamp}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography sx={{ color: '#bfc9d1', fontSize: 13 }}>
                        {item.details}
                      </Typography>
                      <Typography sx={{ color: '#64748b', fontSize: 12, mt: 0.5 }}>
                        by {item.user}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < mockHistory.length - 1 && (
                <Divider sx={{ borderColor: '#23272f', ml: 5 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    );
  };

  const renderAISuggestionsTab = () => {
    const mockSuggestions = [
      {
        id: 1,
        type: 'budget',
        title: 'Increase Daily Budget',
        description: 'Your campaign is hitting budget limits early. Consider increasing daily budget by 20% to capture more conversions.',
        impact: 'high',
        confidence: 85,
      },
      {
        id: 2,
        type: 'bid',
        title: 'Optimize Bid Strategy',
        description: 'Switch to Target CPA bidding to improve cost efficiency. Current manual bids may be too conservative.',
        impact: 'medium',
        confidence: 72,
      },
      {
        id: 3,
        type: 'schedule',
        title: 'Adjust Dayparting',
        description: 'Performance is 40% better during evening hours. Consider focusing budget on 6 PM - 12 AM.',
        impact: 'medium',
        confidence: 68,
      },
    ];

    const getImpactColor = (impact: string) => {
      switch (impact) {
        case 'high': return '#ef4444';
        case 'medium': return '#f59e0b';
        case 'low': return '#10b981';
        default: return '#64748b';
      }
    };

    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Lightbulb size={18} color="#bfc9d1" />
          <Typography variant="subtitle2" sx={{ color: '#bfc9d1', fontWeight: 600 }}>
            AI Optimization Suggestions
          </Typography>
        </Box>
        
        <Typography sx={{ color: '#64748b', fontSize: 14, mb: 3 }}>
          Based on your campaign performance data, here are our recommendations:
        </Typography>

        {mockSuggestions.map((suggestion) => (
          <Box key={suggestion.id} sx={{ mb: 3, p: 2, border: '1px solid #23272f', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}>
                {suggestion.title}
              </Typography>
              <Chip
                label={`${suggestion.confidence}%`}
                size="small"
                sx={{
                  background: getImpactColor(suggestion.impact),
                  color: '#fff',
                  fontSize: 11,
                  height: 20,
                }}
              />
            </Box>
            
            <Typography sx={{ color: '#bfc9d1', fontSize: 13, mb: 2 }}>
              {suggestion.description}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                sx={{ 
                  background: '#3b82f6', 
                  color: '#fff', 
                  fontSize: 12,
                  px: 2,
                  py: 0.5,
                  minWidth: 'auto'
                }}
              >
                Apply
              </Button>
              <Button
                size="small"
                variant="outlined"
                sx={{ 
                  color: '#bfc9d1', 
                  borderColor: '#23272f',
                  fontSize: 12,
                  px: 2,
                  py: 0.5,
                  minWidth: 'auto'
                }}
              >
                Dismiss
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const renderOtherTabs = () => {
    switch (tabIndex) {
      case 1:
        return renderBudgetAndBidsTab();
      case 2:
        return renderScheduleTab();
      case 3:
        return renderVersionHistoryTab();
      case 4:
        return renderAISuggestionsTab();
      default:
        return null;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 420, md: 480 },
          background: '#181c20',
          color: '#e2e8f0',
          borderLeft: '1.5px solid #23272f',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: '1px solid #23272f' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {mode === 'bulk' ? 'Bulk Edit Campaigns' : 'Campaign Settings'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#bfc9d1' }}>
          <X size={22} />
        </IconButton>
      </Box>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          px: 2,
          borderBottom: '1px solid #23272f',
          minHeight: 48,
          '& .MuiTab-root': {
            color: '#bfc9d1',
            fontWeight: 500,
            fontSize: 15,
            textTransform: 'none',
            minHeight: 48,
            minWidth: 100,
            mr: 2,
            '&.Mui-selected': {
              color: '#e2e8f0',
              fontWeight: 600,
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#d1d5db',
            height: 3,
          },
        }}
      >
        {TAB_LABELS.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      <Box sx={{ px: 3, py: 2, flex: 1, overflowY: 'auto' }}>
        <Typography variant="body1" sx={{ color: '#bfc9d1', mt: 2 }}>
          {mode === 'bulk'
            ? `Editing ${campaigns.length} campaigns.`
            : campaigns[0]?.name || ''}
        </Typography>
        {renderTabContent()}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, px: 3, py: 2, borderTop: '1px solid #23272f' }}>
        <Button onClick={onClose} variant="outlined" sx={{ color: '#bfc9d1', borderColor: '#23272f' }} disabled={saving}>Cancel</Button>
        <Button
          variant="contained"
          sx={{ background: '#3b82f6', color: '#fff', fontWeight: 600 }}
          onClick={handleSave}
          disabled={saving || (mode === 'single' ? !hasChanges() : !bulkStatus)}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </Drawer>
  );
};

export default CampaignSettingsDrawer; 