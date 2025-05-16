import React, {useEffect, useState} from "react";
import {Avatar, Button, Dropdown, Menu, message, Modal} from "antd";
import {HomeOutlined, LogoutOutlined, PlusCircleOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import {BiMenuAltRight} from "react-icons/bi";
import {Link, NavLink} from "react-router-dom";
import "./Header.css";
import logo from "../../assets/header-logo.png";
import LoginSignupPage from "../AuthModal/AuthModal.jsx";

const Header = () => {
    const [menuOpened, setMenuOpened] = useState(false);
    const [authModalVisible, setAuthModalVisible] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userDetails, setUserDetails] = useState(null);

    const fetchUserDetails = async () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const response = await axios.get("http://127.0.0.1:8080/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserDetails(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Failed to fetch user details:", error);
                localStorage.removeItem("access_token");
                setIsAuthenticated(false);
            }
        }
    };

    const handleLoginSuccess = (accessToken) => {
        localStorage.setItem("access_token", accessToken);
        fetchUserDetails();
        setAuthModalVisible(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
        setUserDetails(null);
        message.success("Logged out successfully!");
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const userMenu = (
        <Menu className="user-menu">
            <Menu.Item key="profile">
                <Link to="/profile">
                    <UserOutlined/> Profile
                </Link>
            </Menu.Item>
            <Menu.Item key="add-properties">
                <Link to="/add-properties">
                    <PlusCircleOutlined/> Add Property
                </Link>
            </Menu.Item>
            <Menu.Item key="manage-properties">
                <Link to="/manage-properties">
                    <HomeOutlined/> Manage Properties
                </Link>
            </Menu.Item>
            <Menu.Item key="settings">
                <Link to="/settings">
                    <SettingOutlined/> Settings
                </Link>
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="logout" danger onClick={handleLogout}>
                <LogoutOutlined/> Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <header className="modern-header">
            <div className="header-container">
                {/* Logo */}
                <Link to="/" className="logo-container">
                    <img src={logo} alt="InfraEstateAILogo" className="logo"/>
                </Link>
                {/* Navigation Links */}
                <nav className={`nav-links ${menuOpened ? "active" : ""}`}>
                    <NavLink to="/properties" className="nav-link">
                        Properties
                    </NavLink>
                    <NavLink to="/ai-architect" className="nav-link">
                        <span className="flex items-center gap-1">
                            {/*<LayoutOutlined style={{fontSize: '14px'}}/>*/}
                            AI Architect
                        </span>
                    </NavLink>

                    <NavLink to="/construction-estimator" className="nav-link">
                        <span className="flex items-center gap-1">
                            {/*<LayoutOutlined style={{fontSize: '14px'}}/>*/}
                            Construction Estimator
                        </span>
                    </NavLink>

                    <NavLink to="/infra-ai" className="nav-link">
                        <span className="flex items-center gap-1">
                            {/*<LayoutOutlined style={{fontSize: '14px'}}/>*/}
                            Infra AI
                        </span>
                    </NavLink>

                    <NavLink to="/contact-us" className="nav-link">
                        Contact
                    </NavLink>
                    {!isAuthenticated ? (
                        <Button type="primary" onClick={() => setAuthModalVisible(true)} className="login-btn">
                            Login
                        </Button>
                    ) : (
                        <Dropdown overlay={userMenu} trigger={["click"]}>
                            <Avatar className="header-user-avatar">
                                {userDetails && userDetails.name ? userDetails.name.charAt(0).toUpperCase() :
                                    <UserOutlined/>}
                            </Avatar>
                        </Dropdown>
                    )}
                </nav>
                {/* Mobile Menu Toggle */}
                <div className="menu-toggle" onClick={() => setMenuOpened(!menuOpened)}>
                    <BiMenuAltRight size={30}/>
                </div>
            </div>
            {/* Login/Signup Modal */}
            <Modal
                open={authModalVisible}
                onCancel={() => setAuthModalVisible(false)}
                footer={null}
            >
                <LoginSignupPage onLoginSuccess={handleLoginSuccess}/>
            </Modal>
        </header>
    );
};

export default Header;