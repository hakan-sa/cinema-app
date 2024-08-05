import React, { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import NavBar from '../general/NavBar';
import WarpSpeed from '../general/WarpSpeed';

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [email, setEmail] = useState('');

    const submitHandler = async (event) => {
        // Handle form submission
    };

    return (
        <div>
            <NavBar />
            <WarpSpeed speedMultiplier={0.0001} />
            <Container style={{ maxWidth: '400px', marginTop: '20vh' }}>
                <h2> Reset your Password </h2>
                <hr/>
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
                    <Form.Group className="mt-3" controlId="newPassword">
                        <Form.Control
                            placeholder="Enter your new password"
                            type="text"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mt-3" controlId="newPassword">
                        <Form.Control
                            placeholder="Reenter your new password"
                            type="text"
                            value={checkPassword}
                            onChange={(event) => setCheckPassword(event.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button className="mt-5" variant="primary" type="submit">Reset Password</Button>
                </Form>
            </Container>
        </div>
    );
}
