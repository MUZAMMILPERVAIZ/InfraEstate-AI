// import React, {useEffect, useState} from "react";
// import {Button, Divider, Form, Input, Layout, message, Modal, Table, Upload} from "antd";
// import {DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined} from "@ant-design/icons";
// import "./ManageProperties.css";
//
// const {Header, Content} = Layout;
//
// const API_BASE_URL = "http://127.0.0.1:8080"; // API Base URL
//
// const ManageProperties = () => {
//     const [properties, setProperties] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//     const [isViewModalVisible, setIsViewModalVisible] = useState(false);
//     const [selectedProperty, setSelectedProperty] = useState(null);
//
//     const [editForm] = Form.useForm();
//     const token = localStorage.getItem("access_token");
//
//     // Fetch Properties
//     useEffect(() => {
//         fetchProperties();
//     }, []);
//
//     const fetchProperties = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(`${API_BASE_URL}/my-properties/`, {
//                 headers: {Authorization: `Bearer ${token}`},
//             });
//             if (!response.ok) throw new Error("Failed to fetch properties");
//             const data = await response.json();
//             setProperties(data);
//         } catch (error) {
//             message.error(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//
//     // Open Edit Property Modal
//     const openEditModal = (property) => {
//         setSelectedProperty(property);
//         editForm.setFieldsValue(property);
//         setIsEditModalVisible(true);
//     };
//
//     // Open View Property Modal
//     const openViewModal = (property) => {
//         setSelectedProperty(property);
//         setIsViewModalVisible(true);
//     };
//
//
//     // Handle Update Property
//     const handleUpdateProperty = async (values) => {
//         try {
//             const formData = createFormData(values);
//
//
//             const formattedValues = {
//                 location: values.location || null,
//                 city: values.city || null,
//                 price: values.price ? parseInt(values.price, 10) : null,
//                 size: values.size ? parseFloat(values.size) : null,
//                 bedrooms: values.bedrooms ? parseInt(values.bedrooms, 10) : null,
//                 baths: values.baths ? parseInt(values.baths, 10) : null,
//                 year: values.year ? parseInt(values.year, 10) : null,
//                 type: values.type || null,
//             };
//
//             Object.keys(formattedValues).forEach((key) => {
//                 if (formattedValues[key] !== null) {
//                     formData.append(key, formattedValues[key]);
//                 }
//             });
//
//             if (values.image && values.image.file) {  // Ensure values.image and file exist
//                 formData.append("image", values.image.file.originFileObj);
//             }
//
//
//             const response = await fetch(`${API_BASE_URL}/properties/${selectedProperty.id}`, {
//                 method: "PUT",
//                 headers: {Authorization: `Bearer ${token}`},
//                 body: formData,
//             });
//
//             if (!response.ok) throw new Error("Failed to update property");
//
//             message.success("Property updated successfully!");
//             fetchProperties();
//             setIsEditModalVisible(false);
//             editForm.resetFields();
//             setSelectedProperty(null);
//         } catch (error) {
//             message.error(error.message);
//         }
//     };
//
//     // Handle Delete Property
//     const handleDeleteProperty = async (id) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
//                 method: "DELETE",
//                 headers: {Authorization: `Bearer ${token}`},
//             });
//
//             if (!response.ok) throw new Error("Failed to delete property");
//
//             message.success("Property deleted successfully!");
//             fetchProperties();
//         } catch (error) {
//             message.error(error.message);
//         }
//     };
//
//     // Utility function to create FormData from values
//     const createFormData = (values) => {
//         const formData = new FormData();
//         Object.keys(values).forEach((key) => {
//             if (values[key] !== null && values[key] !== undefined) {
//                 formData.append(key, values[key]);
//             }
//         });
//
//         if (values.image && values.image.file) {
//             formData.append("image", values.image.file.originFileObj);
//         }
//
//         return formData;
//     };
//
//     // Table Columns
//     const columns = [
//         {
//             title: "Image",
//             dataIndex: "image_link",
//             key: "image_link",
//             render: (image) => (
//                 <img src={`${API_BASE_URL}/${image}`} alt="Property" className="property-image"/>
//             ),
//         },
//         {title: "Location", dataIndex: "location", key: "location"},
//         {title: "City", dataIndex: "city", key: "city"},
//         {title: "Price", dataIndex: "price", key: "price", render: (text) => `$${text}`},
//         {title: "Size (Marla)", dataIndex: "size", key: "size"},
//         {title: "Bedrooms", dataIndex: "bedrooms", key: "bedrooms"},
//         {title: "Baths", dataIndex: "baths", key: "baths"},
//         {title: "Year", dataIndex: "year", key: "year"},
//
//         {
//             title: "Actions",
//             key: "actions",
//             render: (_, record) => (
//                 <React.Fragment>
//                     <Button icon={<EyeOutlined/>} onClick={() => openViewModal(record)}/>
//                     <Button icon={<EditOutlined/>} onClick={() => openEditModal(record)}/>
//                     <Button icon={<DeleteOutlined/>} danger onClick={() => handleDeleteProperty(record.id)}/>
//                 </React.Fragment>
//             ),
//         },
//     ];
//
//     return (
//         <div className="settings-container">
//
//             <Content className="content">
//                 <h2 className="form-title">Manage Properties</h2>
//
//                 <Divider/>
//                 <Table dataSource={properties} columns={columns} rowKey="id" loading={loading}/>
//             </Content>
//
//             {/* Edit Property Modal */}
//             <Modal title="Edit Property" open={isEditModalVisible} onCancel={() => setIsEditModalVisible(false)}
//                    footer={null}>
//                 <Form form={editForm} layout="vertical" onFinish={handleUpdateProperty}>
//                     <Form.Item name="location" label="Location" rules={[{required: true}]}>
//                         <Input placeholder="Enter location"/>
//                     </Form.Item>
//                     <Form.Item name="city" label="City" rules={[{required: true}]}>
//                         <Input placeholder="Enter city"/>
//                     </Form.Item>
//                     <Form.Item name="price" label="Price" rules={[{required: true}]}>
//                         <Input type="number" placeholder="Enter price"/>
//                     </Form.Item>
//                     <Form.Item name="size" label="Size (Marla)" rules={[{required: true}]}>
//                         <Input type="number" placeholder="Enter size"/>
//                     </Form.Item>
//                     <Form.Item name="bedrooms" label="Bedrooms" rules={[{required: true}]}>
//                         <Input type="number" placeholder="Enter bedrooms"/>
//                     </Form.Item>
//                     <Form.Item name="baths" label="Baths" rules={[{required: true}]}>
//                         <Input type="number" placeholder="Enter baths"/>
//                     </Form.Item>
//                     <Form.Item name="year" label="Year" rules={[{required: true}]}>
//                         <Input type="number" placeholder="Enter year"/>
//                     </Form.Item>
//                     <Form.Item name="image" label="Upload Image">
//                         <Upload beforeUpload={() => false} listType="picture">
//                             <Button icon={<UploadOutlined/>}>Upload</Button>
//                         </Upload>
//                     </Form.Item>
//                     <Form.Item>
//                         <Button type="primary" htmlType="submit" block>
//                             Update Property
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </Modal>
//
//             {/* View Property Modal */
//             }
//             <Modal title="Property Details" open={isViewModalVisible} onCancel={() => setIsViewModalVisible(false)}
//                    footer={null}>
//                 <img src={`${API_BASE_URL}/${selectedProperty && selectedProperty.image_link}`} alt="Property"
//                      className="property-modal-image"/>
//
//                 <p><strong>{selectedProperty.location}, {selectedProperty.city}</strong></p>
//                 <p>Price: ${selectedProperty.price}</p>
//                 <p>Size: {selectedProperty.size} Marla</p>
//                 <p>Bedrooms: {selectedProperty.bedrooms}</p>
//                 <p>Baths: {selectedProperty.baths}</p>
//             </Modal>
//         </div>
//     )
//         ;
// };
//
// export default ManageProperties;


