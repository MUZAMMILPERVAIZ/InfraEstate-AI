import React from "react"; // Add this import
import {HiShieldCheck} from "react-icons/hi";
import {MdAnalytics, MdCancel} from "react-icons/md";

const data = [
    {
        icon: <HiShieldCheck/>,
        heading: "Best interest rates on the market",
        detail: "We provide the best rates tailored to your financial goals, ensuring maximum value for your investment.",
    },
    {
        icon: <MdCancel/>,
        heading: "Prevent unstable prices",
        detail: "Our AI ensures you stay ahead of market trends and avoid fluctuations, making informed property decisions.",
    },
    {
        icon: <MdAnalytics/>,
        detail: "Access competitive pricing backed by robust data analytics and market insights.",
    },
];
export default data;