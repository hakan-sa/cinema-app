import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import useRefreshToken from "../hooks/useRefreshToken";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refreshToken = useRefreshToken();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refreshToken();
            } catch (err) {
                console.log(err);
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        verifyRefreshToken()

        return () => isMounted = false;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {isLoading ? <p>Loading...</p> : <Outlet />}
        </>
    );
}

export default PersistLogin;