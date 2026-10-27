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
} from "@mui/material";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import AuthLayout from "../layouts/AuthLayout";

// Login component with multiple views: login form, forgot password, and confirmation
export default function Login() {
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'confirmation'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setPasswordError("");
    return true;
  };

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      setLoading(true);
      setTimeout(() => {
        console.log("Login submitted", { email, password });
        setLoading(false);
      }, 2000);
    }
  };

  const handleForgotSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateEmail(email)) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setView('confirmation');
      }, 2000);
    }
  };

  const renderLoginView = () => (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          Welcome back!
        </Typography>
        <Typography variant="body2" sx={{ color: '#9ca3af' }}>
          Sign in to your dashboard
        </Typography>
      </div>
      <form noValidate onSubmit={handleLoginSubmit}>
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
        <TextField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          variant="filled"
          size="small"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (passwordError) validatePassword(e.target.value); }}
          onBlur={() => validatePassword(password)}
          error={!!passwordError}
          helperText={passwordError}
          aria-describedby={passwordError ? "password-error" : undefined}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <FormControlLabel
            control={<Checkbox name="remember" size="small" sx={{ color: "#8b949e", '&.Mui-checked': { color: "#16a34a" } }} />}
            label={<Typography variant="caption">Remember me</Typography>}
          />
          <Link 
            component="button" 
            type="button" 
            role="button"
            onClick={() => setView('forgot')} 
            variant="caption" 
            sx={{ color: "#818cf8", backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ py: 1.2, backgroundColor: "#16a34a", "&:hover": { backgroundColor: "#22c55e" }, fontWeight: 'bold', fontSize: '0.875rem' }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign in'}
        </Button>
        <div className="social-login-divider">
          <span className="divider-line"></span>
          <span className="divider-text">OR</span>
          <span className="divider-line"></span>
        </div>
        <div className="social-login-buttons">
          <Button variant="outlined" fullWidth size="small" startIcon={<FaGoogle />} sx={{ color: '#e2e8f0', borderColor: '#4b5563', '&:hover': { borderColor: '#9ca3af', backgroundColor: 'rgba(255, 255, 255, 0.04)' } }}>
            Sign in with Google
          </Button>
          <Button variant="outlined" fullWidth size="small" startIcon={<FaLinkedin />} sx={{ color: '#e2e8f0', borderColor: '#4b5563', '&:hover': { borderColor: '#9ca3af', backgroundColor: 'rgba(255, 255, 255, 0.04)' } }}>
            Sign in with LinkedIn
          </Button>
        </div>
        <Typography variant="caption" align="center" sx={{ color: '#9ca3af', mt: 'auto' }}>
          Don't have an account?{" "}
          <Link href="/register" variant="caption" sx={{ color: "#818cf8" }}>
            Create one
          </Link>
        </Typography>
      </form>
    </>
  );

  const renderForgotView = () => (
    <>
      <div style={{ marginBottom: '1.5rem', marginTop: '3rem' }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          Forgot your password?
        </Typography>
        <Typography variant="body2" sx={{ color: '#9ca3af' }}>
          No worries, we'll send you reset instructions.
        </Typography>
      </div>
      <form noValidate onSubmit={handleForgotSubmit}>
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
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 2, py: 1.2, backgroundColor: "#16a34a", "&:hover": { backgroundColor: "#22c55e" }, fontWeight: 'bold', fontSize: '0.875rem' }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Reset Link'}
        </Button>
        <Link 
          component="button" 
          type="button" 
          role="button"
          onClick={() => setView('login')} 
          sx={{ color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, mt: 'auto', pt: 2, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} style={{ marginRight: '8px' }} />
          Back to Login
        </Link>
      </form>
    </>
  );

  const renderConfirmationView = () => (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
        Check your email
      </Typography>
      <Typography sx={{ color: '#9ca3af', mt: 1 }}>
        We've sent a password reset link to {email}.
      </Typography>
      <Link 
        component="button" 
        type="button" 
        role="button"
        onClick={() => setView('login')} 
        sx={{ color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, mt: 4, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} style={{ marginRight: '8px' }} />
        Back to Login
      </Link>
    </div>
  );

  return (
    <AuthLayout>
      {view === 'login' && renderLoginView()}
      {view === 'forgot' && renderForgotView()}
      {view === 'confirmation' && renderConfirmationView()}
    </AuthLayout>
  );
}
  