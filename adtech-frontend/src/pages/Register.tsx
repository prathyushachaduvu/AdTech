import { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  LinearProgress,
  Paper,
} from "@mui/material";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import AuthLayout from "../layouts/AuthLayout";

// Register component with password strength validation and real-time feedback
export default function Register() {
  const [view, setView] = useState('register'); // 'register' | 'confirmation'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validateEmail = (emailInput: string) => {
    if (!emailInput) {
      setEmailError("Email address is required");
      return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(emailInput)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (passwordInput: string) => {
    if (!passwordInput) {
      setPasswordError("Password is required");
      return false;
    }
    if (passwordInput.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    if (!/(?=.*[a-z])/.test(passwordInput)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/(?=.*[A-Z])/.test(passwordInput)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/(?=.*\d)/.test(passwordInput)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    if (!/(?=.*[!@#$%^&*])/.test(passwordInput)) {
      setPasswordError("Password must contain at least one special character (!@#$%^&*)");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (confirmPasswordInput: string) => {
    if (!confirmPasswordInput) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }
    if (confirmPasswordInput !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const getPasswordStrength = (passwordInput: string) => {
    if (!passwordInput) return 0;
    let strength = 0;
    if (passwordInput.length >= 8) strength += 20;
    if (/(?=.*[a-z])/.test(passwordInput)) strength += 20;
    if (/(?=.*[A-Z])/.test(passwordInput)) strength += 20;
    if (/(?=.*\d)/.test(passwordInput)) strength += 20;
    if (/(?=.*[!@#$%^&*])/.test(passwordInput)) strength += 20;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 40) return "#ef4444";
    if (strength <= 60) return "#f59e0b";
    if (strength <= 80) return "#3b82f6";
    return "#10b981";
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 40) return "Weak";
    if (strength <= 60) return "Fair";
    if (strength <= 80) return "Good";
    return "Strong";
  };

  const checkPasswordRequirement = (requirement: string) => {
    switch (requirement) {
      case 'length':
        return password.length >= 8;
      case 'lowercase':
        return /(?=.*[a-z])/.test(password);
      case 'uppercase':
        return /(?=.*[A-Z])/.test(password);
      case 'number':
        return /(?=.*\d)/.test(password);
      case 'special':
        return /(?=.*[!@#$%^&*])/.test(password);
      default:
        return false;
    }
  };

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (isEmailValid && isPasswordValid && isConfirmPasswordValid && acceptedTerms) {
      setLoading(true);
      setTimeout(() => {
        console.log("Registration submitted", { email, password });
        setLoading(false);
        setView('confirmation');
      }, 2000);
    }
  };

  const renderRegisterView = () => {
    const passwordStrength = getPasswordStrength(password);
    const strengthColor = getPasswordStrengthColor(passwordStrength);
    const strengthText = getPasswordStrengthText(passwordStrength);
    const passwordsMatch = password && confirmPassword && password === confirmPassword;

    return (
      <>
        <div style={{ marginBottom: '1rem' }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            Create your account
          </Typography>
          <Typography variant="body2" sx={{ color: '#9ca3af' }}>
            Start building privacy-first advertising campaigns
          </Typography>
        </div>
        <form noValidate onSubmit={handleRegisterSubmit}>
          <TextField
            id="email"
            label="Email address"
            type="email"
            fullWidth
            variant="filled"
            size="small"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
            onBlur={() => validateEmail(email)}
            error={!!emailError}
            helperText={emailError}
            aria-describedby={emailError ? "email-error" : undefined}
            InputLabelProps={{ style: { color: "#8b949e" } }}
            FormHelperTextProps={{ id: 'email-error' }}
            sx={{ "& .MuiFilledInput-root": { backgroundColor: "#21262d", color: "white" }, "& .MuiFilledInput-input": { paddingTop: '15px' } }}
          />
          <div style={{ position: 'relative' }}>
            <TextField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              variant="filled"
              size="small"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (passwordError) validatePassword(e.target.value); }}
              onBlur={() => {
                validatePassword(password);
                setPasswordFocused(false);
              }}
              onFocus={() => setPasswordFocused(true)}
              error={!!passwordError}
              helperText={passwordError}
              aria-describedby={passwordError ? "password-error password-requirements" : "password-requirements"}
              InputLabelProps={{ style: { color: "#8b949e" } }}
              FormHelperTextProps={{ id: 'password-error' }}
              sx={{ "& .MuiFilledInput-root": { backgroundColor: "#21262d", color: "white" }, "& .MuiFilledInput-input": { paddingTop: '15px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      aria-label={showPassword ? "hide password" : "show password"}
                      onClick={() => setShowPassword(!showPassword)} 
                      edge="end" 
                      sx={{ color: "#8b949e" }}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {passwordFocused && (
              <Paper 
                id="password-requirements"
                role="region"
                aria-live="polite"
                elevation={0} 
                sx={{ 
                  position: 'absolute',
                  left: '102%',
                  top: 0,
                  width: '280px',
                  p: 1.5, 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: 2,
                  zIndex: 10,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '20px',
                    right: '100%',
                    height: 0,
                    width: 0,
                    border: '10px solid transparent',
                    borderRightColor: '#374151',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '20px',
                    right: '100%',
                    height: 0,
                    width: 0,
                    marginRight: '-1px',
                    border: '10px solid transparent',
                    borderRightColor: '#1f2937',
                  },
                }}
              >
                <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, display: 'block', mb: 1 }}>
                  Password requirements:
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {checkPasswordRequirement('length') ? 
                      <Check size={14} style={{ color: '#10b981' }} /> : 
                      <X size={14} style={{ color: '#ef4444' }} />
                    }
                    <Typography variant="caption" sx={{ color: checkPasswordRequirement('length') ? '#10b981' : '#9ca3af' }}>
                      At least 8 characters long
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {checkPasswordRequirement('lowercase') ? 
                      <Check size={14} style={{ color: '#10b981' }} /> : 
                      <X size={14} style={{ color: '#ef4444' }} />
                    }
                    <Typography variant="caption" sx={{ color: checkPasswordRequirement('lowercase') ? '#10b981' : '#9ca3af' }}>
                      Contains at least one lowercase letter
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {checkPasswordRequirement('uppercase') ? 
                      <Check size={14} style={{ color: '#10b981' }} /> : 
                      <X size={14} style={{ color: '#ef4444' }} />
                    }
                    <Typography variant="caption" sx={{ color: checkPasswordRequirement('uppercase') ? '#10b981' : '#9ca3af' }}>
                      Contains at least one uppercase letter
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {checkPasswordRequirement('number') ? 
                      <Check size={14} style={{ color: '#10b981' }} /> : 
                      <X size={14} style={{ color: '#ef4444' }} />
                    }
                    <Typography variant="caption" sx={{ color: checkPasswordRequirement('number') ? '#10b981' : '#9ca3af' }}>
                      Contains at least one number
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {checkPasswordRequirement('special') ? 
                      <Check size={14} style={{ color: '#10b981' }} /> : 
                      <X size={14} style={{ color: '#ef4444' }} />
                    }
                    <Typography variant="caption" sx={{ color: checkPasswordRequirement('special') ? '#10b981' : '#9ca3af' }}>
                      Contains at least one special character (!@#$%^&*)
                    </Typography>
                  </div>
                </div>
              </Paper>
            )}
          </div>
          {password && (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                  Password strength: {strengthText}
                </Typography>
                <Typography variant="caption" sx={{ color: strengthColor }}>
                  {passwordStrength}%
                </Typography>
              </div>
              <LinearProgress 
                variant="determinate" 
                value={passwordStrength} 
                sx={{ 
                  height: 4, 
                  borderRadius: 2,
                  backgroundColor: '#374151',
                  '& .MuiLinearProgress-bar': { 
                    backgroundColor: strengthColor 
                  }
                }} 
              />
            </div>
          )}
          <TextField
            id="confirm-password"
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            variant="filled"
            size="small"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); if (confirmPasswordError) validateConfirmPassword(e.target.value); }}
            onBlur={() => validateConfirmPassword(confirmPassword)}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
            InputLabelProps={{ style: { color: "#8b949e" } }}
            FormHelperTextProps={{ id: 'confirm-password-error' }}
            sx={{ "& .MuiFilledInput-root": { backgroundColor: "#21262d", color: "white" }, "& .MuiFilledInput-input": { paddingTop: '15px' } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    aria-label={showConfirmPassword ? "hide password" : "show password"}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    edge="end" 
                    sx={{ color: "#8b949e" }}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {confirmPassword && (
            <div 
              role="status"
              aria-live="polite"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              {passwordsMatch ? 
                <Check size={16} style={{ color: '#10b981' }} /> : 
                <X size={16} style={{ color: '#ef4444' }} />
              }
              <Typography variant="caption" sx={{ color: passwordsMatch ? '#10b981' : '#ef4444' }}>
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </Typography>
            </div>
          )}
          <FormControlLabel
            control={
              <Checkbox 
                name="terms"
                size="small" 
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                sx={{ color: "#8b949e", '&.Mui-checked': { color: "#16a34a" } }} 
              />
            }
            label={
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                I agree to the{" "}
                <Link href="#" variant="caption" sx={{ color: "#818cf8" }}>
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link href="#" variant="caption" sx={{ color: "#818cf8" }}>
                  Privacy Policy
                </Link>
              </Typography>
            }
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !acceptedTerms}
            sx={{ 
                py: 1.2, 
                backgroundColor: "#16a34a", 
                "&:hover": { backgroundColor: "#22c55e" }, 
                fontWeight: 'bold', 
                fontSize: '0.875rem',
                '&.Mui-disabled': {
                  backgroundColor: '#2d3748',
                  color: '#6b7280'
                }
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
          </Button>
          <div className="social-login-divider">
            <span className="divider-line"></span>
            <span className="divider-text">OR</span>
            <span className="divider-line"></span>
          </div>
          <div className="social-login-buttons">
            <Button variant="outlined" fullWidth size="small" startIcon={<FaGoogle />} sx={{ color: '#e2e8f0', borderColor: '#4b5563', '&:hover': { borderColor: '#9ca3af', backgroundColor: 'rgba(255, 255, 255, 0.04)' } }}>
              Sign up with Google
            </Button>
            <Button variant="outlined" fullWidth size="small" startIcon={<FaLinkedin />} sx={{ color: '#e2e8f0', borderColor: '#4b5563', '&:hover': { borderColor: '#9ca3af', backgroundColor: 'rgba(255, 255, 255, 0.04)' } }}>
              Sign up with LinkedIn
            </Button>
          </div>
          <Typography variant="caption" align="center" sx={{ color: '#9ca3af', mt: 'auto' }}>
            Already have an account?{" "}
            <Link href="/login" variant="caption" sx={{ color: "#818cf8" }}>
              Sign in
            </Link>
          </Typography>
        </form>
      </>
    );
  };

  const renderConfirmationView = () => (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
        Check your email
      </Typography>
      <Typography sx={{ color: '#9ca3af', mt: 1 }}>
        We've sent a verification link to {email}.
      </Typography>
      <Typography variant="body2" sx={{ color: '#9ca3af', mt: 2 }}>
        Please check your inbox and click the verification link to complete your registration.
      </Typography>
      <Link 
        href="/login" 
        sx={{ color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, mt: 4 }}
        aria-label="Back to Login"
      >
        <ArrowLeft size={16} style={{ marginRight: '8px' }} />
        Back to Login
      </Link>
    </div>
  );

  return (
    <AuthLayout>
        {view === 'register' && renderRegisterView()}
        {view === 'confirmation' && renderConfirmationView()}
    </AuthLayout>
  );
} 