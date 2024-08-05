// To send an email confirmation upon account creation, to reset password, and ordering tickets

import axios from '../apis/axios';

const generateTemporaryPassword = () => {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let temporaryPassword = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        temporaryPassword += charset[randomIndex];
    }

    return temporaryPassword;
};

export const sendEmail = async (to, subject, text) => {
    try {
        const emailDetails = { to, subject, text };
        const response = await axios.post('/emails/send-email', emailDetails);
        console.log('Client: Email sent successfully');
        return response;
    } catch (error) {
        console.error('Client: Error sending email:', error);
    }
};

export const sendForgotPasswordEmail = async (to, subject, text) => {
    try {
        const tempPassword = generateTemporaryPassword();
        const emailDetails = { to, subject, text, tempPassword };
        const response = await axios.post('/emails/send-forgot-password-email', emailDetails);
        console.log('Client: Forgot password email sent successfully');
        return response;
    } catch (error) {
        console.error('Client: Error sending forgot password email:', error);
    }
};