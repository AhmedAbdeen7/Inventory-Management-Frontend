import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Collapse,
  Chip,
  InputAdornment,
  IconButton,
  Fade,
  Avatar,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('manager');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');

  const isValid = firstName && lastName && email.includes('@') && phone && password.length >= 6 && (role !== 'staff' || accessKey);

  const handleRegister = (e) => {
    e.preventDefault();
    if (isValid) {
      navigate('/dashboard');
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
              p: { xs: 4, sm: 5 },
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
                  Create Account
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
                  Fill in your details to get started with FreshFlow.
                </Typography>
              </Box>

              <Box component="form" noValidate onSubmit={handleRegister}>
                <Box sx={{ mb: 3 }}>
                  <Typography className="form-label" sx={{ fontSize: 14, fontWeight: 500, color: '#374151', mb: 1.5, letterSpacing: '-0.01em' }}>
                    Select Your Role
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label="Store Manager"
                      onClick={() => setRole('manager')}
                      sx={{
                        flex: 1,
                        fontWeight: 600,
                        borderRadius: '8px',
                        bgcolor: role === 'manager' ? '#1B5E20' : '#F9FAFB',
                        color: role === 'manager' ? 'white' : '#374151',
                        border: '1px solid',
                        borderColor: role === 'manager' ? '#1B5E20' : '#E5E7EB',
                        '&:hover': { bgcolor: role === 'manager' ? '#003300' : '#F3F4F6' }
                      }}
                    />
                    <Chip
                      label="Floor Staff"
                      onClick={() => setRole('staff')}
                      sx={{
                        flex: 1,
                        fontWeight: 600,
                        borderRadius: '8px',
                        bgcolor: role === 'staff' ? '#1B5E20' : '#F9FAFB',
                        color: role === 'staff' ? 'white' : '#374151',
                        border: '1px solid',
                        borderColor: role === 'staff' ? '#1B5E20' : '#E5E7EB',
                        '&:hover': { bgcolor: role === 'staff' ? '#003300' : '#F3F4F6' }
                      }}
                    />
                  </Stack>
                </Box>

                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Box className="form-group" sx={{ flex: 1 }}>
                      <Typography className="form-label" component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', mb: 1, letterSpacing: '-0.01em' }}>
                        First Name
                      </Typography>
                      <TextField
                        fullWidth
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        InputProps={{
                          startAdornment: (<InputAdornment position="start"><PersonOutlineIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>)
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#F9FAFB',
                            borderRadius: '8px',
                            '& fieldset': { borderColor: '#E5E7EB' },
                            '&.Mui-focused fieldset': { borderColor: '#1B5E20' },
                            '&.Mui-focused': { bgcolor: '#FFFFFF', boxShadow: '0 0 0 3px rgba(27, 94, 32, 0.1)' }
                          },
                          '& input': { padding: '12px 16px', fontSize: 15 }
                        }}
                      />
                    </Box>
                    <Box className="form-group" sx={{ flex: 1 }}>
                      <Typography className="form-label" component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', mb: 1, letterSpacing: '-0.01em' }}>
                        Last Name
                      </Typography>
                      <TextField
                        fullWidth
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        InputProps={{
                          startAdornment: (<InputAdornment position="start"><PersonOutlineIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>)
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#F9FAFB',
                            borderRadius: '8px',
                            '& fieldset': { borderColor: '#E5E7EB' },
                            '&.Mui-focused fieldset': { borderColor: '#1B5E20' },
                            '&.Mui-focused': { bgcolor: '#FFFFFF', boxShadow: '0 0 0 3px rgba(27, 94, 32, 0.1)' }
                          },
                          '& input': { padding: '12px 16px', fontSize: 15 }
                        }}
                      />
                    </Box>
                  </Stack>

                  <Box className="form-group">
                    <Typography className="form-label" component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', mb: 1, letterSpacing: '-0.01em' }}>
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        startAdornment: (<InputAdornment position="start"><EmailOutlinedIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>)
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#F9FAFB',
                          borderRadius: '8px',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&.Mui-focused fieldset': { borderColor: '#1B5E20' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', boxShadow: '0 0 0 3px rgba(27, 94, 32, 0.1)' }
                        },
                        '& input': { padding: '12px 16px', fontSize: 15 }
                      }}
                    />
                  </Box>

                  <Box className="form-group">
                    <Typography className="form-label" component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', mb: 1, letterSpacing: '-0.01em' }}>
                      Phone Number
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      InputProps={{
                        startAdornment: (<InputAdornment position="start"><PhoneOutlinedIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>)
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#F9FAFB',
                          borderRadius: '8px',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&.Mui-focused fieldset': { borderColor: '#1B5E20' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', boxShadow: '0 0 0 3px rgba(27, 94, 32, 0.1)' }
                        },
                        '& input': { padding: '12px 16px', fontSize: 15 }
                      }}
                    />
                  </Box>

                  <Box className="form-group">
                    <Typography className="form-label" component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', mb: 1, letterSpacing: '-0.01em' }}>
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        startAdornment: (<InputAdornment position="start"><LockOutlinedIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>)
                      }}
                      helperText="Minimum 6 characters"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#F9FAFB',
                          borderRadius: '8px',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&.Mui-focused fieldset': { borderColor: '#1B5E20' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', boxShadow: '0 0 0 3px rgba(27, 94, 32, 0.1)' }
                        },
                        '& input': { padding: '12px 16px', fontSize: 15 }
                      }}
                    />
                  </Box>

                  <Collapse in={role === 'staff'}>
                    <Box className="form-group">
                      <Typography className="form-label" component="label" sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', mb: 1, letterSpacing: '-0.01em' }}>
                        Staff Access Key
                      </Typography>
                      <TextField
                        fullWidth
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        InputProps={{
                          startAdornment: (<InputAdornment position="start"><VpnKeyOutlinedIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>)
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: alpha('#1B5E20', 0.02),
                            borderRadius: '8px',
                            '& fieldset': { borderColor: '#E5E7EB' },
                            '&.Mui-focused fieldset': { borderColor: '#1B5E20' }
                          },
                          '& input': { padding: '12px 16px', fontSize: 15 }
                        }}
                      />
                    </Box>
                  </Collapse>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!isValid}
                    className="auth-button"
                    sx={{
                      py: 1.75,
                      fontWeight: 600,
                      fontSize: 15,
                      borderRadius: '8px',
                      textTransform: 'none',
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
                    Create Account
                  </Button>
                </Stack>
              </Box>

              <Box className="auth-footer" sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#6B7280', fontSize: 14 }}>
                  Already have an account?{' '}
                  <Link
                    component="button"
                    className="auth-link"
                    onClick={() => navigate('/login')}
                    sx={{
                      color: '#1B5E20',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      fontSize: 14,
                      '&:hover': { color: '#003300', textDecoration: 'underline' }
                    }}
                  >
                    Sign in
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
