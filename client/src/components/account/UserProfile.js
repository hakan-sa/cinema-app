import React, { useState, useEffect, useMemo } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Container, Form, Button, Image, FloatingLabel, Row, Col } from 'react-bootstrap';
import NavBar from '../general/NavBar';
import PaymentCard from './PaymentCard';
import AddPaymentCard from './AddPaymentCard';
import './UserProfile.css';
import { US_STATES } from '../../utils/States';

import useUserData from '../../hooks/useUserData';

export default function UserProfile() {
    const PASSWORD_REGEX = useMemo(() => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{10,32}$/, []);
    // We will need state react hook for all fields that can be changed
    // States basically declares a variable and its setter function
    // const [VARIABLE_NAME, FUNCTION_TO_CHANGE_VARIABLE'S_VALUE] = useState(DEFAULT_VALUES)
    // Every time a state is changed by its setter function, react rerenders (updates) the component visually

    // Page Loading state - needed because you want to get the user first before loading the rest of the page
    const [loading, setLoading] = useState(true);

    // Initialize names variable and it setter, and its default values (for the name change section)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatarLink, setAvatarLink] = useState('');
    const [emailPromoStatus, setEmailPromoStatus] = useState('');

    const [hasAddress, setHasAddress] = useState(false);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const [passwordsMatch, setPasswordsMatch] = useState(true);

    // TODO : Intialize payment cards
    const [userPaymentCards, setUserPaymentCards] = useState([]);

    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

    // Forces reload due to modal usage
    const [reload, setReload] = useState(0);

    const { userData } = useUserData();
    const axiosPrivate = useAxiosPrivate();

    const clearAddressStates = () => {
        setHasAddress(false);
        setStreet('');
        setCity('');
        setState('');
        setZipCode('');
    }

    const setAddressStates = (address) => {
        setHasAddress(true);
        setStreet(address.street);
        setCity(address.city);
        setState(address.state);
        if (address.zipCode) {
            setZipCode(address.zipCode);
        } else {
            setZipCode(address.zip_code);
        }
    }

    const clearPasswordStates = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    }

    const addNewPaymentHandler = () => setShowAddPaymentModal(true);
    const closeAddNewPaymentHandler = () => setShowAddPaymentModal(false);

    const fetchPaymentCards = async () => {
        try {
            const cardsResponse = await axiosPrivate.get(`payment-cards/get-all/${userData.user.id}/`);
            if (cardsResponse.data) {
                setUserPaymentCards(cardsResponse.data);
            } else {
                setUserPaymentCards([]);
            }
        } catch (error) {
            console.error('Error fetching payment cards:', error);
        }
    };

    // useEffect hook is generally used to run code before the component load, or every time a state is changed
    // Gets the user from database before rendering component
    useEffect(() => {
        // An async function allows the await keyword to be used within the function
        // Needed because you want to wait for a response from the database before running the rest of the function
        const getUserData = async () => {
            try {
                // Study routes from routes/user.js
                // This route will obtain a user object by running a getUser function that calls the database (see: UsersControllers.js)
                // response is a JSON file, returning a response object that has a data, status, etc field.
                // In this GET function, response will contain a user object from the getUser function.
                const response = await axiosPrivate.get(`/users/${userData.user.id}`);
                // After receiving a response, extract user object from the response's .data and set it to the user variable
                const foundUser = response.data

                // Populate fields
                if (foundUser.email_promo_status_id === 1) {
                    setEmailPromoStatus(true);
                } else {
                    setEmailPromoStatus(false);
                }
                setFirstName(foundUser.first_name);
                setLastName(foundUser.last_name);
                setAvatarLink(foundUser.avatar_link);
                if (foundUser.userAddress) {
                    setHasAddress(true);
                    setStreet(foundUser.userAddress.street);
                    setCity(foundUser.userAddress.city);
                    setState(foundUser.userAddress.state);
                    setZipCode(foundUser.userAddress.zip_code);
                    setEmailPromoStatus(foundUser.email_promo_status_id);
                }
            } catch (error) {
                console.error("Client: Error fetching user data. " + error);
                //handle error
                return;
            } finally {
                setLoading(false);
            }
        };

        getUserData();
        fetchPaymentCards();

        // eslint-disable-next-line
    }, []); // <-- This useEffect has an empty dependency array [], which means it runs only once.
    // Otherwise setUser will rerender the component and call this useEffect again, causing an infinite loop.

    useEffect(() => {
        setPasswordsMatch(newPassword === confirmNewPassword);
    }, [newPassword, confirmNewPassword]);

    if (loading) {
        return <div> Loading user data... </div>;
    }

    const emailPromoStatusChangeHandler = async (event) => {
        event.preventDefault();
        const updatedStatus = emailPromoStatus === 1 ? 2 : 1; // Toggle between 1 and 2
        const requestBody = { emailPromoStatus: updatedStatus };
    
        try {
            const response = await axiosPrivate.patch(`users/${userData.user.id}`, requestBody);
            if (response.status === 200) {
                alert("Email promo status successfully changed!");
                setEmailPromoStatus(updatedStatus); // Update state to reflect change
            } else {
                alert("Error changing email promo status.");
            }
        } catch (error) {
            console.error('Failed to update user', error);
            alert("Error changing email promo status.");
        }
    };

    // Submit name change to database. Attached to the "Change Name" button.
    const nameChangeHandler = async (event) => {
        event.preventDefault();
        if (window.confirm("Are you sure you want to change your name?")) {
            const requestBody = { firstName, lastName };

            try {
                const response = await axiosPrivate.patch(`users/${userData.user.id}`, requestBody);
                if (response.status === 200) alert("Name succesfully changed!");
                else alert("Error changing name.");
            } catch (error) {
                console.error('Failed to update user', error);
                alert("Error changing name.");
            }
        }
    }

    const avatarChangeHandler = async (event) => {
        event.preventDefault();
        const requestBody = { avatarLink };
        try {
            const response = await axiosPrivate.patch(`users/${userData.user.id}`, requestBody);
            if (response.status === 200) alert("Avatar succesfully updated!");
            else alert("Error updating avatar");
        } catch (error) {
            console.error('Failed to change avatar', error);
            alert("Error updating avatar");
        }
    }

    const addAddressHandler = async (event) => {
        event.preventDefault();
        const requestBody = { street, city, state, zipCode };

        try {
            const response = await axiosPrivate.post(`addresses/${userData.user.id}`, requestBody);
            if (response === 200) {
                setHasAddress(true);
                alert("Address successfully added.");
            } else {
                alert("Failed to add address. Please try again");
            }
        } catch (error) {
            console.error('Failed to add address', error);
        }
    }

    const updateAddressHandler = async (event) => {
        event.preventDefault();
        if (window.confirm("Are you sure you want to change your address?")) {
            const requestBody = { street, city, state, zipCode };

            try {
                const response = await axiosPrivate.patch(`addresses/${userData.user.id}`, requestBody);
                if (response.status === 200) {
                    setAddressStates(response.data);
                    alert("Address changed successfully")
                } else {
                    alert("Failed to update the address. Please try again")
                }
            } catch (error) {
                console.error("Error updating address: ", error);
                alert("An error occured while updating the address.");
            }
        }
    }

    const deleteAddressHandler = async (event) => {
        event.preventDefault();

        if (window.confirm("Are you sure you want to delete your address?")) {
            try {
                const response = await axiosPrivate.delete(`addresses/${userData.user.id}`);
                if (response.status === 200) {
                    clearAddressStates();
                    alert("Address successfully deleted.");
                } else {
                    alert("Failed to delete address. Please try again.")
                }
            } catch (error) {
                console.error('Error deleting address:', error);
                alert("An error occured while deleting the address.")
            }
        }
    }

    const deletePaymentCardHandler = async (cardId) => {
        if (window.confirm("Are you sure you want to delete this card?")) {
            try {
                const response = await axiosPrivate.delete(`/payment-cards/${cardId}`);

                if (response.status === 200) {
                    const cardsResponse = await axiosPrivate.get(`payment-cards/get-all/${userData.user.id}/`);
                    if (cardsResponse.data) {
                        setUserPaymentCards(cardsResponse.data);
                    } else {
                        setUserPaymentCards([]);
                    }
                }

            } catch (error) {
                console.error('Error deleting card:', error);
            }
        }
    };

    const changePasswordHandler = async (event) => {
        event.preventDefault();

        if (window.confirm("Are you sure you want to change your password?")) {
            const requestBody = { currentPassword, newPassword };

            if (!PASSWORD_REGEX.test(newPassword)) {
                alert("Password must be at 10 to 32 characters long and contain at least one uppercase letter, one lowercase letter, one number, and 1 special character");
                clearPasswordStates();
                return;
            }

            try {
                const response = await axiosPrivate.patch(`users/update-password/${userData.user.id}`, requestBody);
                if (response.status === 201) {
                    alert("Password changed successfully");
                } else if (response.status === 401) {
                    alert("Current password is incorrect. Please try again");
                } else {
                    alert("Failed to update password. Please try again");
                }
            } catch (error) {
                console.error('Failed to update user', error);
            } finally {
                clearPasswordStates();
            }
        }
    }
    

    const forceReload = () => {
        setReload(prevReload => prevReload + 1);
    }

    return (
        <div className="userprofile-body">
            <NavBar />
            <h1 className="neon" data-text="U">US<span className="neon-flicker-slow">ER</span>  S<span className="neon-flicker-fast">ET</span>TINGS</h1>
            <Container className="mt-5 pt-5" >

                {/* Avatar Section */}
                <div className="d-flex flex-column align-items-center mb-5">
                    <Image src={avatarLink} roundedCircle style={{ width: '150px', height: '150px', border: '3px solid #fff', boxShadow: '0 4px 8px rgba(0,0,0,.05)', zIndex: "5" }} />
                    {userData.user && (
                        <>
                            <h2 className="mt-3">Welcome, {userData.user.first_name}!</h2>
                            <h3 className="text-white-50"><i>{userData.user.email}</i></h3>
                        </>
                    )}
                </div>

                {/* Name Section */}
                <div className="my-4 mb-5 user-profile-container">
                    <h3 className="mb-5"><i className="material-icons align-middle me-2">face</i>Change Name</h3>

                    <Form onSubmit={nameChangeHandler}>
                        <div className="d-flex justify-content-between">
                            <Form.Group className="me-2 flex-grow-1 mb-3">
                                <FloatingLabel className="mb-3" label="First Name" controlId="formFirstName">
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={firstName}
                                        onChange={(event) => setFirstName(event.target.value)} // When anything is typed into the field, update the first name state
                                        required
                                    />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="flex-grow-1 mb-3">
                                <FloatingLabel className="mb-3" label="Last Name" controlId="formLastName">
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={lastName}
                                        onChange={(event) => setLastName(event.target.value)}
                                        required
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </div>
                        <Button variant="primary" type="submit">Change Name</Button>
                    </Form>
                    <Form className="mt-5" onSubmit={avatarChangeHandler}>
                        <Form.Group className="flex-grow-1 mb-3">
                            <FloatingLabel className="mb-3" label="Avatar (Image URL)" controlId="formAvatar">
                                <Form.Control
                                    type="text"
                                    name="avatarLink"
                                    value={avatarLink}
                                    onChange={(event) => setAvatarLink(event.target.value)}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Button variant="primary" type="submit">Set Avatar</Button>
                    </Form>

                </div>

                {/* Address Section */}
                <div className="mb-5 user-profile-container">
                    <h3 className="mb-5"><i className="material-icons align-middle me-2">home</i>{hasAddress ? "Change Address" : "Add Address"}</h3>
                    <Form onSubmit={(event) => hasAddress ? updateAddressHandler(event) : addAddressHandler(event)}>
                        <Form.Group className="mb-3">
                            <FloatingLabel className="mb-3" label="Street" controlId="formStreet">
                                <Form.Control
                                    type="text"
                                    name="street"
                                    placeholder="Street"
                                    value={street}
                                    onChange={(event) => setStreet(event.target.value)}
                                    required
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                            <Form.Group className="me-2 flex-grow-1 mb-3">
                                <FloatingLabel className="mb-3" label="City" controlId="formCity">
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={city}
                                        onChange={(event) => setCity(event.target.value)}
                                        required
                                    />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="me-2 flex-grow-1 mb-3">
                                <FloatingLabel className="mb-3" label="State" controlId="formState">
                                    <Form.Select
                                        name="state"
                                        placeholder={state ? null : "State"}
                                        value={state}
                                        onChange={(event) => setState(event.target.value)}
                                        required
                                    >
                                        {!state && <option value=""></option>}
                                        {US_STATES.map(state => (
                                            <option key={state.value} value={state.value}>{state.label}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="flex-grow-1 mb-3">
                                <FloatingLabel className="mb-3" label="Zip Code" controlId="formZipCode">
                                    <Form.Control
                                        type="number"
                                        name="zipCode"
                                        placeholder="Zip Code"
                                        value={zipCode}
                                        onChange={(event) => setZipCode(event.target.value)}
                                        required
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </div>
                        {/* Differentiate buttons depending if the user has an address or not for POST/PATCH */}
                        <div>
                            {hasAddress ? (
                                <>
                                    <Button variant="primary" type="submit" className="me-3">Change Address</Button>
                                    <Button variant="danger" onClick={deleteAddressHandler}>Delete Address</Button>
                                </>
                            ) : (
                                <Button variant="primary" disabled={!street || !city || !state || !zipCode} type="submit">Add Address</Button>
                            )}
                        </div>
                    </Form>
                </div>

                {/*Payment Information*/}
                <div className="mb-5 user-profile-container">
                    <h3 className="mb-5"><i className="material-icons align-middle me-2">payment</i>Manage Payment Information</h3>
                    <Container>
                        {userPaymentCards.length > 0 ? (
                            <Row>
                                {userPaymentCards.map((card) => (
                                    <Col key={card.paymentCard.id}>
                                        <PaymentCard
                                            cardNumber={card.paymentCard.card_number}
                                            firstName={card.paymentCard.first_name}
                                            lastName={card.paymentCard.last_name}
                                            expirationDate={card.paymentCard.expiration_date}
                                            deletePaymentCardHandler={() => deletePaymentCardHandler(card.paymentCard.id)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <p className="text-white">You currently have no added payment cards.</p>
                        )}
                    </Container>
                    {userPaymentCards.length <= 2 ? (
                        <Button variant="primary" onClick={addNewPaymentHandler}>Add New Payment Card</Button>
                    ) : null}
                    <AddPaymentCard
                        show={showAddPaymentModal}
                        handleClose={closeAddNewPaymentHandler}
                        userId={userData.user.id}
                        forceReload={forceReload}
                        updatePaymentCardsHandler={fetchPaymentCards} />
                </div>

                {/* TODO : When attemping to change password, only allow 3 attempts to get the current password right until account is suspended.
                           After account is suspended, send email verification to reverify and unsuspend account. */}
                <div className="user-profile-container">
                    <h3 className="mb-5"><i className="material-icons align-middle me-2">lock</i>Change Password</h3>
                    <div className="d-flex justify-content-between">
                        <Form.Group className="me-2 flex-grow-1 mb-3">
                            <FloatingLabel className="mb-3" label="Current Password" controlId="formCurrentPassword">
                                <Form.Control
                                    type={showCurrentPassword ? "text" : "password"}
                                    name="currentPassword"
                                    placeholder='Current Password'
                                    value={currentPassword}
                                    onChange={(event) => setCurrentPassword(event.target.value)}
                                    autoComplete='off'
                                    required
                                />
                                <Button
                                    onMouseEnter={() => setShowCurrentPassword(true)}
                                    onMouseLeave={() => setShowCurrentPassword(false)}
                                    variant="outline-secondary"
                                    className="ms-2"
                                >
                                    Show
                                </Button>
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="flex-grow-1 mb-3">
                            <FloatingLabel className="mb-3" label="New Password" controlId="formNewPassword">
                                <Form.Control
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    placeholder='New Password'
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    autoComplete='off'
                                    required
                                    className={newPassword && passwordsMatch ? "is-valid" : newPassword ? "is-invalid" : ""}
                                />
                                <Button
                                    onMouseEnter={() => setShowNewPassword(true)}
                                    onMouseLeave={() => setShowNewPassword(false)}
                                    variant="outline-secondary"
                                    className="ms-2"
                                >
                                    Show
                                </Button>
                            </FloatingLabel>
                        </Form.Group>
                    </div>
                    <Form.Group className="mb-3">
                        <FloatingLabel className="mb-3" label="Confirm New Password" controlId="formConfirmNewPassword">
                            <Form.Control
                                type={showConfirmNewPassword ? "text" : "password"}
                                name="confirmNewPassword"
                                placeholder='Confirm New Password'
                                value={confirmNewPassword}
                                onChange={(event) => setConfirmNewPassword(event.target.value)}
                                autoComplete='off'
                                required
                                className={confirmNewPassword && passwordsMatch ? "is-valid" : confirmNewPassword ? "is-invalid" : ""}
                            />
                            <Button
                                onMouseEnter={() => setShowConfirmNewPassword(true)}
                                onMouseLeave={() => setShowConfirmNewPassword(false)}
                                variant="outline-secondary"
                                className="ms-2"
                            >
                                Show
                            </Button>
                        </FloatingLabel>
                    </Form.Group>
                    <Button
                        variant="primary"
                        disabled={!currentPassword || !newPassword || !confirmNewPassword || !passwordsMatch}
                        onClick={changePasswordHandler}
                    >
                        Change Password
                    </Button>
                </div>
                    {/* Promotions Section */}
                    <div className="user-profile-container mt-5 text-white" style={{ width: '400px', margin: 'auto' }}>
                        <h3 className="mb-5"><i className="material-icons align-middle me-2">campaign</i>Subscribe to Promotions</h3>

                        <Form onSubmit={emailPromoStatusChangeHandler}>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check 
                                    type="checkbox" 
                                    label="Promotional Emails" 
                                    checked={emailPromoStatus === 1}
                                    onChange={(event) => setEmailPromoStatus(event.target.checked ? 1 : 2)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">Update Preferences</Button>
                        </Form>
                    </div>
            </Container>
        </div>
    );
}