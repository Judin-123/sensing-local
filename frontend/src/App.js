import React, { useState } from "react";
import {
    ThemeProvider,
    createTheme,
    CssBaseline,
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Divider,
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
    Container,
    Paper,
    Alert,
    CircularProgress,
    Stack,
    useMediaQuery,
    GlobalStyles
} from "@mui/material";
import {
    Google as GoogleIcon,
    People as PeopleIcon,
    Business as BusinessIcon,
    Settings as SettingsIcon
} from "@mui/icons-material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import axios from "axios";
import { AnimatePresence, motion } from 'framer-motion';

import CoordinatorDashboard from "./CoordinatorDashboard";
import VolunteerSignup from "./VolunteerSignup";
import AdminDashboard from "./AdminDashboard";
import VolunteerDashboard from "./VolunteerDashboard";

// Google-like theme with responsive breakpoints
const theme = createTheme({
    palette: {
        primary: {
            main: '#4285F4', // Google Blue
        },
        secondary: {
            main: '#34A853', // Google Green
        },
        background: {
            default: '#F8F9FA',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#202124',
            secondary: '#5F6368',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h1: {
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 400,
            color: '#202124',
        },
        h2: {
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            fontWeight: 400,
            color: '#202124',
        },
        h3: {
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontWeight: 500,
            color: '#202124',
        },
        body1: {
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            color: '#5F6368',
        },
        body2: {
            fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
            color: '#5F6368',
        },
    },
    shape: {
        borderRadius: 8,
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    padding: 'clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)',
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    fontWeight: 500,
                    minHeight: 'clamp(36px, 8vw, 48px)',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    },
                },
                outlined: {
                    borderColor: '#DADCE0',
                    color: '#5F6368',
                    '&:hover': {
                        borderColor: '#4285F4',
                        backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                        '& fieldset': {
                            borderColor: '#DADCE0',
                        },
                        '&:hover fieldset': {
                            borderColor: '#4285F4',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#4285F4',
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                    borderRadius: 12,
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    padding: 'clamp(8px, 2vw, 12px)',
                    minHeight: 'clamp(40px, 8vw, 48px)',
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#8b5cf6', // Soft purple
        },
        secondary: {
            main: '#38bdf8', // Accent blue
        },
        background: {
            default: '#18181b',
            paper: 'rgba(36, 37, 50, 0.7)',
        },
        text: {
            primary: '#f3f4f6',
            secondary: '#a1a1aa',
        },
    },
    shape: {
        borderRadius: 16,
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h1: { fontWeight: 700, color: '#f3f4f6' },
        h2: { fontWeight: 600, color: '#f3f4f6' },
        h3: { fontWeight: 500, color: '#f3f4f6' },
        body1: { color: '#e5e7eb' },
        body2: { color: '#a1a1aa' },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: 'rgba(36, 37, 50, 0.7)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    borderRadius: '18px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'background 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.3s',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'rgba(36, 37, 50, 0.7)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    borderRadius: '18px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'transform 0.2s cubic-bezier(.4,2,.3,1), box-shadow 0.2s',
                    '&:hover': {
                        transform: 'translateY(-4px) scale(1.02)',
                        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.45)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'rgba(36, 37, 50, 0.7)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    fontWeight: 600,
                    transition: 'background 0.2s, box-shadow 0.2s, transform 0.18s',
                },
                contained: {
                    background: 'linear-gradient(90deg, #8b5cf6 0%, #38bdf8 100%)',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(139,92,246,0.12)',
                    '&:hover': {
                        background: 'linear-gradient(90deg, #7c3aed 0%, #0ea5e9 100%)',
                        boxShadow: '0 6px 24px rgba(56,189,248,0.18)',
                        transform: 'scale(1.03)',
                    },
                },
                outlined: {
                    borderColor: '#8b5cf6',
                    color: '#f3f4f6',
                    '&:hover': {
                        borderColor: '#38bdf8',
                        background: 'rgba(139,92,246,0.08)',
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    background: 'rgba(30,32,38,0.92)',
                    backdropFilter: 'blur(20px)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: 'rgba(24,24,27,0.95)',
                    backdropFilter: 'blur(12px)',
                },
            },
        },
    },
});

