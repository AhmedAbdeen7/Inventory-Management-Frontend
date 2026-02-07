import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Fade,
  Link,
  Stack,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import useAuth from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const valid = email.includes('@') && password.length >= 6;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (valid) {
      setLoading(true);
      setError('');
      try {
        await login(email, password);
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      className="auth-page"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
        p: { xs: 3, sm: 5 },
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <Fade in timeout={800}>
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          {/* Header Section - Matched to Sidebar Logo */}
          <Box className="auth-header" sx={{ textAlign: 'center', mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography sx={{ fontSize: 40 }}>🌿</Typography>
              <Typography
                variant="h4"
                sx={{
                  color: '#1B5E20',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  letterSpacing: '-1px'
                }}
              >
                FreshFlow
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#6B7280',
                fontWeight: 500,
                letterSpacing: '0.2px'
              }}
            >
              Inventory intelligence for modern retail
            </Typography>
          </Box>

          <Card
            className="auth-card"
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.05)',
              p: { xs: 4, sm: 6 },
              border: 'none',
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ mb: 4 }}>
                <Typography
                  className="auth-title"
                  sx={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: '#111827',
                    mb: 1,
                    letterSpacing: '-0.01em'
                  }}
                >
                  Sign In
                </Typography>
                <Typography
                  className="auth-subtitle"
                  sx={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#6B7280',
                    lineHeight: 1.5
                  }}
                >
                  Log in to manage your inventory and view AI insights.
                </Typography>
                {error && (
                  <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                    {error}
                  </Typography>
                )}
              </Box>

              <Box component="form" noValidate onSubmit={handleLogin}>
                <Stack spacing={2.5}>
                  <Box className="form-group">
                    <Typography className="form-label" component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', mb: 1, letterSpacing: '-0.01em' }}>
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      value={email}
                      placeholder="name@company.com"
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon fontSize="small" sx={{ color: '#9CA3AF' }} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#F9FAFB',
                          borderRadius: '8px',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&:hover fieldset': { borderColor: '#D1D5DB' },
                          '&.Mui-focused fieldset': { borderColor: '#1B5E20' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', boxShadow: '0 0 0 3px rgba(27, 94, 32, 0.1)' }
                        },
                        '& input': { padding: '12px 16px', fontSize: 15, color: '#111827' }
                      }}
                    />
                  </Box>

                  <Box className="form-group">
                    <Typography className="form-label" component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', mb: 1, letterSpacing: '-0.01em' }}>
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      type={show ? 'text' : 'password'}
                      value={password}
                      placeholder="••••••••"
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon fontSize="small" sx={{ color: '#9CA3AF' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end" onClick={() => setShow(!show)} size="small">
                              {show ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#F9FAFB',
                          borderRadius: '8px',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&:hover fieldset': { borderColor: '#D1D5DB' },
                          '&.Mui-focused fieldset': { borderColor: '#1B5E20' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', boxShadow: '0 0 0 3px rgba(27, 94, 32, 0.1)' }
                        },
                        '& input': { padding: '12px 16px', fontSize: 15, color: '#111827' }
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!valid}
                    className="auth-button"
                    sx={{
                      mt: 3,
                      py: 1.75,
                      fontWeight: 600,
                      fontSize: 15,
                      textTransform: 'none',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%) !important',
                      boxShadow: '0 2px 4px rgba(27, 94, 32, 0.2)',
                      letterSpacing: '-0.01em',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #003300 0%, #1B5E20 100%) !important',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px rgba(27, 94, 32, 0.3)'
                      },
                      '&:active': { transform: 'translateY(0)' },
                      '&.Mui-disabled': { opacity: 0.7, color: '#fff', background: '#9CA3AF !important' }
                    }}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Box>

              <Box className="auth-footer" sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#6B7280', fontSize: 14 }}>
                  Don't have an account?{' '}
                  <Link
                    component="button"
                    className="auth-link"
                    onClick={() => navigate('/register')}
                    sx={{
                      color: '#1B5E20',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      fontSize: 14,
                      '&:hover': { color: '#003300', textDecoration: 'underline' }
                    }}
                  >
                    Create account
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Box>
  );
}
