import React, {useEffect, useState} from "react";
import {Button, Card, Col, Form, Input, message, Row, Spin} from "antd";
import "./Settings.css";

const Settings = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                message.error("Unauthorized. Please log in.");
                return;
            }

            setLoading(true);
            try {
                const response = await fetch("http://127.0.0.1:8080/user/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data.");
                }

                const data = await response.json();
                setUserData(data);
                form.setFieldsValue(data); // Pre-fill form with current data
            } catch (error) {
                message.error(error.message || "Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [form]);

    const onFinish = async (values) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            message.error("Unauthorized. Please log in.");
            return;
        }

        // Remove null or undefined values before sending
        const cleanedValues = Object.fromEntries(
            Object.entries(values).filter(([_, v]) => v != null && v !== "")
        );

        setLoading(true);
        try {
            console.log("Sending Data:", cleanedValues);

            const response = await fetch("http://127.0.0.1:8080/user/update", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cleanedValues),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile.");
            }

            message.success("Profile updated successfully!");
        } catch (error) {
            message.error(error.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };


    if (loading && !userData) return <Spin tip="Loading settings..." className="settings-loading"/>;

    return (
        <div className="settings-container">
            <Card className="settings-card" title="User Settings">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Full Name" name="name">
                                <Input placeholder="Enter full name"/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Email" name="email">
                                <Input placeholder="Enter email" type="email"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Phone Number" name="phone_number">
                                <Input placeholder="Enter phone number"/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Password" name="password">
                                <Input.Password placeholder="Enter new password"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="City" name="city">
                                <Input placeholder="Enter city"/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="State" name="state">
                                <Input placeholder="Enter state"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Country" name="country">
                                <Input placeholder="Enter country"/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Address" name="address">
                                <Input placeholder="Enter address"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Update Profile
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Settings;
