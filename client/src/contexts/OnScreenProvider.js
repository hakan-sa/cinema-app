import React, { createContext, useState, useContext } from 'react';

const OnScreenContext = createContext();

export const useOnScreen = () => useContext(OnScreenContext);

export const OnScreenProvider = ({ children }) => {
    const [onScreen, setOnScreen] = useState({
        showAuthModal: false,
        showSignup: false,
        showSignupConfirmation: false,
        showLogin: false,
        showForgotPassword: false
    });

    return (
        <OnScreenContext.Provider value={{ onScreen, setOnScreen }}>
            {children}
        </OnScreenContext.Provider>
    );
};