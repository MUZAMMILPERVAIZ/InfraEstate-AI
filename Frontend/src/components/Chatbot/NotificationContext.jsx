import React, { createContext, useState, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, severity = 'info', duration = 4000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, severity, duration }]);

    // Auto remove after duration
    if (duration !== null) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const success = (message, duration) => addNotification(message, 'success', duration);
  const error = (message, duration) => addNotification(message, 'error', duration);
  const info = (message, duration) => addNotification(message, 'info', duration);
  const warning = (message, duration) => addNotification(message, 'warning', duration);

  return (
    <NotificationContext.Provider value={{ addNotification, success, error, info, warning, removeNotification }}>
      {children}

      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          TransitionComponent={Slide}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: notifications.indexOf(notification) * 7 + 6 }}
        >
          <Alert
            severity={notification.severity}
            variant="filled"
            sx={{
              width: '100%',
              alignItems: 'center',
              boxShadow: 3,
              borderRadius: '10px'
            }}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => removeNotification(notification.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;