import React, { useState, useEffect } from "react";
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
    CircularProgress,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    TextField
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
    ArrowBack as ArrowBackIcon,
    People as PeopleIcon,
    Add as AddIcon
} from "@mui/icons-material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from "recharts";
import axios from "axios";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8AM to 7PM
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getWeekDates(startDate) {
    const start = new Date(startDate);
    const week = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        week.push(d);
    }
    return week;
}

const CoordinatorDashboard = ({ userData }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [activeTab, setActiveTab] = useState("volunteers");
    const [showAddVolunteerModal, setShowAddVolunteerModal] = useState(false);
    const [newVolunteer, setNewVolunteer] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [showSpotlightModal, setShowSpotlightModal] = useState(false);
    const [newSpotlightMessage, setNewSpotlightMessage] = useState({
        title: "",
        content: "",
        priority: "normal"
    });
    const [showChatModal, setShowChatModal] = useState(false);
    const [selectedVolunteerChat, setSelectedVolunteerChat] = useState(null);
    const [newChatMessage, setNewChatMessage] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [weekStart, setWeekStart] = useState(() => {
        const today = new Date();
        today.setDate(today.getDate() - today.getDay()); // set to Sunday
        today.setHours(0, 0, 0, 0);
        return today;
    });

    // Real data states
    const [meetings, setMeetings] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [spotlightMessages, setSpotlightMessages] = useState([]);
    const [chatConversations, setChatConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch data on component mount
    useEffect(() => {
        if (userData && userData.id) {
            fetchCoordinatorData();
        }
    }, [userData]);

    const fetchCoordinatorData = async () => {
        try {
            setLoading(true);
            const [meetingsRes, volunteersRes, profileRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/campaigns/by-coordinator/${userData.id}`),
                axios.get(`http://localhost:5000/api/volunteers/by-coordinator/${userData.id}`),
                axios.get(`http://localhost:5000/api/user/${userData.id}`)
            ]);

            // Add dummy volunteer data to meetings
            const meetingsWithVolunteers = (meetingsRes.data.data || []).map(meeting => ({
                ...meeting,
                volunteers: [
                    {
                        id: 1,
                        name: "Rahul Kumar",
                        email: "rahul.kumar@example.com",
                        phone: "+91 98765 43210",
                        attendance: "confirmed",
                        completion: "in-progress"
                    },
                    {
                        id: 2,
                        name: "Priya Sharma",
                        email: "priya.sharma@example.com",
                        phone: "+91 98765 43211",
                        attendance: "present",
                        completion: "completed"
                    },
                    {
                        id: 3,
                        name: "Amit Patel",
                        email: "amit.patel@example.com",
                        phone: "+91 98765 43212",
                        attendance: "pending",
                        completion: "pending"
                    },
                    {
                        id: 4,
                        name: "Neha Singh",
                        email: "neha.singh@example.com",
                        phone: "+91 98765 43213",
                        attendance: "confirmed",
                        completion: "in-progress"
                    },
                    {
                        id: 5,
                        name: "Rajesh Verma",
                        email: "rajesh.verma@example.com",
                        phone: "+91 98765 43214",
                        attendance: "absent",
                        completion: "pending"
                    }
                ]
            }));

            setMeetings(meetingsWithVolunteers);
            setVolunteers(volunteersRes.data.data || []);

            // Add dummy badges to coordinator profile
            const coordinatorWithBadges = {
                ...profileRes.data.data,
                badges: [
                    { icon: "👑", name: "Team Leader", description: "Successfully managed 10+ volunteer teams" },
                    { icon: "📊", name: "Data Master", description: "Coordinated 100+ community audits" },
                    { icon: "🤝", name: "Community Builder", description: "Built strong relationships with local communities" },
                    { icon: "📈", name: "Efficiency Expert", description: "Improved audit completion rates by 40%" },
                    { icon: "🎯", name: "Goal Achiever", description: "Met all quarterly targets consistently" },
                    { icon: "🌟", name: "Mentor", description: "Trained 20+ new volunteers" }
                ]
            };
            setUserProfile(coordinatorWithBadges);

            // Mock data for features not yet supported by backend
            setSpotlightMessages([
                {
                    id: 1,
                    title: "Important: New Safety Guidelines",
                    content: "Please review the updated safety protocols before your next audit. All volunteers must wear safety gear.",
                    priority: "high",
                    date: "2025-07-12",
                    author: userData.name
                },
                {
                    id: 2,
                    title: "Training Session Tomorrow",
                    content: "Mandatory training session for all volunteers at 10 AM. Please bring your notebooks.",
                    priority: "normal",
                    date: "2025-07-11",
                    author: userData.name
                },
                {
                    id: 3,
                    title: "Great Work Team!",
                    content: "Congratulations to everyone for completing the Ward 1 audit successfully. Keep up the excellent work!",
                    priority: "low",
                    date: "2025-07-10",
                    author: userData.name
                }
            ]);

            setChatConversations([
                {
                    volunteerId: 1,
                    volunteerName: "Rahul Kumar",
                    messages: [
                        { id: 1, sender: "volunteer", content: "Hi, I have a question about the audit checklist", timestamp: "2025-07-12 09:30" },
                        { id: 2, sender: "coordinator", content: "Sure Rahul, what's your question?", timestamp: "2025-07-12 09:32" },
                        { id: 3, sender: "volunteer", content: "Do I need to take photos of every street light?", timestamp: "2025-07-12 09:33" },
                        { id: 4, sender: "coordinator", content: "Yes, please take photos of any damaged or non-functioning street lights. Working ones don't need photos.", timestamp: "2025-07-12 09:35" }
                    ]
                },
                {
                    volunteerId: 2,
                    volunteerName: "Priya Sharma",
                    messages: [
                        { id: 1, sender: "volunteer", content: "I'm running late for today's audit. Will be there by 10:30", timestamp: "2025-07-12 08:45" },
                        { id: 2, sender: "coordinator", content: "No problem Priya, we'll wait for you. Drive safely!", timestamp: "2025-07-12 08:46" }
                    ]
                },
                {
                    volunteerId: 3,
                    volunteerName: "Amit Patel",
                    messages: [
                        { id: 1, sender: "volunteer", content: "Completed the Ward 1 audit. All tasks done!", timestamp: "2025-07-12 15:20" },
                        { id: 2, sender: "coordinator", content: "Excellent work Amit! Please submit your report by end of day.", timestamp: "2025-07-12 15:22" }
                    ]
                }
            ]);
        } catch (error) {
            console.error('Error fetching coordinator data:', error);
            setError('Failed to load coordinator data');
        } finally {
            setLoading(false);
        }
    };

    const weekDates = getWeekDates(weekStart);

    const handlePrevWeek = () => {
        const prev = new Date(weekStart);
        prev.setDate(prev.getDate() - 7);
        setWeekStart(prev);
    };

    const handleNextWeek = () => {
        const next = new Date(weekStart);
        next.setDate(next.getDate() + 7);
        setWeekStart(next);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed": return "#10b981";
            case "in-progress": return "#f59e0b";
            case "pending": return "#6b7280";
            default: return "#6b7280";
        }
    };

    const getAttendanceColor = (attendance) => {
        switch (attendance) {
            case "present": return "#10b981";
            case "confirmed": return "#3b82f6";
            case "pending": return "#f59e0b";
            case "absent": return "#ef4444";
            default: return "#6b7280";
        }
    };

    const getCompletionColor = (completion) => {
        switch (completion) {
            case "completed": return "#10b981";
            case "in-progress": return "#f59e0b";
            case "pending": return "#6b7280";
            default: return "#6b7280";
        }
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

    const updateVolunteerStatus = (meetingId, volunteerId, field, value) => {
        setMeetings(meetings.map(meeting => {
            if (meeting.id === meetingId) {
                return {
                    ...meeting,
                    volunteers: meeting.volunteers.map(volunteer => {
                        if (volunteer.id === volunteerId) {
                            return { ...volunteer, [field]: value };
                        }
                        return volunteer;
                    })
                };
            }
            return meeting;
        }));
    };

    const addNewVolunteer = () => {
        if (!newVolunteer.name || !newVolunteer.email) {
            alert("Please fill in name and email");
            return;
        }

        const currentVolunteers = selectedMeeting.volunteers || [];
        const volunteerId = Math.max(...currentVolunteers.map(v => v.id), 0) + 1;
        const newVolunteerData = {
            id: volunteerId,
            name: newVolunteer.name,
            email: newVolunteer.email,
            phone: newVolunteer.phone,
            attendance: "present",
            completion: "pending"
        };

        setMeetings(meetings.map(meeting => {
            if (meeting.id === selectedMeeting.id) {
                return {
                    ...meeting,
                    volunteers: [...(meeting.volunteers || []), newVolunteerData]
                };
            }
            return meeting;
        }));

        setNewVolunteer({ name: "", email: "", phone: "" });
        setShowAddVolunteerModal(false);
    };

    const handleInputChange = (field, value) => {
        setNewVolunteer(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSpotlightInputChange = (field, value) => {
        setNewSpotlightMessage(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const createSpotlightMessage = () => {
        if (!newSpotlightMessage.title || !newSpotlightMessage.content) {
            alert("Please fill in title and content");
            return;
        }

        const newMessage = {
            id: Math.max(...spotlightMessages.map(m => m.id), 0) + 1,
            title: newSpotlightMessage.title,
            content: newSpotlightMessage.content,
            priority: newSpotlightMessage.priority,
            date: new Date().toISOString().split('T')[0],
            author: "Judin Dsouza"
        };

        setSpotlightMessages([newMessage, ...spotlightMessages]);
        setNewSpotlightMessage({ title: "", content: "", priority: "normal" });
        setShowSpotlightModal(false);
    };

    const sendChatMessage = () => {
        if (!newChatMessage.trim() || !selectedVolunteerChat) return;

        const newMessage = {
            id: Math.max(...selectedVolunteerChat.messages.map(m => m.id), 0) + 1,
            sender: "coordinator",
            content: newChatMessage,
            timestamp: new Date().toLocaleString()
        };

        setChatConversations(prev => prev.map(conv => {
            if (conv.volunteerId === selectedVolunteerChat.volunteerId) {
                return {
                    ...conv,
                    messages: [...conv.messages, newMessage]
                };
            }
            return conv;
        }));

        setNewChatMessage("");
    };

    const openChatWithVolunteer = (volunteerId, volunteerName) => {
        const conversation = chatConversations.find(conv => conv.volunteerId === volunteerId);
        if (!conversation) {
            // Create new conversation if it doesn't exist
            const newConversation = {
                volunteerId,
                volunteerName,
                messages: []
            };
            setChatConversations([...chatConversations, newConversation]);
            setSelectedVolunteerChat(newConversation);
        } else {
            setSelectedVolunteerChat(conversation);
        }
        setShowChatModal(true);
    };

    // Meeting detail view
    if (selectedMeeting) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => setSelectedMeeting(null)}
                            sx={{
                                color: 'text.primary',
                                mr: 2,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            Back to Dashboard
                        </Button>
                        <Typography variant="h6" sx={{
                            flexGrow: 1,
                            color: 'text.primary',
                            fontSize: { xs: '1.1rem', sm: '1.25rem' }
                        }}>
                            {selectedMeeting.title}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2 } }}>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                        {/* Meeting Info */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                        <Chip
                                            label={selectedMeeting.status}
                                            color={selectedMeeting.status === 'completed' ? 'success' : 'primary'}
                                            variant="outlined"
                                        />
                                        <Typography variant="h6">{selectedMeeting.title}</Typography>
                                    </Stack>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <ScheduleIcon color="primary" />
                                                <Typography>{selectedMeeting.date} at {selectedMeeting.time}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <LocationIcon color="primary" />
                                                <Typography>{selectedMeeting.location}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <PeopleIcon color="primary" />
                                                <Typography>{(selectedMeeting.volunteers ? selectedMeeting.volunteers.length : 0)} volunteers</Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Tabs */}
                        <Grid item xs={12}>
                            <Paper sx={{ width: '100%' }}>
                                <Tabs
                                    value={activeTab}
                                    onChange={(e, newValue) => setActiveTab(newValue)}
                                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                                >
                                    <Tab label={`Volunteers (${(selectedMeeting.volunteers ? selectedMeeting.volunteers.length : 0)})`} value="volunteers" />
                                </Tabs>
                            </Paper>
                        </Grid>

                        {/* Tab Content */}
                        {activeTab === "volunteers" && (
                            <Grid item xs={12}>
                                <Card sx={{ height: 'calc(100vh - 400px)', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                            <Box>
                                                <Typography variant="h6" sx={{ mb: 0.5 }}>
                                                    Volunteers
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Manage volunteer attendance and task completion
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={() => setShowAddVolunteerModal(true)}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                Add Volunteer
                                            </Button>
                                        </Box>

                                        <Box sx={{ flex: 1, overflow: 'auto' }}>
                                            <TableContainer>
                                                <Table stickyHeader>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Name</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Email</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Phone</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Attendance</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Completion</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Actions</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {(selectedMeeting.volunteers || []).map((volunteer) => (
                                                            <TableRow key={volunteer.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                                                                <TableCell>
                                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                                                                            {volunteer.name.charAt(0)}
                                                                        </Avatar>
                                                                        <Box>
                                                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                                                {volunteer.name}
                                                                            </Typography>
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                ID: {volunteer.id}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Stack>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body2">{volunteer.email}</Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body2">{volunteer.phone || '-'}</Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormControl size="small" fullWidth>
                                                                        <Select
                                                                            value={volunteer.attendance}
                                                                            onChange={(e) => updateVolunteerStatus(selectedMeeting.id, volunteer.id, 'attendance', e.target.value)}
                                                                            sx={{
                                                                                minWidth: 120,
                                                                                '& .MuiSelect-select': {
                                                                                    py: 1,
                                                                                    px: 2
                                                                                }
                                                                            }}
                                                                        >
                                                                            <MenuItem value="confirmed">
                                                                                <Chip label="Confirmed" color="success" size="small" />
                                                                            </MenuItem>
                                                                            <MenuItem value="pending">
                                                                                <Chip label="Pending" color="warning" size="small" />
                                                                            </MenuItem>
                                                                            <MenuItem value="present">
                                                                                <Chip label="Present" color="success" size="small" />
                                                                            </MenuItem>
                                                                            <MenuItem value="absent">
                                                                                <Chip label="Absent" color="error" size="small" />
                                                                            </MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormControl size="small" fullWidth>
                                                                        <Select
                                                                            value={volunteer.completion}
                                                                            onChange={(e) => updateVolunteerStatus(selectedMeeting.id, volunteer.id, 'completion', e.target.value)}
                                                                            sx={{
                                                                                minWidth: 120,
                                                                                '& .MuiSelect-select': {
                                                                                    py: 1,
                                                                                    px: 2
                                                                                }
                                                                            }}
                                                                        >
                                                                            <MenuItem value="pending">
                                                                                <Chip label="Pending" color="warning" size="small" />
                                                                            </MenuItem>
                                                                            <MenuItem value="in-progress">
                                                                                <Chip label="In Progress" color="info" size="small" />
                                                                            </MenuItem>
                                                                            <MenuItem value="completed">
                                                                                <Chip label="Completed" color="success" size="small" />
                                                                            </MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Stack direction="row" spacing={1}>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => openChatWithVolunteer(volunteer.id, volunteer.name)}
                                                                            title="Chat with volunteer"
                                                                            sx={{
                                                                                bgcolor: 'primary.main',
                                                                                color: 'white',
                                                                                '&:hover': { bgcolor: 'primary.dark' }
                                                                            }}
                                                                        >
                                                                            <ChatIcon fontSize="small" />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            size="small"
                                                                            title="View profile"
                                                                            sx={{
                                                                                bgcolor: 'grey.200',
                                                                                '&:hover': { bgcolor: 'grey.300' }
                                                                            }}
                                                                        >
                                                                            <PersonIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Stack>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </Container>

                {/* Add Volunteer Modal */}
                <Dialog
                    open={showAddVolunteerModal}
                    onClose={() => setShowAddVolunteerModal(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Add New Volunteer</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={newVolunteer.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={newVolunteer.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Phone"
                                value={newVolunteer.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowAddVolunteerModal(false)}>Cancel</Button>
                        <Button variant="contained" onClick={addNewVolunteer}>
                            Add Volunteer
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Create Spotlight Message Modal */}
                <Dialog
                    open={showSpotlightModal}
                    onClose={() => setShowSpotlightModal(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Create Spotlight Message</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={newSpotlightMessage.title}
                                onChange={(e) => handleSpotlightInputChange("title", e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Content"
                                multiline
                                rows={4}
                                value={newSpotlightMessage.content}
                                onChange={(e) => handleSpotlightInputChange("content", e.target.value)}
                                required
                            />
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={newSpotlightMessage.priority}
                                    onChange={(e) => handleSpotlightInputChange("priority", e.target.value)}
                                    label="Priority"
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="normal">Normal</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowSpotlightModal(false)}>Cancel</Button>
                        <Button variant="contained" onClick={createSpotlightMessage}>
                            Create Message
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Chat Modal */}
                <Dialog
                    open={showChatModal}
                    onClose={() => setShowChatModal(false)}
                    maxWidth="md"
                    fullWidth
                    sx={{ '& .MuiDialog-paper': { height: '80vh' } }}
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">
                                Chat with {selectedVolunteerChat?.volunteerName}
                            </Typography>
                            <IconButton onClick={() => setShowChatModal(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                            {selectedVolunteerChat?.messages.map((message) => (
                                <Box
                                    key={message.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: message.sender === 'coordinator' ? 'flex-end' : 'flex-start',
                                        mb: 1
                                    }}
                                >
                                    <Box
                                        sx={{
                                            maxWidth: '70%',
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: message.sender === 'coordinator' ? 'primary.main' : 'grey.100',
                                            color: message.sender === 'coordinator' ? 'white' : 'text.primary'
                                        }}
                                    >
                                        <Typography variant="body2">{message.content}</Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                                            {message.timestamp}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                placeholder="Type your message..."
                                value={newChatMessage}
                                onChange={(e) => setNewChatMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                            />
                            <IconButton
                                onClick={sendChatMessage}
                                disabled={!newChatMessage.trim()}
                                color="primary"
                            >
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
        );
    }

    // Main dashboard view
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
                        Coordinator Dashboard
                    </Typography>
                    <IconButton
                        onClick={() => setShowProfile(true)}
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        <PersonIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Grid container spacing={3}>
                    {/* Stats Cards */}
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Total Meetings
                                </Typography>
                                <Typography variant="h3" sx={{ color: 'primary.main' }}>
                                    {meetings.length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Upcoming
                                </Typography>
                                <Typography variant="h3" sx={{ color: 'warning.main' }}>
                                    {meetings.filter(m => m.status === 'upcoming').length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Completed
                                </Typography>
                                <Typography variant="h3" sx={{ color: 'success.main' }}>
                                    {meetings.filter(m => m.status === 'completed').length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Total Volunteers
                                </Typography>
                                <Typography variant="h3" sx={{ color: 'secondary.main' }}>
                                    {meetings.reduce((total, meeting) => total + (Array.isArray(meeting.volunteers) ? meeting.volunteers.length : 0), 0)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Tabs */}
                    <Grid item xs={12}>
                        <Paper sx={{ width: '100%' }}>
                            <Tabs
                                value={activeTab}
                                onChange={(e, newValue) => setActiveTab(newValue)}
                                sx={{ borderBottom: 1, borderColor: 'divider' }}
                            >
                                <Tab label="Meetings" value="meetings" />
                                <Tab label="Spotlight Messages" value="spotlight" />
                                <Tab label="Chat" value="chat" />
                            </Tabs>
                        </Paper>
                    </Grid>

                    {/* Tab Content */}
                    {activeTab === "meetings" && (
                        <Grid item xs={12}>
                            <Card sx={{ height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                                            Meetings
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Click on a meeting to view details and manage volunteers
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: 1, overflow: 'auto' }}>
                                        <Grid container spacing={2}>
                                            {meetings.map((meeting) => (
                                                <Grid item xs={12} key={meeting.id}>
                                                    <Card
                                                        variant="outlined"
                                                        sx={{
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                bgcolor: 'grey.50',
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                                            },
                                                            transition: 'all 0.2s ease-in-out'
                                                        }}
                                                        onClick={() => setSelectedMeeting(meeting)}
                                                    >
                                                        <CardContent>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                                <Box>
                                                                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                                                                        {meeting.title}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {(Array.isArray(meeting.volunteers) ? meeting.volunteers.length : 0)} volunteers assigned
                                                                    </Typography>
                                                                </Box>
                                                                <Chip
                                                                    label={meeting.status}
                                                                    color={meeting.status === 'completed' ? 'success' : 'primary'}
                                                                    size="small"
                                                                    sx={{ fontWeight: 500 }}
                                                                />
                                                            </Box>

                                                            <Stack spacing={1.5}>
                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <ScheduleIcon fontSize="small" color="action" />
                                                                    <Typography variant="body2">
                                                                        {meeting.date} at {meeting.time}
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <LocationIcon fontSize="small" color="action" />
                                                                    <Typography variant="body2">{meeting.location}</Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <PeopleIcon fontSize="small" color="action" />
                                                                    <Typography variant="body2">
                                                                        {(Array.isArray(meeting.volunteers) ? meeting.volunteers.filter(v => v.attendance === 'confirmed' || v.attendance === 'present').length : 0)} confirmed
                                                                    </Typography>
                                                                </Stack>
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {activeTab === "spotlight" && (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6">Spotlight Messages</Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={() => setShowSpotlightModal(true)}
                                        >
                                            Create Message
                                        </Button>
                                    </Box>
                                    <Stack spacing={2}>
                                        {spotlightMessages.map((message) => (
                                            <Card key={message.id} variant="outlined">
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                        <Typography variant="h6">{message.title}</Typography>
                                                        <Chip
                                                            label={message.priority}
                                                            color={message.priority === 'high' ? 'error' : message.priority === 'normal' ? 'warning' : 'success'}
                                                            size="small"
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        {message.content}
                                                    </Typography>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Typography variant="caption" color="text.secondary">
                                                            By {message.author}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {message.date}
                                                        </Typography>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {activeTab === "chat" && (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Chat with Volunteers
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {chatConversations.map((conversation) => (
                                            <Grid item xs={12} md={6} lg={4} key={conversation.volunteerId}>
                                                <Card
                                                    variant="outlined"
                                                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'grey.50' } }}
                                                    onClick={() => openChatWithVolunteer(conversation.volunteerId, conversation.volunteerName)}
                                                >
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                            <Typography variant="h6">{conversation.volunteerName}</Typography>
                                                            <Badge badgeContent={conversation.messages.filter(m => m.sender === 'volunteer').length} color="primary">
                                                                <ChatIcon color="action" />
                                                            </Badge>
                                                        </Box>
                                                        {conversation.messages.length > 0 && (
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                                {conversation.messages[conversation.messages.length - 1].content.substring(0, 50)}...
                                                            </Typography>
                                                        )}
                                                        <Typography variant="caption" color="text.secondary">
                                                            {conversation.messages.length} messages
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Container>

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
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Basic Information
                            </Typography>
                            <Stack spacing={2}>
                                <Typography><strong>Name:</strong> {userProfile?.name}</Typography>
                                <Typography><strong>Email:</strong> {userProfile?.email}</Typography>
                                <Typography><strong>Phone:</strong> {userProfile?.phone}</Typography>
                                <Typography><strong>Ward:</strong> {userProfile?.ward}</Typography>
                                <Typography><strong>Join Date:</strong> {userProfile?.joinDate}</Typography>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
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
                                        title={badge.description}
                                    />
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default CoordinatorDashboard; 