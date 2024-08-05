import React, { useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { Form, Button, FormLabel, FloatingLabel } from 'react-bootstrap';
import './ForgotPassword.css'

export default function ForgotPassword({ switchLoginForgotPasswordViewHandler, closeAuthenticationHandler }) {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const axiosPrivate = useAxiosPrivate();

    // TODO : Implement axios forgot password

    const submitHandler = (event) => {
        event.preventDefault();
        console.log(email);
        setIsSubmitted(true);
    }

    const fieldChangeHandler = (event) => {
        setEmail(event.target.value);
    };

    if (isSubmitted) {
        return (
            <div className="forgotpassword-body" style={{ padding: '5rem' }}>
                <h6>
                    If the email entered matches an existing account, a reset password email will be sent to it shortly.
                </h6>
                <Button variant="secondary" onClick={switchLoginForgotPasswordViewHandler}>Back to Login</Button>
            </div>
        );
    }

    return (
        <div className="forgotpassword-body" style={{ padding: '2rem' }}>
            <Form onSubmit={submitHandler}>
                <div><FormLabel>Enter your account's email to receive a password reset email.</FormLabel></div>

                <FloatingLabel className="mb-3 mt-3" label="Email" controlId="formEmail">
                    <Form.Control
                        type="email"
                        name="email"
                        value={email}
                        onChange={fieldChangeHandler}
                        required
                    />
                </FloatingLabel>
                <Button variant="primary" type="submit">Reset my Password</Button>
                <div className='back-to-login'>
                    <h6 style={{ cursor: 'pointer' }} onClick={switchLoginForgotPasswordViewHandler}>Back To Login</h6>
                </div>
            </Form>
        </div>
    );
}