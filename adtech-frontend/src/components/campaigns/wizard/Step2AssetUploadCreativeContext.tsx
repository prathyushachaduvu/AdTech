import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Paper, Typography, TextField, Button, Chip, IconButton, InputAdornment, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { X as LucideX } from 'lucide-react';

interface Step2AssetUploadCreativeContextProps {
  onDataUpdate?: (data: { isValid: boolean; formData: any }) => void;
  initialData?: any;
  promoteType?: string; // 'product' or 'service', from Step 1
}

const DRAFT_KEY = 'campaignWizardStep2Draft';

const Step2AssetUploadCreativeContext: React.FC<Step2AssetUploadCreativeContextProps> = ({ onDataUpdate, initialData, promoteType }) => {
  // Brand Asset Uploads
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  // Product Context
  const [productFeatures, setProductFeatures] = useState('');
  const [productValueProps, setProductValueProps] = useState<string[]>([]);
  const [productValuePropInput, setProductValuePropInput] = useState('');
  const [productImages, setProductImages] = useState<File[]>([]);

  // Service Context
  const [serviceHighlights, setServiceHighlights] = useState('');
  const [customerPromise, setCustomerPromise] = useState('');
  const [serviceCollateralFile, setServiceCollateralFile] = useState<File | null>(null);

  // Uploaded Files (for display)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Autosave and draft
  const [lastSaveTime, setLastSaveTime] = useState('');
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Add drag-and-drop state for visual feedback
  const [logoDragActive, setLogoDragActive] = useState(false);
  const [productImagesDragActive, setProductImagesDragActive] = useState(false);
  const [serviceCollateralDragActive, setServiceCollateralDragActive] = useState(false);

  // Add error state for file upload errors
  const [logoFileError, setLogoFileError] = useState('');
  const [productImagesError, setProductImagesError] = useState('');
  const [serviceCollateralError, setServiceCollateralError] = useState('');

  // Helper to trigger file input click
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const productImagesInputRef = React.useRef<HTMLInputElement>(null);
  const serviceCollateralInputRef = React.useRef<HTMLInputElement>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Simulated loading state
  const [uploadLoading, setUploadLoading] = useState<{ logo: boolean; product: boolean; service: boolean }>({ logo: false, product: false, service: false });
  const [criticalError, setCriticalError] = useState('');
  const [criticalErrorOpen, setCriticalErrorOpen] = useState(false);

  // Add state for product image previews
  const [productImagePreviews, setProductImagePreviews] = useState<string[]>([]);

  // Add state for service collateral preview
  const [serviceCollateralPreview, setServiceCollateralPreview] = useState<string | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        setLogoFile(data.logoFile || null);
        setProductFeatures(data.productFeatures || '');
        setProductValueProps(data.productValueProps || []);
        setProductImages(data.productImages || []);
        setServiceHighlights(data.serviceHighlights || '');
        setCustomerPromise(data.customerPromise || '');
        setServiceCollateralFile(data.serviceCollateralFile || null);
        if (data.lastSaveTime) setLastSaveTime(data.lastSaveTime);
      } catch {}
    }
  }, []);

  // Debounced autosave (to be implemented)
  const saveDraft = useCallback(() => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const draft = {
      logoFile,
      productFeatures,
      productValueProps,
      productImages,
      serviceHighlights,
      customerPromise,
      serviceCollateralFile,
      lastSaveTime: currentTime,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setIsAutoSaving(false);
    setLastSaveTime(currentTime);
  }, [logoFile, productFeatures, productValueProps, productImages, serviceHighlights, customerPromise, serviceCollateralFile]);

  useEffect(() => {
    // TODO: Add debounced save logic
  }, [logoFile, productFeatures, productValueProps, productImages, serviceHighlights, customerPromise, serviceCollateralFile, saveDraft]);

  // Validation
  const errors: Record<string, string> = {};

  // Brand Asset Uploads
  if (!logoFile) {
    errors.logoFile = 'Logo is required.';
  } else if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(logoFile.type)) {
    errors.logoFile = 'Logo must be PNG, JPG, or SVG.';
  } else if (logoFile.size > 5 * 1024 * 1024) {
    errors.logoFile = 'Logo must be under 5MB.';
  }

  // Product/Service Context
  if (promoteType === 'product') {
    if (!productFeatures.trim()) {
      errors.productFeatures = 'Product features are required.';
    }
    if (productValueProps.length === 0) {
      errors.productValueProps = 'Add at least one value prop.';
    }
    if (productImages.length === 0) {
      errors.productImages = 'Upload at least one product image.';
    } else if (productImages.length > 2) {
      errors.productImages = 'Maximum 2 product images.';
    } else {
      productImages.forEach((img, idx) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(img.type)) {
          errors[`productImages_${idx}`] = 'Product image must be JPG, PNG, or WEBP.';
        } else if (img.size > 5 * 1024 * 1024) {
          errors[`productImages_${idx}`] = 'Product image must be under 5MB.';
        }
      });
    }
  } else if (promoteType === 'service') {
    if (!serviceHighlights.trim()) {
      errors.serviceHighlights = 'Service highlights are required.';
    }
    if (!customerPromise.trim()) {
      errors.customerPromise = 'Customer promise is required.';
    }
    if (serviceCollateralFile) {
      if (!['image/png', 'application/pdf', 'image/jpeg'].includes(serviceCollateralFile.type)) {
        errors.serviceCollateralFile = 'Collateral must be PNG, PDF, or JPG.';
      } else if (serviceCollateralFile.size > 10 * 1024 * 1024) {
        errors.serviceCollateralFile = 'Collateral must be under 10MB.';
      }
    }
  }

  const isValid = Object.keys(errors).length === 0;

  // Notify parent of validation status
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({
        isValid,
        formData: {
          logoFile,
          productFeatures,
          productValueProps,
          productImages,
          serviceHighlights,
          customerPromise,
          serviceCollateralFile,
        }
      });
    }
  }, [isValid, logoFile, productFeatures, productValueProps, productImages, serviceHighlights, customerPromise, serviceCollateralFile, onDataUpdate]);

  // Add requiredLabel helper
  const requiredLabel = (label: string) => (
    <span>{label} <span style={{ color: '#bfc9d1' }}>*</span></span>
  );

  // Debounced auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        logoFile || productFeatures || productValueProps.length > 0 || productImages.length > 0 || serviceHighlights || customerPromise || serviceCollateralFile
      ) {
        setIsAutoSaving(true);
        saveDraft();
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [logoFile, productFeatures, productValueProps, productImages, serviceHighlights, customerPromise, serviceCollateralFile, saveDraft]);

  // Add handleClearDraft function
  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setLogoFile(null);
    setProductFeatures('');
    setProductValueProps([]);
    setProductImages([]);
    setServiceHighlights('');
    setCustomerPromise('');
    setServiceCollateralFile(null);
    setLastSaveTime('');
    setSnackbarOpen(true);
  };

  // Handle logo file preview
  const handleLogoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = ev => {
      setLogoPreviewUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle product image previews
  const handleProductImageFiles = (files: File[]) => {
    const readers = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = ev => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(urls => setProductImagePreviews(urls));
  };

  // Handle service collateral preview
  const handleServiceCollateralPreview = (file: File) => {
    if (file.type === 'application/pdf') {
      setServiceCollateralPreview(null); // No image preview for PDF
    } else {
      const reader = new FileReader();
      reader.onload = ev => setServiceCollateralPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Brand Asset Uploads */}
      <Paper sx={{ background: '#23272f', p: 5, borderRadius: 3, border: '1px solid #30363d', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', width: 1000, maxWidth: '100%', mx: 'auto', mb: 4 }} elevation={3}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 26, color: '#e2e8f0', mb: 3, letterSpacing: 0.2 }}>Brand Asset Uploads</Typography>
        {/* Logo Upload */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: '#bfc9d1', mb: 1 }}>Logo Upload *</Typography>
          {!logoFile ? (
            <Button
              component="div"
              variant="outlined"
              startIcon={<ImageIcon />}
              sx={{
                border: logoDragActive ? '2px solid #3b82f6' : '2px dashed #374151',
                background: '#181c20',
                color: '#bfc9d1',
                width: '100%',
                minHeight: 100,
                justifyContent: 'center',
                mb: 1,
                transition: 'border 0.2s',
                outline: logoDragActive ? '2px solid #3b82f6' : undefined,
                '&:focus': { outline: '2px solid #3b82f6' },
                position: 'relative',
                p: 0,
              }}
              tabIndex={0}
              role="button"
              aria-label="Upload brand logo (PNG, JPG, SVG, max 5MB)"
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  logoInputRef.current?.click();
                }
              }}
              onClick={() => logoInputRef.current?.click()}
              onDragOver={e => {
                e.preventDefault();
                setLogoDragActive(true);
              }}
              onDragLeave={e => {
                e.preventDefault();
                setLogoDragActive(false);
              }}
              onDrop={e => {
                e.preventDefault();
                setLogoDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const file = e.dataTransfer.files[0];
                  if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
                    setLogoFileError('Logo must be PNG, JPG, or SVG.');
                    setCriticalError('Logo must be PNG, JPG, or SVG.');
                    setCriticalErrorOpen(true);
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    setLogoFileError('Logo must be under 5MB.');
                    setCriticalError('Logo must be under 5MB.');
                    setCriticalErrorOpen(true);
                    return;
                  }
                  setUploadLoading(l => ({ ...l, logo: true }));
                  setTimeout(() => {
                    setLogoFile(file);
                    handleLogoFile(file);
                    setLogoFileError('');
                    setUploadLoading(l => ({ ...l, logo: false }));
                  }, 1500);
                }
              }}
            >
              <Box>
                <Typography sx={{ color: '#64748b' }}>Click to upload or drag and drop</Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>PNG, JPG, SVG up to 5MB</Typography>
              </Box>
              {uploadLoading.logo && (
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(24,28,32,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                  <CircularProgress size={36} sx={{ color: '#3b82f6' }} />
                </Box>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.svg"
                hidden
                tabIndex={-1}
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
                      setLogoFileError('Logo must be PNG, JPG, or SVG.');
                      setCriticalError('Logo must be PNG, JPG, or SVG.');
                      setCriticalErrorOpen(true);
                      return;
                    }
                    if (file.size > 5 * 1024 * 1024) {
                      setLogoFileError('Logo must be under 5MB.');
                      setCriticalError('Logo must be under 5MB.');
                      setCriticalErrorOpen(true);
                      return;
                    }
                    setUploadLoading(l => ({ ...l, logo: true }));
                    setTimeout(() => {
                      setLogoFile(file);
                      handleLogoFile(file);
                      setLogoFileError('');
                      setUploadLoading(l => ({ ...l, logo: false }));
                    }, 1500);
                  }
                }}
              />
            </Button>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', py: 3 }}>
              <Box sx={{ position: 'relative', width: 120, height: 120, mb: 2 }}>
                <img
                  src={logoPreviewUrl || ''}
                  alt="Logo preview"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: 'contain',
                    borderRadius: 12,
                    background: '#fff',
                    border: '2px solid #3b82f6',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                    padding: 8,
                    display: 'block',
                  }}
                />
                <IconButton
                  size="small"
                  onClick={e => { e.stopPropagation(); setLogoFile(null); setLogoPreviewUrl(null); }}
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    bgcolor: '#23272f',
                    color: '#ef4444',
                    border: '1px solid #374151',
                    '&:hover': { bgcolor: '#181c20' },
                    zIndex: 2,
                  }}
                  aria-label="Remove logo"
                >
                  <LucideX size={18} />
                </IconButton>
              </Box>
              <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 18, mt: 1, textAlign: 'center', wordBreak: 'break-all' }}>
                {logoFile.name}
              </Typography>
            </Box>
          )}
          {logoFileError && <Typography variant="caption" sx={{ color: '#bfc9d1', mt: 0.5 }}>{logoFileError}</Typography>}
        </Box>
      </Paper>

      {/* Product or Service Context */}
      {promoteType === 'product' && (
        <Paper sx={{ background: '#23272f', p: 5, borderRadius: 3, border: '1px solid #30363d', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', width: 1000, maxWidth: '100%', mx: 'auto', mb: 4 }} elevation={3}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 26, color: '#e2e8f0', mb: 3, letterSpacing: 0.2 }}>Product Context</Typography>
          {/* Product Features */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#bfc9d1', mb: 1 }}>Product Features *</Typography>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              variant="filled"
              value={productFeatures}
              onChange={e => setProductFeatures(e.target.value)}
              placeholder="What are the top 3–5 things your product offers?\nExample: Waterproof. Compact. Lasts 14 hours."
              sx={{
                input: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                textarea: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                label: { color: '#bfc9d1', fontWeight: 500 },
                select: { background: 'transparent' },
                '.MuiFilledInput-root': {
                  background: 'transparent',
                  borderRadius: 2,
                  border: '1px solid #374151',
                  boxShadow: 'none',
                  '&:hover': { background: 'transparent', borderColor: '#525c6b' },
                  '&.Mui-focused': { background: 'transparent', borderColor: '#525c6b' },
                  mb: 2
                },
              }}
            />
          </Box>
          {/* Product Value Props (Chips) */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#bfc9d1', mb: 1 }}>Product Benefits / Value Props</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {productValueProps.map((prop, idx) => (
                <Chip
                  key={prop}
                  label={prop}
                  onDelete={() => setProductValueProps(productValueProps.filter((_, i) => i !== idx))}
                  sx={{ background: '#181c20', color: '#e2e8f0', border: '1px solid #374151' }}
                />
              ))}
            </Box>
            <TextField
              fullWidth
              variant="filled"
              value={productValuePropInput}
              onChange={e => setProductValuePropInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && productValuePropInput.trim()) {
                  e.preventDefault();
                  if (!productValueProps.includes(productValuePropInput.trim())) {
                    setProductValueProps([...productValueProps, productValuePropInput.trim()]);
                  }
                  setProductValuePropInput('');
                }
              }}
              placeholder="Type a value prop and press Enter"
              sx={{
                input: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                textarea: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                label: { color: '#bfc9d1', fontWeight: 500 },
                select: { background: 'transparent' },
                '.MuiFilledInput-root': {
                  background: 'transparent',
                  borderRadius: 2,
                  border: '1px solid #374151',
                  boxShadow: 'none',
                  '&:hover': { background: 'transparent', borderColor: '#525c6b' },
                  '&.Mui-focused': { background: 'transparent', borderColor: '#525c6b' },
                  mb: 2
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Add">
                      <IconButton
                        onClick={() => {
                          if (productValuePropInput.trim() && !productValueProps.includes(productValuePropInput.trim())) {
                            setProductValueProps([...productValueProps, productValuePropInput.trim()]);
                            setProductValuePropInput('');
                          }
                        }}
                        size="small"
                        edge="end"
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
            <Typography variant="caption" sx={{ color: '#64748b' }}>Press Enter to add tags</Typography>
          </Box>
          {/* Product Image Upload */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#bfc9d1', mb: 1 }}>Product Image Upload *</Typography>
            {productImages.length === 0 ? (
              <Button
                component="div"
                variant="outlined"
                startIcon={<ImageIcon />}
                sx={{
                  border: productImagesDragActive ? '2px solid #3b82f6' : '2px dashed #374151',
                  background: '#181c20',
                  color: '#bfc9d1',
                  width: '100%',
                  minHeight: 120,
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  transition: 'border 0.2s',
                  outline: productImagesDragActive ? '2px solid #3b82f6' : undefined,
                  '&:focus': { outline: '2px solid #3b82f6' },
                  position: 'relative',
                  p: 0,
                }}
                tabIndex={0}
                role="button"
                aria-label="Upload product images (JPG, PNG, WEBP, max 2, max 5MB each)"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    productImagesInputRef.current?.click();
                  }
                }}
                onClick={() => productImagesInputRef.current?.click()}
                onDragOver={e => {
                  e.preventDefault();
                  setProductImagesDragActive(true);
                }}
                onDragLeave={e => {
                  e.preventDefault();
                  setProductImagesDragActive(false);
                }}
                onDrop={e => {
                  e.preventDefault();
                  setProductImagesDragActive(false);
                  if (e.dataTransfer.files) {
                    const files = Array.from(e.dataTransfer.files).slice(0, 2);
                    const validFiles = files.filter(f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) && f.size <= 5 * 1024 * 1024);
                    if (validFiles.length !== files.length) {
                      setProductImagesError('Each image must be JPG, PNG, or WEBP and under 5MB.');
                      setCriticalError('Each image must be JPG, PNG, or WEBP and under 5MB.');
                      setCriticalErrorOpen(true);
                      return;
                    }
                    setUploadLoading(l => ({ ...l, product: true }));
                    setTimeout(() => {
                      setProductImages(validFiles);
                      handleProductImageFiles(validFiles);
                      setProductImagesError('');
                      setUploadLoading(l => ({ ...l, product: false }));
                    }, 1500);
                  }
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ color: '#64748b', fontSize: 14 }}>Upload<br/>product image</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>JPG, PNG, WEBP<br/>Max 2 images</Typography>
                </Box>
                {uploadLoading.product && (
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(24,28,32,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                    <CircularProgress size={36} sx={{ color: '#3b82f6' }} />
                  </Box>
                )}
                <input
                  ref={productImagesInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  hidden
                  multiple
                  tabIndex={-1}
                  onChange={e => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files).slice(0, 2);
                      const validFiles = files.filter(f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) && f.size <= 5 * 1024 * 1024);
                      if (validFiles.length !== files.length) {
                        setProductImagesError('Each image must be JPG, PNG, or WEBP and under 5MB.');
                        setCriticalError('Each image must be JPG, PNG, or WEBP and under 5MB.');
                        setCriticalErrorOpen(true);
                        return;
                      }
                      setUploadLoading(l => ({ ...l, product: true }));
                      setTimeout(() => {
                        setProductImages(validFiles);
                        handleProductImageFiles(validFiles);
                        setProductImagesError('');
                        setUploadLoading(l => ({ ...l, product: false }));
                      }, 1500);
                    }
                  }}
                />
              </Button>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                {productImages.map((file, idx) => (
                  <Box key={file.name + idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <Box sx={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={productImagePreviews[idx] || ''}
                        alt={`Product preview ${idx + 1}`}
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: 'contain',
                          borderRadius: 12,
                          background: '#fff',
                          border: '2px solid #3b82f6',
                          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                          padding: 8,
                          display: 'block',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newFiles = productImages.filter((_, i) => i !== idx);
                          setProductImages(newFiles);
                          const newPreviews = productImagePreviews.filter((_, i) => i !== idx);
                          setProductImagePreviews(newPreviews);
                        }}
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          bgcolor: '#23272f',
                          color: '#ef4444',
                          border: '1px solid #374151',
                          '&:hover': { bgcolor: '#181c20' },
                          zIndex: 2,
                        }}
                        aria-label={`Remove product image ${idx + 1}`}
                      >
                        <LucideX size={18} />
                      </IconButton>
                    </Box>
                    <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 16, mt: 1, textAlign: 'center', wordBreak: 'break-all', maxWidth: 140, lineHeight: 1.2 }}>
                      {file.name}
                    </Typography>
                  </Box>
                ))}
                {productImages.length < 2 && (
                  <Button
                    component="div"
                    variant="outlined"
                    startIcon={<ImageIcon />}
                    sx={{
                      border: productImagesDragActive ? '2px solid #3b82f6' : '2px dashed #374151',
                      background: '#181c20',
                      color: '#bfc9d1',
                      minWidth: 120,
                      maxWidth: 120,
                      minHeight: 120,
                      maxHeight: 120,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'border 0.2s',
                      outline: productImagesDragActive ? '2px solid #3b82f6' : undefined,
                      '&:focus': { outline: '2px solid #3b82f6' },
                      position: 'relative',
                      p: 0,
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Upload product images (JPG, PNG, WEBP, max 2, max 5MB each)"
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        productImagesInputRef.current?.click();
                      }
                    }}
                    onClick={() => productImagesInputRef.current?.click()}
                    onDragOver={e => {
                      e.preventDefault();
                      setProductImagesDragActive(true);
                    }}
                    onDragLeave={e => {
                      e.preventDefault();
                      setProductImagesDragActive(false);
                    }}
                    onDrop={e => {
                      e.preventDefault();
                      setProductImagesDragActive(false);
                      if (e.dataTransfer.files) {
                        const files = Array.from(e.dataTransfer.files).slice(0, 2 - productImages.length);
                        const validFiles = files.filter(f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) && f.size <= 5 * 1024 * 1024);
                        if (validFiles.length !== files.length) {
                          setProductImagesError('Each image must be JPG, PNG, or WEBP and under 5MB.');
                          setCriticalError('Each image must be JPG, PNG, or WEBP and under 5MB.');
                          setCriticalErrorOpen(true);
                          return;
                        }
                        setUploadLoading(l => ({ ...l, product: true }));
                        setTimeout(() => {
                          const newFiles = [...productImages, ...validFiles].slice(0, 2);
                          setProductImages(newFiles);
                          handleProductImageFiles(newFiles);
                          setProductImagesError('');
                          setUploadLoading(l => ({ ...l, product: false }));
                        }, 1500);
                      }
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{ color: '#64748b', fontSize: 14 }}>Upload<br/>product image</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>JPG, PNG, WEBP<br/>Max 2 images</Typography>
                    </Box>
                    {uploadLoading.product && (
                      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(24,28,32,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                        <CircularProgress size={36} sx={{ color: '#3b82f6' }} />
                      </Box>
                    )}
                    <input
                      ref={productImagesInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      hidden
                      multiple
                      tabIndex={-1}
                      onChange={e => {
                        if (e.target.files) {
                          const files = Array.from(e.target.files).slice(0, 2 - productImages.length);
                          const validFiles = files.filter(f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) && f.size <= 5 * 1024 * 1024);
                          if (validFiles.length !== files.length) {
                            setProductImagesError('Each image must be JPG, PNG, or WEBP and under 5MB.');
                            setCriticalError('Each image must be JPG, PNG, or WEBP and under 5MB.');
                            setCriticalErrorOpen(true);
                            return;
                          }
                          setUploadLoading(l => ({ ...l, product: true }));
                          setTimeout(() => {
                            const newFiles = [...productImages, ...validFiles].slice(0, 2);
                            setProductImages(newFiles);
                            handleProductImageFiles(newFiles);
                            setProductImagesError('');
                            setUploadLoading(l => ({ ...l, product: false }));
                          }, 1500);
                        }
                      }}
                    />
                  </Button>
                )}
              </Box>
            )}
            {productImagesError && <Typography variant="caption" sx={{ color: '#bfc9d1', mt: 0.5 }}>{productImagesError}</Typography>}
          </Box>
        </Paper>
      )}
      {promoteType === 'service' && (
        <Paper sx={{ background: '#23272f', p: 5, borderRadius: 3, border: '1px solid #30363d', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', width: 1000, maxWidth: '100%', mx: 'auto', mb: 4 }} elevation={3}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 26, color: '#e2e8f0', mb: 3, letterSpacing: 0.2 }}>Service Context</Typography>
          {/* Service Highlights */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#bfc9d1', mb: 1 }}>Service Highlights *</Typography>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              variant="filled"
              value={serviceHighlights}
              onChange={e => setServiceHighlights(e.target.value)}
              placeholder="Example: 24/7 support, personalized onboarding, data privacy built-in"
              sx={{
                input: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                textarea: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                label: { color: '#bfc9d1', fontWeight: 500 },
                select: { background: 'transparent' },
                '.MuiFilledInput-root': {
                  background: 'transparent',
                  borderRadius: 2,
                  border: '1px solid #374151',
                  boxShadow: 'none',
                  '&:hover': { background: 'transparent', borderColor: '#525c6b' },
                  '&.Mui-focused': { background: 'transparent', borderColor: '#525c6b' },
                  mb: 2
                },
              }}
            />
          </Box>
          {/* Customer Promise / Mission */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#bfc9d1', mb: 1 }}>Customer Promise / Mission</Typography>
            <TextField
              fullWidth
              variant="filled"
              value={customerPromise}
              onChange={e => setCustomerPromise(e.target.value)}
              placeholder="What does your service help users achieve?"
              sx={{
                input: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                textarea: { color: '#e2e8f0', background: 'transparent', borderRadius: 2 },
                label: { color: '#bfc9d1', fontWeight: 500 },
                select: { background: 'transparent' },
                '.MuiFilledInput-root': {
                  background: 'transparent',
                  borderRadius: 2,
                  border: '1px solid #374151',
                  boxShadow: 'none',
                  '&:hover': { background: 'transparent', borderColor: '#525c6b' },
                  '&.Mui-focused': { background: 'transparent', borderColor: '#525c6b' },
                  mb: 2
                },
              }}
            />
          </Box>
          {/* Company Visual or Collateral Upload */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#bfc9d1', mb: 1 }}>Service Collateral Upload</Typography>
            {!serviceCollateralFile ? (
              <Button
                component="div"
                variant="outlined"
                startIcon={<InsertDriveFileIcon />}
                sx={{
                  border: serviceCollateralDragActive ? '2px solid #3b82f6' : '2px dashed #374151',
                  background: '#181c20',
                  color: '#bfc9d1',
                  width: '100%',
                  minHeight: 120,
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  transition: 'border 0.2s',
                  outline: serviceCollateralDragActive ? '2px solid #3b82f6' : undefined,
                  '&:focus': { outline: '2px solid #3b82f6' },
                  position: 'relative',
                  p: 0,
                }}
                tabIndex={0}
                role="button"
                aria-label="Upload service collateral (PNG, PDF, JPG, max 10MB)"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    serviceCollateralInputRef.current?.click();
                  }
                }}
                onClick={() => serviceCollateralInputRef.current?.click()}
                onDragOver={e => {
                  e.preventDefault();
                  setServiceCollateralDragActive(true);
                }}
                onDragLeave={e => {
                  e.preventDefault();
                  setServiceCollateralDragActive(false);
                }}
                onDrop={e => {
                  e.preventDefault();
                  setServiceCollateralDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    if (!['image/png', 'application/pdf', 'image/jpeg'].includes(file.type)) {
                      setServiceCollateralError('Collateral must be PNG, PDF, or JPG.');
                      setCriticalError('Collateral must be PNG, PDF, or JPG.');
                      setCriticalErrorOpen(true);
                      return;
                    }
                    if (file.size > 10 * 1024 * 1024) {
                      setServiceCollateralError('Collateral must be under 10MB.');
                      setCriticalError('Collateral must be under 10MB.');
                      setCriticalErrorOpen(true);
                      return;
                    }
                    setUploadLoading(l => ({ ...l, service: true }));
                    setTimeout(() => {
                      setServiceCollateralFile(file);
                      handleServiceCollateralPreview(file);
                      setServiceCollateralError('');
                      setUploadLoading(l => ({ ...l, service: false }));
                    }, 1500);
                  }
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ color: '#64748b', fontSize: 14 }}>Upload<br/>brochure, screenshot, or photo</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>PNG, PDF, JPG<br/>Max 10MB</Typography>
                </Box>
                {uploadLoading.service && (
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(24,28,32,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                    <CircularProgress size={36} sx={{ color: '#3b82f6' }} />
                  </Box>
                )}
                <input
                  ref={serviceCollateralInputRef}
                  type="file"
                  accept=".png,.pdf,.jpg,.jpeg"
                  hidden
                  tabIndex={-1}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      if (!['image/png', 'application/pdf', 'image/jpeg'].includes(file.type)) {
                        setServiceCollateralError('Collateral must be PNG, PDF, or JPG.');
                        setCriticalError('Collateral must be PNG, PDF, or JPG.');
                        setCriticalErrorOpen(true);
                        return;
                      }
                      if (file.size > 10 * 1024 * 1024) {
                        setServiceCollateralError('Collateral must be under 10MB.');
                        setCriticalError('Collateral must be under 10MB.');
                        setCriticalErrorOpen(true);
                        return;
                      }
                      setUploadLoading(l => ({ ...l, service: true }));
                      setTimeout(() => {
                        setServiceCollateralFile(file);
                        handleServiceCollateralPreview(file);
                        setServiceCollateralError('');
                        setUploadLoading(l => ({ ...l, service: false }));
                      }, 1500);
                    }
                  }}
                />
              </Button>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  <Box sx={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {serviceCollateralFile.type === 'application/pdf' ? (
                      <InsertDriveFileIcon sx={{ fontSize: 60, color: '#64748b' }} />
                    ) : (
                      <img
                        src={serviceCollateralPreview || ''}
                        alt="Service collateral preview"
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: 'contain',
                          borderRadius: 12,
                          background: '#fff',
                          border: '2px solid #3b82f6',
                          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                          padding: 8,
                          display: 'block',
                        }}
                      />
                    )}
                    <IconButton
                      size="small"
                      onClick={() => { setServiceCollateralFile(null); setServiceCollateralPreview(null); }}
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        bgcolor: '#23272f',
                        color: '#ef4444',
                        border: '1px solid #374151',
                        '&:hover': { bgcolor: '#181c20' },
                        zIndex: 2,
                      }}
                      aria-label="Remove service collateral"
                    >
                      <LucideX size={18} />
                    </IconButton>
                  </Box>
                  <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 16, mt: 1, textAlign: 'center', wordBreak: 'break-all', maxWidth: 140, lineHeight: 1.2 }}>
                    {serviceCollateralFile.name}
                  </Typography>
                </Box>
              </Box>
            )}
            {serviceCollateralError && <Typography variant="caption" sx={{ color: '#bfc9d1', mt: 0.5 }}>{serviceCollateralError}</Typography>}
          </Box>
        </Paper>
      )}

      {/* Uploaded Files Section (Preview) */}
      <Paper sx={{ background: '#23272f', p: 5, borderRadius: 3, border: '1px solid #30363d', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', width: 1000, maxWidth: '100%', mx: 'auto', mb: 4 }} elevation={3}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 26, color: '#e2e8f0', mb: 3, letterSpacing: 0.2 }}>Uploaded Files</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
          {/* Logo */}
          {logoFile && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <Box sx={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {logoPreviewUrl && (
                  <img
                    src={logoPreviewUrl}
                    alt="Logo preview"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: 'contain',
                      borderRadius: 12,
                      background: '#fff',
                      border: '2px solid #3b82f6',
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                      padding: 8,
                      display: 'block',
                    }}
                  />
                )}
                <IconButton size="small" onClick={() => { setLogoFile(null); setLogoPreviewUrl(null); }}
                  sx={{ position: 'absolute', top: -10, right: -10, bgcolor: '#23272f', color: '#ef4444', border: '1px solid #374151', '&:hover': { bgcolor: '#181c20' }, zIndex: 2 }}
                  aria-label="Remove logo file"
                >
                  <LucideX size={18} />
                </IconButton>
              </Box>
              <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 16, mt: 1, textAlign: 'center', wordBreak: 'break-all', maxWidth: 140, lineHeight: 1.2 }}>{logoFile.name}</Typography>
            </Box>
          )}
          {/* Product Images */}
          {promoteType === 'product' && productImages.map((img, idx) => (
            <Box key={img.name + idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <Box sx={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={productImagePreviews[idx] || ''}
                  alt={`Product preview ${idx + 1}`}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: 'contain',
                    borderRadius: 12,
                    background: '#fff',
                    border: '2px solid #3b82f6',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                    padding: 8,
                    display: 'block',
                  }}
                />
                <IconButton size="small" onClick={() => {
                  const newFiles = productImages.filter((_, i) => i !== idx);
                  setProductImages(newFiles);
                  const newPreviews = productImagePreviews.filter((_, i) => i !== idx);
                  setProductImagePreviews(newPreviews);
                }}
                  sx={{ position: 'absolute', top: -10, right: -10, bgcolor: '#23272f', color: '#ef4444', border: '1px solid #374151', '&:hover': { bgcolor: '#181c20' }, zIndex: 2 }}
                  aria-label={`Remove product image ${idx + 1}`}
                >
                  <LucideX size={18} />
                </IconButton>
              </Box>
              <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 16, mt: 1, textAlign: 'center', wordBreak: 'break-all', maxWidth: 140, lineHeight: 1.2 }}>{img.name}</Typography>
            </Box>
          ))}
          {/* Service Collateral */}
          {promoteType === 'service' && serviceCollateralFile && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <Box sx={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {serviceCollateralFile.type === 'application/pdf' ? (
                  <InsertDriveFileIcon sx={{ fontSize: 60, color: '#64748b' }} />
                ) : (
                  <img
                    src={serviceCollateralPreview || ''}
                    alt="Service collateral preview"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: 'contain',
                      borderRadius: 12,
                      background: '#fff',
                      border: '2px solid #3b82f6',
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                      padding: 8,
                      display: 'block',
                    }}
                  />
                )}
                <IconButton size="small" onClick={() => { setServiceCollateralFile(null); setServiceCollateralPreview(null); }}
                  sx={{ position: 'absolute', top: -10, right: -10, bgcolor: '#23272f', color: '#ef4444', border: '1px solid #374151', '&:hover': { bgcolor: '#181c20' }, zIndex: 2 }}
                  aria-label="Remove service collateral"
                >
                  <LucideX size={18} />
                </IconButton>
              </Box>
              <Typography sx={{ color: '#e2e8f0', fontWeight: 500, fontSize: 16, mt: 1, textAlign: 'center', wordBreak: 'break-all', maxWidth: 140, lineHeight: 1.2 }}>{serviceCollateralFile.name}</Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Autosave and Last Save Time */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Clear all form data and saved draft" arrow>
            <IconButton onClick={handleClearDraft} sx={{ color: '#64748b', '&:hover': { color: '#ef4444' } }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#64748b',
            fontSize: 12,
            fontWeight: 400,
            background: 'rgba(100, 116, 139, 0.1)',
            border: '1px solid rgba(100, 116, 139, 0.2)',
            borderRadius: 1,
            px: 2,
            py: 0.5
          }}>
            {isAutoSaving ? (
              <>
                <Box sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#3b82f6',
                  animation: 'pulse 1.5s infinite'
                }} />
                Saving...
              </>
            ) : (
              <>
                ✓ Last saved {lastSaveTime || 'never'}
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Snackbar for draft cleared notification */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Draft cleared"
      />

      {/* Critical error Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={criticalErrorOpen}
        autoHideDuration={2000}
        onClose={() => setCriticalErrorOpen(false)}
        message={criticalError}
        ContentProps={{ sx: { background: '#23272f', color: '#ef4444', fontWeight: 500 } }}
      />
    </Box>
  );
};

export default Step2AssetUploadCreativeContext; 