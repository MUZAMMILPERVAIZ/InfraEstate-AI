import React, {useState, useContext} from "react";
import {useQuery, useMutation} from "react-query";
import {useParams} from "react-router-dom";
import {Spin, Card, Typography, Descriptions, Button, Row, Col, Space, Image, Table, message} from "antd";
import UserDetailContext from "../../context/UserDetailContext";
import "./Property.css";
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm"; // For GitHub-flavored markdown
import rehypeRaw from "rehype-raw"; // To allow HTML rendering in markdown

const {Title, Paragraph, Text} = Typography;

// Function to fetch property details
const fetchPropertyDetails = async (propertyId) => {
    const response = await fetch(`http://127.0.0.1:8080/properties/${propertyId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch property details");
    }
    return response.json();
};

// Function to fetch property analysis
const fetchAnalysisReport = async (payload) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        throw new Error("User is not logged in");
    }

    const response = await fetch("http://127.0.0.1:8080/generate-report/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });


    if (!response.ok) {
        throw new Error("Failed to generate analysis report..");
    }

    return response.json();
};

const Property = () => {
    const {propertyId} = useParams();
    const {userDetails} = useContext(UserDetailContext);
    const [analysisData, setAnalysisData] = useState(null);

    // Fetch property details
    const {data, isLoading, isError} = useQuery(
        ["property", propertyId],
        () => fetchPropertyDetails(propertyId),
        {enabled: !!propertyId}
    );

    // Fetch analysis report
    const {mutate: generateAnalysis, isLoading: isGeneratingAnalysis} = useMutation(
        () =>
            fetchAnalysisReport({
                location: data.location,
                city: data.city,
                size: data.size,
                bedrooms: data.bedrooms,
                baths: data.baths,
                current_price: data.price,
            }),
        {
            onSuccess: (data) => {
                setAnalysisData(data);
                message.success("Analysis generated successfully!");
            },
            onError: (error) => {
                console.error("Error generating analysis:", error.message);
                message.error("Failed to generate analysis. Please try again.");
            },
        }
    );

    if (isLoading) {
        return (
            <div className="property-loader">
                <Spin size="large"/>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="property-error">
                <Text type="danger">Error while fetching the property details</Text>
            </div>
        );
    }

    const {location, city, price, size, bedrooms, baths, type, image_link, owner_email} = data;
    const imageUrl = `http://127.0.0.1:8080/${image_link}`;

    return (
        <div className="property-wrapper">
            {/* Property Details */}
            <Card
                cover={<img alt={location} src={imageUrl} className="property-image"/>}
                className="property-card"
            >
                <Title level={2}>{location}</Title>
                <Descriptions bordered column={1} size="middle" className="property-descriptions">
                    <Descriptions.Item label="Price">PKR {price.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Size">
                        {size} m<sup>2</sup>
                    </Descriptions.Item>
                    <Descriptions.Item label="Bedrooms">{bedrooms}</Descriptions.Item>
                    <Descriptions.Item label="Bathrooms">{baths}</Descriptions.Item>
                    <Descriptions.Item label="Type">{type}</Descriptions.Item>
                    <Descriptions.Item label="Owner">
                        <a href={`mailto:${owner_email}`}>{owner_email}</a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Location">
                        {location}, {city}
                    </Descriptions.Item>
                </Descriptions>
                <div className="property-actions">
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => generateAnalysis()}
                        loading={isGeneratingAnalysis}
                    >
                        Generate Analysis
                    </Button>
                </div>
            </Card>

            {/* Analysis Results */}
            {analysisData && (
                <div className="analysis-section">
                    {/* Risk Analysis */}
                    <Card className="analysis-results">
                        <Title level={4}>Risk Analysis</Title>
                        {/*<ReactMarkdown>{analysisData.report}</ReactMarkdown>*/}

                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]} // Enable advanced markdown like tables and lists
                            rehypePlugins={[rehypeRaw]} // Allow raw HTML rendering if needed

                        >
                            {analysisData.report}
                        </ReactMarkdown>
                    </Card>

                    {/* Forecast Charts */}
                    <Card className="forecast-chart">
                        <Title level={4}>Price Forecast Charts</Title>
                        <Row gutter={16}>
                            {analysisData.chart_urls.map((chartUrl, index) => (
                                <Col key={index} span={12}>
                                    <Image
                                        src={`http://127.0.0.1:8080/${chartUrl}`}
                                        alt={`Forecast Chart ${index + 1}`}
                                        style={{borderRadius: "8px", boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)"}}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Card>

                    {/* Price Forecast */}
                    <Card className="price-forecast">
                        <Title level={4}>Price Forecast</Title>
                        <Table
                            dataSource={Object.entries(analysisData.price_forecast).map(([year, price]) => ({
                                year,
                                price: `PKR ${price.toLocaleString()}`,
                            }))}
                            columns={[
                                {title: "Year", dataIndex: "year", key: "year"},
                                {title: "Forecasted Price", dataIndex: "price", key: "price"},
                            ]}
                            pagination={false}
                            bordered
                        />
                    </Card>

                    {/* Related News */}
                    <Card className="related-news">
                        <Title level={4}>Related News</Title>
                        <Space direction="vertical" style={{width: "100%"}}>
                            {analysisData.news.map((newsGroup, index) => (
                                <Card key={index} type="inner" title={`News Group ${index + 1}`}>
                                    {newsGroup.map((newsItem, subIndex) => (
                                        <Paragraph key={subIndex} style={{marginBottom: "1rem"}}>
                                            {newsItem}
                                        </Paragraph>
                                    ))}
                                </Card>
                            ))}
                        </Space>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Property;
