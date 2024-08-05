import axios from "../apis/axios";
import useUserData from "./useUserData";

const useRefreshToken = () => {
    const { setUserData } = useUserData();

    const refreshToken = async () => {
        try {
            const response = await axios.get('/auths/refresh-token',
                {
                    withCredentials: true
                });
            if (response.status === 200) {
                setUserData(() => ({
                    loggedIn: true,
                    accessToken: response.headers['authorization'].split(' ')[1],
                    user: response.data,
                    clearance: response.data.clearance_id
                }));

                // Refresh access token before it expires
                setTimeout(() => {
                    refreshToken();
                }, (300 * 1000) - 500);

            } else {
                setUserData(() => ({
                    loggedIn: false,
                    accessToken: undefined,
                    user: undefined,
                    clearance: undefined
                }));
            }
        } catch (error) {
            console.log("Error trying to refresh token.", error);
            setUserData(() => ({
                loggedIn: false,
                accessToken: undefined,
                user: undefined,
                clearance: undefined
            }));
        }
    }

    return refreshToken;
}

export default useRefreshToken;