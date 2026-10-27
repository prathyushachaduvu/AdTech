import React from 'react';
import { Box, Typography, Paper, Divider, Button, Chip, LinearProgress, Tooltip } from '@mui/material';
import { CreditCard, TrendingUp, BarChart2, Calendar, ArrowUpRight } from 'lucide-react';

const MOCK_USAGE = [
  { label: 'API Calls', value: 12000, max: 20000, icon: <TrendingUp size={18} /> },
  { label: 'Ad Impressions', value: 1_200_000, max: 2_000_000, icon: <BarChart2 size={18} /> },
  { label: 'Storage Used', value: 8, max: 20, unit: 'GB', icon: <BarChart2 size={18} /> },
];

const MOCK_BILLING = {
  plan: 'Pro',
  renewal: '2024-12-01',
  payment: '**** **** **** 1234',
};

const UsageAndBillingSection: React.FC = () => {
  return (
    <Paper sx={{ p: { xs: 2.5, sm: 4 }, mb: 4, background: '#23272f', borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', maxWidth: '100%', border: '1px solid #30363d' }}>
      <Typography variant="h6" fontWeight={600} sx={{ color: '#fff', fontSize: { xs: 18, sm: 20 }, letterSpacing: 0.3, mb: 3 }}>Usage & Billing</Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Usage Stats */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" color="#8b949e" sx={{ mb: 2, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>Usage Statistics</Typography>
          {MOCK_USAGE.map((stat) => (
            <Box key={stat.label} sx={{ mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Box sx={{ color: '#60a5fa' }}>{stat.icon}</Box>
                <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 15 }}>{stat.label}</Typography>
                <Box sx={{ flex: 1 }} />
                <Typography variant="body2" sx={{ color: '#8b949e', fontWeight: 500, fontSize: 14 }}>
                  {stat.value.toLocaleString()} {stat.unit || ''} / {stat.max.toLocaleString()} {stat.unit || ''}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(100, (stat.value / stat.max) * 100)} 
                sx={{ height: 8, borderRadius: 4, background: '#23272f', '& .MuiLinearProgress-bar': { background: '#60a5fa' } }}
              />
            </Box>
          ))}
        </Box>
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 2, background: '#30363d' }} />
        {/* Billing Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" color="#8b949e" sx={{ mb: 2, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>Billing Information</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Chip label={MOCK_BILLING.plan} color="primary" sx={{ fontWeight: 600, fontSize: 14, bgcolor: '#1e293b', color: '#60a5fa', px: 2, height: 28, borderRadius: 2 }} />
            <Tooltip title="Renewal Date">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#8b949e', fontSize: 14 }}>
                <Calendar size={16} />
                <Typography sx={{ color: '#8b949e', fontSize: 14, fontWeight: 500, ml: 0.5 }}>Renews {MOCK_BILLING.renewal}</Typography>
              </Box>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <CreditCard size={18} style={{ color: '#8b949e' }} />
            <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 15 }}>{MOCK_BILLING.payment}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary" startIcon={<ArrowUpRight size={16} />} sx={{ borderRadius: 2, fontWeight: 600, px: 3, boxShadow: 'none' }}>Upgrade Plan</Button>
            <Button variant="outlined" color="primary" sx={{ borderRadius: 2, fontWeight: 600, px: 3, color: '#60a5fa', borderColor: '#30363d', boxShadow: 'none' }}>Download Invoice</Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UsageAndBillingSection; 