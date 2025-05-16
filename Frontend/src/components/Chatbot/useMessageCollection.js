
import {useState, useEffect} from 'react';

const useMessageCollection = () => {
    const [messages, setMessages] = useState([]);
    const [bot_id, setBotId] = useState(null);
    const [chat_id, setChatId] = useState(null);

    useEffect(() => {
        try {
            const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
            const storedBotId = localStorage.getItem('bot_id');
            const storedChatId = localStorage.getItem('chat_id');

            if (storedMessages.length) {
                setMessages(storedMessages);
            }
            if (storedBotId) {
                setBotId(storedBotId);
            }
            if (storedChatId) {
                setChatId(storedChatId);
            }
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            // Optionally clear or handle corrupt local storage data
        }
    }, []);

    useEffect(() => {
        // Save data to localStorage when messages, bot_id, or chat_id change
        localStorage.setItem('messages', JSON.stringify(messages));
        localStorage.setItem('bot_id', bot_id || '');  // Store empty string if null
        localStorage.setItem('chat_id', chat_id || '');  // Store empty string if null
    }, [messages, bot_id, chat_id]);

    const addMessage = (message) => {
        if (message.systemMessage) {
            setBotId(message.bot_id);
            setChatId(message.chat_id);
        } else {
            setMessages((prev) => [...prev, message]);
        }
    };

    const clearChat = () => {
        // Clear localStorage and state for messages, bot_id, and chat_id
        localStorage.removeItem('messages');
        localStorage.removeItem('bot_id');
        localStorage.removeItem('chat_id');
        setMessages([]);
        setBotId(null);  // Clear the bot_id
        setChatId(null);  // Clear the chat_id
    };

    const addBotDetails = (botDetails) => {
        setBotId(botDetails.bot_id);
        setChatId(botDetails.chat_id);
    };

    return {messages, addMessage, clearChat, addBotDetails, bot_id, chat_id};
};

export default useMessageCollection;

