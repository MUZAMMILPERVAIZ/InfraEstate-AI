import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";
// import InfraEstateLogo from "./InfraEstateLogo";

// MUI Components
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';

// MUI Icons
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import InfraEstateLogo from "../Chatbot/InfraEstateLogo";

const AuthModal = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success"
  });

  // Form state
  const [loginFormData, setLoginFormData] = useState({ username: '', password: '' });
  const [signupFormData, setSignupFormData] = useState({ email: '', name: '', password: '', otp: '' });

  // OTP digits
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);

  const navigate = useNavigate();

  // Handle input changes for login form
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };

  // Handle input changes for signup form
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupFormData({ ...signupFormData, [name]: value });
  };

  // Handle OTP digit change
  const handleOtpDigitChange = (index, value) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Update the signup form data with the complete OTP
    const fullOtp = newOtpDigits.join('');
    setSignupFormData({ ...signupFormData, otp: fullOtp });
  };

  // Handle key press in OTP field (for backspace navigation)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({
      open: true,
      message,
      type
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8080/login/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'username': loginFormData.username,
          'password': loginFormData.password
        })
      });

      if (!response.ok) {
        throw new Error('Incorrect username or password');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.access_token);
      await initializeChatbot(navigate);

      showNotification("Login successful! Welcome back.");
      onLoginSuccess(data.access_token);
    } catch (error) {
      showNotification("Login failed. Please check your credentials.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP request
  const handleOtpRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:8080/signup/request-otp/?email=${signupFormData.email}`, {
        method: 'POST',
        headers: {},
      });

      setOtpSent(true);
      setEmailForOtp(signupFormData.email);
      showNotification("OTP sent to your email. Please check your inbox.");
    } catch (error) {
      showNotification("Failed to send OTP. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize chatbot
  const initializeChatbot = async (navigate) => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        throw new Error("No access token found. Please login or sign up.");
      }

      const initResponse = await fetch('http://127.0.0.1:8080/initialize_model/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!initResponse.ok) {
        if (initResponse.statusText === "Unauthorized") {
          localStorage.removeItem('accessToken');
          navigate('/');
          throw new Error('Session Expired. Login again');
        } else {
          throw new Error(`Failed to initialize the model: ${initResponse.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error initializing the chatbot:', error.message);
    }
  };

  // Handle signup submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8080/signup/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupFormData.name,
          email: emailForOtp,
          password: signupFormData.password,
          otp: signupFormData.otp,
        }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.access_token);
      await initializeChatbot(navigate);

      showNotification("Signup successful! Welcome to InfraEstate.");
      onLoginSuccess(data.access_token);
    } catch (error) {
      showNotification("Signup failed. Please check the OTP or try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all forms when switching between login and signup
  const switchMode = (mode) => {
    setLoginFormData({ username: '', password: '' });
    setSignupFormData({ email: '', name: '', password: '', otp: '' });
    setOtpDigits(['', '', '', '', '', '']);
    setIsLogin(mode === 'login');
    setOtpSent(false);
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${isLogin ? 'login-mode' : otpSent ? 'otp-mode' : 'signup-mode'}`}>
        <div className="auth-logo">
          <InfraEstateLogo size={90} color="#4f46e5" />
        </div>

        <Typography variant="h4" className="auth-title">
          {isLogin ? "Welcome Back" : otpSent ? "Verify Your Email" : "Create Account"}
        </Typography>

        <Typography variant="body1" className="auth-subtitle">
          {isLogin
            ? "Sign in to access your account"
            : otpSent
              ? `We've sent a verification code to ${emailForOtp}`
              : "Join InfraEstate to explore premium properties"
          }
        </Typography>

        {/* Login Form */}
        {isLogin && (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                name="username"
                type="email"
                value={loginFormData.username}
                onChange={handleLoginChange}
                required
                className="auth-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon className="input-icon" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="form-group">
              <TextField
                fullWidth
                variant="outlined"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={loginFormData.password}
                onChange={handleLoginChange}
                required
                className="auth-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon className="input-icon" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon className="password-icon" />
                        ) : (
                          <VisibilityIcon className="password-icon" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="auth-button login-button"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="auth-switch">
              <Typography variant="body2">
                Don't have an account?
              </Typography>
              <Button
                variant="text"
                className="switch-button"
                onClick={() => switchMode('signup')}
              >
                Sign Up
              </Button>
            </div>
          </form>
        )}

        {/* Request OTP Form */}
        {!isLogin && !otpSent && (
          <form className="auth-form" onSubmit={handleOtpRequest}>
            <div className="form-group">
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                name="email"
                type="email"
                value={signupFormData.email}
                onChange={handleSignupChange}
                required
                className="auth-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon className="input-icon" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="auth-button signup-button"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            >
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Button>

            <div className="auth-switch">
              <Typography variant="body2">
                Already have an account?
              </Typography>
              <Button
                variant="text"
                className="switch-button"
                onClick={() => switchMode('login')}
              >
                Sign In
              </Button>
            </div>
          </form>
        )}

        {/* OTP Verification & Signup Form */}
        {!isLogin && otpSent && (
          <form className="auth-form" onSubmit={handleSignup}>
            <div className="otp-container">
              <div className="otp-inputs">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="otp-input"
                    required
                  />
                ))}
              </div>
              <Typography variant="body2" className="otp-hint">
                Enter the 6-digit verification code
              </Typography>
            </div>

            <div className="form-group">
              <TextField
                fullWidth
                variant="outlined"
                label="Full Name"
                name="name"
                value={signupFormData.name}
                onChange={handleSignupChange}
                required
                className="auth-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon className="input-icon" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="form-group">
              <TextField
                fullWidth
                variant="outlined"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={signupFormData.password}
                onChange={handleSignupChange}
                required
                className="auth-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon className="input-icon" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon className="password-icon" />
                        ) : (
                          <VisibilityIcon className="password-icon" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="form-actions">
              <Button
                variant="outlined"
                className="back-button"
                startIcon={<ArrowBackIcon />}
                onClick={() => setOtpSent(false)}
              >
                Back
              </Button>

              <Button
                type="submit"
                variant="contained"
                className="auth-button complete-button"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <HowToRegIcon />}
              >
                {isLoading ? "Completing..." : "Complete Signup"}
              </Button>
            </div>

            <div className="auth-switch">
              <Typography variant="body2">
                Already have an account?
              </Typography>
              <Button
                variant="text"
                className="switch-button"
                onClick={() => switchMode('login')}
              >
                Sign In
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Notification System */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          className="auth-notification"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AuthModal;