import React, {useEffect, useState} from "react";
import {Button, Divider, Form, Input, Layout, message, Modal, Table, Upload} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined} from "@ant-design/icons";
import "./ManageProperties.css";

const {Header, Content} = Layout;

const API_BASE_URL = "http://127.0.0.1:8080"; // API Base URL

const ManageProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);

    const [editForm] = Form.useForm();
    const token = localStorage.getItem("access_token");

    // Fetch Properties
    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/my-properties/`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            if (!response.ok) throw new Error("Failed to fetch properties");
            const data = await response.json();
            setProperties(data);
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };


    // Open Edit Property Modal
    const openEditModal = (property) => {
        setSelectedProperty(property);
        editForm.setFieldsValue(property);
        setIsEditModalVisible(true);
    };

    // Open View Property Modal
    const openViewModal = (property) => {
        setSelectedProperty(property);
        setIsViewModalVisible(true);
    };


    // Handle Update Property
    const handleUpdateProperty = async (values) => {
        try {
            const formData = createFormData(values);


            const formattedValues = {
                location: values.location || null,
                city: values.city || null,
                price: values.price ? parseInt(values.price, 10) : null,
                size: values.size ? parseFloat(values.size) : null,
                bedrooms: values.bedrooms ? parseInt(values.bedrooms, 10) : null,
                baths: values.baths ? parseInt(values.baths, 10) : null,
                year: values.year ? parseInt(values.year, 10) : null,
                type: values.type || null,
            };

            Object.keys(formattedValues).forEach((key) => {
                if (formattedValues[key] !== null) {
                    formData.append(key, formattedValues[key]);
                }
            });

            if (values.image && values.image.file) {  // Ensure values.image and file exist
                formData.append("image", values.image.file.originFileObj);
            }


            const response = await fetch(`${API_BASE_URL}/properties/${selectedProperty.id}`, {
                method: "PUT",
                headers: {Authorization: `Bearer ${token}`},
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to update property");

            message.success("Property updated successfully!");
            fetchProperties();
            setIsEditModalVisible(false);
            editForm.resetFields();
            setSelectedProperty(null);
        } catch (error) {
            message.error(error.message);
        }
    };

    // Handle Delete Property
    const handleDeleteProperty = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
                method: "DELETE",
                headers: {Authorization: `Bearer ${token}`},
            });

            if (!response.ok) throw new Error("Failed to delete property");

            message.success("Property deleted successfully!");
            fetchProperties();
        } catch (error) {
            message.error(error.message);
        }
    };

    // Utility function to create FormData from values
    const createFormData = (values) => {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (values[key] !== null && values[key] !== undefined) {
                formData.append(key, values[key]);
            }
        });

        if (values.image && values.image.file) {
            formData.append("image", values.image.file.originFileObj);
        }

        return formData;
    };

    // Table Columns
    const columns = [
        {
            title: "Image",
            dataIndex: "image_link",
            key: "image_link",
            render: (image) => (
                <img src={`${API_BASE_URL}/${image}`} alt="Property" className="property-image"/>
            ),
        },
        {title: "Location", dataIndex: "location", key: "location"},
        {title: "City", dataIndex: "city", key: "city"},
        {title: "Price", dataIndex: "price", key: "price", render: (text) => `$${text}`},
        {title: "Size (Marla)", dataIndex: "size", key: "size"},
        {title: "Bedrooms", dataIndex: "bedrooms", key: "bedrooms"},
        {title: "Baths", dataIndex: "baths", key: "baths"},
        {title: "Year", dataIndex: "year", key: "year"},

        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <React.Fragment>
                    <Button icon={<EyeOutlined/>} onClick={() => openViewModal(record)}/>
                    <Button icon={<EditOutlined/>} onClick={() => openEditModal(record)}/>
                    <Button icon={<DeleteOutlined/>} danger onClick={() => handleDeleteProperty(record.id)}/>
                </React.Fragment>
            ),
        },
    ];

    return (
        <div className="settings-container">

            <Content className="content">
                <h2 className="form-title">Manage Properties</h2>

                <Divider/>
                <Table dataSource={properties} columns={columns} rowKey="id" loading={loading}/>
            </Content>

            {/* Edit Property Modal */}
            <Modal title="Edit Property" open={isEditModalVisible} onCancel={() => setIsEditModalVisible(false)}
                   footer={null}>
                <Form form={editForm} layout="vertical" onFinish={handleUpdateProperty}>
                    <Form.Item name="location" label="Location" rules={[{required: true}]}>
                        <Input placeholder="Enter location"/>
                    </Form.Item>
                    <Form.Item name="city" label="City" rules={[{required: true}]}>
                        <Input placeholder="Enter city"/>
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{required: true}]}>
                        <Input type="number" placeholder="Enter price"/>
                    </Form.Item>
                    <Form.Item name="size" label="Size (Marla)" rules={[{required: true}]}>
                        <Input type="number" placeholder="Enter size"/>
                    </Form.Item>
                    <Form.Item name="bedrooms" label="Bedrooms" rules={[{required: true}]}>
                        <Input type="number" placeholder="Enter bedrooms"/>
                    </Form.Item>
                    <Form.Item name="baths" label="Baths" rules={[{required: true}]}>
                        <Input type="number" placeholder="Enter baths"/>
                    </Form.Item>
                    <Form.Item name="year" label="Year" rules={[{required: true}]}>
                        <Input type="number" placeholder="Enter year"/>
                    </Form.Item>
                    <Form.Item name="image" label="Upload Image">
                        <Upload beforeUpload={() => false} listType="picture">
                            <Button icon={<UploadOutlined/>}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Update Property
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Property Modal */}
            <Modal title="Property Details" open={isViewModalVisible} onCancel={() => setIsViewModalVisible(false)}
                   footer={null}>
                {selectedProperty && (
                    <>
                        <img src={`${API_BASE_URL}/${selectedProperty.image_link}`} alt="Property"
                            className="property-modal-image"/>

                        <p><strong>{selectedProperty.location}, {selectedProperty.city}</strong></p>
                        <p>Price: ${selectedProperty.price}</p>
                        <p>Size: {selectedProperty.size} Marla</p>
                        <p>Bedrooms: {selectedProperty.bedrooms}</p>
                        <p>Baths: {selectedProperty.baths}</p>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default ManageProperties;