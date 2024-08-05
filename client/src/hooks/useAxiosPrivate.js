import { useEffect } from "react";
import { axiosPrivate } from "../apis/axios";
import useUserData from "./useUserData";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
    const refreshToken = useRefreshToken();
    const { userData } = useUserData();

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['authorization']) {
                    config.headers['authorization'] = `Bearer ${userData.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refreshToken();
                    prevRequest.headers['authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }

    }, [userData, refreshToken]);

    return axiosPrivate;
}

export default useAxiosPrivate;