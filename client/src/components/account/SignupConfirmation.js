import React from 'react';

export default function SignupConfirmation({ closeAuthenticationHandler }) {

    return (
        <div style={{ padding: '2rem' }}>
            <h1> Congrats, new Stargazer!</h1>
            <h4>Your registration has been confirmed. But before you take off, please check your email for your verification code. </h4>
        </div>
    );
}