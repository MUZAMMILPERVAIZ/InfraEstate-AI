import React, {useContext, useEffect, useState} from "react";
import {Alert, Card, Col, Divider, Row, Spin, Typography} from "antd";
import axios from "axios";
import UserDetailContext from "../../context/UserDetailContext";
import "./Profile.css";

const {Title, Text} = Typography;

const Profile = () => {
    const {userDetails} = useContext(UserDetailContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setError("User is not authenticated.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://127.0.0.1:8080/user/me", {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setUserData(response.data);
            } catch (err) {
                setError("Failed to fetch profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <Spin tip="Loading profile..." className="profile-loading"/>;
    if (error) return <Alert message="Error" description={error} type="error" showIcon/>;

    return (
        <div className="profile-container">
            <Card className="profile-card">
                <Divider/>
                <Title level={3} className="profile-title">User Profile</Title>
                <Divider/>
                <Row gutter={[16, 16]}>
                    <Col span={12}><Text strong>Name:</Text> {userData.name || "N/A"}</Col>
                    <Col span={12}><Text strong>Email:</Text> {userData.email || "N/A"}</Col>

                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}><Text strong>Role:</Text> {userData.role || "N/A"}</Col>
                    <Col span={12}><Text strong>Auth Method:</Text> {userData.auth_method || "N/A"}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}><Text strong>Subscription Status:</Text> {userData.subscription_status || "N/A"}
                    </Col>
                    <Col span={12}><Text strong>Plan Name:</Text> {userData.plan_name || "N/A"}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}><Text strong>Queries Used:</Text> {userData.query_count} / {userData.query_limit}
                    </Col>
                    <Col span={12}><Text strong>Joined:</Text> {new Date(userData.created_at).toLocaleString()}</Col>
                </Row>
                <Divider/>
                <Title level={4} className="profile-subtitle">Additional Info</Title>
                <Divider/>

                <Row gutter={[16, 16]}>
                    <Col span={12}><Text strong>City:</Text> {userData.city || "N/A"}</Col>
                    <Col span={12}><Text strong>State:</Text> {userData.state || "N/A"}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}><Text strong>Country:</Text> {userData.country || "N/A"}</Col>
                    <Col span={12}><Text strong>Phone Number:</Text> {userData.phone_number || "N/A"}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}><Text strong>Address:</Text> {userData.address || "N/A"}</Col>
                </Row>
                <Divider/>

            </Card>
        </div>
    );
};

export default Profile;
