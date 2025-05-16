import React, {Suspense, useState} from "react"; // Add this import
import {ChatContextProvider} from "./components/Chatbot/chatContext"; // adjust path if needed
import "./App.css";
import Layout from "./components/Layout/Layout";
import Website from "./pages/Website";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Properties from "./pages/Properties/Properties";
import {QueryClient, QueryClientProvider} from "react-query";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Property from "./pages/Property/Property";
import UserDetailContext from "./context/UserDetailContext";
import Bookings from "./pages/Bookings/Bookings";
import Favourites from "./pages/Favourites/Favourites";
import Profile from "./pages/Profile/Profile.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import ManageProperties from "./pages/PropertiesPanel/ManageProperties.jsx";
import AddPropertyForm from "./pages/PropertiesPanel/AddPropertyForm.jsx";
import ContactUs from "./components/Contact/ContactUs.jsx";
import AIFloorPlanGenerator from "./pages/AIArchitect/AIFloorPlanGenerator.jsx";
import ConstructionBudgetEstimator from "./pages/ConstructionBudgetEstimator/ConstructionBudgetEstimator";
import ChatPage from "./pages/Chatbot/ChatPage";

function App() {
    const queryClient = new QueryClient();

    const [userDetails, setUserDetails] = useState({
        favourites: [],
        bookings: [],
        token: null,
    });

    return (
        <UserDetailContext.Provider value={{userDetails, setUserDetails}}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route element={<Layout/>}>
                                <Route path="/" element={<Website/>}/>
                                <Route path="/properties">
                                    <Route index element={<Properties/>}/>
                                    <Route path=":propertyId" element={<Property/>}/>
                                </Route>
                                <Route path="/ai-architect" element={<AIFloorPlanGenerator/>}/>
                                <Route path="/construction-estimator" element={<ConstructionBudgetEstimator/>}/>
                                <Route path="/infra-ai" element={
                                    <ChatContextProvider>
                                        <ChatPage/>
                                    </ChatContextProvider>
                                }/>
                                <Route path="/bookings" element={<Bookings/>}/>
                                <Route path="/favourites" element={<Favourites/>}/>
                                <Route path="/profile" element={<Profile/>}/>
                                <Route path="/settings" element={<Settings/>}/>
                                <Route path="/manage-properties" element={<ManageProperties/>}/>
                                <Route path="/add-properties" element={<AddPropertyForm/>}/>
                                <Route path="/contact-us" element={<ContactUs/>}/>

                            </Route>
                        </Routes>

                    </Suspense>
                </BrowserRouter>
                <ToastContainer/>
            </QueryClientProvider>
        </UserDetailContext.Provider>
    );
}

export default App;
