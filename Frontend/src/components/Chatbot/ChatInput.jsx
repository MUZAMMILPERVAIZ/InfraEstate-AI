import React, { useRef, useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Send as SendIcon, Info as InfoIcon } from '@mui/icons-material';
import { useNotification } from './NotificationContext';
import './ChatInput.css';

const ChatInput = ({ onSendMessage, isThinking = false }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  const notification = useNotification();

  useEffect(() => {
    // Focus the input on component mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // Auto-resize logic
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isThinking) return;

    onSendMessage(trimmedMessage);
    setMessage('');

    // Reset input field height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  return (
    <Box className="chat-input-container">
      <Box className="chat-input-wrapper">
        <textarea
          ref={inputRef}
          className="chat-input-field"
          placeholder="Type your message here..."
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isThinking}
        />

        <IconButton
          className="chat-send-button"
          onClick={handleSendMessage}
          disabled={!message.trim() || isThinking}
          color="primary"
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box className="chat-disclaimer">
        <InfoIcon className="disclaimer-icon" />
        <Typography variant="caption">
          Infra AI can make mistakes consider checking important information
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatInput;