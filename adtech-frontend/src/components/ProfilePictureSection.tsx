import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Avatar, IconButton, Button, CircularProgress, Tooltip } from '@mui/material';
import { UploadCloud, X, Pencil, Check } from 'lucide-react';

interface ProfilePictureSectionProps {
  imageUrl?: string;
  onChange: (img: string | null) => void;
  loading?: boolean;
  editing?: boolean;
  onRequestEdit?: () => void;
  onEditEnd?: () => void;
}

const ProfilePictureSection: React.FC<ProfilePictureSectionProps> = ({ imageUrl, onChange, loading, editing, onRequestEdit, onEditEnd }) => {
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const isEditing = editing !== undefined ? editing : isEditingLocal;
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(imageUrl);
  const [tempImage, setTempImage] = useState<string | null>(null);

  // Keep preview in sync with prop
  useEffect(() => {
    if (!isEditing) setPreview(imageUrl);
  }, [imageUrl, isEditing]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = ev => {
      setTempImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
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
  const handleRemove = () => {
    setTempImage(null);
  };
  const handleEdit = () => {
    setTempImage(null);
    if (onRequestEdit) onRequestEdit();
    if (editing === undefined) setIsEditingLocal(true);
  };
  const handleCancel = () => {
    setTempImage(null);
    if (editing === undefined) setIsEditingLocal(false);
    if (editing !== undefined && onEditEnd) onEditEnd();
  };
  const handleSave = () => {
    onChange(tempImage === undefined ? null : tempImage);
    if (editing === undefined) setIsEditingLocal(false);
    if (editing !== undefined && onEditEnd) onEditEnd();
  };

  // Show tempImage if editing, else preview
  const displayImage = isEditing ? tempImage ?? preview : preview;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        background: '#23272f',
        borderRadius: 3,
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
        border: '1px solid #30363d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 220,
        maxWidth: 320,
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2, justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: '#fff', fontSize: { xs: 18, sm: 20 }, letterSpacing: 0.3 }}>Profile Picture</Typography>
        {!isEditing && (
          <Tooltip title="Edit Profile Picture">
            <IconButton
              onClick={handleEdit}
              sx={{ color: '#8b949e', transition: 'color 0.2s', ml: 1, '&:hover': { color: '#60a5fa', background: 'rgba(96,165,250,0.08)' } }}
              aria-label="Edit Profile Picture"
            >
              <Pencil size={18} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <input
        ref={inputRef}
        id="profile-picture-upload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      {!isEditing ? (
        <>
          <Box sx={{ mb: 2 }}>
            <Avatar src={displayImage} alt="Profile Preview" sx={{ width: 140, height: 140, bgcolor: '#1e293b', border: '2px dashed #374151', boxShadow: 2 }} />
          </Box>
        </>
      ) : (
        <>
          {!displayImage && (
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              sx={{
                width: 140,
                height: 140,
                border: dragActive ? '2px dashed #60a5fa' : '2px dashed #4b5563',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: dragActive ? 'rgba(96,165,250,0.08)' : 'transparent',
                cursor: 'pointer',
                mb: 2,
                transition: 'border 0.2s, background 0.2s',
                textAlign: 'center',
              }}
              onClick={e => {
                e.preventDefault();
                inputRef.current?.click();
              }}
            >
              <UploadCloud size={36} style={{ color: dragActive ? '#60a5fa' : '#8b949e', marginBottom: 8 }} />
              <Typography variant="body2" sx={{ color: '#8b949e', fontWeight: 600 }}>Upload Photo</Typography>
            </Box>
          )}
          {displayImage && (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Avatar src={displayImage} alt="Profile Preview" sx={{ width: 140, height: 140, bgcolor: '#1e293b', border: '2px solid #374151', boxShadow: 2 }} />
              <IconButton
                size="small"
                onClick={handleRemove}
                sx={{ position: 'absolute', top: -10, right: -10, bgcolor: '#23272f', color: '#ef4444', border: '1px solid #374151', '&:hover': { bgcolor: '#181c20' } }}
                aria-label="Remove profile picture"
              >
                <X size={18} />
              </IconButton>
            </Box>
          )}
          <Typography variant="caption" color="#8b949e" sx={{ mb: 1, textAlign: 'center' }}>
            PNG, JPG, max 2MB. Drag & drop or click to upload.
          </Typography>
        </>
      )}
      {isEditing && (
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSave}
            disabled={loading || (!tempImage && tempImage !== null && tempImage !== undefined)}
            startIcon={<Check size={16} />}
            sx={{ borderRadius: 2, fontWeight: 600, px: 2, py: 0.5, fontSize: 14, minWidth: 90, height: 36, mr: 1, boxShadow: 'none' }}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{ borderRadius: 2, color: '#8b949e', borderColor: '#4b5563', px: 2, py: 0.5, fontSize: 14, minWidth: 90, height: 36, boxShadow: 'none' }}
          >
            Cancel
          </Button>
        </Box>
      )}
      {loading && <CircularProgress size={24} sx={{ mt: 1 }} />}
    </Box>
  );
};

export default ProfilePictureSection; 