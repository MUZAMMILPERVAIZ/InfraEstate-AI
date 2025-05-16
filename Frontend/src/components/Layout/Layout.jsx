import React, {useContext, useEffect} from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {Outlet, useLocation} from "react-router-dom"; // <-- import useLocation
import {useAuth0} from "@auth0/auth0-react";
import UserDetailContext from "../../context/UserDetailContext";
import {useMutation} from "react-query";
import {createUser} from "../../utils/api";
import useFavourites from "../../hooks/useFavourites";
import useBookings from "../../hooks/useBookings";

const Layout = () => {
    useFavourites();
    useBookings();

    const {isAuthenticated, user, getAccessTokenWithPopup} = useAuth0();
    const {setUserDetails} = useContext(UserDetailContext);
    const location = useLocation(); // <-- get current route

    const {mutate} = useMutation({
        mutationKey: [user && user.email],
        mutationFn: (token) => createUser(user && user.email, token),
    });

    useEffect(() => {
        const getTokenAndRegister = async () => {
            const res = await getAccessTokenWithPopup({
                authorizationParams: {
                    audience: "http://localhost:8000",
                    scope: "openid profile email",
                },
            });
            localStorage.setItem("access_token", res);
            setUserDetails((prev) => ({...prev, token: res}));
            mutate(res);
        };

        if (isAuthenticated) {
            getTokenAndRegister();
        }
    }, [isAuthenticated]);

    return (
        <React.Fragment>
            <div style={{background: "var(--black)", overflow: "hidden"}}>
                <Header/>
                <Outlet/>
            </div>
            {/* Hide Footer only on /infra-ai */}
            {location.pathname !== "/infra-ai" && <Footer/>}
        </React.Fragment>
    );
};

export default Layout;
