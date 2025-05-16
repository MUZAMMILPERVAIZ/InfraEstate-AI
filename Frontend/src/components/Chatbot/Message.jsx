// import React, {useState} from 'react';
// import PropTypes from 'prop-types';
// import {Box, Fade, IconButton, Paper, Tooltip, Typography} from '@mui/material';
// import {
//     Check as CheckIcon,
//     ContentCopy as CopyIcon,
//     ExpandLess as ExpandLessIcon,
//     ExpandMore as ExpandMoreIcon
// } from '@mui/icons-material';
// import {MdPerson} from 'react-icons/md';
// import moment from 'moment';
// import Markdown from './Markdown';
// import Latex from 'react-latex-next';
// import './Message.css';
// import infraLogo from '../../assets/logo.svg';
//
// // Helper function to check if the text contains LaTeX
// const containsLatex = (text) => {
//     return /\$\$[\s\S]+\$\$|\\\[.*?\\\]/.test(text);
// };
//
// // Helper function to check if text contains RTL characters
// const isRTL = (text) => {
//     const rtlChars = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
//     return rtlChars.test(text);
// };
//
// // Helper function to truncate long messages
// const shouldTruncate = (text) => {
//     return text.length > 800;
// };
//
// const Message = ({message}) => {
//     const {id, createdAt, text, ai} = message;
//     const [copied, setCopied] = useState(false);
//     const [expanded, setExpanded] = useState(false);
//
//     const rtl = isRTL(text);
//     const needsTruncation = shouldTruncate(text) && !expanded;
//
//     // Handle copy function
//     const handleCopy = async () => {
//         try {
//             await navigator.clipboard.writeText(text);
//             setCopied(true);
//             setTimeout(() => setCopied(false), 2000);
//         } catch (err) {
//             console.error('Failed to copy: ', err);
//         }
//     };
//
//     // Toggle expand/collapse for long messages
//     const toggleExpand = () => {
//         setExpanded(!expanded);
//     };
//
//     // Truncate text for preview
//     const getTruncatedText = () => {
//         return text.slice(0, 800) + '...';
//     };
//
//     return (
//         <Box
//             className={`message-container ${ai ? 'ai-message' : 'user-message'}`}
//             key={id}
//         >
//             <Box className="message-avatar">
//                 {ai ? (
//                     <img src={infraLogo} alt="AI Assistant" className="avatar-image"/>
//                 ) : (
//                     <Box className="user-avatar">
//                         <MdPerson/>
//                     </Box>
//                 )}
//             </Box>
//
//             <Box className="message-content-wrapper">
//                 {/*<Box className="message-header">*/}
//                 {/*    <Typography variant="subtitle2" className="message-author">*/}
//                 {/*        {ai ? 'Infra Estate AI' : 'You'}*/}
//                 {/*    </Typography>*/}
//                 {/*    <Typography variant="caption" className="message-time">*/}
//                 {/*        {moment(createdAt).calendar()}*/}
//                 {/*    </Typography>*/}
//                 {/*</Box>*/}
//
//                 <Paper
//                     elevation={0}
//                     className={`message-bubble ${ai ? 'ai-bubble' : 'user-bubble'} ${rtl ? 'rtl-text' : ''}`}
//                 >
//                     {needsTruncation ? (
//                         <>
//                             {containsLatex(getTruncatedText()) ? (
//                                 <Latex>{getTruncatedText()}</Latex>
//                             ) : (
//                                 <Markdown markdownText={getTruncatedText()} isBotMessage={ai}/>
//                             )}
//                             <Box className="expand-button-wrapper">
//                                 <IconButton
//                                     size="small"
//                                     onClick={toggleExpand}
//                                     className="expand-button"
//                                 >
//                                     <ExpandMoreIcon fontSize="small"/>
//                                     <Typography variant="caption">Show more</Typography>
//                                 </IconButton>
//                             </Box>
//                         </>
//                     ) : (
//                         <>
//                             {containsLatex(text) ? (
//                                 <Latex>{text}</Latex>
//                             ) : (
//                                 <Markdown markdownText={text} isBotMessage={ai}/>
//                             )}
//                             {shouldTruncate(text) && (
//                                 <Box className="expand-button-wrapper">
//                                     <IconButton
//                                         size="small"
//                                         onClick={toggleExpand}
//                                         className="expand-button"
//                                     >
//                                         <ExpandLessIcon fontSize="small"/>
//                                         <Typography variant="caption">Show less</Typography>
//                                     </IconButton>
//                                 </Box>
//                             )}
//                         </>
//                     )}
//                 </Paper>
//
//                 {/* Copy button for AI messages */}
//                 {ai && (
//                     <Box className="message-actions">
//                         <Tooltip
//                             title={copied ? "Copied!" : "Copy message"}
//                             placement="top"
//                             TransitionComponent={Fade}
//                             TransitionProps={{timeout: 600}}
//                         >
//                             <IconButton
//                                 size="small"
//                                 onClick={handleCopy}
//                                 className="copy-button"
//                             >
//                                 {copied ? <CheckIcon fontSize="small"/> : <CopyIcon fontSize="small"/>}
//                             </IconButton>
//                         </Tooltip>
//                     </Box>
//                 )}
//             </Box>
//         </Box>
//     );
// };
//
// Message.propTypes = {
//     message: PropTypes.shape({
//         id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//         createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
//         text: PropTypes.string.isRequired,
//         ai: PropTypes.bool,
//     }).isRequired,
// };
//
// export default Message;



