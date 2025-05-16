import React, {useContext, useEffect, useRef, useState} from 'react';
import {Box, CircularProgress, Divider, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {replaceProfanities} from 'no-profanity';
import {useTranslation} from 'react-i18next';
import {ChatContext} from './chatContext';
import { useNotification } from './NotificationContext';
import Message from './Message';
import Thinking from './Thinking';
import ChatInput from './ChatInput';
import InfraEstateLogo from './InfraEstateLogo';
import './ChatView.css';

const ChatView = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const messagesEndRef = useRef();
    const [thinking, setThinking] = useState(false);
    const {messages, addMessage, clearChat} = useContext(ChatContext);
    const notification = useNotification();

    // Scrolls the chat area to the bottom
    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    // };

    // Adds a new message to the chat context
    const updateMessage = (newValue, ai = false, properties = []) => {
        const id = Date.now() + Math.floor(Math.random() * 1000000);
        const newMsg = {
            id: id,
            createdAt: Date.now(),
            text: newValue,
            ai: ai,
            properties: properties
        };

        addMessage(newMsg);
    };

    // Handles sending a message
    const handleSendMessage = async (messageText) => {
        if (!messageText.trim()) return;

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            // Show login prompt if not authenticated
            notification.error(t('login_prompt_chatbot') || 'Please log in to continue');
            navigate('/login');
            return;
        }

        const cleanPrompt = replaceProfanities(messageText);
        setThinking(true);
        updateMessage(cleanPrompt, false);

        try {
            const response = await fetch('http://127.0.0.1:8080/response/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({query: cleanPrompt}),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    notification.error(t('session_expired') || 'Your session has expired. Please log in again.');
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                    return;
                }
                if (response.status === 429) {
                    notification.warning(t('query_limit_reached') || 'You have reached your query limit.');
                    return;
                }
                throw new Error(`HTTP error ${response.status}`);
            }

            const responseData = await response.json();
            const serverResponse = responseData.response;
            const properties = responseData.properties || [];

            if (serverResponse) {
                updateMessage(serverResponse, true, properties);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Show an error message in the chat
            updateMessage("Sorry, I encountered an error processing your request. Please try again later.", true);
            notification.error('Failed to process your request');
        } finally {
            setThinking(false);
        }
    };

    // New chat function
    const startNewChat = () => {
        clearChat();
        notification.info("Started a new conversation");
    };

// Scrolls the chat area to the bottom
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ block: 'end', inline: 'nearest' });
        }
    };

    // Initial scroll when component mounts
    useEffect(() => {
        scrollToBottom();
    }, []);

    // Scroll when messages change or thinking state changes
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages.length, thinking]);
    return (
        <Box className="chat-view-container">
            {/* Messages Area */}
            <Box className="messages-container">
                {messages && messages.length ? (
                    <Box className="messages-list">
                        {messages.map((message) => (
                            <Message key={`msg-${message.id}`} message={message}/>
                        ))}
                        {thinking && <Thinking/>}
                        <div ref={messagesEndRef}/>
                    </Box>
                ) : (
                    <Box className="welcome-screen">
                        <Box className="logo-container">
                            <InfraEstateLogo size={160} />
                        </Box>
                        <Typography variant="h5" className="welcome-title">
                            Welcome to Infra AI
                        </Typography>
                        <Typography variant="body1" className="welcome-subtitle">
                            Your intelligent real estate assistant
                        </Typography>

                        <Box className="suggestion-grid">
                            <Box
                                className="suggestion-card"
                                onClick={() => handleSendMessage("What services do you offer?")}
                            >
                                <Typography variant="body2">What services do you offer?</Typography>
                            </Box>
                            <Box
                                className="suggestion-card"
                                onClick={() => handleSendMessage("Help me find properties in my budget")}
                            >
                                <Typography variant="body2">Help me find properties in my budget</Typography>
                            </Box>
                            <Box
                                className="suggestion-card"
                                onClick={() => handleSendMessage("Explain the construction estimation process")}
                            >
                                <Typography variant="body2">Explain the construction estimation process</Typography>
                            </Box>
                            <Box
                                className="suggestion-card"
                                onClick={() => handleSendMessage("What are the current real estate trends?")}
                            >
                                <Typography variant="body2">What are the current real estate trends?</Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Input Area */}
            <ChatInput
                onSendMessage={handleSendMessage}
                isThinking={thinking}
            />
        </Box>
    );
};

export default ChatView;