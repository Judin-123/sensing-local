import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Paper,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    IconButton,
    Drawer,
    AppBar,
    Toolbar,
    Avatar,
    Badge,
    Stack,
    Container,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    Tabs,
    Tab,
    useMediaQuery,
    useTheme,
    CircularProgress
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    Assignment as AssignmentIcon,
    Chat as ChatIcon,
    Help as HelpIcon,
    School as SchoolIcon,
    Person as PersonIcon,
    Notifications as NotificationsIcon,
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    LocationOn as LocationIcon,
    Schedule as ScheduleIcon,
    Star as StarIcon,
    Download as DownloadIcon,
    PlayArrow as PlayArrowIcon,
    Description as DescriptionIcon,
    Language as LanguageIcon,
    CameraAlt as CameraIcon,
    PhotoCamera as PhotoCameraIcon,
    Send as SendIcon,
    AttachMoney as MoneyIcon,
    Menu as MenuIcon,
    Event as EventIcon,
    Cancel as CancelIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Announcement as AnnouncementIcon,
    PictureAsPdf as PdfIcon,
    GetApp as DownloadIcon2
} from "@mui/icons-material";
import axios from "axios";

import FAQPage from "./FAQPage";
import GroupChatPage from "./GroupChatPage";
import TrainingMaterialsPage from "./TrainingMaterialsPage";

