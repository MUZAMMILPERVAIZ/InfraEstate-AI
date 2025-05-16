import React, { useState, useEffect } from "react";
import ChatSidebar from "../../components/Chatbot/ChatSidebar";
import ChatView from "../../components/Chatbot/ChatView";
import AuthCheck from "../../components/Chatbot/AuthCheck";
import NotificationProvider from "../../components/Chatbot/NotificationContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, IconButton, Slide, Fade } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import "./ChatPage.css";

// Create a custom theme for Infra Estate AI
const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6",
      light: "#93c5fd",
      dark: "#1e40af",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#f8fafc",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default function ChatPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthCheck>
          <div className="infra-chat-page">
            <div className="infra-chat-container">
              {/* Mobile sidebar backdrop */}
              {isMobile && (
                <Fade in={sidebarOpen}>
                  <Box
                    className={`sidebar-backdrop ${sidebarOpen ? "visible" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  />
                </Fade>
              )}

              {/* Chat Sidebar */}
              <Slide direction="right" in={sidebarOpen} mountOnEnter unmountOnExit={isMobile}>
                <Box sx={{ display: "flex" }}>
                  <ChatSidebar className={sidebarOpen ? "open" : ""} />
                </Box>
              </Slide>

              {/* Main Chat Area */}
              <main className="infra-chat-main">
                <ChatView />
              </main>
            </div>

            {/* Mobile sidebar toggle button */}
            {isMobile && (
              <IconButton
                className="sidebar-toggle"
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}
          </div>
        </AuthCheck>
      </NotificationProvider>
    </ThemeProvider>
  );
}