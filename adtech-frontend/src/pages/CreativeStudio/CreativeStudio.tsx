import React, { useState } from 'react';
import { Box } from '@mui/material';
import SidebarLayout from '../../layouts/SidebarLayout';
import TopNav from '../../components/TopNav';
import CreativeStudioGenerate from './CreativeStudioGenerate';
import CreativeStudioGallery from './CreativeStudioGallery';

const CreativeStudio: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('generate');

  const handleSectionClick = (section: string) => {
    setCurrentSection(section);
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'generate':
        return <CreativeStudioGenerate />;
      case 'gallery':
        return <CreativeStudioGallery />;
      default:
        return <CreativeStudioGenerate />;
    }
  };

  return (
    <SidebarLayout currentPage="creative-studio">
      <TopNav 
        currentPage="creative-studio"
        currentSection={currentSection}
        onSectionClick={handleSectionClick}
      />
      <Box sx={{ p: 0 }}>
        {renderCurrentSection()}
      </Box>
    </SidebarLayout>
  );
};

export default CreativeStudio; 