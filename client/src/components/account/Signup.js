import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from '../../apis/axios';

import { sendEmail } from '../../utils/Email';

import { Button, Form, Row, Col, Collapse, FloatingLabel } from 'react-bootstrap';
import './Signup.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export default function Signup({
    switchLoginSignupViewsHandler,
    showSignupVerificationViewHandler
}) {

    const EMAIL_REGEX = useMemo(() => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, []);
    const PASSWORD_REGEX = useMemo(() => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{10,32}$/, []);
    const PHONE_REGEX = useMemo(() => /^\d{3}-?\d{3}-?\d{4}$/, []);
    const ZIPCODE_REGEX = useMemo(() => /^\d{5}(?:-\d{4})?$/, []);
    const CARDNUMBER_REGEX = useMemo(() => /^\d{4}-?\d{4}-?\d{4}-?\d{4}$/, []);
    const EXPIRATIONDATE_REGEX = useMemo(() => /^(0[1-9]|1[0-2])\/(2[2-9]|[3-9][0-9])$/, []);

    const signupRef = useRef(null);

    const [showAddressSection, setShowAddressSection] = useState(false);
    const [showPaymentCardSection, setShowPaymentCardSection] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [emailTaken, setEmailTaken] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [validPhoneNumber, setValidPhoneNumber] = useState(false);
    const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');

    const [zipCode, setZipCode] = useState('');
    const [validZipCode, setValidZipCode] = useState(false);
    const [zipCodeFocus, setZipCodeFocus] = useState(false);

    // TODO : Use a 3rd party API to verify that is a valid and legit address
    // TODO : Use a 3rd party API to display address recomendations

    const [promoStatus, setPromoStatus] = useState('off');

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

    // TODO : Use a 3rd party API to verify that is valid and legit credit card information
    //        and that the billing address is correct

    const isAddressPopulated = !!street || !!city || !!state || !!zipCode;
    const isAddressRequired = showAddressSection && isAddressPopulated;

    const isPaymentCardPopulated = !!cardNumber || !!expirationDate || !!paymentStreet || !!paymentCity || !!paymentState || !!paymentZipCode;
    const isPaymentCardRequired = showPaymentCardSection && isPaymentCardPopulated;

    // Validate email
    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
        // TODO : Use a 3rd party API to verify that this is a valid and legit email address
    }, [email, EMAIL_REGEX]);

    // Determine if email is taken
    const isEmailTaken = async () => {
        const isEmailTaken = await axios.get(`/auths/is-email-taken/${email}`);
        if (isEmailTaken.data) {
            setEmailTaken(true);
            setValidEmail(false);
        } else {
            setEmailTaken(false);
        }
    }

    // Validate password and check if it matches confirm password
    useEffect(() => {
        const result = PASSWORD_REGEX.test(password);
        setValidPassword(result);
        if (result) {
            const match = password === confirmPassword;
            setValidConfirmPassword(match);
        } else {
            setValidConfirmPassword(false);
        }
    }, [password, confirmPassword, PASSWORD_REGEX]);

    // Validate phone number
    useEffect(() => {
        setValidPhoneNumber(PHONE_REGEX.test(phoneNumber));
        // TODO : Use a 3rd party API to verify that is a valid and legit phone number
    }, [phoneNumber, PHONE_REGEX]);

    // Validate zip code
    useEffect(() => {
        setValidZipCode(ZIPCODE_REGEX.test(zipCode));
        // TODO : Use a 3rd party API to verify that is a valid and legit zip code
    }, [zipCode, ZIPCODE_REGEX]);

    // Validate credit card number
    useEffect(() => {
        setValidCardNumber(CARDNUMBER_REGEX.test(cardNumber));
        // TODO : Use a 3rd party API to verify that is a valid and legit card number
    }, [cardNumber, CARDNUMBER_REGEX]);

    // Validate expiration date
    useEffect(() => {
        setValidExpirationDate(EXPIRATIONDATE_REGEX.test(expirationDate));
        // TODO : Use a 3rd party API to verify that is a valid and legit expiration date
    }, [expirationDate, EXPIRATIONDATE_REGEX]);

    // Validate payment zip code
    useEffect(() => {
        setValidPaymentZipCode(ZIPCODE_REGEX.test(paymentZipCode));
        // TODO : Use a 3rd party API to verify that is a valid and legit zip code
    }, [paymentZipCode, ZIPCODE_REGEX]);

    // Validate general information
    const isGeneralFieldsValid = () => {
        return (validEmail && validPhoneNumber && validPassword && validConfirmPassword &&
            firstName && lastName);
    };

    // Validate address information
    const isAddressValid = () => {
        if (showAddressSection) {
            return (validZipCode && street && city && state);
        }
        return true;
    };

    // Validation payment card information
    const isPaymentCardValid = () => {
        if (showPaymentCardSection) {
            return (validCardNumber && validExpirationDate && validPaymentZipCode &&
                paymentStreet && paymentCity && paymentState && paymentFirstName && paymentLastName);
        }
        return true;
    };

    // Determine if all field sections are valid
    const areAllFieldsValid = isGeneralFieldsValid() &&
        (isAddressValid() || !isAddressRequired) &&
        (isPaymentCardValid() || !isPaymentCardRequired);

    const buildNewUser = () => {
        let intPromoStatus = 2;
        if (promoStatus === "on") {
            intPromoStatus = 1;
        } else {
            intPromoStatus = 2;
        }

        const verificationCode = generateRandomCode();

        let newUser = { firstName, lastName, email, password, phoneNumber, promoStatus: intPromoStatus, verificationCode };
        if (isAddressRequired) {
            newUser = { ...newUser, street, city, state, zipCode };
        }
        if (isPaymentCardRequired) {
            newUser = {
                ...newUser, paymentFirstName, paymentLastName, paymentStreet, paymentCity,
                paymentState, paymentZipCode, cardNumber, expirationDate
            };
        }
        return newUser;
    }

    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // TODO : If registeration is successful, send verification/confirmation email
    const sendVerificationEmail = (email, verificationCode) => {
        const to = email;
        const subject = "Welcome to Stargazer eCinema! Verify Account Here";
        const text = "Hello Stargazer! We hope you enjoy your time at Stargazer! Follow this link for your account to be verified and be redirected back to the Stargazer website:" +
            " http://localhost:3000/verification?verificationCode=" + verificationCode + "&email=" + email;
        sendEmail(to, subject, text);
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        const newUser = buildNewUser();

        try {
            let response = await axios.post(`/auths/signup`,
                newUser,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            if (response.status === 201) {
                sendVerificationEmail(email, newUser.verificationCode);
                signupRef.current.reset();
                showSignupVerificationViewHandler();
            }
        } catch (error) {
            if (!error?.response) {
                console.log("No server response.");
            } else if (error.response?.status === 409) {
                console.log("Email taken.")
            }
            console.log("Failed to register user: " + error);
        }
    }

    return (
        <div className='signup-body'>
            <Form ref={signupRef} onSubmit={submitHandler} className="text-white">
                <Row>
                    <h5>Account Information</h5>
                    <Col>
                        <FloatingLabel className="mb-3" label="First Name" controlId="formFirstName">
                            <Form.Control
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                pattern="[A-Za-z]+"
                                onChange={(event) => setFirstName(event.target.value)}
                                autoCapitalize="words"
                                autoFocus="on"
                                autoComplete="off"
                                required
                                className={firstName && "is-valid"}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel className="mb-3" label="Last Name" controlId="formLastName">
                            <Form.Control
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                pattern="[A-Za-z]+"
                                onChange={(event) => setLastName(event.target.value)}
                                autoCapitalize="words"
                                autoComplete="off"
                                required
                                className={lastName && "is-valid"}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FloatingLabel className="mb-3" label="Email" controlId="formEmail">
                            {/* TODO : If email is already registered to an account, display error to user */}
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={(event) => setEmail(event.target.value)}
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => {
                                    setEmailFocus(false);
                                    isEmailTaken();
                                }}
                                autoComplete="off"
                                required
                                className={email && validEmail ? "is-valid" : email ? "is-invalid" : ""}
                            />
                            {emailFocus && email && !validEmail && !emailTaken ?
                                (<p>
                                    <FontAwesomeIcon icon={faInfoCircle} /> {" "}
                                    Must be a valid email address. <br />
                                    In the form example@stargazer.com.
                                </p>)
                                : null}
                            {emailFocus && email && !validEmail && emailTaken ?
                                (<p>
                                    <FontAwesomeIcon icon={faInfoCircle} /> {" "}
                                    This email is already taken. <br />
                                    Please use a different email or sign in with your existing account.
                                </p>)
                                : null}
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel className="mb-3" label="Phone Number" controlId="formPhoneNumber">
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                onChange={(event) => setPhoneNumber(event.target.value)}
                                onFocus={() => setPhoneNumberFocus(true)}
                                onBlur={() => setPhoneNumberFocus(false)}
                                autoComplete="off"
                                required
                                className={phoneNumber && validPhoneNumber ? "is-valid" : phoneNumber ? "is-invalid" : ""}
                            />
                            {phoneNumberFocus && phoneNumber && !validPhoneNumber ?
                                (<p>
                                    <FontAwesomeIcon icon={faInfoCircle} /> {" "}
                                    Must be a valid phone number.<br />
                                    In the form xxx-xxx-xxxx or xxxxxxxxxx.
                                </p>)
                                : null}
                        </FloatingLabel>
                    </Col>
                </Row>
                <FloatingLabel className="mb-3" label="Password" controlId="formPassword">
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        style={{ width: '49%' }}
                        onChange={(event) => setPassword(event.target.value)}
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                        autoComplete="off"
                        required
                        className={password && validPassword ? "is-valid" : password ? "is-invalid" : ""}
                    />
                    {passwordFocus && password && !validPassword ?
                        (<p>
                            <FontAwesomeIcon icon={faInfoCircle} /> {" "}
                            Must be 10 to 32 characters. <br />
                            Must contain an uppercase letter, lowercase letter, digit, and at least one <br />
                            specical character: ! @ # $ % ^ & *
                        </p>)
                        : null}
                </FloatingLabel>
                <FloatingLabel className="mb-3" label="Confirm Password" controlId="formConfirmPassword">
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        style={{ width: '49%' }}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        onFocus={() => setConfirmPasswordFocus(true)}
                        onBlur={() => setConfirmPasswordFocus(false)}
                        autoComplete="off"
                        required
                        className={confirmPassword && validConfirmPassword ? "is-valid" : confirmPassword ? "is-invalid" : ""}
                    />
                    {confirmPasswordFocus && confirmPassword && !validConfirmPassword ?
                        (<p>
                            <FontAwesomeIcon icon={faInfoCircle} /> {" "}
                            Must match password.
                        </p>)
                        : null}
                </FloatingLabel>
                <hr />
                <h5
                    className='toggle-header'
                    onClick={() => setShowAddressSection(!showAddressSection)}
                >
                    Address Information (Optional)
                    <span className="material-icons">
                        {showAddressSection ? 'expand_less' : 'expand_more'}
                    </span>
                </h5>
                <Collapse in={showAddressSection}>
                    <div id="address-form">
                        <FloatingLabel className="mb-3" label="Street Name" controlId="formStreetName">
                            <Form.Control
                                type="text"
                                name="street"
                                placeholder="Street"
                                pattern="[A-Za-z0-9\s]+"
                                onChange={(event) => setStreet(event.target.value)}
                                autoCapitalize="words"
                                autoComplete="off"
                                required={isAddressRequired}
                                className={street && "is-valid"}
                            />
                        </FloatingLabel>
                        <Row>
                            <Col>
                                <FloatingLabel className="mb-3" label="City" controlId="formCity">
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        pattern="[A-Za-z ]+"
                                        onChange={(event) => setCity(event.target.value)}
                                        autoCapitalize="words"
                                        autoComplete="off"
                                        required={isAddressRequired}
                                        className={city && "is-valid"}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formState">
                                    <FloatingLabel className="mb-3" label="State" controlId="formState">
                                        <Form.Select
                                            name="state"
                                            placeholder={state ? null : "State"}
                                            value={state}
                                            onChange={(event) => setState(event.target.value)}
                                            autoComplete="off"
                                            required={isAddressRequired}
                                            className={state && "is-valid"}
                                        >
                                            {!state && <option value="">State</option>}
                                            <option value="AL">AL</option>
                                            <option value="AK">AK</option>
                                            <option value="AZ">AZ</option>
                                            <option value="AR">AR</option>
                                            <option value="CA">CA</option>
                                            <option value="CO">CO</option>
                                            <option value="CT">CT</option>
                                            <option value="DE">DE</option>
                                            <option value="FL">FL</option>
                                            <option value="GA">GA</option>
                                            <option value="HI">HI</option>
                                            <option value="ID">ID</option>
                                            <option value="IL">IL</option>
                                            <option value="IN">IN</option>
                                            <option value="IA">IA</option>
                                            <option value="KS">KS</option>
                                            <option value="KY">KY</option>
                                            <option value="LA">LA</option>
                                            <option value="ME">ME</option>
                                            <option value="MD">MD</option>
                                            <option value="MA">MA</option>
                                            <option value="MI">MI</option>
                                            <option value="MN">MN</option>
                                            <option value="MS">MS</option>
                                            <option value="MO">MO</option>
                                            <option value="MT">MT</option>
                                            <option value="NE">NE</option>
                                            <option value="NV">NV</option>
                                            <option value="NH">NH</option>
                                            <option value="NJ">NJ</option>
                                            <option value="NM">NM</option>
                                            <option value="NY">NY</option>
                                            <option value="NC">NC</option>
                                            <option value="ND">ND</option>
                                            <option value="OH">OH</option>
                                            <option value="OK">OK</option>
                                            <option value="OR">OR</option>
                                            <option value="PA">PA</option>
                                            <option value="RI">RI</option>
                                            <option value="SC">SC</option>
                                            <option value="SD">SD</option>
                                            <option value="TN">TN</option>
                                            <option value="TX">TX</option>
                                            <option value="UT">UT</option>
                                            <option value="VT">VT</option>
                                            <option value="VA">VA</option>
                                            <option value="WA">WA</option>
                                            <option value="WV">WV</option>
                                            <option value="WI">WI</option>
                                            <option value="WY">WY</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <FloatingLabel className="mb-3" label="Zip Code" controlId="formZip">
                                    <Form.Control
                                        type="number"
                                        name="zipCode"
                                        placeholder="Zip Code"
                                        onChange={(event) => setZipCode(event.target.value)}
                                        onFocus={() => setZipCodeFocus(true)}
                                        onBlur={() => setZipCodeFocus(false)}
                                        autoComplete="off"
                                        required={isAddressRequired}
                                        className={zipCode && validZipCode ? "is-valid" : zipCode ? "is-invalid" : ""}
                                    />
                                    {zipCodeFocus && zipCode && !validZipCode ?
                                        (<p>
                                            <FontAwesomeIcon icon={faInfoCircle} /> {" "}
                                            Must be a valid 5 digit zip code. <br />
                                            Optionally, followed by dash "-" and last 4 digits.
                                        </p>)
                                        : null}
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </div>
                </Collapse>
                <hr />
                <h5
                    className='toggle-header'
                    onClick={() => setShowPaymentCardSection(!showPaymentCardSection)}
                >
                    Add Payment Card (Optional)
                    <span className="material-icons">
                        {showPaymentCardSection ? 'expand_less' : 'expand_more'}
                    </span>
                </h5>
                <Collapse in={showPaymentCardSection}>
                    <div id="add-payment-form">
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
                                        pattern="[A-Za-z ]+"
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
                                        <option value="AL">AL</option>
                                        <option value="AK">AK</option>
                                        <option value="AZ">AZ</option>
                                        <option value="AR">AR</option>
                                        <option value="CA">CA</option>
                                        <option value="CO">CO</option>
                                        <option value="CT">CT</option>
                                        <option value="DE">DE</option>
                                        <option value="FL">FL</option>
                                        <option value="GA">GA</option>
                                        <option value="HI">HI</option>
                                        <option value="ID">ID</option>
                                        <option value="IL">IL</option>
                                        <option value="IN">IN</option>
                                        <option value="IA">IA</option>
                                        <option value="KS">KS</option>
                                        <option value="KY">KY</option>
                                        <option value="LA">LA</option>
                                        <option value="ME">ME</option>
                                        <option value="MD">MD</option>
                                        <option value="MA">MA</option>
                                        <option value="MI">MI</option>
                                        <option value="MN">MN</option>
                                        <option value="MS">MS</option>
                                        <option value="MO">MO</option>
                                        <option value="MT">MT</option>
                                        <option value="NE">NE</option>
                                        <option value="NV">NV</option>
                                        <option value="NH">NH</option>
                                        <option value="NJ">NJ</option>
                                        <option value="NM">NM</option>
                                        <option value="NY">NY</option>
                                        <option value="NC">NC</option>
                                        <option value="ND">ND</option>
                                        <option value="OH">OH</option>
                                        <option value="OK">OK</option>
                                        <option value="OR">OR</option>
                                        <option value="PA">PA</option>
                                        <option value="RI">RI</option>
                                        <option value="SC">SC</option>
                                        <option value="SD">SD</option>
                                        <option value="TN">TN</option>
                                        <option value="TX">TX</option>
                                        <option value="UT">UT</option>
                                        <option value="VT">VT</option>
                                        <option value="VA">VA</option>
                                        <option value="WA">WA</option>
                                        <option value="WV">WV</option>
                                        <option value="WI">WI</option>
                                        <option value="WY">WY</option>
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
                    </div>
                </Collapse>
                <hr />
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check
                                type="checkbox"
                                name="promoStatus"
                                onChange={(event) => setPromoStatus(event.target.value)}
                                autoComplete="off"
                                label="Subscribe to Email promotions" />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={!areAllFieldsValid}
                        >
                            Register
                        </Button>
                    </Col>
                    <Col className="d-flex align-items-center justify-content-end">
                        <h6 className="mb-0" onClick={switchLoginSignupViewsHandler}
                            style={{ cursor: 'pointer' }}>Already have an account? Login here</h6>
                    </Col>
                </Row>

            </Form>
        </div>
    );
}