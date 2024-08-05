import { useNavigate } from "react-router-dom";
import axios from "../apis/axios";
import useUserData from "./useUserData";

const useLogout = () => {
    const navigate = useNavigate();
    const { setUserData } = useUserData();

    const logout = async () => {
        setUserData(() => ({
            loggedIn: false,
            accessToken: undefined,
            user: '',
            clearance: undefined
        }));
        try {
            await axios.delete('/auths/logout',
                {
                    withCredentials: true
                });

            navigate('/home', { replace: true });
        } catch (err) {
            console.log(err);
        }
    }

    return logout;
}

export default useLogout;