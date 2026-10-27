import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import { 
  User2, 
  Settings, 
  Building2, 
  Users, 
  TrendingUp, 
  ChevronDown,
  LogOut,
  Sparkles,
  Image,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

interface TopNavProps {
  currentPage: string;
  currentSection?: string | null;
  onSectionClick?: (section: string) => void;
  onSettingsClick?: () => void;
  settingsEnabled?: boolean;
  campaignsActiveTab?: 'new' | 'settings';
  onCampaignsTabClick?: (tab: 'new' | 'settings') => void;
}

const PROFILE_SECTIONS = [
  { label: 'Personal Info', icon: <User2 size={16} />, section: 'personal' },
  { label: 'Company', icon: <Building2 size={16} />, section: 'company' },
  { label: 'Preferences', icon: <Settings size={16} />, section: 'preferences' },
  { label: 'Team', icon: <Users size={16} />, section: 'team' },
  { label: 'Usage', icon: <TrendingUp size={16} />, section: 'usage' },
];

const CREATIVE_STUDIO_SECTIONS = [
  { label: 'Generate Creatives', icon: <Sparkles size={16} />, section: 'generate' },
  { label: 'My Generated Creatives', icon: <Image size={16} />, section: 'gallery' },
];

const TopNav: React.FC<TopNavProps> = ({ 
  currentPage, 
  currentSection, 
  onSectionClick,
  onSettingsClick,
  settingsEnabled,
  campaignsActiveTab,
  onCampaignsTabClick,
}) => {
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleSectionClick = (section: string) => {
    if (currentPage === 'profile') {
      // Handle Profile section scrolling directly
      const sectionMap: Record<string, { id: string }> = {
        'personal': { id: 'personal-info-section' },
        'company': { id: 'company-info-section' },
        'preferences': { id: 'preferences-section' },
        'team': { id: 'team-members-section' },
        'usage': { id: 'usage-billing-section' },
      };

      const target = sectionMap[section];
      if (target) {
        const element = document.getElementById(target.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } else if (onSectionClick) {
      onSectionClick(section);
    }
    handleProfileMenuClose();
  };

  const renderContextNav = () => {
    switch (currentPage) {
      case 'profile':
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              height: 64, // nav bar height
              background: 'transparent',
              borderRadius: 0,
              px: 2,
            }}
          >
            {PROFILE_SECTIONS.map((item) => {
              const isActive = currentSection === item.section;
              return (
                <Button
                  key={item.section}
                  variant="text"
                  disableRipple
                  onClick={() => handleSectionClick(item.section)}
                  sx={{
                    color: isActive ? '#e2e8f0' : '#9ca3af',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 16,
                    textTransform: 'none',
                    borderRadius: 0,
                    px: 3,
                    minWidth: 0,
                    height: '100%',
                    position: 'relative',
                    background: isActive
                      ? 'linear-gradient(0deg, rgba(209,213,219,0.10) 0%, rgba(156,163,175,0.08) 100%)'
                      : 'transparent',
                    boxShadow: isActive ? '0 2px 8px 0 rgba(156,163,175,0.08)' : 'none',
                    transition: 'background 0.18s, color 0.18s',
                    '&:hover': {
                      color: '#e2e8f0',
                      background: 'linear-gradient(0deg, rgba(209,213,219,0.18) 0%, rgba(156,163,175,0.12) 100%)',
                      

                    },
                    '&::after': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: isActive ? '3px' : '0px',
                      background: '#d1d5db',
                      opacity: isActive ? 1 : 0,
                      
                    },
                    '&:hover::after': {
                      height: '3px',
                      opacity: 1,
                      transition: 'height 0.18s cubic-bezier(.4,0,.2,1), opacity 0.18s cubic-bezier(.4,0,.2,1)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        );

      case 'creative-studio':
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              height: 64, // nav bar height
              background: 'transparent',
              borderRadius: 0,
              px: 2,
            }}
          >
            {CREATIVE_STUDIO_SECTIONS.map((item) => {
              const isActive = currentSection === item.section;
              return (
                <Button
                  key={item.section}
                  variant="text"
                  disableRipple
                  onClick={() => handleSectionClick(item.section)}
                  sx={{
                    color: isActive ? '#e2e8f0' : '#9ca3af',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 16,
                    textTransform: 'none',
                    borderRadius: 0,
                    px: 3,
                    minWidth: 0,
                    height: '100%',
                    position: 'relative',
                    background: isActive
                      ? 'linear-gradient(0deg, rgba(209,213,219,0.10) 0%, rgba(156,163,175,0.08) 100%)'
                      : 'transparent',
                    boxShadow: isActive ? '0 2px 8px 0 rgba(156,163,175,0.08)' : 'none',
                    transition: 'background 0.18s, color 0.18s',
                    '&:hover': {
                      color: '#e2e8f0',
                      background: 'linear-gradient(0deg, rgba(209,213,219,0.18) 0%, rgba(156,163,175,0.12) 100%)',
                    },
                    '&::after': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: isActive ? '3px' : '0px',
                      background: '#d1d5db',
                      opacity: isActive ? 1 : 0,
                      transition: 'height 0.18s cubic-bezier(.4,0,.2,1), opacity 0.18s cubic-bezier(.4,0,.2,1)',
                    },
                    '&:hover::after': {
                      height: '3px',
                      opacity: 1,
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        );
      
      case 'dashboard':
        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button variant="text" size="small" sx={{ color: '#8b949e' }}>Today</Button>
            <Button variant="text" size="small" sx={{ color: '#8b949e' }}>Week</Button>
            <Button variant="contained" size="small" sx={{ backgroundColor: '#3b82f6' }}>Month</Button>
            <Button variant="text" size="small" sx={{ color: '#8b949e' }}>Custom</Button>
          </Box>
        );
      
      case 'campaigns':
        const tabs = [
          { label: '+ New Campaign', key: 'new', onClick: () => navigate('/campaigns/new'), disabled: false },
          { label: 'Settings', key: 'settings', onClick: onSettingsClick, disabled: !settingsEnabled },
        ];
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              height: 64,
              background: 'transparent',
              borderRadius: 0,
              px: 2,
              gap: 0,
            }}
          >
            {tabs.map(tab => {
              const isActive =
                (tab.key === 'new' && campaignsActiveTab === 'new') ||
                (tab.key === 'settings' && campaignsActiveTab === 'settings');
              
              const button = (
                <Button
                  key={tab.key}
                  variant="text"
                  disableRipple
                  onClick={() => {
                    if (tab.disabled) return;
                    if (typeof onCampaignsTabClick === 'function') onCampaignsTabClick(tab.key as 'new' | 'settings');
                    if (typeof tab.onClick === 'function') tab.onClick();
                  }}
                  sx={{
                    color: isActive ? '#e2e8f0' : '#9ca3af',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 16,
                    textTransform: 'none',
                    borderRadius: 0,
                    px: 3,
                    minWidth: 0,
                    height: '100%',
                    position: 'relative',
                    background: isActive
                      ? 'linear-gradient(0deg, rgba(209,213,219,0.10) 0%, rgba(156,163,175,0.08) 100%)'
                      : 'transparent',
                    boxShadow: isActive ? '0 2px 8px 0 rgba(156,163,175,0.08)' : 'none',
                    transition: 'background 0.18s, color 0.18s',
                    opacity: tab.disabled ? 1 : 1,
                    cursor: tab.disabled ? 'not-allowed' : 'pointer',
                    pointerEvents: tab.disabled ? 'auto' : 'auto',
                    '&:hover': {
                      color: '#e2e8f0',
                      background: 'linear-gradient(0deg, rgba(209,213,219,0.18) 0%, rgba(156,163,175,0.12) 100%)',
                    },
                    '&::after': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: isActive ? '3px' : '0px',
                      background: '#d1d5db',
                      opacity: isActive ? 1 : 0,
                      transition: 'height 0.18s cubic-bezier(.4,0,.2,1), opacity 0.18s cubic-bezier(.4,0,.2,1)',
                    },
                    '&:hover::after': {
                      height: '3px',
                      opacity: 1,
                    },
                  }}
                >
                  {tab.label}
                </Button>
              );

              // Wrap Settings button with tooltip when disabled
              if (tab.key === 'settings' && tab.disabled) {
                return (
                  <Tooltip
                    key={tab.key}
                    title="Select one or more campaigns to edit settings"
                    placement="bottom"
                    arrow
                    componentsProps={{
                      tooltip: {
                        sx: {
                          background: '#1f2937',
                          color: '#e2e8f0',
                          fontSize: 13,
                          padding: '8px 12px',
                          border: '1px solid #374151',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        },
                      },
                      arrow: {
                        sx: {
                          color: '#1f2937',
                        },
                      },
                    }}
                  >
                    {button}
                  </Tooltip>
                );
              }

              return button;
            })}
          </Box>
        );
      
      case 'assets':
      case 'brand-guidelines':
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              height: 64, // nav bar height
              background: 'transparent',
              borderRadius: 0,
              px: 2,
            }}
          >
            <Button
              variant="text"
              disableRipple
              onClick={() => navigate('/brand-guidelines')}
              sx={{
                color: currentPage === 'brand-guidelines' ? '#e2e8f0' : '#9ca3af',
                fontWeight: currentPage === 'brand-guidelines' ? 600 : 500,
                fontSize: 16,
                textTransform: 'none',
                borderRadius: 0,
                px: 3,
                minWidth: 0,
                height: '100%',
                position: 'relative',
                background: currentPage === 'brand-guidelines'
                  ? 'linear-gradient(0deg, rgba(209,213,219,0.10) 0%, rgba(156,163,175,0.08) 100%)'
                  : 'transparent',
                boxShadow: currentPage === 'brand-guidelines' ? '0 2px 8px 0 rgba(156,163,175,0.08)' : 'none',
                transition: 'background 0.18s, color 0.18s',
                '&:hover': {
                  color: '#e2e8f0',
                  background: 'linear-gradient(0deg, rgba(209,213,219,0.18) 0%, rgba(156,163,175,0.12) 100%)',
                },
                '&::after': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: currentPage === 'brand-guidelines' ? '3px' : '0px',
                  background: '#d1d5db',
                  opacity: currentPage === 'brand-guidelines' ? 1 : 0,
                  transition: 'height 0.18s cubic-bezier(.4,0,.2,1), opacity 0.18s cubic-bezier(.4,0,.2,1)',
                },
                '&:hover::after': {
                  height: '3px',
                  opacity: 1,
                  transition: 'height 0.18s cubic-bezier(.4,0,.2,1), opacity 0.18s cubic-bezier(.4,0,.2,1)',
                },
              }}
            >
              Brand Guidelines
            </Button>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{
      height: 64,
      background: 'transparent',
      borderBottom: '1px solid #23272f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 3,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Left side - Context Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {renderContextNav()}
      </Box>

      {/* Right side - User Menu */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        

        {/* Profile Menu */}
        <Box>
          <Button
            onClick={handleProfileMenuOpen}
            sx={{
              color: '#e2e8f0',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'rgba(139, 148, 158, 0.1)' },
              px: 2,
              py: 1,
            }}
            endIcon={<ChevronDown size={16} />}
          >
            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#3b82f6', fontSize: 14 }} src={user?.profilePicture || undefined}>
              {user ? (user.firstName?.[0] || '') + (user.lastName?.[0] || '') : ''}
            </Avatar>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              {user ? `${user.firstName} ${user.lastName}` : ''}
            </Typography>
          </Button>
          
          <Menu
            anchorEl={profileMenuAnchor}
            open={Boolean(profileMenuAnchor)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                background: '#20232a',
                border: '1px solid #23272f',
                mt: 1,
                minWidth: 200,
              }
            }}
          >
            <MenuItem onClick={handleProfileMenuClose} sx={{ color: '#e2e8f0' }}>
              <ListItemIcon>
                <User2 size={16} style={{ color: '#8b949e' }} />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose} sx={{ color: '#e2e8f0' }}>
              <ListItemIcon>
                <Settings size={16} style={{ color: '#8b949e' }} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
            <Divider sx={{ background: '#23272f', my: 1 }} />
            <MenuItem onClick={handleProfileMenuClose} sx={{ color: '#e2e8f0' }}>
              <ListItemIcon>
                <LogOut size={16} style={{ color: '#8b949e' }} />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default TopNav; 