import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Row } from 'react-bootstrap';
import './OrderConfirmation.css';

import useUserData from "../../hooks/useUserData";
import WarpSpeed from '../general/WarpSpeed';

import NavBar from "../general/NavBar";
import TicketStub from './TicketStub';
import { sendEmail } from "../../utils/Email";

export default function OrderConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    const sentEmail = useRef(false);

    const { ticketStubs, totalTicketPrice, movie, adultTicketPrice, childTicketPrice, seniorTicketPrice, bookingId, adultTickets, childTickets, seniorTickets } = location.state || {};

    const { userData } = useUserData();

    useEffect(() => {
        if (!location.state || !movie || !ticketStubs) navigate('/home');
    }, [navigate, location.state, movie, ticketStubs]);

    const sendOrderConfirmationEmail = () => {
        const to = userData.user.email;
        const subject = 'Stargazer - Order Confirmation';
        let text = "Thank you for your order. Your booking (id: " + bookingId + ") has been confirmed.\nMovie: " + movie.title + "\n";
        if (adultTickets > 0) text += "Adult Tickets: " + adultTickets + " x $" + adultTicketPrice + "\n";
        if (childTickets > 0) text += "Child Tickets: " + childTickets + " x $" + childTicketPrice + "\n";
        if (seniorTickets > 0) text += "Senior Tickets: " + seniorTickets + " x $" + seniorTicketPrice + "\n"
        text += "Total Price: $" + totalTicketPrice;

        sendEmail(to, subject, text);
    }

    useEffect(() => {
        if (!sentEmail.current) {
            sendOrderConfirmationEmail();
            sentEmail.current = true;
        }
    }, [sendOrderConfirmationEmail]);

    const returnHomeHandler = (event) => {
        event.preventDefault();
        navigate('/home');
    }

    const viewBookingHistoryHandler = (event) => {
        event.preventDefault();
        navigate('/booking-history');
    }

    return (
        <div className="order-confirmation-container">

            <NavBar />
            <WarpSpeed speedMultiplier={0.0001} />
            <h1>Booking Confirmation</h1>
            <hr />
            <Container>
                <h5>Booking Successful!</h5>
                <Row className="justify-content-center">
                    {ticketStubs?.map((stub, index) => (
                        <TicketStub key={index} show={stub.show} type={stub.type} movie={stub.movie} price={stub.price} />
                    ))}
                </Row>
                <h3>Total Price: ${totalTicketPrice}.00</h3>
                <h3>An order confirmation has been sent to your email</h3>
                <div className="mt-4">
                    <Button variant="primary" onClick={returnHomeHandler}>Home</Button>
                    <Button variant="primary" onClick={viewBookingHistoryHandler}>Booking History</Button>
                </div>
            </Container>
        </div>
    );
}
