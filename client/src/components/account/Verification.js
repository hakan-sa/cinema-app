import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Button, Form } from 'react-bootstrap';
import NavBar from '../general/NavBar';
import WarpSpeed from '../general/WarpSpeed';
import axios from '../../apis/axios';

export default function Verification() {
    const [verificationCode, setVerificationCode] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const useQuery = () => {
        return new URLSearchParams(location.search);
    };

    const query = useQuery();
    const initialized = useRef(false);

    const submitHandler = async () => {
        if (verificationCode && email) {
            try {
                const response = await axios.put(`/auths/verification-match/${verificationCode}`, { email });
                if (response.status === 200) {
                    alert("Your account has been verified. You can now log in.");
                    navigate('/home');
                } else if (response.status === 403) {
                    alert("Invalid verification code. Please try again.");
                }
            } catch (error) {
                console.log("Error verifying account:", error);
            }
        }
    };

    useEffect(() => {
        if (!initialized.current) {
            const verificationCode = query.get('verificationCode');
            const email = query.get('email');
            if (verificationCode) setVerificationCode(verificationCode);
            if (email) setEmail(email);
            if (verificationCode && email) submitHandler();
            initialized.current = true;
        }
    }, []);

    useEffect(() => {
        if (verificationCode && email) submitHandler();
    }, [verificationCode, email]);

    return (
        <div>
            <NavBar />
            <WarpSpeed speedMultiplier={0.0001} />
            <Container style={{ maxWidth: '400px', marginTop: '20vh' }}>
                <h2> Verify your Account </h2>
                <hr />
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="email">
                        <Form.Control
                            placeholder="Enter account email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mt-3" controlId="verificationCode">
                        <Form.Control
                            placeholder="Enter your verification code"
                            type="text"
                            value={verificationCode}
                            onChange={(event) => setVerificationCode(event.target.value)}
                            maxLength={6}
                            required
                        />
                    </Form.Group>
                    <Button className="mt-5" variant="primary" disabled={!verificationCode || !email} type="submit">Verify</Button>
                </Form>
            </Container>
        </div>
    );
}