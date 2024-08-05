import { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import { useOnScreen } from "../contexts/OnScreenProvider";

// TODO : Figure out how to secure checkout routes

const RequireAuth = ({ clearance }) => {
    const { userData } = useUserData();
    const { setOnScreen } = useOnScreen();
    const location = useLocation();

    const trimPath = (path) => {
        const segments = path.split('/');
        if (segments.includes('movie')) {
            return '/home';
        }

        return segments.join('/');
    };

    useEffect(() => {
        if (!userData?.loggedIn && userData?.user !== '') {
            setOnScreen((prevContext) => ({
                ...prevContext,
                showAuthModal: true,
                showLogin: true
            }));
        }

        location.pathname = trimPath(location.pathname);

    }, [userData, setOnScreen, location]);

    return (
        <>
            {userData?.loggedIn && userData?.clearance <= clearance
                ? <Outlet />
                : <Navigate to="/home" state={{ from: location }} replace />}
        </>
    );
}

export default RequireAuth;