import React, { forwardRef, useImperativeHandle } from 'react';
import { Modal } from 'react-bootstrap';
import './AuthenticationModal.css';

import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import SignupConfirmation from './SignupConfirmation';

import { useOnScreen } from '../../contexts/OnScreenProvider';
import useUserData from '../../hooks/useUserData';

const AuthenticationModal = forwardRef(function AuthenticationModal(props, ref) {

    const { onScreen, setOnScreen } = useOnScreen();
    const { setUserData } = useUserData();

    useImperativeHandle(ref, () => ({
        showSignupViewHandler: () => {
            setOnScreen((prevContext) => ({
                ...prevContext,
                showAuthModal: true,
                showSignup: true
            }));
        },

        showLoginViewHandler: () => {
            setOnScreen((prevContext) => ({
                ...prevContext,
                showAuthModal: true,
                showLogin: true
            }));
        }
    }));

    const switchLoginSignupViewsHandler = () => {
        setOnScreen((prevContext) => ({
            ...prevContext,
            showSignup: !prevContext.showSignup,
            showLogin: !prevContext.showLogin
        }));
    }

    const switchLoginForgotPasswordViewsHandler = () => {
        setOnScreen((prevContext) => ({
            ...prevContext,
            showLogin: !prevContext.showLogin,
            showForgotPassword: !prevContext.showForgotPassword
        }));
    }

    const showSignupVerificationViewHandler = () => {
        setOnScreen((prevContext) => ({
            ...prevContext,
            showSignup: false,
            showSignupConfirmation: true
        }));
    }

    const closeAuthenticationHandler = () => {
        setOnScreen(() => ({
            showAuthModal: false,
            showSignup: false,
            showSignupConfirmation: false,
            showLogin: false,
            showForgotPassword: false
        }));
    }

    const loginUpdateHandler = (accessToken, user, clearance) => {
        const loggedIn = true;
        setUserData({ loggedIn, accessToken, user, clearance });
    }

    return (
        <div>
            <Modal className="modal-xl text-white" data-bs-theme="dark" centered show={onScreen.showAuthModal} onHide={closeAuthenticationHandler}>
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title text-center text-white">
                        {onScreen.showSignup ? 'Register New Account' : null}
                        {onScreen.showSignupConfirmation ? 'Signup Confirmation' : null}
                        {onScreen.showLogin ? 'Login To Your Account' : null}
                        {onScreen.showForgotPassword ? 'Reset Password' : null}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {onScreen.showSignup ?
                        (<> <Signup
                            switchLoginSignupViewsHandler={switchLoginSignupViewsHandler}
                            showSignupVerificationViewHandler={showSignupVerificationViewHandler}
                        />
                        </>)
                        : null}
                    {onScreen.showSignupConfirmation ?
                        (<> <SignupConfirmation
                            closeAuthenticationHandler={closeAuthenticationHandler}
                        />
                        </>)
                        : null}
                    {onScreen.showLogin ?
                        (<> <Login
                            switchLoginSignupViewsHandler={switchLoginSignupViewsHandler}
                            switchLoginForgotPasswordViewsHandler={switchLoginForgotPasswordViewsHandler}
                            loginUpdateHandler={loginUpdateHandler}
                            closeAuthenticationHandler={closeAuthenticationHandler}
                        />
                        </>)
                        : null}
                    {onScreen.showForgotPassword ?
                        (<> <ForgotPassword
                            switchLoginForgotPasswordViewHandler={switchLoginForgotPasswordViewsHandler}
                            closeAuthenticationHandler={closeAuthenticationHandler}
                        />
                        </>)
                        : null}

                </Modal.Body>
            </Modal>
        </div>
    );
});

export default AuthenticationModal;