import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Box, Fade, IconButton, Paper, Tooltip, Typography} from '@mui/material';
import {
    Check as CheckIcon,
    ContentCopy as CopyIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import {MdPerson} from 'react-icons/md';
import moment from 'moment';
import Markdown from './Markdown';
import Latex from 'react-latex-next';
import PropertyList from './PropertyList';
import './Message.css';
import infraLogo from '../../assets/logo.svg';

// Helper function to check if the text contains LaTeX
const containsLatex = (text) => {
    return /\$\$[\s\S]+\$\$|\\\[.*?\\\]/.test(text);
};

// Helper function to check if text contains RTL characters
const isRTL = (text) => {
    const rtlChars = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return rtlChars.test(text);
};

// Helper function to truncate long messages
const shouldTruncate = (text) => {
    return text.length > 800;
};

const Message = ({message}) => {
    const {id, createdAt, text, ai, properties} = message;
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const rtl = isRTL(text);
    const needsTruncation = shouldTruncate(text) && !expanded;
    const hasProperties = properties && properties.length > 0;

    // Handle copy function
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    // Toggle expand/collapse for long messages
    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    // Truncate text for preview
    const getTruncatedText = () => {
        return text.slice(0, 800) + '...';
    };

    return (
        <Box
            className={`message-container ${ai ? 'ai-message' : 'user-message'}`}
            key={id}
        >
            <Box className="message-avatar">
                {ai ? (
                    <img src={infraLogo} alt="AI Assistant" className="avatar-image"/>
                ) : (
                    <Box className="user-avatar">
                        <MdPerson/>
                    </Box>
                )}
            </Box>

            <Box className="message-content-wrapper">
                {/*<Box className="message-header">*/}
                {/*    <Typography variant="subtitle2" className="message-author">*/}
                {/*        {ai ? 'Infra Estate AI' : 'You'}*/}
                {/*    </Typography>*/}
                {/*    <Typography variant="caption" className="message-time">*/}
                {/*        {moment(createdAt).calendar()}*/}
                {/*    </Typography>*/}
                {/*</Box>*/}

                <Paper
                    elevation={0}
                    className={`message-bubble ${ai ? 'ai-bubble' : 'user-bubble'} ${rtl ? 'rtl-text' : ''}`}
                >
                    {needsTruncation ? (
                        <>
                            {containsLatex(getTruncatedText()) ? (
                                <Latex>{getTruncatedText()}</Latex>
                            ) : (
                                <Markdown markdownText={getTruncatedText()} isBotMessage={ai}/>
                            )}
                            <Box className="expand-button-wrapper">
                                <IconButton
                                    size="small"
                                    onClick={toggleExpand}
                                    className="expand-button"
                                >
                                    <ExpandMoreIcon fontSize="small"/>
                                    <Typography variant="caption">Show more</Typography>
                                </IconButton>
                            </Box>
                        </>
                    ) : (
                        <>
                            {containsLatex(text) ? (
                                <Latex>{text}</Latex>
                            ) : (
                                <Markdown markdownText={text} isBotMessage={ai}/>
                            )}
                            {shouldTruncate(text) && (
                                <Box className="expand-button-wrapper">
                                    <IconButton
                                        size="small"
                                        onClick={toggleExpand}
                                        className="expand-button"
                                    >
                                        <ExpandLessIcon fontSize="small"/>
                                        <Typography variant="caption">Show less</Typography>
                                    </IconButton>
                                </Box>
                            )}
                        </>
                    )}

                    {/* Property List Display */}
                    {ai && hasProperties && <PropertyList properties={properties} />}
                </Paper>

                {/* Copy button for AI messages */}
                {ai && (
                    <Box className="message-actions">
                        <Tooltip
                            title={copied ? "Copied!" : "Copy message"}
                            placement="top"
                            TransitionComponent={Fade}
                            TransitionProps={{timeout: 600}}
                        >
                            <IconButton
                                size="small"
                                onClick={handleCopy}
                                className="copy-button"
                            >
                                {copied ? <CheckIcon fontSize="small"/> : <CopyIcon fontSize="small"/>}
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

Message.propTypes = {
    message: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
        text: PropTypes.string.isRequired,
        ai: PropTypes.bool,
        properties: PropTypes.array,
    }).isRequired,
};

export default Message;