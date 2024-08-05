import React, { createContext, useState } from 'react';

const UserDataContext = createContext({});

export const UserDataProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        loggedIn: false,
        user: undefined,
        accessToken: undefined,
        // clearance: admin 1, user = 2
        clearance: undefined
    });

    return (
        <UserDataContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserDataContext;