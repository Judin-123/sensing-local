import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Stack,
    Container,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import axios from "axios";

const VolunteerSignup = ({ onBackToLogin, onSignupSuccess }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        phone: "",
        ward: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const wards = [
        "Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6",
        "Ward 7", "Ward 8", "Ward 9", "Ward 10"
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        // Full name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        // Phone validation
        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }

        // Ward validation
        if (!formData.ward) {
            newErrors.ward = "Please select a ward";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [signupError, setSignupError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setSignupError("");

        try {
            const response = await axios.post('http://localhost:5000/api/signup', {
                email: formData.email,
                name: formData.fullName,
                password: formData.password,
                role: 'volunteer',
                phone: formData.phone,
                address: formData.ward
            });

            if (response.data.success) {
                onSignupSuccess(formData.email);
            } else {
                setSignupError(response.data.message || "Signup failed");
            }
        } catch (error) {
            console.error('Signup error:', error);
            if (error.response && error.response.data) {
                setSignupError(error.response.data.message || "Signup failed");
            } else {
                setSignupError("Network error. Please check your connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #F8F9FA 0%, #E8EAED 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 1, sm: 2 },
            }}
        >
            <Container maxWidth="sm" sx={{ width: '100%' }}>
                <Card sx={{ maxWidth: { xs: '100%', sm: 600 }, mx: 'auto' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        {/* Header */}
                        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={onBackToLogin}
                                sx={{
                                    position: 'absolute',
                                    left: { xs: 8, sm: 16 },
                                    top: { xs: 8, sm: 16 },
                                    color: 'text.secondary',
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                }}
                            >
                                Back
                            </Button>

                            <Typography variant="h1" sx={{
                                mb: 1,
                                fontWeight: 300,
                                fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' }
                            }}>
                                sensing
                                <Box component="span" sx={{ fontWeight: 500 }}>local</Box>
                            </Typography>
                            <Typography variant="h2" sx={{
                                mb: 1,
                                fontWeight: 400,
                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                            }}>
                                Join as Volunteer
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}>
                                Create your account to start volunteering
                            </Typography>
                        </Box>

                        {/* Error Display */}
                        {signupError && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {signupError}
                            </Alert>
                        )}

                        {/* Form */}
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <Stack spacing={{ xs: 2, sm: 3 }}>
                                {/* Email Field */}
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    required
                                    size={isMobile ? "small" : "medium"}
                                />

                                {/* Full Name Field */}
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                                    error={!!errors.fullName}
                                    helperText={errors.fullName}
                                    required
                                    size={isMobile ? "small" : "medium"}
                                />

                                {/* Phone Field */}
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                    required
                                    size={isMobile ? "small" : "medium"}
                                />

                                {/* Ward Selection */}
                                <FormControl fullWidth error={!!errors.ward}>
                                    <InputLabel>Ward</InputLabel>
                                    <Select
                                        value={formData.ward}
                                        label="Ward"
                                        onChange={(e) => handleInputChange("ward", e.target.value)}
                                        required
                                        size={isMobile ? "small" : "medium"}
                                    >
                                        {wards.map(ward => (
                                            <MenuItem key={ward} value={ward}>{ward}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.ward && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                            {errors.ward}
                                        </Typography>
                                    )}
                                </FormControl>

                                {/* Password Field */}
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    required
                                    size={isMobile ? "small" : "medium"}
                                />

                                {/* Confirm Password Field */}
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                    required
                                    size={isMobile ? "small" : "medium"}
                                />

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={isLoading}
                                    sx={{
                                        py: { xs: 1.5, sm: 2 },
                                        mt: 2,
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }}
                                >
                                    {isLoading ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </Stack>
                        </Box>

                        {/* Sign in link */}
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Already have an account?{' '}
                                <Button
                                    variant="text"
                                    onClick={onBackToLogin}
                                    sx={{ color: 'primary.main', p: 0, minWidth: 'auto' }}
                                >
                                    Sign in
                                </Button>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default VolunteerSignup; 