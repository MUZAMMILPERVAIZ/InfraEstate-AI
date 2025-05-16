import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';

const AuthCheck = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        navigate('/login', {
          state: {
            from: window.location.pathname,
            message: 'Please log in to access the chat'
          }
        });
      }
    };

    checkAuth();
  }, [navigate]);

  // Check if token exists for rendering
  const isAuthenticated = !!localStorage.getItem('accessToken');

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 80px)',
          gap: 2
        }}
      >
        <CircularProgress size={40} color="primary" />
        <Typography variant="body1" color="text.secondary">
          Checking authentication status...
        </Typography>
      </Box>
    );
  }

  return children;
};

export default AuthCheck;