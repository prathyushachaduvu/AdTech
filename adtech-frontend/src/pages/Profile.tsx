import { useEffect, useState } from 'react';
import { Box, Typography,  CircularProgress } from '@mui/material';
import type { Profile } from '../types/profile';
import { updateProfile } from '../services/profileApi';
import PersonalInfoSection from '../components/PersonalInfoSection';
import CompanyInfoSection from '../components/CompanyInfoSection';
import ProfilePictureSection from '../components/ProfilePictureSection';
import ProfileCompletionStepper from '../components/ProfileCompletionStepper';
import type { Step } from '../components/ProfileCompletionStepper';
import { Building2, Camera, Settings, User2 } from 'lucide-react';
import PreferencesSection from '../components/PreferencesSection';  
import type { PreferencesData } from '../components/PreferencesSection';
import TeamMembersSection, { type TeamMember } from '../components/TeamMembersSection';
import UsageAndBillingSection from '../components/UsageAndBillingSection';
import { useUser } from '../context/UserContext';

const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { name: 'Alice Johnson', role: 'Owner' },
  { name: 'Bob Smith', role: 'Admin' },
  { name: 'Carol Lee', role: 'Member' },
];

interface ProfileProps {}

export default function Profile({}: ProfileProps) {
  const { user: profile, setUser: setProfile } = useUser();
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState<null | 'personal' | 'company' | 'picture' | 'preferences'> (null);
  const [editingSection, setEditingSection] = useState<null | 'personal' | 'company' | 'preferences' | 'picture'>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);

  // Dynamic profile completion calculation
  let requiredFields: { label: string; value: any }[] = [];
  let filledCount = 0;
  let completion = 0;
  if (profile) {
    requiredFields = [
      { label: 'First Name', value: profile.firstName },
      { label: 'Last Name', value: profile.lastName },
      { label: 'Email', value: profile.email },
      { label: 'Job Title', value: profile.jobTitle },
      { label: 'Company Name', value: profile.companyInfo?.name },
      { label: 'Industry', value: profile.companyInfo?.industry },
      { label: 'Profile Picture', value: profile.profilePicture },
    ];
    filledCount = requiredFields.filter(f => !!f.value && String(f.value).trim() !== '').length;
    completion = Math.round((filledCount / requiredFields.length) * 100);
  }

  // Handle personal info save
  const handlePersonalInfoSave = (personalData: { firstName: string; middleName: string; lastName: string; email: string; phoneNumber: string; jobTitle: string; department: string }) => {
    if (!profile) return;
    setSaving(true);
    setSavingSection('personal');
    const updatedProfile = { ...profile, ...personalData };
    updateProfile(updatedProfile).then(() => {
      setProfile(updatedProfile);
      setSaving(false);
      setSavingSection(null);
    });
  };

  // Handle company info save
  const handleCompanyInfoSave = (companyInfo: Profile['companyInfo']) => {
    if (!profile) return;
    setSaving(true);
    setSavingSection('company');
    const updatedProfile = { ...profile, companyInfo };
    updateProfile(updatedProfile).then(() => {
      setProfile(updatedProfile);
      setSaving(false);
      setSavingSection(null);
    });
  };

  // Handle profile picture change
  const handleProfilePictureChange = (img: string | null) => {
    if (!profile) return;
    setSaving(true);
    setSavingSection('picture');
    const updatedProfile = { ...profile, profilePicture: img };
    updateProfile(updatedProfile).then(() => {
      setProfile(updatedProfile);
      setSaving(false);
      setSavingSection(null);
    });
  };

  // Handle preferences save
  const handlePreferencesSave = (prefs: PreferencesData) => {
    if (!profile) return;
    setSaving(true);
    setSavingSection('preferences');
    const updatedProfile = {
      ...profile,
      notificationPreferences: prefs.notificationPreferences,
      dashboardLayout: prefs.dashboardLayout as Profile['dashboardLayout'],
    };
    updateProfile(updatedProfile).then(() => {
      setProfile(updatedProfile);
      setSaving(false);
      setSavingSection(null);
    });
  };

  // Define steps for the stepper (Profile Picture is now last and only has two states)
  const stepDefinitions = [
    {
      label: 'Personal Info',
      isComplete: !!(profile && profile.firstName && profile.lastName && profile.email && profile.jobTitle),
      icon: <User2 size={22} />,
    },
    {
      label: 'Company Info',
      isComplete: !!(profile && profile.companyInfo?.name && profile.companyInfo?.industry),
      icon: <Building2 size={22} />,
    },
    {
      label: 'Preferences',
      isComplete: !!(profile && profile.notificationPreferences.length > 0),
      icon: <Settings size={22} />,
    },
    {
      label: 'Profile Picture',
      isComplete: !!(profile && profile.profilePicture),
      icon: <Camera size={22} />,
      isPicture: true,
    },
  ];

  // Find the first incomplete step (excluding Profile Picture for in-progress logic)
  const firstIncompleteIdx = stepDefinitions.findIndex(s => !s.isComplete && !s.isPicture);

  // Build steps array with correct status
  const steps: Step[] = stepDefinitions.map((def, idx) => {
    let status: 'completed' | 'in-progress' | 'pending';
    if (def.isPicture) {
      status = def.isComplete ? 'completed' : 'pending';
    } else if (def.isComplete) {
      status = 'completed';
    } else if (idx === firstIncompleteIdx || firstIncompleteIdx === -1) {
      status = 'in-progress';
    } else {
      status = 'pending';
    }
    return {
      label: def.label,
      status,
      icon: def.icon,
      completed: def.isComplete,
    };
  });

  // Find the first incomplete step as the current step (excluding Profile Picture)
  const currentStep = firstIncompleteIdx === -1 ? steps.length - 2 : firstIncompleteIdx;
  // Scroll to section on step click
  const handleStepClick = (idx: number) => {
    const sectionIds = ['personal-info-section', 'company-info-section', 'preferences-section', 'profile-picture-section'];
    const sectionKeys: (typeof editingSection)[] = ['personal', 'company', 'preferences', 'picture'];
    setEditingSection(sectionKeys[idx]);
    const el = document.getElementById(sectionIds[idx]);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };



  if (!profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 1, pb: 2 }}>
      {/* Page Heading */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
          mt: { xs: 2, md: 4 },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 24, sm: 28, md: 32 },
              fontWeight: 600,
              color: '#fff',
              letterSpacing: 0.3,
              lineHeight: 1.2,
            }}
            component="h1"
          >
            Profile
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#8b949e',
              fontWeight: 400,
              mt: 0.5,
              fontSize: { xs: 14, sm: 15 },
              letterSpacing: 0.2,
            }}
          >
            Manage your information and preferences
          </Typography>
        </Box>
        {/* Placeholder for future actions/menu */}
        <Box sx={{ minWidth: 48 }} />
      </Box>

      {/* Profile Completion Timeline Bar */}
      <ProfileCompletionStepper
        steps={steps}
        currentStep={currentStep}
        percent={completion}
        onStepClick={handleStepClick}
      />

      {/* Main Content with Profile Picture on the right */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', gap: 4, mb: 4 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <div id="personal-info-section" />
          <PersonalInfoSection
            data={{
              firstName: profile.firstName,
              middleName: profile.middleName,
              lastName: profile.lastName,
              email: profile.email,
              phoneNumber: profile.phoneNumber,
              jobTitle: profile.jobTitle,
              department: profile.department
            }}
            onSave={handlePersonalInfoSave}
            loading={savingSection === 'personal' && saving}
            editing={editingSection === 'personal'}
            onRequestEdit={() => setEditingSection('personal')}
            onEditEnd={() => setEditingSection(null)}
          />
          <div id="company-info-section" />
          <CompanyInfoSection
            data={profile.companyInfo}
            onSave={handleCompanyInfoSave}
            loading={savingSection === 'company' && saving}
            editing={editingSection === 'company'}
            onRequestEdit={() => setEditingSection('company')}
            onEditEnd={() => setEditingSection(null)}
          />
          <div id="preferences-section" />
          <PreferencesSection
            data={{
              notificationPreferences: profile.notificationPreferences,
              dashboardLayout: profile.dashboardLayout,
            }}
            onSave={handlePreferencesSave}
            loading={savingSection === 'preferences' && saving}
            editing={editingSection === 'preferences'}
            onRequestEdit={() => setEditingSection('preferences')}
            onEditEnd={() => setEditingSection(null)}
          />
          <div id="team-members-section">
            <TeamMembersSection
              members={teamMembers}
              onSave={(members) => setTeamMembers(members)}
            />
          </div>
          <div id="usage-billing-section">
            <UsageAndBillingSection />
          </div>
        </Box>
        {/* Profile Picture on the right (desktop), below on mobile */}
        <Box sx={{ minWidth: 240, maxWidth: 320, width: '100%', alignSelf: { xs: 'center', md: 'flex-start' }, mt: { xs: 2, md: 0 } }}>
          <div id="profile-picture-section" />
          <ProfilePictureSection
            imageUrl={profile.profilePicture || undefined}
            onChange={handleProfilePictureChange}
            loading={savingSection === 'picture' && saving}
            editing={editingSection === 'picture'}
            onRequestEdit={() => setEditingSection('picture')}
            onEditEnd={() => setEditingSection(null)}
          />
        </Box>
      </Box>
    </Box>
  );
} 