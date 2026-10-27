import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Tooltip } from '@mui/material';
import { Layers, User2, LayoutDashboard, BarChart2, Users, CreditCard, Briefcase, ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MAIN_NAV = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
  { label: 'Campaigns', icon: <Briefcase size={20} />, path: '/campaigns' },
  { label: 'Analytics', icon: <BarChart2 size={20} />, path: '/analytics' },
  { label: 'Audience', icon: <Users size={20} />, path: '/audience' },
  { label: 'Assets', icon: <Layers size={20} />, path: '/assets' },
  { label: 'Creative Studio', icon: <Palette size={20} />, path: '/creative-studio' },
  { label: 'Billing', icon: <CreditCard size={20} />, path: '/billing' },
  { label: 'Profile', icon: <User2 size={20} />, path: '/profile' },
];

interface SidebarLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageClick?: (page: string) => void;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ 
  children, 
  currentPage = 'profile',
  onPageClick 
}) => {
  const [collapsed, setCollapsed] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const navigate = useNavigate();

  // Save to localStorage whenever collapsed state changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);


  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#181c20' }}>
      {/* Sidebar */}
      <Box sx={{
        width: collapsed ? 70 : 250,
        background: '#20232a',
        borderRight: '1px solid #23272f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        py: 3,
        px: collapsed ? 1 : 2,
        minHeight: '100vh',
        position: 'relative',
        transition: 'width 0.3s ease, padding 0.3s ease',
        overflow: 'hidden',
        '&:hover .toggle-button': {
          opacity: 1,
        },
      }}>
        {/* Logo & Title */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: collapsed ? 'column' : 'column', 
          alignItems: 'center', 
          gap: 0.5, 
          mb: 3, 
          px: collapsed ? 0 : 1,
          opacity: collapsed ? 0.8 : 1,
          transition: 'opacity 0.3s ease',
        }}>
          <Layers size={collapsed ? 28 : 32} style={{ color: '#16a34a' }} />
          {!collapsed && (
            <>
              <Typography variant="h5" component="h1" sx={{ mt: 1, fontWeight: 'bold', color: '#fff', fontSize: 20, letterSpacing: 0.5 }}>
                LatentFlux
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: 13, fontWeight: 400 }}>
                Privacy-First AdTech Platform
              </Typography>
            </>
          )}
        </Box>

        {/* Toggle Button */}
        <Box 
          className="toggle-button"
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: collapsed ? 4 : 12, 
            zIndex: 10,
            opacity: collapsed ? 0 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <Tooltip title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'} placement="right">
            <IconButton
              onClick={toggleSidebar}
              sx={{
                color: '#8b949e',
                backgroundColor: 'rgba(139, 148, 158, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(139, 148, 158, 0.2)',
                  color: '#e2e8f0',
                },
                width: 28,
                height: 28,
              }}
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Main Navigation */}
        <List sx={{ mb: 2 }}>
          {MAIN_NAV.map(item => (
            <Tooltip 
              key={item.label} 
              title={collapsed ? item.label : ''} 
              placement="right"
              disableHoverListener={!collapsed}
            >
              <ListItemButton 
                selected={currentPage === item.path.replace('/', '')}
                onClick={() => {
                  navigate(item.path);
                  if (onPageClick) onPageClick(item.path);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: '#e2e8f0',
                  fontWeight: 500,
                  '&.Mui-selected, &:hover': {
                    background: 'rgba(59,130,246,0.12)',
                    color: '#60a5fa',
                  },
                  px: collapsed ? 1.5 : 2,
                  py: collapsed ? 1.5 : 1.2,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  minHeight: collapsed ? 48 : 'auto',
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'inherit', 
                  minWidth: collapsed ? 0 : 32,
                  margin: collapsed ? 0 : undefined,
                }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ fontSize: 15, fontWeight: 500 }} 
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        minWidth: 0, 
        background: '#181c20', 
        overflowX: 'auto',
        transition: 'margin-left 0.3s ease',
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default SidebarLayout; 