function AnimatedPage({ children }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.5, ease: [0.4, 0.2, 0.3, 1] }}
                style={{ height: '100%' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState("volunteer");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [userData, setUserData] = useState(null);

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email,
                password
            });

            if (response.data.success) {
                const user = response.data.data.user;

                // Check if the selected role matches the user's actual role
                if (user.role !== selectedRole) {
                    setError(`This account is registered as a ${user.role}, not a ${selectedRole}. Please select the correct role.`);
                    setIsLoading(false);
                    return;
                }

                setUserData(user);
                setIsLoggedIn(true);
                setError("");
            } else {
                setError(response.data.message || "Login failed");
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.data) {
                setError(error.response.data.message || "Login failed");
            } else {
                setError("Network error. Please check your connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignupSuccess = (signupEmail) => {
        setEmail(signupEmail);
        setShowSignup(false);
        setError("Account created successfully! Please sign in.");
    };

    const handleBackToLogin = () => {
        setShowSignup(false);
        setError("");
    };

    if (isLoggedIn && selectedRole === "coordinator") {
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <CoordinatorDashboard userData={userData} />
            </ThemeProvider>
        );
    }

    if (isLoggedIn && selectedRole === "admin") {
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <AdminDashboard userData={userData} />
            </ThemeProvider>
        );
    }

    if (isLoggedIn && selectedRole === "volunteer") {
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <VolunteerDashboard userData={userData} />
            </ThemeProvider>
        );
    }

    if (showSignup) {
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <VolunteerSignup onBackToLogin={handleBackToLogin} onSignupSuccess={handleSignupSuccess} />
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <GlobalStyles styles={{
                body: {
                    background: 'linear-gradient(135deg, #23243a 0%, #2d2e4a 100%)',
                    minHeight: '100vh',
                    fontFamily: 'Poppins, Inter, DM Sans, Arial, sans-serif',
                },
                '#root': {
                    minHeight: '100vh',
                },
            }} />
            <AnimatedPage>
                <Box
                    sx={{
                        minHeight: '100vh',
                        background: '#18181b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: { xs: 1, sm: 2 },
                    }}
                >
                    <Container maxWidth="lg" sx={{ width: '100%' }}>
                        <Card sx={{ background: '#18181b', color: '#f3f4f6', borderRadius: '18px', maxWidth: 900, width: '100%', mx: 'auto', p: 5, minHeight: 400, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)' }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                minHeight: { xs: 'auto', md: 600 }
                            }}>
                                {/* Left side - Branding */}
                                <Box
                                    sx={{
                                        flex: { xs: 'none', md: 1.2 },
                                        minWidth: { md: 380 },
                                        background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
                                        display: { xs: 'none', md: 'flex' },
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        p: { xs: 2, md: 6 },
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        minHeight: { xs: 200, md: 'auto' },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -50,
                                            right: -50,
                                            width: 200,
                                            height: 200,
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.1)',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: -30,
                                            left: -30,
                                            width: 150,
                                            height: 150,
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.1)',
                                        }}
                                    />
                                    <Typography variant="h1" sx={{
                                        mb: 4,
                                        fontWeight: 700,
                                        textAlign: 'center',
                                        fontSize: { xs: '2.2rem', md: '2.8rem' },
                                        letterSpacing: 1.5
                                    }}>
                                        sensing
                                        <Box component="span" sx={{ fontWeight: 900, color: '#8b5cf6', ml: 1 }}>local</Box>
                                    </Typography>
                                    <Typography variant="h2" sx={{
                                        mb: 2,
                                        fontWeight: 400,
                                        textAlign: 'center',
                                        fontSize: { xs: '1.25rem', md: '1.5rem' }
                                    }}>
                                        Welcome back
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        textAlign: 'center',
                                        opacity: 0.9,
                                        fontSize: { xs: '0.875rem', md: '1rem' },
                                        color: 'white'
                                    }}>
                                        Sign in to your Sensing Local account to continue
                                    </Typography>
                                </Box>

                                {/* Right side - Login Form */}
                                <Box sx={{
                                    flex: 1.5,
                                    p: { xs: 2, sm: 4, md: 7 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    minWidth: { md: 420 },
                                }}>
                                    <CardContent sx={{ p: 0 }}>
                                        <Typography variant="h2" sx={{
                                            mb: 3,
                                            textAlign: { xs: 'center', md: 'left' },
                                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                                        }}>
                                            Sign in
                                        </Typography>

                                        {error && (
                                            <Alert severity="error" sx={{ mb: 3 }}>
                                                {error}
                                            </Alert>
                                        )}

                                        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                                            <Stack spacing={{ xs: 2, sm: 3 }}>
                                                {/* Role Selection */}
                                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 1 }}>
                                                    <Typography variant="body2" sx={{
                                                        mb: 2,
                                                        color: 'text.secondary',
                                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                                        width: '100%',
                                                        textAlign: 'center'
                                                    }}>
                                                        Select your role
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
                                                    <ToggleButtonGroup
                                                        value={selectedRole}
                                                        exclusive
                                                        onChange={(e, newRole) => newRole && setSelectedRole(newRole)}
                                                        sx={{
                                                            width: '100%',
                                                            maxWidth: '100%',
                                                            minWidth: 220,
                                                            mx: 'auto',
                                                            borderRadius: 2,
                                                            gap: 0,
                                                            p: 0,
                                                            boxShadow: 'none',
                                                            border: '1px solid #23232b',
                                                            borderCollapse: 'collapse',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        <ToggleButton
                                                            value="volunteer"
                                                            sx={{
                                                                flex: 1,
                                                                minWidth: 0,
                                                                maxWidth: 'none',
                                                                py: { xs: 1.5, sm: 2 },
                                                                px: 0,
                                                                borderRadius: '8px 0 0 8px',
                                                                m: 0,
                                                                border: 'none',
                                                            }}
                                                        >
                                                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                                                <PeopleIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem' } }} />
                                                                <Typography noWrap sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Volunteer</Typography>
                                                            </Stack>
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value="coordinator"
                                                            sx={{
                                                                flex: 1,
                                                                minWidth: 0,
                                                                maxWidth: 'none',
                                                                py: { xs: 1.5, sm: 2 },
                                                                px: 0,
                                                                borderRadius: 0,
                                                                m: 0,
                                                                border: 'none',
                                                            }}
                                                        >
                                                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                                                <BusinessIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem' } }} />
                                                                <Typography noWrap sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Coordinator</Typography>
                                                            </Stack>
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value="admin"
                                                            sx={{
                                                                flex: 1,
                                                                minWidth: 0,
                                                                maxWidth: 'none',
                                                                py: { xs: 1.5, sm: 2 },
                                                                px: 0,
                                                                borderRadius: '0 8px 8px 0',
                                                                m: 0,
                                                                border: 'none',
                                                            }}
                                                        >
                                                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                                                <SettingsIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem' } }} />
                                                                <Typography noWrap sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Admin</Typography>
                                                            </Stack>
                                                        </ToggleButton>
                                                    </ToggleButtonGroup>
                                                </Box>

                                                {/* Email Field */}
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    autoComplete="username"
                                                    size={isMobile ? "small" : "medium"}
                                                />

                                                {/* Password Field */}
                                                <TextField
                                                    fullWidth
                                                    label="Password"
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    autoComplete="current-password"
                                                    size={isMobile ? "small" : "medium"}
                                                />

                                                {/* Remember me and Forgot password */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: { xs: 'column', sm: 'row' },
                                                    justifyContent: 'space-between',
                                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                                    gap: { xs: 1, sm: 0 }
                                                }}>
                                                    <FormControlLabel
                                                        control={<Checkbox size={isMobile ? "small" : "medium"} />}
                                                        label="Remember me"
                                                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                                    />
                                                    <Button
                                                        variant="text"
                                                        sx={{
                                                            color: 'primary.main',
                                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                                            p: { xs: 0, sm: 1 }
                                                        }}
                                                    >
                                                        Forgot password?
                                                    </Button>
                                                </Box>

                                                {/* Sign in button */}
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    fullWidth
                                                    disabled={isLoading}
                                                    sx={{
                                                        py: { xs: 1.5, sm: 2 },
                                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                                    }}
                                                >
                                                    {isLoading ? (
                                                        <CircularProgress size={20} color="inherit" />
                                                    ) : (
                                                        'Sign in'
                                                    )}
                                                </Button>

                                                {/* Divider */}
                                                <Divider>
                                                    <Typography variant="body2" sx={{
                                                        color: 'text.secondary',
                                                        px: 2,
                                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                                    }}>
                                                        or
                                                    </Typography>
                                                </Divider>

                                                {/* Google Sign in */}
                                                <Button
                                                    variant="outlined"
                                                    fullWidth
                                                    startIcon={<GoogleIcon />}
                                                    sx={{
                                                        py: { xs: 1.5, sm: 2 },
                                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                                    }}
                                                >
                                                    Continue with Google
                                                </Button>

                                                {/* Sign up link */}
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Typography variant="body2" sx={{
                                                        color: 'text.secondary',
                                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                                    }}>
                                                        Don't have an account?{' '}
                                                        <Button
                                                            variant="text"
                                                            onClick={() => setShowSignup(true)}
                                                            sx={{
                                                                color: 'primary.main',
                                                                p: 0,
                                                                minWidth: 'auto',
                                                                fontSize: { xs: '0.875rem', sm: '1rem' }
                                                            }}
                                                        >
                                                            Sign up for free
                                                        </Button>
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </CardContent>
                                </Box>
                            </Box>
                        </Card>
                    </Container>
                </Box>
            </AnimatedPage>
        </ThemeProvider>
    );
}

export default App;
