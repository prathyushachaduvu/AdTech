import React, { useState, useRef } from 'react';
import { Box, Button, Typography, Paper, TextField, IconButton, useTheme, Tooltip, Avatar } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Pencil, Check, X, UploadCloud } from 'lucide-react';
import type { CompanyInfo } from '../types/profile';

interface CompanyInfoSectionProps {
  data: CompanyInfo;
  onSave: (data: CompanyInfo) => void;
  loading?: boolean;
  editing?: boolean;
  onRequestEdit?: () => void;
  onEditEnd?: () => void;
}

export default function CompanyInfoSection({ data, onSave, loading = false, editing, onRequestEdit, onEditEnd }: CompanyInfoSectionProps) {
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const isEditing = editing !== undefined ? editing : isEditingLocal;
  const [formData, setFormData] = useState<CompanyInfo>(data);
  const [logoPreview, setLogoPreview] = useState<string>(data.logoUrl || '');
  const [errors, setErrors] = useState({ name: '', website: '' });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors = { name: '', website: '' };
    if (!formData.name.trim()) newErrors.name = 'Company name is required.';
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) newErrors.website = 'Enter a valid website URL (https://...)';
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleEdit = () => {
    setFormData(data);
    setLogoPreview(data.logoUrl || '');
    if (onRequestEdit) onRequestEdit();
    if (editing === undefined) setIsEditingLocal(true);
  };
  const handleCancel = () => {
    setFormData(data);
    setLogoPreview(data.logoUrl || '');
    if (editing === undefined) setIsEditingLocal(false);
    if (editing !== undefined && onEditEnd) onEditEnd();
  };
  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...formData, logoUrl: logoPreview });
    if (editing === undefined) setIsEditingLocal(false);
    if (editing !== undefined && onEditEnd) onEditEnd();
  };
  const handleChange = (field: keyof CompanyInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: '' });
    }
  };
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setLogoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };
  const handleLogoRemove = () => {
    setLogoPreview('');
    setFormData({ ...formData, logoUrl: '' });
    // Optionally reset file input (if you want to do this, add a ref)
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = ev => setLogoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
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
          Company Information
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isEditing && (
            <Tooltip title="Edit Company Information">
              <IconButton
                onClick={handleEdit}
                sx={{
                  color: '#8b949e',
                  transition: 'color 0.2s',
                  ml: 1,
                  '&:hover': { color: theme.palette.success.main, background: 'rgba(22,163,74,0.08)' },
                }}
                aria-label="Edit Company Information"
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
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(5, 1fr)' },
            rowGap: 2,
            columnGap: 7,
            mb: 1,
            '@media (max-width: 600px)': {
              gridTemplateColumns: '1fr',
            },
          }}
        >
          <Box sx={{ gridColumn: '1 / span 2' }}>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 0.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Company Name</Typography>
            <Typography variant="body1" fontWeight={500} sx={{ color: '#e2e8f0', fontSize: 15 }}>{data.name || 'Not provided'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 0.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Website</Typography>
            {data.website ? (
              <Typography variant="body1" fontWeight={500} sx={{ fontSize: 15 }}>
                <a
                  href={data.website}
                  style={{
                    color: '#e2e8f0',
                    textDecoration: 'none',
                    transition: 'text-decoration 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.website}
                </a>
              </Typography>
            ) : (
              <Typography variant="body1" fontWeight={500} sx={{ color: '#e2e8f0', fontSize: 15 }}>Not provided</Typography>
            )}
          </Box>
          <Box />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minHeight: 88 }}>
            {data.logoUrl && (
              <Avatar src={data.logoUrl} alt="Company Logo" sx={{ width: 88, height: 88, bgcolor: '#1e293b' }} />
            )}
          </Box>
          <Box sx={{ gridColumn: '1 / span 2' }}>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 0.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Address</Typography>
            <Typography variant="body1" fontWeight={500} sx={{ color: '#e2e8f0', fontSize: 15, whiteSpace: 'pre-line' }}>{data.address || 'Not provided'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 0.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Company Size</Typography>
            <Typography variant="body1" fontWeight={500} sx={{ color: '#e2e8f0', fontSize: 15 }}>{data.size || 'Not provided'}</Typography>
          </Box>
          <Box />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minHeight: 40 }}>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 0.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Industry</Typography>
            <Typography variant="body1" fontWeight={500} sx={{ color: '#e2e8f0', fontSize: 15 }}>{data.industry || 'Not provided'}</Typography>
          </Box>
          <Box sx={{ gridColumn: '1 / span 5' }}>
            <Typography variant="caption" color="#8b949e" sx={{ mb: 0.5, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Description</Typography>
            <Box sx={{ position: 'relative', maxWidth: '100%' }}>
              <Box
                sx={{
                  color: '#e2e8f0',
                  fontWeight: 500,
                  fontSize: 15,
                  maxHeight: showFullDescription ? 'none' : 72,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: showFullDescription ? 'none' : 3,
                  WebkitBoxOrient: 'vertical',
                  transition: 'max-height 0.2s',
                }}
              >
                {data.description || 'Not provided'}
              </Box>
              {!showFullDescription && data.description && data.description.length > 120 && (
                <Box
                  sx={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 32,
                    background: 'linear-gradient(180deg, rgba(35,39,47,0) 0%, #23272f 90%)',
                  }}
                />
              )}
            </Box>
            {data.description && data.description.length > 120 && (
              <Button
                size="small"
                sx={{ mt: 1, color: '#8b949e', textTransform: 'none', fontWeight: 600, px: 0 }}
                onClick={() => setShowFullDescription(v => !v)}
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        <Box component="form" autoComplete="off" sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Company Name"
                value={formData.name}
                onChange={handleChange('name')}
                fullWidth
                variant="filled"
                required
                InputLabelProps={{ style: { color: '#8b949e' } }}
                InputProps={{ style: { color: '#e2e8f0' } }}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Website (Optional)"
                value={formData.website || ''}
                onChange={handleChange('website')}
                fullWidth
                variant="filled"
                InputLabelProps={{ style: { color: '#8b949e' } }}
                InputProps={{ style: { color: '#e2e8f0' } }}
                error={!!errors.website}
                helperText={errors.website}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Industry (Optional)"
                value={formData.industry || ''}
                onChange={handleChange('industry')}
                fullWidth
                variant="filled"
                InputLabelProps={{ style: { color: '#8b949e' } }}
                InputProps={{ style: { color: '#e2e8f0' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Company Size (Optional)"
                value={formData.size || ''}
                onChange={handleChange('size')}
                fullWidth
                variant="filled"
                InputLabelProps={{ style: { color: '#8b949e' } }}
                InputProps={{ style: { color: '#e2e8f0' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Address (Optional)"
                value={formData.address || ''}
                onChange={handleChange('address')}
                fullWidth
                variant="filled"
                InputLabelProps={{ style: { color: '#8b949e' } }}
                InputProps={{ style: { color: '#e2e8f0' } }}
                multiline
                minRows={2}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 1,
                  mt: 1,
                  width: '100%',
                }}
              >
                <Typography variant="subtitle2" color="#8b949e" sx={{ mb: 0.5 }}>Logo (Optional)</Typography>
                <input
                  ref={inputRef}
                  id="company-logo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleLogoChange}
                />
                {!logoPreview && (
                  <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    sx={{
                      width: 160,
                      height: 80,
                      border: dragActive ? '2px dashed #60a5fa' : '2px dashed #4b5563',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: dragActive ? 'rgba(96,165,250,0.08)' : 'transparent',
                      cursor: 'pointer',
                      mb: 1,
                      transition: 'border 0.2s, background 0.2s',
                      textAlign: 'center',
                    }}
                    onClick={e => {
                      e.preventDefault();
                      inputRef.current?.click();
                    }}
                  >
                    <UploadCloud size={32} style={{ color: dragActive ? '#60a5fa' : '#8b949e', marginBottom: 4 }} />
                    <Typography variant="body2" sx={{ color: '#8b949e', fontWeight: 600 }}>Upload Logo</Typography>
                  </Box>
                )}
                {!logoPreview && (
                  <Typography variant="caption" color="#8b949e" sx={{ mb: 1 }}>PNG, JPG, max 2MB. Drag & drop or click to upload.</Typography>
                )}
                {logoPreview && (
                  <Box sx={{ position: 'relative', mt: 1 }}>
                    <Avatar src={logoPreview} alt="Logo Preview" sx={{ width: 88, height: 88, bgcolor: '#1e293b', border: '2px solid #374151', boxShadow: 2 }} />
                    <IconButton
                      size="small"
                      onClick={handleLogoRemove}
                      sx={{ position: 'absolute', top: -10, right: -10, bgcolor: '#23272f', color: '#ef4444', border: '1px solid #374151', '&:hover': { bgcolor: '#181c20' } }}
                      aria-label="Remove logo"
                    >
                      <X size={18} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description (Optional)"
                value={formData.description || ''}
                onChange={handleChange('description')}
                fullWidth
                variant="filled"
                InputLabelProps={{ style: { color: '#8b949e' } }}
                InputProps={{ style: { color: '#e2e8f0' } }}
                multiline
                minRows={2}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
} 