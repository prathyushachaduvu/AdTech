import React, { useState } from 'react';
import { Box, Button, Typography, Paper, IconButton, Tooltip, List, ListItem, ListItemText, ListItemSecondaryAction, CircularProgress, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { Pencil, Check, X, UserPlus, Trash2 } from 'lucide-react';

export interface TeamMember {
  name: string;
  role: string;
}

interface TeamMembersSectionProps {
  members: TeamMember[];
  onRemove?: (idx: number) => void;
  onRoleChange?: (idx: number, newRole: string) => void;
  onSave?: (members: TeamMember[]) => void;
  loading?: boolean;
  editing?: boolean;
  onRequestEdit?: () => void;
  onEditEnd?: () => void;
}

const ROLE_OPTIONS = ['Owner', 'Admin', 'Member'];

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  members,
  onRemove,
  onRoleChange,
  onSave,
  loading = false,
  editing,
  onRequestEdit,
  onEditEnd,
}) => {
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const isEditing = editing !== undefined ? editing : isEditingLocal;
  const [editMembers, setEditMembers] = useState<TeamMember[]>(members);
  
  // Invite modal state
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleEdit = () => {
    setEditMembers(members);
    if (onRequestEdit) onRequestEdit();
    if (editing === undefined) setIsEditingLocal(true);
  };
  const handleCancel = () => {
    setEditMembers(members);
    if (editing === undefined) setIsEditingLocal(false);
    if (editing !== undefined && onEditEnd) onEditEnd();
  };
  const handleSave = () => {
    if (onSave) onSave(editMembers);
    if (editing === undefined) setIsEditingLocal(false);
    if (editing !== undefined && onEditEnd) onEditEnd();
  };
  const handleRemove = (idx: number) => {
    setEditMembers(prev => prev.filter((_, i) => i !== idx));
    if (onRemove) onRemove(idx);
  };
  const handleRoleChange = (idx: number, newRole: string) => {
    setEditMembers(prev => prev.map((m, i) => i === idx ? { ...m, role: newRole } : m));
    if (onRoleChange) onRoleChange(idx, newRole);
  };

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleInviteClick = () => {
    setInviteModalOpen(true);
    setInviteEmail('');
    setInviteSuccess(false);
    setEmailError('');
  };

  const handleInviteClose = () => {
    // Close modal first, then reset states after animation
    setInviteModalOpen(false);
    
    // Reset other states after a brief delay to avoid visual jumps
    setTimeout(() => {
      setInviteEmail('');
      setInviteSuccess(false);
      setEmailError('');
    }, 150);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setInviteEmail(email);
    if (emailError) {
      validateEmail(email);
    }
  };

  const handleSendInvite = async () => {
    if (!validateEmail(inviteEmail)) return;
    
    setInviteLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setInviteSuccess(true);
    setInviteLoading(false);
  };

  const isEmailValid = EMAIL_REGEX.test(inviteEmail.trim());

  return (
    <>
      <Paper sx={{ p: { xs: 2.5, sm: 4 }, mb: 4, background: '#23272f', borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', maxWidth: '100%', border: '1px solid #30363d' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
          <Typography variant="h6" fontWeight={600} sx={{ color: '#fff', fontSize: { xs: 18, sm: 20 }, letterSpacing: 0.3, mb: 0 }}>Team Members</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isEditing && (
              <>
                <Tooltip title="Invite Member">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<UserPlus size={18} />}
                    sx={{ borderRadius: 2, fontWeight: 600, px: 2, py: 0.5, fontSize: 14, minWidth: 90, height: 36, boxShadow: 'none', mr: 1 }}
                    onClick={handleInviteClick}
                  >
                    Invite
                  </Button>
                </Tooltip>
                <Tooltip title="Edit Team Members">
                  <IconButton
                    onClick={handleEdit}
                    sx={{ color: '#8b949e', transition: 'color 0.2s', ml: 1, '&:hover': { color: '#60a5fa', background: 'rgba(96,165,250,0.08)' } }}
                    aria-label="Edit Team Members"
                  >
                    <Pencil size={18} />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {isEditing && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSave}
                  disabled={loading}
                  startIcon={<Check size={16} />}
                  sx={{ borderRadius: 2, fontWeight: 600, px: 2, py: 0.5, fontSize: 14, minWidth: 90, height: 36, mr: 1, boxShadow: 'none' }}
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<X size={16} />}
                  sx={{ borderRadius: 2, color: '#8b949e', borderColor: '#4b5563', px: 2, py: 0.5, fontSize: 14, minWidth: 90, height: 36, boxShadow: 'none' }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>
        <List>
          {(isEditing ? editMembers : members).map((member, idx) => (
            <ListItem key={idx} sx={{ borderBottom: '1px solid #30363d', py: 1.2 }}>
              <ListItemText
                primary={<Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 15 }}>{member.name}</Typography>}
                secondary={isEditing ? (
                  <TextField
                    select
                    value={member.role}
                    onChange={e => handleRoleChange(idx, e.target.value)}
                    size="small"
                    variant="outlined"
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            background: '#23272f',
                            color: '#e2e8f0',
                            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
                            border: '1px solid #30363d',
                            mt: 0.5,
                            '& .MuiMenu-list': {
                              p: 0,
                            },
                          },
                        },
                      },
                    }}
                    sx={{
                      minWidth: 110,
                      background: '#23272f',
                      color: '#e2e8f0',
                      mt: 0.5,
                      borderRadius: 2,
                      fontSize: 14,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: '#23272f',
                        color: '#e2e8f0',
                        fontSize: 14,
                        border: '1.5px solid #30363d',
                        transition: 'border-color 0.2s',
                        '&:hover fieldset': {
                          borderColor: '#60a5fa',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#60a5fa',
                        },
                      },
                      '& .MuiSelect-icon': {
                        color: '#8b949e',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#8b949e',
                        fontSize: 13,
                      },
                    }}
                    InputProps={{
                      style: { color: '#e2e8f0', fontWeight: 500, fontSize: 14, borderRadius: 8 },
                    }}
                    InputLabelProps={{ style: { color: '#8b949e', fontSize: 13 } }}
                  >
                    {ROLE_OPTIONS.map(role => (
                      <MenuItem 
                        key={role} 
                        value={role} 
                        sx={{ 
                          fontSize: 14, 
                          color: '#e2e8f0', 
                          background: '#23272f',
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(59,130,246,0.18) !important',
                            color: '#60a5fa !important',
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: 'rgba(59,130,246,0.28) !important',
                            color: '#60a5fa !important',
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(59,130,246,0.12) !important',
                            color: '#e2e8f0',
                          },
                        }}
                      >
                        {role}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <Typography sx={{ color: '#8b949e', fontWeight: 400, fontSize: 14 }}>{member.role}</Typography>
                )}
              />
              {isEditing && (
                <ListItemSecondaryAction>
                  <Tooltip title="Remove Member">
                    <IconButton edge="end" color="error" onClick={() => handleRemove(idx)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
        {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
      </Paper>

      {/* Invite Modal */}
      <Dialog 
        open={inviteModalOpen} 
        onClose={handleInviteClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: '#23272f',
            borderRadius: 3,
            border: '1px solid #30363d',
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 700, fontSize: 20, pb: 1 }}>
          Invite Team Member
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {inviteSuccess ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Alert severity="success" sx={{ 
                background: 'rgba(34,197,94,0.08)', 
                border: '1px solid rgba(34,197,94,0.3)', 
                color: '#4ade80',
                mb: 2
              }}>
                <Typography variant="h6" sx={{ color: '#4ade80', fontWeight: 600, mb: 1 }}>
                  Invitation Sent Successfully!
                </Typography>
                <Typography sx={{ color: '#4ade80', fontSize: 15 }}>
                  An invitation has been sent to <strong>{inviteEmail}</strong>
                </Typography>
                <Typography sx={{ color: '#4ade80', fontSize: 14, mt: 1, opacity: 0.8 }}>
                  They will receive an email with instructions to join your team.
                </Typography>
              </Alert>
            </Box>
          ) : (
            <Box sx={{ pt: 1 }}>
              <Typography sx={{ color: '#8b949e', mb: 2, fontSize: 15 }}>
                Enter the email address of the person you'd like to invite to your team.
              </Typography>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={inviteEmail}
                onChange={handleEmailChange}
                variant="outlined"
                disabled={inviteLoading}
                error={!!emailError}
                helperText={emailError}
                placeholder="colleague@company.com"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e2e8f0',
                    '& fieldset': {
                      borderColor: emailError ? '#ef4444' : '#4b5563',
                    },
                    '&:hover fieldset': {
                      borderColor: emailError ? '#ef4444' : '#60a5fa',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: emailError ? '#ef4444' : '#60a5fa',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: emailError ? '#ef4444' : '#8b949e',
                    '&.Mui-focused': {
                      color: emailError ? '#ef4444' : '#60a5fa',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#ef4444',
                    fontSize: 13,
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          {inviteSuccess ? (
            <Button
              onClick={handleInviteClose}
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2, fontWeight: 600, px: 3 }}
            >
              Close
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleInviteClose}
                sx={{ color: '#8b949e', borderColor: '#4b5563' }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendInvite}
                disabled={!isEmailValid || inviteLoading}
                variant="contained"
                color="primary"
                startIcon={inviteLoading ? <CircularProgress size={16} /> : <UserPlus size={16} />}
                sx={{ borderRadius: 2, fontWeight: 600, px: 3 }}
              >
                {inviteLoading ? 'Sending...' : 'Send Invite'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeamMembersSection; 