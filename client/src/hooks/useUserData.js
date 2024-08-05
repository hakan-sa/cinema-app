import { useContext, useDebugValue } from "react";
import UserDataContext from "../contexts/UserDataProvider";

const useUserData = () => {

    const userData = useContext(UserDataContext);

    useDebugValue(userData, userData => userData?.loggedIn ? "Logged In" : "Logged Out")

    return userData;
}

export default useUserData;