const VolunteerDashboard = ({ userData }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [trainingCompleted, setTrainingCompleted] = useState(false);
    const [activeTab, setActiveTab] = useState("spotlight");
    const [showTraining, setShowTraining] = useState(false);
    const [auditCompleted, setAuditCompleted] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [activePage, setActivePage] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPhotoCapture, setShowPhotoCapture] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [predictedCost, setPredictedCost] = useState(null);
    const [photoHistory, setPhotoHistory] = useState([]);
    const [showPhotoHistory, setShowPhotoHistory] = useState(false);

    // Real data states
    const [userProfile, setUserProfile] = useState(null);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch user data on component mount
    useEffect(() => {
        if (userData && userData.id) {
            fetchUserData();
        }
    }, [userData]);

    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true);
            const [profileRes, tasksRes, campaignsRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/user/${userData.id}`),
                axios.get(`http://localhost:5000/api/tasks/upcoming/${userData.id}`),
                axios.get(`http://localhost:5000/api/campaigns/by-volunteer/${userData.id}`)
            ]);

            // Add dummy badges and certificates to user profile
            const userWithBadges = {
                ...profileRes.data.data,
                badges: [
                    { icon: "🏆", name: "First Audit", description: "Completed your first community audit" },
                    { icon: "📸", name: "Photo Expert", description: "Captured 10+ infrastructure photos" },
                    { icon: "🎯", name: "Accuracy Master", description: "95%+ accuracy in cost predictions" },
                    { icon: "📅", name: "Regular Volunteer", description: "Active for 3+ months" },
                    { icon: "🌟", name: "Community Hero", description: "Completed 50+ audits" },
                    { icon: "📚", name: "Training Complete", description: "Finished all training modules" }
                ],
                certificates: [
                    {
                        id: 1,
                        title: "ward1_participation certificate",
                        type: "Training",
                        issueDate: "2025-01-15",
                        expiryDate: "2026-01-15",
                        status: "Active",
                        coverImage: "https://m.media-amazon.com/images/I/71hI16-vr6L._SL1000_.jpg",
                        description: "Comprehensive training in community infrastructure auditing techniques"
                    },
                    {
                        id: 2,
                        title: "ward1_participation certificate",
                        type: "Safety",
                        issueDate: "2025-02-20",
                        expiryDate: "2026-02-20",
                        status: "Active",
                        coverImage: "https://m.media-amazon.com/images/I/71hI16-vr6L._SL1000_.jpg",
                        description: "Certification in workplace safety protocols and emergency procedures"
                    },
                    {
                        id: 3,
                        title: "ward1_participation certificate",
                        type: "Skills",
                        issueDate: "2025-03-10",
                        expiryDate: "2026-03-10",
                        status: "Active",
                        coverImage: "https://m.media-amazon.com/images/I/71hI16-vr6L._SL1000_.jpg",
                        description: "Advanced certification in data collection and reporting methodologies"
                    },
                    {
                        id: 4,
                        title: "ward1_participation certificate",
                        type: "Leadership",
                        issueDate: "2025-04-05",
                        expiryDate: "2026-04-05",
                        status: "Active",
                        coverImage: "https://m.media-amazon.com/images/I/71hI16-vr6L._SL1000_.jpg",
                        description: "Leadership certification in community engagement and mobilization"
                    }
                ]
            };
            setUserProfile(userWithBadges);
            setUpcomingTasks(tasksRes.data.data.upcomingTasks || []);
            setCampaigns(campaignsRes.data.data.campaigns || []);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data');
        } finally {
            setLoading(false);
        }
    }, [userData]);

    const fetchCompletedTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/tasks/completed?volunteerId=${userData.id}`);
            setCompletedTasks(response.data.data.completedTasks || []);
        } catch (error) {
            console.error('Error fetching completed tasks:', error);
        }
    };

    // Mock data for features not yet supported by backend
    const auditInfo = {
        location: "Church Street, Bengaluru",
        lat: 12.9716,
        lng: 77.5946,
        date: "2025-07-15",
        time: "10:00 AM",
        road: "Church Street to Brigade Road"
    };

    const spotlightMessages = [
        {
            id: 1,
            title: "Important Meeting Reminder",
            message: "Please arrive at Church Street location at 10:00 AM sharp for the community audit meeting. Bring your safety gear and documentation materials.",
            priority: "high",
            timestamp: "2025-07-14 15:30"
        },
        {
            id: 2,
            title: "New Safety Guidelines",
            message: "Updated safety protocols have been implemented. Please review the new guidelines before your next audit.",
            priority: "medium",
            timestamp: "2025-07-13 09:15"
        },
        {
            id: 3,
            title: "Training Completion Deadline",
            message: "Complete your mandatory training modules by end of this week to maintain active volunteer status.",
            priority: "high",
            timestamp: "2025-07-12 14:20"
        }
    ];

    const pendingRoads = [
        "Brigade Road to MG Road",
        "Commercial Street to Residency Road",
        "St. Mark's Road to Lavelle Road"
    ];

    const trainingMaterials = [
        {
            title: "Safety Protocols Video",
            type: "video",
            url: "#",
            duration: "15 min"
        },
        {
            title: "Audit Methodology Guide",
            type: "pdf",
            url: "#",
            size: "2.5 MB"
        },
        {
            title: "Community Engagement Training",
            type: "external",
            url: "#",
            description: "External resource for advanced training"
        }
    ];

    const handleCompleteTraining = async () => {
        try {
            await axios.patch(`http://localhost:5000/api/users/${userData.id}/learning`);
            setTrainingCompleted(true);
            setShowTraining(false);
            // Refresh user data
            fetchUserData();
        } catch (error) {
            console.error('Error updating training status:', error);
        }
    };

    const handleStartTraining = () => {
        setShowTraining(true);
    };

    const handleCompleteAudit = () => {
        setAuditCompleted(true);
    };

    const handleNextAudit = () => {
        setAuditCompleted(false);
    };

    const getGoogleMapsUrl = (lat, lng) => {
        return `https://www.google.com/maps?q=${lat},${lng}`;
    };

    const handlePhotoCapture = () => {
        setShowPhotoCapture(true);
    };

    const capturePhoto = () => {
        // Simulate photo capture using file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setCapturedImage(e.target.result);
                    setShowPhotoCapture(false);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const analyzePhoto = async () => {
        if (!capturedImage) return;

        setIsAnalyzing(true);

        try {
            // Simulate API call to the trained model
            // In real implementation, this would send the image to your model endpoint
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

            // Mock prediction result
            const mockPrediction = {
                cost: Math.floor(Math.random() * 50000) + 5000, // Random cost between 5000-55000
                confidence: Math.random() * 0.3 + 0.7, // Random confidence between 70-100%
                category: ['Road Repair', 'Street Light', 'Drainage', 'Signage'][Math.floor(Math.random() * 4)],
                description: 'Infrastructure maintenance required',
                timestamp: new Date().toISOString()
            };

            setPredictedCost(mockPrediction);

            // Add to photo history
            const newPhotoEntry = {
                id: Date.now(),
                image: capturedImage,
                prediction: mockPrediction,
                location: auditInfo.location,
                date: new Date().toISOString()
            };

            setPhotoHistory([newPhotoEntry, ...photoHistory]);
            setCapturedImage(null);

        } catch (error) {
            console.error('Error analyzing photo:', error);
            alert('Error analyzing photo. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        setPredictedCost(null);
    };

    const sendToAdmin = async (photoEntry) => {
        try {
            // Simulate sending to admin
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Photo and cost prediction sent to admin successfully!');

            // Update photo history to mark as sent
            setPhotoHistory(prev => prev.map(photo =>
                photo.id === photoEntry.id
                    ? { ...photo, sentToAdmin: true }
                    : photo
            ));
        } catch (error) {
            console.error('Error sending to admin:', error);
            alert('Error sending to admin. Please try again.');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "#ef4444";
            case "medium": return "#f59e0b";
            case "low": return "#10b981";
            default: return "#6b7280";
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "high": return <WarningIcon />;
            case "medium": return <InfoIcon />;
            case "low": return <CheckCircleIcon />;
            default: return <InfoIcon />;
        }
    };

    const downloadCertificate = (certificate) => {
        // Create a mock PDF download
        const certificateData = {
            title: certificate.title,
            name: userProfile?.name,
            issueDate: certificate.issueDate,
            expiryDate: certificate.expiryDate,
            type: certificate.type,
            description: certificate.description
        };

        // Create a blob with certificate data (in real app, this would be a PDF)
        const blob = new Blob([JSON.stringify(certificateData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${certificate.title.replace(/\s+/g, '_')}_${userProfile?.name}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    // Training not completed - show training page
    if (!trainingCompleted) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <Container maxWidth="md" sx={{ py: { xs: 4, sm: 8 }, px: { xs: 2, sm: 3 } }}>
                    <Card sx={{ textAlign: 'center', p: { xs: 3, sm: 4 } }}>
                        <Typography variant="h4" sx={{
                            mb: 2,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                        }}>
                            Trainings Pending
                        </Typography>
                        <Typography variant="body1" sx={{
                            mb: 4,
                            color: 'text.secondary',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                            Complete your mandatory training before accessing the volunteer dashboard.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleStartTraining}
                            startIcon={<SchoolIcon />}
                            sx={{
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                py: { xs: 1, sm: 1.5 }
                            }}
                        >
                            Complete Training
                        </Button>
                    </Card>
                </Container>

                <Dialog
                    open={showTraining}
                    onClose={() => setShowTraining(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Volunteer Training
                            <IconButton onClick={() => setShowTraining(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Safety Protocols
                                </Typography>
                                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                                    <PlayArrowIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                                    <Typography>Safety Protocols Video</Typography>
                                </Paper>
                            </Box>

                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Materials
                                </Typography>
                                <Stack spacing={1}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<DescriptionIcon />}
                                        fullWidth
                                        sx={{ justifyContent: 'flex-start' }}
                                    >
                                        Download PDF Guide
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<LanguageIcon />}
                                        fullWidth
                                        sx={{ justifyContent: 'flex-start' }}
                                    >
                                        Visit External Training Resource
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowTraining(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleCompleteTraining}
                            startIcon={<CheckCircleIcon />}
                        >
                            Mark Training as Completed
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }

    // Main dashboard
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Sidebar */}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? sidebarOpen : true}
                onClose={() => setSidebarOpen(false)}
                sx={{
                    width: { xs: 280, sm: 280 },
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: { xs: 280, sm: 280 },
                        boxSizing: 'border-box',
                        bgcolor: 'background.paper',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                    },
                }}
            >
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h5" sx={{ fontWeight: 300 }}>
                        sensing
                        <Box component="span" sx={{ fontWeight: 500 }}>local</Box>
                    </Typography>
                </Box>

                <List sx={{ pt: 2 }}>
                    <ListItem
                        button
                        selected={activePage === "dashboard"}
                        onClick={() => setActivePage("dashboard")}
                    >
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>

                    <ListItem
                        button
                        selected={activePage === "faq"}
                        onClick={() => setActivePage("faq")}
                    >
                        <ListItemIcon>
                            <HelpIcon />
                        </ListItemIcon>
                        <ListItemText primary="FAQ" />
                    </ListItem>

                    <ListItem
                        button
                        selected={activePage === "training"}
                        onClick={() => setActivePage("training")}
                    >
                        <ListItemIcon>
                            <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText primary="Training" />
                    </ListItem>

                    <ListItem
                        button
                        selected={activePage === "chat"}
                        onClick={() => setActivePage("chat")}
                    >
                        <ListItemIcon>
                            <ChatIcon />
                        </ListItemIcon>
                        <ListItemText primary="Group Chat" />
                    </ListItem>
                </List>
            </Drawer>

            {/* Main content */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Top bar */}
                <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
                        {isMobile && (
                            <IconButton
                                edge="start"
                                onClick={() => setSidebarOpen(true)}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography variant="h6" sx={{
                            flexGrow: 1,
                            color: 'text.primary',
                            fontSize: { xs: '1.1rem', sm: '1.25rem' }
                        }}>
                            Volunteer Dashboard
                        </Typography>

                        <IconButton sx={{ mr: 1 }} size={isMobile ? "small" : "medium"}>
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        <Button
                            startIcon={<PersonIcon />}
                            onClick={() => setShowProfile(true)}
                            sx={{
                                color: 'text.primary',
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                display: { xs: 'none', sm: 'flex' }
                            }}
                        >
                            {userProfile?.name}
                        </Button>
                    </Toolbar>
                </AppBar>

                {/* Page content */}
                <Box sx={{ flexGrow: 1, p: 3 }}>
                    {activePage === "dashboard" && (
                        <Container maxWidth="xl">
                            <Grid container spacing={3}>
                                {/* Welcome and Quick Actions */}
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h4" sx={{ mb: 2 }}>
                                                Welcome back, {userProfile?.name}! 👋
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                                                You have {pendingRoads.length} pending audits. Let's make our community safer together.
                                            </Typography>

                                            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    onClick={() => window.open('https://app.merginmaps.com/', '_blank')}
                                                    disabled={auditCompleted}
                                                    startIcon={<AssignmentIcon />}
                                                >
                                                    {auditCompleted ? "Audit Completed" : "Start Audit"}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="large"
                                                    onClick={handlePhotoCapture}
                                                    startIcon={<CameraIcon />}
                                                >
                                                    Capture Photo
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="large"
                                                    onClick={() => setShowPhotoHistory(true)}
                                                    startIcon={<PhotoCameraIcon />}
                                                >
                                                    Photo History
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Stats Cards */}
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 1 }}>
                                                Total Audits
                                            </Typography>
                                            <Typography variant="h3" sx={{ color: 'primary.main' }}>
                                                {userProfile?.totalAudits || 0}
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(userProfile?.completedAudits / userProfile?.totalAudits) * 100}
                                                sx={{ mt: 1 }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 1 }}>
                                                Attendance Rate
                                            </Typography>
                                            <Typography variant="h3" sx={{ color: 'secondary.main' }}>
                                                {userProfile?.attendance || "N/A"}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 1 }}>
                                                Performance Score
                                            </Typography>
                                            <Typography variant="h3" sx={{ color: 'success.main' }}>
                                                {userProfile?.score || 0}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Spotlight Messages */}
                                <Grid item xs={12} md={8}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2 }}>
                                                Spotlight Messages
                                            </Typography>
                                            <List>
                                                {spotlightMessages.map((message, index) => (
                                                    <React.Fragment key={message.id}>
                                                        <ListItem alignItems="flex-start">
                                                            <ListItemIcon>
                                                                <Box sx={{ color: getPriorityColor(message.priority) }}>
                                                                    {getPriorityIcon(message.priority)}
                                                                </Box>
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                                            {message.title}
                                                                        </Typography>
                                                                        <Chip
                                                                            label={message.priority}
                                                                            size="small"
                                                                            sx={{
                                                                                bgcolor: getPriorityColor(message.priority),
                                                                                color: 'white',
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                }
                                                                secondary={
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                                                            {message.message}
                                                                        </Typography>
                                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                                            {message.timestamp}
                                                                        </Typography>
                                                                    </Box>
                                                                }
                                                            />
                                                        </ListItem>
                                                        {index < spotlightMessages.length - 1 && <Divider />}
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Upcoming Tasks */}
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2 }}>
                                                Upcoming Tasks
                                            </Typography>
                                            {upcomingTasks.length > 0 ? (
                                                <List>
                                                    {upcomingTasks.slice(0, 3).map((task, index) => (
                                                        <ListItem key={task._id || index}>
                                                            <ListItemIcon>
                                                                <AssignmentIcon color="primary" />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={task.title}
                                                                secondary={task.location}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No upcoming tasks assigned.
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Container>
                    )}

                    {activePage === "faq" && <FAQPage />}
                    {activePage === "training" && <TrainingMaterialsPage />}
                    {activePage === "chat" && <GroupChatPage userData={userData} />}
                </Box>
            </Box>

            {/* Profile Dialog */}
            <Dialog
                open={showProfile}
                onClose={() => setShowProfile(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Profile
                        <IconButton onClick={() => setShowProfile(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Personal Information
                            </Typography>
                            <Stack spacing={2}>
                                <Typography><strong>Name:</strong> {userProfile?.name}</Typography>
                                <Typography><strong>Email:</strong> {userProfile?.email}</Typography>
                                <Typography><strong>Phone:</strong> {userProfile?.phone}</Typography>
                                <Typography><strong>Ward:</strong> {userProfile?.ward}</Typography>
                                <Typography><strong>Join Date:</strong> {userProfile?.joinDate}</Typography>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Badges
                            </Typography>
                            <Stack spacing={1}>
                                {userProfile?.badges?.map((badge, index) => (
                                    <Chip
                                        key={index}
                                        label={`${badge.icon} ${badge.name}`}
                                        variant="outlined"
                                        size="small"
                                    />
                                ))}
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Certificates ({userProfile?.certificates?.length || 0})
                            </Typography>
                            <Stack spacing={1}>
                                {userProfile?.certificates?.map((certificate, index) => (
                                    <Chip
                                        key={index}
                                        label={certificate.title}
                                        variant="outlined"
                                        size="small"
                                        onClick={() => downloadCertificate(certificate)}
                                        sx={{ cursor: 'pointer' }}
                                        icon={<PdfIcon />}
                                    />
                                ))}
                            </Stack>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Certificates Gallery
                            </Typography>
                            <Grid container spacing={2}>
                                {userProfile?.certificates?.map((certificate, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={certificate.id}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    boxShadow: 2,
                                                    transform: 'translateY(-2px)',
                                                    transition: 'all 0.2s ease-in-out'
                                                }
                                            }}
                                            onClick={() => downloadCertificate(certificate)}
                                        >
                                            <Box sx={{ position: 'relative' }}>
                                                <img
                                                    src={certificate.coverImage}
                                                    alt={certificate.title}
                                                    style={{
                                                        width: '100%',
                                                        height: 150,
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    bgcolor: 'rgba(0,0,0,0.7)',
                                                    color: 'white',
                                                    borderRadius: 1,
                                                    px: 1,
                                                    py: 0.5
                                                }}>
                                                    <Chip
                                                        label={certificate.status}
                                                        color={certificate.status === 'Active' ? 'success' : 'warning'}
                                                        size="small"
                                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                                    />
                                                </Box>
                                            </Box>
                                            <CardContent sx={{ p: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    {certificate.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                                    {certificate.type}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                                    Issued: {certificate.issueDate}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                                    Expires: {certificate.expiryDate}
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<DownloadIcon2 />}
                                                    fullWidth
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        downloadCertificate(certificate);
                                                    }}
                                                >
                                                    Download
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>

            {/* Photo Capture Modal */}
            <Dialog
                open={showPhotoCapture}
                onClose={() => setShowPhotoCapture(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Capture Photo
                        <IconButton onClick={() => setShowPhotoCapture(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                            <CameraIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Capture Infrastructure Photo
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Take a photo of the infrastructure issue for cost prediction analysis
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={capturePhoto}
                            startIcon={<PhotoCameraIcon />}
                            fullWidth
                        >
                            Take Photo
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>

            {/* Photo Analysis Modal */}
            <Dialog
                open={!!capturedImage}
                onClose={() => setCapturedImage(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Photo Analysis
                        <IconButton onClick={() => setCapturedImage(null)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Captured Photo
                            </Typography>
                            <Box sx={{
                                width: '100%',
                                height: 300,
                                bgcolor: 'grey.100',
                                borderRadius: 2,
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Box>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={retakePhoto}
                                    fullWidth
                                >
                                    Retake Photo
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={analyzePhoto}
                                    disabled={isAnalyzing}
                                    startIcon={isAnalyzing ? <LinearProgress size={20} /> : <SendIcon />}
                                    fullWidth
                                >
                                    {isAnalyzing ? 'Analyzing...' : 'Analyze Photo'}
                                </Button>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Analysis Results
                            </Typography>
                            {isAnalyzing ? (
                                <Box sx={{ textAlign: 'center', p: 4 }}>
                                    <LinearProgress sx={{ mb: 2 }} />
                                    <Typography>Analyzing photo with AI model...</Typography>
                                </Box>
                            ) : predictedCost ? (
                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h6">Predicted Cost</Typography>
                                                <Chip
                                                    label={`${(predictedCost.confidence * 100).toFixed(1)}% confidence`}
                                                    color="primary"
                                                    size="small"
                                                />
                                            </Box>

                                            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                                ₹{predictedCost.cost.toLocaleString()}
                                            </Typography>

                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Category: {predictedCost.category}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Description: {predictedCost.description}
                                                </Typography>
                                            </Box>

                                            <Button
                                                variant="contained"
                                                onClick={() => sendToAdmin({
                                                    id: Date.now(),
                                                    image: capturedImage,
                                                    prediction: predictedCost,
                                                    location: auditInfo.location,
                                                    date: new Date().toISOString()
                                                })}
                                                startIcon={<SendIcon />}
                                                fullWidth
                                            >
                                                Send to Admin
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <MoneyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                    <Typography color="text.secondary">
                                        Click "Analyze Photo" to get cost prediction
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>

            {/* Photo History Modal */}
            <Dialog
                open={showPhotoHistory}
                onClose={() => setShowPhotoHistory(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Photo History
                        <IconButton onClick={() => setShowPhotoHistory(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {photoHistory.length === 0 ? (
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <PhotoCameraIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                No Photos Yet
                            </Typography>
                            <Typography color="text.secondary">
                                Capture your first photo to see it here
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {photoHistory.map((photo) => (
                                <Grid item xs={12} md={6} key={photo.id}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box sx={{
                                                width: '100%',
                                                height: 200,
                                                bgcolor: 'grey.100',
                                                borderRadius: 1,
                                                overflow: 'hidden',
                                                mb: 2
                                            }}>
                                                <img
                                                    src={photo.image}
                                                    alt="Captured"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </Box>

                                            <Stack spacing={1}>
                                                <Typography variant="h6">
                                                    ₹{photo.prediction.cost.toLocaleString()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {photo.prediction.category} • {new Date(photo.date).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Location: {photo.location}
                                                </Typography>

                                                {!photo.sentToAdmin && (
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => sendToAdmin(photo)}
                                                        startIcon={<SendIcon />}
                                                    >
                                                        Send to Admin
                                                    </Button>
                                                )}

                                                {photo.sentToAdmin && (
                                                    <Chip
                                                        label="Sent to Admin"
                                                        color="success"
                                                        size="small"
                                                        icon={<CheckCircleIcon />}
                                                    />
                                                )}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </DialogContent>
            </Dialog>
        </Box >
    );
};

export default VolunteerDashboard; 