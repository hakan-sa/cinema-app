import React, { useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Modal, Button, Form, FloatingLabel, Collapse, Image, Row, Col } from 'react-bootstrap';

export default function ManageUsersModal({ manageManageUsersViews, setManageManageUsersViews }) {
    const [searchType, setSearchType] = useState('email');
    const [searchInput, setSearchInput] = useState('');
    const [showSearchForm, setShowSearchForm] = useState(true);

    const [userId, setUserId] = useState('');
    const [userStatusId, setUserStatusId] = useState('');
    const [avatarLink, setAvatarLink] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [clearanceId, setClearanceId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const axiosPrivate = useAxiosPrivate();

    const closeHandler = () => {
        setManageManageUsersViews(prevContext => ({
            ...prevContext,
            showManageUsersModal: false
        }));
    };

    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
        setSearchInput(''); // Clear search when type is changed
    };

    const submitHandler = (event) => {
        //event.preventDefault();
    };

    const searchHandler = async (event) => {
        event.preventDefault();
        if (searchType === 'email') {
            await fetchUserByEmailHandler(event);
        } else if (searchType === 'id') {
            await fetchUserByIdHandler();
        }
    };

    const fetchUserByIdHandler = async () => {
        try {
            const response = await axiosPrivate.get(`/users/${searchInput}`);
            const foundUser = response.data;
            setUserId(foundUser.id);
            setAvatarLink(foundUser.avatar_link);
            setFirstName(foundUser.first_name);
            setLastName(foundUser.last_name);
            setPhoneNumber(foundUser.phone_number);
            setEmail(foundUser.email);
            setUserStatusId(foundUser.status_id);
            setClearanceId(foundUser.clearance_id);
            setShowSearchForm(false);
        } catch (error) {
            setUserId(null);
            alert(`User with the ID: ${searchInput} not found. Please try again.`);
            console.error("Client: Error fetching user by ID: ", error);
            setShowSearchForm(true);
        }
    };

    const fetchUserByEmailHandler = async () => {
        try {
            const response = await axiosPrivate.get(`/users/email/${searchInput}`);
            const foundUser = response.data;
            setUserId(foundUser.id);
            setAvatarLink(foundUser.avatar_link);
            setFirstName(foundUser.first_name);
            setLastName(foundUser.last_name);
            setPhoneNumber(foundUser.phone_number);
            setEmail(foundUser.email);
            setUserStatusId(foundUser.status_id);
            setClearanceId(foundUser.clearance_id);
            setShowSearchForm(false);
        } catch (error) {
            setUserId(null);
            alert(`User with the email: ${searchInput} not found. Please try again.`);
            console.error("Client: Error fetching user by email: ", error);
            setShowSearchForm(true);
        }
    };

    const updateUserStatus = async () => {
        const requestBody = {
            status: userStatusId
        }

        try {
            await axiosPrivate.patch(`/users/${userId}`, requestBody);
            alert("Changed user's status to: " + userStatusId);
        } catch (error) {
            console.error("Client: Failed to update user's status", error);
        }
    }

    const updateUserClearance = async () => {
        const requestBody = {
            clearanceId: clearanceId
        }

        try {
            await axiosPrivate.patch(`/users/${userId}`, requestBody);
            alert("User clearance level set to: " + clearanceId);
        } catch (error) {
            console.error("Client: Failed to update user clearance", error);
        }
    }

    return (
        <Modal data-bs-theme="dark" className="text-white emailpromos-modal" show={manageManageUsersViews.showManageUsersModal} onHide={closeHandler} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Manage Users</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3">
                <h5 className='toggle-header' onClick={() => setShowSearchForm(!showSearchForm)}>
                    Search User
                    <span className="material-icons">
                        {showSearchForm ? 'expand_less' : 'expand_more'}
                    </span>
                </h5>
                <Collapse in={showSearchForm}>
                    <div>
                        <Form onSubmit={searchHandler}>
                            <div className="mb-3">
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Email"
                                    name="searchType"
                                    value="email"
                                    checked={searchType === 'email'}
                                    onChange={handleSearchTypeChange}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="User ID"
                                    name="searchType"
                                    value="id"
                                    checked={searchType === 'id'}
                                    onChange={handleSearchTypeChange}
                                />
                            </div>
                            <FloatingLabel className="mb-3" label={`Search by ${searchType === 'email' ? 'Email' : 'ID'}`} controlId="formSearchInput">
                                <Form.Control
                                    type={searchType === 'email' ? 'email' : 'text'}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder={searchType === 'email' ? 'Enter email' : 'Enter ID'}
                                />
                                <Form.Text className="text-muted">
                                    {searchType === 'email' ? 'Enter the user\'s exact email to load their information.' : 'Enter the user ID to load their information.'}
                                </Form.Text>
                            </FloatingLabel>
                            <Button variant="primary" type="submit">
                                Search
                            </Button>
                        </Form>
                    </div>
                </Collapse>
            </Modal.Body>
            <Modal.Body className="p-3">
                {userId && (
                    <Row>
                        {/* Left Column for User Information */}
                        <Col md={6} className="user-info-column">
                            <div className="text-center p-3" style={{ border: '2px solid #fff' }}>
                                <Image className="mb-5 mt-5" src={avatarLink} roundedCircle style={{ width: '150px', height: '150px', border: '3px solid #fff', boxShadow: '0 4px 8px rgba(0,0,0,.05)', zIndex: "5" }} />
                                <h4 className="bold">{firstName} {lastName}</h4>
                                <hr/>
                                <p>User ID: {userId}</p>
                                <p>Email: {email}</p>
                                <p>Phone Number: {phoneNumber}</p>
                            </div>
                        </Col>

                        {/* Right Column for Forms */}
                        <Col md={6} className="d-flex align-items-center justify-content-center">
                            <div>
                                <Form>
                                    <Form.Group controlId="userStatusSelect">
                                        <Form.Label>User Status:</Form.Label>
                                        <Form.Control as="select" value={userStatusId} onChange={event => setUserStatusId(event.target.value)}>
                                            <option value="1">1: Active</option>
                                            <option value="2">2: Inactive</option>
                                            <option value="3">3: Suspended</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Button variant="primary" onClick={updateUserStatus}>Change Status</Button>
                                </Form>

                                <Form>
                                    <Form.Group controlId="userPermissionsSelect">
                                        <Form.Label>User Permissions:</Form.Label>
                                        <Form.Control as="select" value={clearanceId} onChange={event => setClearanceId(event.target.value)}>
                                            <option value="1">1: Admin</option>
                                            <option value="2">2: Customer</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Button variant="primary" onClick={updateUserClearance}>Change Clearance</Button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={closeHandler}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
