import React, { useState, useMemo, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Modal, Button, Form, Row, Col, FloatingLabel, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './AddPaymentCard.css';
import { US_STATES } from '../../utils/States';

export default function AddPaymentCard({ show, handleClose, userId, forceReload, updatePaymentCardsHandler }) {
    const CARDNUMBER_REGEX = useMemo(() => /^\d{4}-?\d{4}-?\d{4}-?\d{4}$/, []);
    const EXPIRATIONDATE_REGEX = useMemo(() => /^(0[1-9]|1[0-2])\/(2[2-9]|[3-9][0-9])$/, []);
    const ZIPCODE_REGEX = useMemo(() => /^\d{5}(?:-\d{4})?$/, []);

    const [paymentFirstName, setPaymentFirstName] = useState('');
    const [paymentLastName, setPaymentLastName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [validCardNumber, setValidCardNumber] = useState(false);
    const [cardNumberFocus, setCardNumberFocus] = useState(false);
    const [expirationDate, setExpirationDate] = useState('');
    const [validExpirationDate, setValidExpirationDate] = useState(false);
    const [expirationDateFocus, setExpirationDateFocus] = useState(false);
    const [paymentStreet, setPaymentStreet] = useState('');
    const [paymentCity, setPaymentCity] = useState('');
    const [paymentState, setPaymentState] = useState('');
    const [paymentZipCode, setPaymentZipCode] = useState('');
    const [validPaymentZipCode, setValidPaymentZipCode] = useState(false);
    const [paymentZipCodeFocus, setPaymentZipCodeFocus] = useState(false);
    const isPaymentCardRequired = true;

    const axiosPrivate = useAxiosPrivate();

    // Validate credit card number
    useEffect(() => {
        setValidCardNumber(CARDNUMBER_REGEX.test(cardNumber));
    }, [cardNumber, CARDNUMBER_REGEX]);

    // Validate expiration date
    useEffect(() => {
        setValidExpirationDate(EXPIRATIONDATE_REGEX.test(expirationDate));
    }, [expirationDate, EXPIRATIONDATE_REGEX]);

    // Validate payment zip code
    useEffect(() => {
        setValidPaymentZipCode(ZIPCODE_REGEX.test(paymentZipCode));
    }, [paymentZipCode, ZIPCODE_REGEX]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const requestBody = {
            cardNumber: cardNumber,
            firstName: paymentFirstName,
            lastName: paymentLastName,
            city: paymentCity,
            state: paymentState,
            street: paymentStreet,
            zipCode: paymentZipCode,
            expirationDate: expirationDate
        }

        try {
            const response = await axiosPrivate.post(`payment-cards/${userId}`, requestBody);
            console.log(response.data);
            forceReload();
            alert("Payment card added successfully!");
            handleClose();
            updatePaymentCardsHandler();
        } catch (error) {
            if (error.status === 403) {
                alert("You cannot add more than three payment cards. Please delete one to add another.");
                console.error(error.message);
            } else {
                alert("Failed to add payment card. Please try again.");
                console.error(error.message);
            }
        }

    };

    const isFormValid = () => {
        return validCardNumber && validExpirationDate && validPaymentZipCode;
    };

    return (
        <Modal className="modal-lg text-white " data-bs-theme="dark" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Payment Card</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="addpaymentcard-body p-3">
                    <Row>
                        <Col>
                            <FloatingLabel className="mb-3" label="First Name" controlId="formPaymentFirstName">
                                <Form.Control
                                    type="text"
                                    name="paymentFirstName"
                                    placeholder="First Name"
                                    pattern="[A-Za-z]+"
                                    onChange={(event) => setPaymentFirstName(event.target.value)}
                                    autoCapitalize="words"
                                    autoComplete="off"
                                    required={isPaymentCardRequired}
                                    className={paymentFirstName && "is-valid"}
                                />
                            </FloatingLabel>
                        </Col>
                        <Col>
                            <FloatingLabel className="mb-3" label="Last Name" controlId="formPaymentLastName">
                                <Form.Control
                                    type="text"
                                    name="paymentLastName"
                                    placeholder="Last Name"
                                    pattern="[A-Za-z]+"
                                    onChange={(event) => setPaymentLastName(event.target.value)}
                                    autoCapitalize="words"
                                    autoComplete="off"
                                    required={isPaymentCardRequired}
                                    className={paymentLastName && "is-valid"}
                                />
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FloatingLabel className="mb-3" label="Credit Card Number" controlId="formCreditCardNumber">
                                <Form.Control
                                    type="text"
                                    name="creditCardNumber"
                                    placeholder="Credit Card Number"
                                    onChange={(event) => setCardNumber(event.target.value)}
                                    onFocus={() => setCardNumberFocus(true)}
                                    onBlur={() => setCardNumberFocus(false)}
                                    autoComplete="off"
                                    required={isPaymentCardRequired}
                                    className={cardNumber && validCardNumber ? "is-valid" : cardNumber ? "is-invalid" : ""}
                                />
                                {cardNumberFocus && cardNumber && !validCardNumber ?
                                    (<p>
                                        <FontAwesomeIcon icon={faInfoCircle} /> {" "}
                                        Must be a valid credit card number. <br />
                                        In the form xxxx-xxxx-xxxx-xxxx.
                                    </p>)
                                    : null}
                            </FloatingLabel>
                        </Col>
                        <Col>
                            <FloatingLabel className="mb-3" label="Expiration Date" controlId="formCardExpirationDate">
                                <Form.Control
                                    type="text"
                                    name="cardExpirationDate"
                                    placeholder="Expiration Date"
                                    onChange={(event) => setExpirationDate(event.target.value)}
                                    onFocus={() => setExpirationDateFocus(true)}
                                    onBlur={() => setExpirationDateFocus(false)}
                                    autoComplete="off"
                                    required={isPaymentCardRequired}
                                    className={expirationDate && validExpirationDate ? "is-valid" : expirationDate ? "is-invalid" : ""}
                                />
                                {expirationDateFocus && expirationDate && !validExpirationDate ?
                                    (<p>
                                        <FontAwesomeIcon icon={faInfoCircle} /> {" "}
                                        Must be a valid credit card expiration date. <br />
                                        In the form mm/yy.
                                    </p>)
                                    : null}
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <FloatingLabel className="mb-3" label="Street Name" controlId="formPaymentStreetName">
                        <Form.Control
                            type="text"
                            name="paymentStreetName"
                            placeholder="Street"
                            pattern="[A-Za-z0-9\s]+"
                            onChange={(event) => setPaymentStreet(event.target.value)}
                            autoCapitalize="words"
                            autoComplete="off"
                            required={isPaymentCardRequired}
                            className={paymentStreet && "is-valid"}
                        />
                    </FloatingLabel>
                    <Row>
                        <Col>
                            <FloatingLabel className="mb-3" label="City" controlId="formPaymentCity">
                                <Form.Control
                                    type="text"
                                    name="paymentCity"
                                    placeholder="City"
                                    pattern="[A-Za-z]+"
                                    onChange={(event) => setPaymentCity(event.target.value)}
                                    autoCapitalize="words"
                                    autoComplete="off"
                                    required={isPaymentCardRequired}
                                    className={paymentCity && "is-valid"}
                                />
                            </FloatingLabel>
                        </Col>
                        <Col>
                            <FloatingLabel className="mb-3" label="State" controlId="formPaymentState">
                                <Form.Select
                                    name="paymentState"
                                    placeholder={paymentState ? null : "State"}
                                    value={paymentState}
                                    onChange={(event) => setPaymentState(event.target.value)}
                                    autoComplete="off"
                                    required={isPaymentCardRequired}
                                    className={paymentState && "is-valid"}
                                >
                                    {!paymentState && <option value=""></option>}
                                    {US_STATES.map(state => (
                                        <option key={state.value} value={state.value}>{state.label}</option>
                                    ))}
                                </Form.Select>
                            </FloatingLabel>
                        </Col>
                        <Col>
                            <FloatingLabel className="mb-3" label="Zip Code" controlId="formPaymentZip">
                                <Form.Control
                                    type="number"
                                    name="paymentZipCode"
                                    placeholder="Zip Code"
                                    onChange={(event) => setPaymentZipCode(event.target.value)}
                                    onFocus={() => setPaymentZipCodeFocus(true)}
                                    onBlur={() => setPaymentZipCodeFocus(false)}
                                    autoComplete="off"
                                    required={isPaymentCardRequired}
                                    className={paymentZipCode && validPaymentZipCode ? "is-valid" : paymentZipCode ? "is-invalid" : ""}
                                />
                                {paymentZipCodeFocus && paymentZipCode && !validPaymentZipCode ?
                                    (<p>
                                        <FontAwesomeIcon icon={faInfoCircle} /> {" "}
                                        Must be a valid 5 digit zip code. <br />
                                        Optionally, followed by dash "-" and last 4 digits.
                                    </p>)
                                    : null}
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <Button
                        variant="primary"
                        disabled={!paymentFirstName || !paymentLastName || !paymentStreet || !paymentCity || !paymentZipCode ||
                            !validPaymentZipCode || !cardNumber || !validCardNumber || !expirationDate || !validExpirationDate}
                        onClick={handleSubmit}
                    >
                        Add Card
                    </Button>
                </Container>
            </Modal.Body>
        </Modal>
    );
}