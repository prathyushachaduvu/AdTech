import React from 'react';
import { Box } from '@mui/material';

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void;
  acceptedFileTypes: string[];
  maxFileSize?: number;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  acceptedFileTypes,
  maxFileSize,
  multiple = true
}) => {
  return (
    <Box>
      {/* File uploader content will go here */}
    </Box>
  );
};

export default FileUploader; 