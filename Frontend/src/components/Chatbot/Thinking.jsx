import React from 'react';
import {Avatar, Box} from '@mui/material';
import infraLogo from '../../assets/Infra estate ai.png';
import './Thinking.css';

const Thinking = () => {
    return (
        <Box className="thinking-container">
            <Avatar
                src={infraLogo}
                alt="Infra Estate AI"
                className="thinking-avatar"
            />

            <Box className="thinking-bubble">
                <Box className="thinking-dots">
                    <span className="thinking-dot"></span>
                    <span className="thinking-dot"></span>
                    <span className="thinking-dot"></span>
                </Box>
            </Box>
        </Box>
    );
};

export default Thinking;