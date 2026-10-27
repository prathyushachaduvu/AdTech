import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Snackbar, Paper, List, ListItem, ListItemText } from '@mui/material';
import SidebarLayout from '../../layouts/SidebarLayout';
import CampaignsHeader from '../../components/campaigns/CampaignsHeader';
import CampaignCard from '../../components/campaigns/CampaignCard';
import { getCampaigns } from '../../services/campaignApi';
import type { Campaign, CampaignStatus } from '../../types/campaign';
import CampaignTable from '../../components/campaigns/CampaignTable';
import BulkActionsToolbar from '../../components/campaigns/BulkActionsToolbar';
import AISuggestionsPanel from '../../components/campaigns/AISuggestionsPanel';
import TopNav from '../../components/TopNav';
import CampaignSettingsDrawer from '../../components/campaigns/CampaignSettingsDrawer';

const CampaignsDashboard: React.FC = () => {
  // State for header controls
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [objective, setObjective] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Campaign data state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // State for settings drawer
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [settingsDrawerMode, setSettingsDrawerMode] = useState<'single' | 'bulk'>('single');
  const [settingsDrawerCampaigns, setSettingsDrawerCampaigns] = useState<Campaign[]>([]);
  const [campaignsActiveTab, setCampaignsActiveTab] = useState<'new' | 'settings'>('new');

  useEffect(() => {
    setLoading(true);
    getCampaigns().then(data => {
      setCampaigns(data);
      setLoading(false);
    });
  }, []);

  // Filter, search, and sort campaigns
  const filtered = campaigns
    .filter(c =>
      (!search || c.name.toLowerCase().includes(search.toLowerCase())) &&
      (!status || c.status === status) &&
      (!objective || c.objective === objective)
    )
    .sort((a, b) => {
      if (sort === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sort === 'budget') {
        return b.budget - a.budget;
      } else if (sort === 'ctr') {
        return b.metrics.ctr - a.metrics.ctr;
      } else if (sort === 'cpa') {
        return a.metrics.cpa - b.metrics.cpa; // Lower CPA is better
      }
      return 0;
    });

  // Clear selection if view changes away from list or filtered campaigns change
  useEffect(() => {
    setSelectedIds([]);
  }, [view, filtered.map(c => c.id).join(",")]);

  // Handler for bulk actions (MVP: just alert)
  const handleBulkAction = (action: string) => {
    alert(`Bulk action: ${action} on ${selectedIds.length} campaigns`);
  };

  // Handler for inline edit save
  const handleInlineEditSave = (updated: Campaign) => {
    setCampaigns(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } : c));
    setSnackbar({ open: true, message: 'Campaign updated!' });
  };

  function campaignsToCSV(campaigns: Campaign[]): string {
    const headers = [
      'Name', 'Status', 'Objective', 'Budget', 'Spend', 'Start Date', 'End Date', 'CTR', 'Impressions', 'Conversions', 'CPA', 'Last Modified'
    ];
    const rows = campaigns.map(c => [
      c.name,
      c.status,
      c.objective,
      c.budget,
      c.spend,
      c.startDate,
      c.endDate,
      c.metrics.ctr,
      c.metrics.impressions,
      c.metrics.conversions,
      c.metrics.cpa,
      c.metrics.lastModified
    ]);
    return [headers, ...rows].map(row => row.map(String).map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
  }

  function downloadFile(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  // Handler for export
  const handleExport = (format: 'csv' | 'json') => {
    const toExport = selectedIds.length > 0
      ? campaigns.filter(c => selectedIds.includes(c.id))
      : campaigns;
    if (format === 'csv') {
      const csv = campaignsToCSV(toExport);
      downloadFile('campaigns.csv', csv, 'text/csv');
      setSnackbar({ open: true, message: 'Exported as CSV!' });
    } else {
      const json = JSON.stringify(toExport, null, 2);
      downloadFile('campaigns.json', json, 'application/json');
      setSnackbar({ open: true, message: 'Exported as JSON!' });
    }
  };

  // Handler to open settings drawer
  const handleOpenSettingsDrawer = () => {
    let selectedCampaigns = campaigns.filter(c => selectedIds.includes(c.id));
    if (selectedCampaigns.length === 0 && campaigns.length > 0) {
      // If nothing selected, default to first campaign
      selectedCampaigns = [campaigns[0]];
      setSettingsDrawerMode('single');
    } else if (selectedCampaigns.length === 1) {
      setSettingsDrawerMode('single');
    } else if (selectedCampaigns.length > 1) {
      setSettingsDrawerMode('bulk');
    }
    setSettingsDrawerCampaigns(selectedCampaigns);
    setSettingsDrawerOpen(true);
    setCampaignsActiveTab('settings');
  };

  const handleCloseSettingsDrawer = () => {
    setSettingsDrawerOpen(false);
    setCampaignsActiveTab('new');
  };

  // Handler for settings drawer save
  const handleSettingsSave = async (updates: {
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
  }) => {
    try {
      if (settingsDrawerMode === 'single' && settingsDrawerCampaigns.length > 0) {
        // Update single campaign
        const campaignId = settingsDrawerCampaigns[0].id;
        setCampaigns(prev => prev.map(c => 
          c.id === campaignId 
            ? { 
                ...c, 
                ...(updates.name && { name: updates.name }),
                ...(updates.status && { status: updates.status as CampaignStatus }),
                ...(updates.budget && { 
                  budget: updates.budget,
                  spend: Math.min(c.spend, updates.budget)
                }),
                ...(updates.startDate && { startDate: updates.startDate }),
                ...(updates.endDate && { endDate: updates.endDate })
              }
            : c
        ));
        setSnackbar({ open: true, message: 'Campaign settings updated successfully!' });
      } else if (settingsDrawerMode === 'bulk' && updates.status) {
        // Update multiple campaigns
        setCampaigns(prev => prev.map(c => 
          selectedIds.includes(c.id) 
            ? { ...c, status: updates.status as CampaignStatus }
            : c
        ));
        setSnackbar({ open: true, message: `Updated status for ${selectedIds.length} campaigns!` });
      }
      
      // Close the drawer after successful save
      handleCloseSettingsDrawer();
    } catch (error) {
      console.error('Error saving campaign settings:', error);
      setSnackbar({ open: true, message: 'Error saving campaign settings. Please try again.' });
    }
  };

  return (
    <SidebarLayout currentPage="campaigns">
      <TopNav
        currentPage="campaigns"
        campaignsActiveTab={campaignsActiveTab}
        onCampaignsTabClick={tab => {
          if (tab === 'settings') {
            handleOpenSettingsDrawer();
          } else {
            setCampaignsActiveTab('new');
          }
        }}
        settingsEnabled={selectedIds.length > 0}
      />
      <Box sx={{ pl: 5, pr: { xs: 1, sm: 2, md: 3, lg: 4 }, py: 3 }}>
        {/* Header Section */}
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 3 }}>
          Campaigns
        </Typography>
        <Box sx={{ mb: 4 }}>
          <CampaignsHeader
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            objective={objective}
            onObjectiveChange={setObjective}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
          />
        </Box>
        {/* Dashboard main layout with AI Suggestions panel */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, maxWidth: 1200, mx: 'auto' }}>
          {/* Main content first */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <CircularProgress />
              </Box>
            ) : view === 'grid' ? (
              <>
                {selectedIds.length > 0 && (
                  <BulkActionsToolbar
                    selectedCount={selectedIds.length}
                    onAction={handleBulkAction}
                    onExport={handleExport}
                  />
                )}
                {filtered.length === 0 ? (
                  <Typography sx={{ color: '#9ca3af', textAlign: 'center', mt: 6 }}>
                    No campaigns found.
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                      gap: 3,
                    }}
                  >
                    {filtered.map(campaign => (
                      <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        selected={selectedIds.includes(campaign.id)}
                        onSelectChange={checked => {
                          if (checked) {
                            setSelectedIds(ids => [...ids, campaign.id]);
                          } else {
                            setSelectedIds(ids => ids.filter(id => id !== campaign.id));
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </>
            ) : (
              filtered.length === 0 ? (
                <Typography sx={{ color: '#9ca3af', textAlign: 'center', mt: 6 }}>
                  No campaigns found.
                </Typography>
              ) : (
                <>
                  {selectedIds.length > 0 && (
                    <BulkActionsToolbar
                      selectedCount={selectedIds.length}
                      onAction={handleBulkAction}
                      onExport={handleExport}
                    />
                  )}
                  <CampaignTable
                    campaigns={filtered}
                    selectedIds={selectedIds}
                    onSelectChange={setSelectedIds}
                    onInlineEditSave={handleInlineEditSave}
                  />
                  <Snackbar
                    open={snackbar.open}
                    autoHideDuration={2000}
                    onClose={() => setSnackbar({ open: false, message: '' })}
                    message={snackbar.message}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  />
                </>
              )
            )}
          </Box>
          {/* Insights column: AI Suggestions + Recent Activity on the right */}
          <Box sx={{
            flex: '0 0 320px',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            gap: 3,
            borderLeft: '1.5px solid #23272f',
            minHeight: 400,
            ml: 0,
            pl: 0,
            mr: 0,
            pr: 0,
            alignItems: 'stretch',
            justifyContent: 'flex-start',
          }}>
            <AISuggestionsPanel />
            <Paper elevation={0} sx={{
              background: '#181c20',
              borderRadius: 0,
              width: '100%',
              minWidth: 0,
              maxWidth: 'none',
              p: 2.5,
              mb: 3,
            }}>
              <Typography variant="h6" sx={{ color: '#818cf8', fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                Recent Activity
              </Typography>
              <List dense>
                <ListItem sx={{ mb: 1.5, alignItems: 'flex-start' }}>
                  <ListItemText primary={<Typography sx={{ color: '#e2e8f0', fontSize: 15 }}>Campaign 'Holiday Sale' paused</Typography>} secondary={<Typography sx={{ color: '#bfc9d1', fontSize: 13 }}>2 hours ago</Typography>} />
                </ListItem>
                <ListItem sx={{ mb: 1.5, alignItems: 'flex-start' }}>
                  <ListItemText primary={<Typography sx={{ color: '#e2e8f0', fontSize: 15 }}>Budget updated for 'Q4 Launch'</Typography>} secondary={<Typography sx={{ color: '#bfc9d1', fontSize: 13 }}>5 hours ago</Typography>} />
                </ListItem>
                <ListItem sx={{ alignItems: 'flex-start' }}>
                  <ListItemText primary={<Typography sx={{ color: '#e2e8f0', fontSize: 15 }}>New campaign 'Winter Collection' created</Typography>} secondary={<Typography sx={{ color: '#bfc9d1', fontSize: 13 }}>1 day ago</Typography>} />
                </ListItem>
              </List>
            </Paper>
          </Box>
        </Box>
      </Box>
      <CampaignSettingsDrawer
        open={settingsDrawerOpen}
        onClose={handleCloseSettingsDrawer}
        campaigns={settingsDrawerCampaigns}
        mode={settingsDrawerMode}
        onSave={handleSettingsSave}
      />
    </SidebarLayout>
  );
};

export default CampaignsDashboard; 