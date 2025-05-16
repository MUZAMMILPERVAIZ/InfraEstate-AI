import PropTypes from 'prop-types';
import {createContext, useState} from 'react';
import useMessageCollection from './useMessageCollection';

const ChatContext = createContext({});

const ChatContextProvider = ({children}) => {
    const {addBotDetails, bot_id, chat_id} = useMessageCollection();
    const [messages, setMessages] = useState([]);

    // Function to add a new message to the list of messages
    const addMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    const clearChat = () => {
        // Clear localStorage and state for messages, bot_id, and chat_id
        localStorage.removeItem('messages');
        localStorage.removeItem('bot_id');
        localStorage.removeItem('chat_id');
        setMessages([]);
    };

    // Pass an object to the context provider for clearer structure
    const contextValue = {
        messages,
        addMessage,
        clearChat,
        addBotDetails,
        bot_id,
        chat_id
    };


    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
};

ChatContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export {ChatContext, ChatContextProvider};
