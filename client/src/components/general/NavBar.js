import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';

import AuthenticationModal from '../account/AuthenticationModal';
import SearchBar from './SearchBar';
import "./NavBar.css";

import useLogout from '../../hooks/useLogout';
import useUserData from '../../hooks/useUserData';

export default function NavBar() {

    const [isAtTop, setIsAtTop] = useState(true);

    const authenticationModalRef = useRef();
    const logout = useLogout();
    const navigate = useNavigate();
    const { userData } = useUserData();

    const showSignupViewHandler = () => {
        authenticationModalRef.current.showSignupViewHandler();
    }

    const showLoginViewHandler = () => {
        authenticationModalRef.current.showLoginViewHandler();
    }

    // Solid color on top, trigger opacity when scrolling down
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsAtTop(scrollTop === 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const signOut = async () => {
        await logout();
        navigate("/home");
    }

    return (
        <Navbar className="navbar-dark text-white" bg="black" expand="lg" fixed="top" style={{ opacity: isAtTop ? 1 : 0.7 }}>
            <Container>
                <div className="logo-sign" onClick={() => navigate('/home')}>
                    <span className="fast-flicker">S</span>tar<span className="flicker">G</span>azer
                </div>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto d-flex gap-3">
                        {userData.loggedIn && userData.clearance <= 1 ?
                            <Nav.Link href="/admin-panel">Admin Panel</Nav.Link>
                            : null}
                    </Nav>

                    {/* TODO : Disable search bar when in checkout process */}
                    <SearchBar />

                    <div className="ms-auto d-flex gap-3">
                        {!userData.loggedIn ?
                            <>
                                <Button variant="primary" onClick={showSignupViewHandler}>Sign up</Button>
                                <Button variant="primary" onClick={showLoginViewHandler}>Login</Button>
                            </>
                            : null}
                        {userData.loggedIn ?
                            <NavDropdown
                                title={
                                    <img
                                        src={userData.user.avatar_link}
                                        style={{ width: '3vh', height: '3vh', borderRadius: '50%', border: '0.2rem solid black' }}
                                        alt="User Avatar"
                                    />
                                }
                                id="basic-nav-dropdown"
                            >
                                <NavDropdown.Item href="/user-profile">User Settings</NavDropdown.Item>
                                <NavDropdown.Item href="/booking-history">Booking History</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={signOut}>Logout</NavDropdown.Item>
                            </NavDropdown>
                            : null}
                    </div>
                </Navbar.Collapse>
            </Container>
            <AuthenticationModal ref={authenticationModalRef} />
        </Navbar>
    );
}