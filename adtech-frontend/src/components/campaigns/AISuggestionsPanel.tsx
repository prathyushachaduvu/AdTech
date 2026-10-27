import React from 'react';
import { Typography, Paper, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Sparkles } from 'lucide-react';

const mockSuggestions = [
  {
    id: 1,
    tip: 'Pause "Holiday Sale 2024" campaign – CTR below 0.5%.',
    action: 'Apply pause',
  },
  {
    id: 2,
    tip: 'Increase budget for "Black Friday" – performing 40% above target.',
    action: 'Apply increase',
  },
];

const AISuggestionsPanel: React.FC = () => {
  return (
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
        <Sparkles size={20} /> AI Suggestions
      </Typography>
      <List dense>
        {mockSuggestions.map(s => (
          <ListItem key={s.id} alignItems="flex-start" sx={{ mb: 1.5, alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ mt: 0.5, minWidth: 32 }}>
              <Sparkles size={18} color="#818cf8" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ color: '#e2e8f0', fontSize: 15 }}>{s.tip}</Typography>}
            />
            <Button size="small" variant="outlined" sx={{ color: '#818cf8', borderColor: '#818cf8', ml: 1, minWidth: 0, px: 1.5, fontSize: 13, textTransform: 'none' }}>
              {s.action}
            </Button>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AISuggestionsPanel; 