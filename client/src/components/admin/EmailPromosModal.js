import React, { useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { sendEmail } from '../../utils/Email';

import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';
import './EmailPromosModal.css';


export default function EmailPromosModal({ manageEmailPromosViews, setManageEmailPromosViews }) {
    const initialValues = {
        subject: '',
        message: '',
    };

    const [emailPromo, setEmailPromo] = useState(initialValues);

    const axiosPrivate = useAxiosPrivate();

    const fieldChangeHandler = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setEmailPromo({ ...emailPromo, [name]: value });
    };

    const closeHandler = () => {
        setManageEmailPromosViews((prevContext) => ({
            ...prevContext,
            showEmailPromosModal: false
        }));
    }

    const clearHandler = () => {
        setEmailPromo(initialValues);
    };

    const submitHandler = () => {
        sendPromoEmails();
        clearHandler();
        closeHandler();
    };

    // Function to send promotional emails
    const sendPromoEmails = async () => {
        let subscribers = null;

        try {
            const response = await axiosPrivate.get('/users/promo-emails');
            subscribers = response.data;

        } catch (error) {
            console.error("Client: Error fetching subscribers: " + error);
            return;
        }
        const subject = emailPromo.subject;
        const text = emailPromo.message;
        const html = "<p> TESTING </p>";

        try {
            for (const subscriber of subscribers) {
                const to = subscriber;
                const sent = await sendEmail(to, subject, text, html);
                if (sent && sent.status === 200) {
                    console.log(`Email sent to ${to}`);
                }
            }
            alert("Emails successfully sent to all subscribers.");
        } catch (error) {
            console.log("Failed to send email", error);
        }
    }

    return (
        <Modal data-bs-theme="dark" className="text-white emailpromos-modal" show={manageEmailPromosViews.showEmailPromosModal} onHide={closeHandler} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Send Email Promotion</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3">
                <Form>
                    <FloatingLabel className="mb-3" label="Subject">
                        <Form.Control
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={emailPromo.subject}
                            onChange={fieldChangeHandler}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel className="mb-3" label="Message Body (HTML)">
                        <Form.Control
                            as="textarea"
                            rows={5}
                            name="message"
                            placeholder="Enter Promotional Content"
                            value={emailPromo.message}
                            onChange={fieldChangeHandler}
                            style={{ height: "30vh" }}
                        />
                    </FloatingLabel>

                    {/* Preview Message Body in HTML */}
                    <h5 className="text-muted">Email Preview:</h5>
                    <div className="htmlPreview mb-3">
                        <div dangerouslySetInnerHTML={{ __html: emailPromo.message }} />
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeHandler}>Close</Button>
                <Button variant="light" onClick={clearHandler}>Clear</Button>
                <Button variant="primary" onClick={submitHandler}>Send Email</Button>
            </Modal.Footer>
        </Modal>
    );
}
