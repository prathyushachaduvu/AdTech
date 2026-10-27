import React, { useState } from 'react';
import { Box, Button, Typography, Paper, TextField, IconButton, useTheme, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Pencil, Check, X} from 'lucide-react';

interface PersonalInfoData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  department: string;
}

interface PersonalInfoSectionProps {
  data: PersonalInfoData;
  onSave: (data: PersonalInfoData) => void;
  loading?: boolean;
  editing?: boolean;
  onRequestEdit?: () => void;
  onEditEnd?: () => void;
}

export default function PersonalInfoSection({ data, onSave, loading = false, editing, onRequestEdit, onEditEnd }: PersonalInfoSectionProps) {
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const isEditing = editing !== undefined ? editing : isEditingLocal;
  const [formData, setFormData] = useState<PersonalInfoData>(data);
  const theme = useTheme();

  // Add validation state and logic
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
  });

  const validate = () => {
    const newErrors: typeof errors = { firstName: '', lastName: '', email: '', jobTitle: '' };
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email address is required.';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required.';
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleEdit = () => {
    setFormData(data);
    if (onRequestEdit) onRequestEdit();
    if (editing === undefined) setIsEditingLocal(true);
  };

  const handleCancel = () => {
    setFormData(data);
    if (editing === undefined) setIsEditingLocal(false);
    if (editing !== undefined && onEditEnd) onEditEnd();
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(formData);
    if (editing === undefined) setIsEditingLocal(false);
    if (editing !== undefined && onEditEnd) onEditEnd();
  };

  const handleChange = (field: keyof PersonalInfoData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 4 },
        mb: 4,
        background: '#23272f',
        borderRadius: 3,
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
        maxWidth: '100%',
        border: '1px solid #30363d',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ color: '#fff', fontSize: { xs: 18, sm: 20 }, letterSpacing: 0.3 }}
        >
          Personal Information
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isEditing && (
            <Tooltip title="Edit Personal Information">
              <IconButton
                onClick={handleEdit}
                sx={{
                  color: '#8b949e',
                  transition: 'color 0.2s',
                  ml: 1,
                  '&:hover': { color: theme.palette.success.main, background: 'rgba(22,163,74,0.08)' },
                }}
                aria-label="Edit Personal Information"
              >
                <Pencil size={18} />
              </IconButton>
            </Tooltip>
          )}
          {isEditing && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
                disabled={loading || hasErrors}
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

      {!isEditing ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            rowGap: 2,
            columnGap: 4,
            mb: 1,
            '@media (max-width: 600px)': {
              gridTemplateColumns: '1fr',
            },
          }}
        >
          <Box>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 0.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>First Name</Typography>
            <Typography variant="body1" fontWeight={500} sx={{ color: '#e2e8f0', fontSize: 15 }}>{data.firstName || 'Not provided'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 0.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Middle Name</Typography>
            <Typography variant="body1" fontWeight={500} sx={{ color: '#e2e8f0', fontSize: 15 }}>{data.middleName || 'Not provided'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 0.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Last Name</Typography>
            <Typography variant="body1" fontWeight={500} sx={{ color: '#e2e8f0', fontSize: 15 }}>{data.lastName || 'Not provided'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 0.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone Number</Typography>
            <Typography variant="body1" fontWeight={500} sx={{ color: '#e2e8f0', fontSize: 15 }}>{data.phoneNumber || 'Not provided'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 0.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email Address</Typography>
            <Typography variant="body1" fontWeight={500} sx={{ color: '#e2e8f0', fontSize: 15 }}>{data.email || 'Not provided'}</Typography>
          </Box>
          <Box />
          <Box>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 0.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Job Title</Typography>
            <Typography variant="body1" fontWeight={500} sx={{ color: '#e2e8f0', fontSize: 15 }}>{data.jobTitle || 'Not provided'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 0.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Department</Typography>
            <Typography variant="body1" fontWeight={500} sx={{ color: '#e2e8f0', fontSize: 15 }}>{data.department || 'Not provided'}</Typography>
          </Box>
          <Box />
        </Box>
      ) : (
        <Box component="form" autoComplete="off" sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                fullWidth
                variant="filled"
                required
                InputLabelProps={{ style: { color: '#8b949e' } }}
                InputProps={{ style: { color: '#e2e8f0' } }}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Middle Name (Optional)"
                value={formData.middleName}
                onChange={handleChange('middleName')}
                fullWidth
                variant="filled"
                InputLabelProps={{ style: { color: '#8b949e' } }}
                InputProps={{ style: { color: '#e2e8f0' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                fullWidth
                variant="filled"
                required
                InputLabelProps={{ style: { color: '#8b949e' } }}
                InputProps={{ style: { color: '#e2e8f0' } }}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Phone Number (Optional)"
                value={formData.phoneNumber}
                onChange={handleChange('phoneNumber')}
                fullWidth
                variant="filled"
                InputLabelProps={{ style: { color: '#8b949e' } }}
                InputProps={{ style: { color: '#e2e8f0' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Email Address"
                value={formData.email}
                onChange={handleChange('email')}
                fullWidth
                variant="filled"
                required
                InputLabelProps={{ style: { color: '#8b949e' } }}
                InputProps={{ style: { color: '#e2e8f0' } }}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}></Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Job Title"
                value={formData.jobTitle}
                onChange={handleChange('jobTitle')}
                fullWidth
                variant="filled"
                required
                InputLabelProps={{ style: { color: '#8b949e' } }}
                InputProps={{ style: { color: '#e2e8f0' } }}
                error={!!errors.jobTitle}
                helperText={errors.jobTitle}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Department (Optional)"
                value={formData.department}
                onChange={handleChange('department')}
                fullWidth
                variant="filled"
                InputLabelProps={{ style: { color: '#8b949e' } }}
                InputProps={{ style: { color: '#e2e8f0' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}></Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
} 