import React from 'react';
import { Box, Typography, Paper, Tooltip } from '@mui/material';
import { CheckCircle2 } from 'lucide-react';

export interface Step {
  label: string;
  status: 'completed' | 'in-progress' | 'pending';
  icon: React.ReactNode;
  completed: boolean;
}

interface ProfileCompletionStepperProps {
  steps: Step[];
  currentStep: number;
  percent: number;
  onStepClick?: (idx: number) => void;
}


const percentColor = '#3b82f6'; // blue for percentage

const ProfileCompletionStepper: React.FC<ProfileCompletionStepperProps> = ({ steps, percent, onStepClick }) => {
  return (
    <Paper sx={{
      p: { xs: 2, sm: 3 },
      mb: 4,
      background: '#23272f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      border: '1px solid #30363d',
      borderRadius: 3,
      maxWidth: '100%',
      width: '100%',
      mx: 'auto',
      position: 'relative',
      overflow: 'visible',
      boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
      minHeight: 0,
    }}>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#fff', letterSpacing: 0.3, fontSize: 16, lineHeight: 1.2 }}>Profile Completion</Typography>
        <Typography variant="body2" sx={{ color: percentColor, fontWeight: 600, fontSize: 15, alignSelf: 'flex-start', mt: 1.2, mr: 0.5 }}>{percent}% Complete</Typography>
      </Box>
      <Box sx={{ width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', mt: 0.5, px: { xs: 0, sm: 0 } }}>
        {/* Stepper Row with fixed height */}
        <Box sx={{ position: 'relative', width: '100%', height: 56, mb: 1 }}>
          {/* Connector line behind all steps */}
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: `calc(50% / ${steps.length})`,
            right: `calc(50% / ${steps.length})`,
            height: 2,
            zIndex: 0,
            width: 'auto',
            transform: 'translateY(-50%)',
            background: (() => {
              // Build a linear gradient for the connector line
              const n = steps.length;
              let stops = [];
              let percentPerStep = 100 / (n - 1);
              let lastColor = '#6b7280';
              for (let i = 0; i < n - 1; ++i) {
                let color = '#6b7280';
                if (steps[i].status === 'completed') color = '#16a34a';
                else if (steps[i].status === 'in-progress') color = '#facc15';
                stops.push(`${color} ${i * percentPerStep}% ${(i + 1) * percentPerStep}%`);
                lastColor = color;
              }
              stops.push(`${lastColor} 100%`);
              return `linear-gradient(to right, ${stops.join(', ')})`;
            })(),
            borderRadius: 2,
          }} />
          {/* Stepper Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: 56, position: 'relative', gap: 0, justifyContent: 'space-between', zIndex: 1 }}>
            {steps.map((step, idx) => {
              // Step circle style
              let circleBg = '#fff';
              let border = `2px solid #6b7280`;
              let iconColor = '#6b7280';
              let size = 48;
              if (step.status === 'completed') {
                circleBg = '#16a34a';
                border = '2px solid #16a34a';
                iconColor = '#fff';
              } else if (step.status === 'in-progress') {
                circleBg = '#fff';
                border = '3.5px solid #facc15';
                iconColor = '#facc15';
                size = 56;
              }
              return (
                <Box key={step.label} sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, position: 'relative', justifyContent: 'center', zIndex: 2 }}>
                  <Tooltip title={step.label} arrow>
                    <Box
                      onClick={() => onStepClick && onStepClick(idx)}
                      sx={{
                        zIndex: 2,
                        width: size,
                        height: size,
                        borderRadius: '50%',
                        background: circleBg,
                        border,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: iconColor,
                        fontSize: 28,
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background 0.3s, border 0.3s, width 0.2s, height 0.2s',
                      }}
                    >
                      {step.status === 'completed' ? <CheckCircle2 size={28} /> : step.icon}
                    </Box>
                  </Tooltip>
                </Box>
              );
            })}
          </Box>
        </Box>
        {/* Field labels and status, stacked */}
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mt: 0.5, gap: 0 }}>
          {steps.map((step) => (
            <Box key={step.label} sx={{ width: 70, textAlign: 'center', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                variant="caption"
                sx={{ color: '#f3f4f6', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: 0.2, mb: 0.2 }}
              >
                {step.label}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#8b949e', fontWeight: 400, fontSize: 12, mt: 0.2, letterSpacing: 0.2 }}
              >
                {step.status === 'completed' ? 'Completed' : step.status === 'in-progress' ? 'In Progress' : 'Pending'}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileCompletionStepper; 