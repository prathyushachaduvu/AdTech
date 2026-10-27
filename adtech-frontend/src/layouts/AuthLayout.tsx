import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import { Layers, BrainCircuit, BarChart, Lock } from 'lucide-react';
import Feature from '../components/Feature';
import '../pages/Login.css'; // We can reuse the same CSS

interface AuthLayoutProps {
  children: React.ReactNode;
}

// AuthLayout provides the split-screen design with form on left, features on right
// Automatically adjusts layout based on whether it's login or register page
export default function AuthLayout({ children }: AuthLayoutProps) {
  const location = useLocation();
  const isRegisterPage = location.pathname === '/register';

  return (
    <div className="login-container">
      {/* SVG clip-path for the curved right panel design */}
      <svg height="0" width="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="login-shape" clipPathUnits="objectBoundingBox">
            <path d="M 0.2,0 H 1 V 1 H 0.2 C 0.3,0.75 0,0.75 0.05,0.5 C 0.1,0.25 0,0.25 0.2,0 Z" />
          </clipPath>
        </defs>
      </svg>
      {/* Left panel - contains the authentication form */}
      <div className={`left-panel ${isRegisterPage ? 'register-view-active' : ''}`}>
        <div className={`logo-header ${isRegisterPage ? 'logo-register-position' : ''}`}>
          <Layers size={32} style={{ color: '#16a34a' }} />
          <Typography variant="h5" component="h1" sx={{ mt: 1, fontWeight: 'bold' }}>
            LatentFlux
          </Typography>
          <Typography variant="body2" sx={{ color: '#9ca3af' }}>
            Privacy-First AdTech Platform
          </Typography>
        </div>
        <div className="auth-form-container">
            <div className="login-form">
                {children}
            </div>
        </div>
      </div>
      {/* Right panel - showcases platform features with curved design */}
      <div className="right-panel">
        <div className="right-panel-content">
          <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }} gutterBottom>
            Privacy-first advertising that works
          </Typography>
          <ul className="feature-list">
            <Feature
              icon={<BrainCircuit size={24} />}
              title="AI-Powered Campaign Optimization"
              description="Intelligent algorithms that maximize performance while protecting user privacy"
            />
            <Feature
              icon={<BarChart size={24} />}
              title="Real-time Analytics Dashboard"
              description="Comprehensive insights and reporting without compromising data security"
            />
            <Feature
              icon={<Lock size={24} />}
              title="Secure Creative Generation"
              description="Generate compelling ad creatives with built-in privacy safeguards"
            />
          </ul>
        </div>
      </div>
    </div>
  );
} 