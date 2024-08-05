import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { Button, Container, Form, InputGroup, Row, Col } from 'react-bootstrap';
import './TicketSelection.css';
import WarpSpeed from '../general/WarpSpeed';

import NavBar from '../general/NavBar';

export default function TicketSelection() {
    const location = useLocation();
    const navigate = useNavigate();

    const selectedSeatsIds = location.state?.selectedSeatIds || [];
    const movie = location.state?.movie || '';
    const show = location.state?.show || '';

    const [adultTickets, setAdultTickets] = useState(0);
    const [childTickets, setChildTickets] = useState(0);
    const [seniorTickets, setSeniorTickets] = useState(0);
    const [ticketsRemaining, setTicketsRemaining] = useState(selectedSeatsIds.length);

    const [adultTicketPrice, setAdultTicketPrice] = useState(0);
    const [childTicketPrice, setChildTicketPrice] = useState(0);
    const [seniorTicketPrice, setSeniorTicketPrice] = useState(0);
    const [totalTicketPrice, setTotalTicketPrice] = useState(0);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (!location.state || !movie || !location.state?.selectedSeatIds) {
            navigate('/home');
        }

        const fetchTicketPrices = async () => {
            try {
                const response = await axiosPrivate.get('/bookings/ticket-prices');
                response.data.forEach(ticket => {
                    const price = parseFloat(ticket.price);
                    if (ticket.type_name === 'Adult') setAdultTicketPrice(price);
                    if (ticket.type_name === 'Child') setChildTicketPrice(price);
                    if (ticket.type_name === 'Senior') setSeniorTicketPrice(price);
                });
            } catch (error) {
                console.error('Error fetching ticket prices:', error.message);
            }
        };
        fetchTicketPrices();
    }, []);

    useEffect(() => {
        const calculateTotalTicketPrice = () => {
            const total = adultTickets * adultTicketPrice +
                childTickets * childTicketPrice +
                seniorTickets * seniorTicketPrice;
            setTotalTicketPrice(total);
        };
        calculateTotalTicketPrice();
    }, [adultTickets, childTickets, seniorTickets, adultTicketPrice, childTicketPrice, seniorTicketPrice]);

    const ticketChangeHandler = (type, value) => {
        const newValue = Math.max(0, parseInt(value, 10) || 0);

        const newTickets = {
            Adult: type === "Adult" ? newValue : adultTickets,
            Child: type === "Child" ? newValue : childTickets,
            Senior: type === "Senior" ? newValue : seniorTickets
        };

        const totalTickets = newTickets.Adult + newTickets.Child + newTickets.Senior; // Sum the values

        if (totalTickets <= selectedSeatsIds.length) {
            if (type === "Adult") setAdultTickets(newValue);
            if (type === "Child") setChildTickets(newValue);
            if (type === "Senior") setSeniorTickets(newValue);

            setTicketsRemaining(selectedSeatsIds.length - totalTickets); // Update remaining tickets
        }
    };

    const validateTicketsAmount = () => {
        const totalTickets = adultTickets + childTickets + seniorTickets;
        return totalTickets === selectedSeatsIds.length;
    };

    const continueHandler = (event) => {
        event.preventDefault();
        const titleSlug = movie.title?.toLowerCase().replace(/ /g, '-') || '';
        if (validateTicketsAmount()) {
            navigate(`/movie/${titleSlug}/summary`, {
                state: {
                    movie,
                    show,
                    selectedSeatsIds,
                    adultTickets,
                    childTickets,
                    seniorTickets,
                    adultTicketPrice,
                    childTicketPrice,
                    seniorTicketPrice,
                    totalTicketPrice
                }
            });
        } else {
            alert('Total ticket quantities must match the number of selected seats.');
        }
    };

    const cancelHandler = (event) => {
        event.preventDefault();
        const titleSlug = movie.title.toLowerCase().replace(/ /g, '-');
        if (window.confirm("Are you sure you want to cancel your booking?")) {
            // Clear seat selection in DB
            navigate(`/movie/${titleSlug}`, {
                state: {
                    id: movie.id
                }
            });
        }
    }

    return (
        <div className="ticket-selection-page">
            <NavBar />
            <WarpSpeed speedMultiplier={0.0001} />
            <h1>Select Tickets</h1>
            <hr/>
            <Container className="ticket-selection-container ">
                <h3>{movie.title}</h3>
                <h4>Tickets Remaining: {ticketsRemaining}</h4>
                {/* Adult Tickets */}
                <Row className="mb-3">
                    <Form.Label className="ticket-type-label" column sm="5">
                        Adult (${adultTicketPrice.toFixed(2)})
                    </Form.Label>
                    <Col>
                        <InputGroup className="ticket-input">
                            <Form.Control
                                type="number"
                                value={adultTickets}
                                onChange={e => ticketChangeHandler('Adult', e.target.value)}
                                min="0"
                                maxLength="3"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                {/* Child Tickets */}
                <Row className="mb-3">
                    <Form.Label className="ticket-type-label" column sm="5">
                        Child (${childTicketPrice.toFixed(2)})
                    </Form.Label>
                    <Col>
                        <InputGroup className="ticket-input">
                            <Form.Control
                                type="number"
                                value={childTickets}
                                onChange={e => ticketChangeHandler('Child', e.target.value)}
                                min="0"
                                maxLength="3"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                {/* Senior Tickets */}
                <Row className="mb-3">
                    <Form.Label className="ticket-type-label"  column sm="5">
                        Senior (${seniorTicketPrice.toFixed(2)})
                    </Form.Label>
                    <Col>
                        <InputGroup className="ticket-input"> 
                            <Form.Control
                                type="number"
                                value={seniorTickets}
                                onChange={e => ticketChangeHandler('Senior', e.target.value)}
                                min="0"
                                maxLength="3"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <h4>Total Price: ${totalTicketPrice.toFixed(2)}</h4>
                <Button className="btn btn-danger" onClick={cancelHandler}>Cancel Booking</Button>
                <Button variant="primary" onClick={continueHandler}>Continue Booking</Button>
            </Container>
        </div>
    );
}
