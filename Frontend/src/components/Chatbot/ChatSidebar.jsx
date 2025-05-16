import React, {useContext, useEffect, useState} from 'react';
import {ChatContext} from './chatContext';
import {useNavigate} from 'react-router-dom';
import { useNotification } from './NotificationContext';
import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    Divider,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemText,
    Typography,
    Badge
} from '@mui/material';
import {
    Add as PlusIcon,
    Delete as DeleteIcon,
    ExpandLess,
    ExpandMore,
    InfoOutlined,
    Search as SearchIcon,
    Today as TodayIcon,
    History as HistoryIcon,
    DateRange as DateRangeIcon,
    Event as EventIcon
} from '@mui/icons-material';
import {differenceInCalendarDays, format} from 'date-fns';
import './ChatSidebar.css';

const ChatSidebar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {clearChat, addMessage} = useContext(ChatContext);
    const navigate = useNavigate();
    const notification = useNotification();

    // State for collapsible sections
    const [openSections, setOpenSections] = useState({
        today: true,
        yesterday: true,
        last7Days: true,
        last30Days: false,
    });

    // Active chat state
    const [activeChat, setActiveChat] = useState(null);

    // Grouped chat state
    const [groupedChats, setGroupedChats] = useState({
        today: [],
        yesterday: [],
        last7Days: [],
        last30Days: [],
    });

    // Fetch chat history on component mount
    useEffect(() => {
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            notification.error("You need to log in to access chat history");
            navigate('/login');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8080/get_chat_history/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    notification.error("Session expired. Please log in again.");
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                    return;
                }
                throw new Error(`HTTP error ${response.status}`);
            }

            const data = await response.json();

            const now = new Date();
            const categorized = {today: [], yesterday: [], last7Days: [], last30Days: []};

            // Get current chat ID to mark active chat
            const userBot = await fetch('http://127.0.0.1:8080/get_user_bot/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }).then(res => res.json());

            if (userBot && userBot.current_chat_id) {
                setActiveChat(userBot.current_chat_id);
            }

            data.forEach(chat => {
                const chatDate = new Date(chat.timestamp);
                const diff = differenceInCalendarDays(now, chatDate);

                // Add formatted time for display
                chat.formattedTime = format(chatDate, 'h:mm a');

                if (diff === 0) categorized.today.push(chat);
                else if (diff === 1) categorized.yesterday.push(chat);
                else if (diff <= 7) categorized.last7Days.push(chat);
                else if (diff <= 30) categorized.last30Days.push(chat);
            });

            setGroupedChats(categorized);
        } catch (error) {
            console.error("Failed to fetch chat history:", error);
            notification.error("Failed to load chat history");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Search functionality
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter chats based on search term across all categories
    const getFilteredChats = (chats) => {
        return chats.filter(chat =>
            chat.question_preview.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Toggle section collapse
    const toggleSection = (section) => {
        setOpenSections({
            ...openSections,
            [section]: !openSections[section]
        });
    };

    // Handle Create New Chat functionality
    const createNewChat = async () => {
        try {
            setIsLoading(true);
            // Clear the current chat context
            clearChat();

            // Retrieve the access token from local storage
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                notification.error("You need to log in to create a new chat");
                navigate('/login');
                return;
            }

            // Call the API to create a new chat
            const chatResponse = await fetch('http://127.0.0.1:8080/new_chat/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!chatResponse.ok) {
                if (chatResponse.status === 401) {
                    notification.error("Session expired. Please log in again.");
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                    return;
                }
                throw new Error("Failed to create a new chat. Please try again.");
            }

            // Fetch updated chat history to display new chat
            await fetchChatHistory();

            // Show success notification
            notification.success("New chat created successfully");

        } catch (error) {
            console.error("Chat creation Failed", error.message);
            notification.error("Failed to create new chat: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Archive Chat
    const archiveChat = async (chatId, event) => {
        event.stopPropagation();
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            notification.error("You need to log in to delete chats");
            navigate('/login');
            return;
        }

        if (!window.confirm("Are you sure you want to delete this chat?")) return;

        try {
            const response = await fetch(`http://127.0.0.1:8080/archive_chat/?chat_id=${chatId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                notification.success("Chat deleted successfully");
                // Update state to remove the deleted chat
                await fetchChatHistory();
            } else {
                if (response.status === 401) {
                    notification.error("Session expired. Please log in again.");
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                    return;
                }
                throw new Error("Failed to delete chat");
            }
        } catch (error) {
            console.error("Failed to delete chat:", error);
            notification.error("Failed to delete chat: " + error.message);
        }
    };

    // Select and Switch Chat
   // Select and Switch Chat
const selectChat = async (chatId) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        notification.error("You need to log in to access chats");
        navigate('/login');
        return;
    }

    setIsLoading(true);

    try {
        // First, switch to the chat to update the current_chat_id
        let switchResponse = await fetch('http://127.0.0.1:8080/switch_chat/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({chat_id: chatId}),
        });

        if (!switchResponse.ok) {
            if (switchResponse.status === 401) {
                notification.error("Session expired. Please log in again.");
                localStorage.removeItem('accessToken');
                navigate('/login');
                return;
            }
            throw new Error("Failed to switch chat");
        }

        const switchResult = await switchResponse.json();
        console.log(switchResult.message);

        // Then, fetch the chat data
        let response = await fetch('http://127.0.0.1:8080/get_chat/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({chat_id: chatId}),
        });

        if (!response.ok) {
            if (response.status === 401) {
                notification.error("Session expired. Please log in again.");
                localStorage.removeItem('accessToken');
                navigate('/login');
                return;
            }
            throw new Error(`Failed to fetch chat: ${response.status}`);
        }

        let data = await response.json();

        clearChat();
        data.chat.forEach((item) => {
            addMessage({
                id: Date.now() + Math.random(),
                createdAt: item.timestamp,
                text: item.question,
                ai: false,
            });
            addMessage({
                id: Date.now() + Math.random(),
                createdAt: item.timestamp,
                text: item.answer,
                ai: true,
                properties: item.properties || []
            });
        });

        // Update active chat
        setActiveChat(chatId);

        // Show notification
        notification.success("Switched to selected chat");

    } catch (error) {
        console.error("Error Selecting chat", error);
        notification.error("Failed to load chat: " + error.message);
    } finally {
        setIsLoading(false);
    }
};

    // Get section icon
    const getSectionIcon = (section) => {
        switch(section) {
            case 'today': return <TodayIcon className="chat-section-icon" />;
            case 'yesterday': return <EventIcon className="chat-section-icon" />;
            case 'last7Days': return <DateRangeIcon className="chat-section-icon" />;
            case 'last30Days': return <HistoryIcon className="chat-section-icon" />;
            default: return null;
        }
    };

    // Render chat section with header
    const renderChatSection = (title, chats, sectionKey) => {
        const filteredChats = getFilteredChats(chats);

        if (filteredChats.length === 0) return null;

        return (
            <Box className="chat-section" key={sectionKey}>
                <Box
                    className="chat-section-header"
                    onClick={() => toggleSection(sectionKey)}
                >
                    <Typography variant="caption" className="chat-section-title">
                        {getSectionIcon(sectionKey)}
                        {title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" className="chat-count">
                            {filteredChats.length}
                        </Typography>
                        {openSections[sectionKey] ? <ExpandLess fontSize="small"/> : <ExpandMore fontSize="small"/>}
                    </Box>
                </Box>

                <Collapse in={openSections[sectionKey]} timeout="auto" unmountOnExit>
                    <List className="chat-list">
                        {filteredChats.map((chat) => (
                            <ListItem
                                key={chat.chat_id}
                                className={`chat-list-item ${activeChat === chat.chat_id ? 'active' : ''}`}
                                onClick={() => selectChat(chat.chat_id)}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" className="chat-title">
                                            {chat.question_preview.length > 40
                                                ? `${chat.question_preview.substring(0, 40)}...`
                                                : chat.question_preview}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" className="chat-time">
                                            {chat.formattedTime}
                                        </Typography>
                                    }
                                />
                                <IconButton
                                    edge="end"
                                    size="small"
                                    className="delete-button"
                                    onClick={(e) => archiveChat(chat.chat_id, e)}
                                >
                                    <DeleteIcon fontSize="small"/>
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </Box>
        );
    };

    return (
        <Box className="chat-sidebar">
            <Box className="sidebar-header">
                <Typography variant="h6" className="sidebar-title">
                    Chat History
                </Typography>
                <Button
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PlusIcon />}
                    className="new-chat-button"
                    onClick={createNewChat}
                    disabled={isLoading}
                    fullWidth
                >
                    {isLoading ? "Creating..." : "New Chat"}
                </Button>
            </Box>

            <Box className="search-container">
                <Box className="search-input-wrapper">
                    <SearchIcon className="search-icon"/>
                    <InputBase
                        placeholder="Search chats..."
                        className="search-input"
                        value={searchTerm}
                        onChange={handleSearch}
                        fullWidth
                    />
                </Box>
            </Box>

            <Divider />

            <Box className="chat-sections">
                {isLoading && !searchTerm && (
                    <Box className="loading-container">
                        <CircularProgress size={24}/>
                    </Box>
                )}

                {!isLoading && (
                    <>
                        {renderChatSection("Today", groupedChats.today, "today")}
                        {renderChatSection("Yesterday", groupedChats.yesterday, "yesterday")}
                        {renderChatSection("Last 7 Days", groupedChats.last7Days, "last7Days")}
                        {renderChatSection("Last 30 Days", groupedChats.last30Days, "last30Days")}

                        {searchTerm && Object.values(groupedChats).every(group =>
                            getFilteredChats(group).length === 0
                        ) && (
                            <Box className="empty-state">
                                <SearchIcon fontSize="large" className="info-icon" />
                                <Typography variant="body2">
                                    No chats found matching "{searchTerm}"
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setSearchTerm("")}
                                >
                                    Clear Search
                                </Button>
                            </Box>
                        )}

                        {!searchTerm && Object.values(groupedChats).every(group => group.length === 0) && (
                            <Box className="empty-state">
                                <InfoOutlined className="info-icon"/>
                                <Typography variant="body2">
                                    No chat history available. Start a new chat!
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                    onClick={createNewChat}
                                    disabled={isLoading}
                                    startIcon={<PlusIcon />}
                                >
                                    New Chat
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default ChatSidebar;