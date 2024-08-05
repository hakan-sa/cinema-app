import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useUserData from '../../hooks/useUserData';
import './OrderSummary.css';
import WarpSpeed from '../general/WarpSpeed';
import PaymentCard from '../account/PaymentCard';
import AddPaymentCard from '../account/AddPaymentCard';
import LoadingScreen from '../general/LoadingScreen';
import TicketStub from './TicketStub';

import NavBar from '../general/NavBar';

export default function OrderSummary() {

    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const movie = (location.state && location.state.movie) || '';
    const show = (location.state && location.state.show) || '';
    const selectedSeatsIds = (location.state && location.state.selectedSeatsIds) || '';
    const adultTickets = (location.state && location.state.adultTickets) || '';
    const childTickets = (location.state && location.state.childTickets) || '';
    const seniorTickets = (location.state && location.state.seniorTickets) || '';
    const adultTicketPrice = (location.state && location.state.adultTicketPrice) || '';
    const childTicketPrice = (location.state && location.state.childTicketPrice) || '';
    const seniorTicketPrice = (location.state && location.state.seniorTicketPrice) || '';
    const [totalTicketPrice, setTotalTicketPrice] = useState(location.state ? location.state.totalTicketPrice : 0);
    const [userPaymentCards, setUserPaymentCards] = useState([]);
    const [selectedPaymentCard, setSelectedPaymentCard] = useState('');
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
    const [reload, setReload] = useState(0);
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');
    const [promoDiscount, setPromoDiscount] = useState(0);
    const { userData } = useUserData();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (!location.state || !movie || !selectedSeatsIds || !totalTicketPrice) {
            console.error("Some required state variables are missing:", {
                movie,
                selectedSeatsIds,
                adultTickets,
                childTickets,
                seniorTickets,
                totalTicketPrice
            });
            navigate('/home');
        }

        const fetchPaymentCards = async() => {
            try {
                const cardsResponse = await axiosPrivate.get(`payment-cards/get-all/${userData.user.id}/`);
                if (cardsResponse.data) {
                    setUserPaymentCards(cardsResponse.data);
                    console.log(cardsResponse.data);
                } else {
                    setUserPaymentCards([]);
                }
            } catch (error) {
                console.log("Error fetching payment cards");
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentCards();
    }, [location.state]);

    
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

    const changeShowtimeHandler = (event) => {
        event.preventDefault();
        const titleSlug = movie.title.toLowerCase().replace(/ /g, '-');
        // Clear seat selection in DB
        navigate(`/movies/${titleSlug}/showtimes`, {
            state: {
                movie: movie
            }
        });
    }

    const changeSeatingHandler = (event) => {
        event.preventDefault();
        const titleSlug = movie.title.toLowerCase().replace(/ /g, '-');
        // Clear seat selection in DB
        navigate(`/movie/"${titleSlug}"/seating`, {
            state: {
                movie: movie
            }
        });
    }

    const changeTicketsHandler = (event) => {
        event.preventDefault();
        const titleSlug = movie.title.toLowerCase().replace(/ /g, '-');
        navigate(`/movie/${titleSlug}/tickets`, {
            state: {
                selectedSeatsIds: selectedSeatsIds,
                movie: movie
            }
        });
    }

    const handleCardSelection = (cardId) => {
        if (selectedPaymentCard === cardId) {
            setSelectedPaymentCard(''); // Deselect if it's already selected
        } else {
            setSelectedPaymentCard(cardId); // Select the card
        }
        console.log(selectedPaymentCard);
    };
    

    const buildNewBooking = () => {
        let newBooking = {
            userId: userData.user.id,
            totalPrice: totalTicketPrice,
            paymentCardId: selectedPaymentCard

        }
        return newBooking;
    }
    
    const buildNewTicket = (ticketPriceType, selectedSeatId, bookingId) => {
        //Sort ticketTypePrice here to its id

        let newTicket = {
            movieId: movie.id,
            userId: userData.user.id,
            bookingId: bookingId,
            showroomId: show.showroom_id,
            showTimeId: show.show_times_id,
            showDate: show.show_date,
            seatId: selectedSeatId,
            ticketPricesId: ticketPriceType,
            showId: show.id
        }
        return newTicket;
    }

    
    const confirmBookingHandler = async (event) => {
        event.preventDefault();
    
        // Create Booking
        const newBooking = buildNewBooking();
        console.log(newBooking);
    
        try {
            let bookingResponse = await axiosPrivate.post('/bookings', newBooking);
            if (bookingResponse.status === 201) {
                const bookingId = bookingResponse.data.id;
                // After booking, create tickets
                const ticketStubs = [];
                const ticketTypes = [];
    
                for (let i = 0; i < adultTickets; i++) {
                    ticketTypes.push({ type: "Adult", typeId: 1 });
                }
                for (let i = 0; i < childTickets; i++) {
                    ticketTypes.push({ type: "Child", typeId: 2 });
                }
                for (let i = 0; i < seniorTickets; i++) {
                    ticketTypes.push({ type: "Senior", typeId: 3 });
                }
    
                for (let i = 0; i < ticketTypes.length; i++) {
                    const ticketInfo = ticketTypes[i];
                    const selectedSeatId = selectedSeatsIds[i];
                    const newTicket = buildNewTicket(ticketInfo.typeId, selectedSeatId, bookingId);
                    await axiosPrivate.post('bookings/tickets', newTicket);
    
                    ticketStubs.push({
                        type: ticketInfo.type,
                        price: ticketInfo.typeId === 1 ? adultTicketPrice : ticketInfo.typeId === 2 ? childTicketPrice : seniorTicketPrice,
                        movie: movie,
                        show: show
                    });
    
                    // Mark seat as booked
                    await axiosPrivate.patch('/seats/book', { showId: show.id, seatId: selectedSeatId });
                }
    
                // Navigate to confirmation page with state
                const titleSlug = movie.title.toLowerCase().replace(/ /g, '-');
                navigate(`/movie/${titleSlug}/confirmation`, {
                    state: {
                        movie: movie,
                        ticketStubs: ticketStubs,
                        bookingId: bookingId,
                        totalTicketPrice: totalTicketPrice,
                        adultTicketPrice: adultTicketPrice,
                        childTicketPrice: childTicketPrice,
                        seniorTicketPrice: seniorTicketPrice,
                        totalTicketPrice: totalTicketPrice,
                        adultTickets: adultTickets,
                        childTickets: childTickets,
                        seniorTickets: seniorTickets
                    }
                });
            } 
        } catch (error) {
            console.error("Failed to add booking:", error);
            throw new Error("Failed to add booking. Status code: " + error);
        }
    };
    
    

    /*
    const confirmBookingHandler = async (event) => {
        event.preventDefault();

        // Create Booking
        const newBooking = buildNewBooking();
        console.log(newBooking);

        try {
            let bookingResponse = await axiosPrivate.post('/bookings', newBooking);
            if (bookingResponse.status == 201) {
                bookingId = bookingResponse.data.id;
                // After booking, create tickets







            } 
        } catch (error) {
            throw new Error("Failed to add booking. Status code: " + error);
        }

        if (movie.title) {
            const titleSlug = movie.title.toLowerCase().replace(/ /g, '-');
            navigate(`/movie/${titleSlug}/confirmation`, {
                state: {
                    movie: movie
                }
            });
        }
    };
*/

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

    const applyPromoCode = async () => {
        if (!promoCode) {
            setPromoError("Please enter a promo code.");
            return;
        }
        setPromoError('');
        try {
            const response = await axiosPrivate.post('bookings/apply-promo', { promoCode });
            if (response.status === 200) {
                setPromoDiscount(response.data.discount);
                alert(`Promo code applied successfully! Discount: $${response.data.discount}`);
                updateTotalPrice(response.data.discount);
            }
        } catch (error) {
            console.error('Failed to apply promo code:', error);
            setPromoError(error.response?.data?.message || 'Failed to apply promo code.');
        }
    };

    const updateTotalPrice = (discount) => {
        const discountedPrice = totalTicketPrice - discount;
        setTotalTicketPrice(discountedPrice >= 0 ? discountedPrice : 0);
    };

    const addNewPaymentHandler = () => setShowAddPaymentModal(true);
    const closeAddNewPaymentHandler = () => setShowAddPaymentModal(false);
    const forceReload = () => {
        setReload(prevReload => prevReload + 1);
        console.log(reload);
    }

    if (loading) {
        return <div className="loading-screen"><LoadingScreen speedMultiplier={0.015} /></div>;
    }

    return (
        <div className="order-summary-container">
            <NavBar />
            <WarpSpeed speedMultiplier={0.0001} />
            <h1>Order Summary</h1>
            <hr/>
            <Container>
                <Row>
                    <h3 className="mb-3">Purchasing {adultTickets + childTickets + seniorTickets} Tickets:</h3>
                    <Row className="justify-content-center">
                        {adultTickets > 0 && (
                            [...Array(adultTickets)].map((_, index) => (
                                <TicketStub key={index} show={show} type="Adult" movie={movie} price={adultTicketPrice} />
                            ))
                        )}
                        {childTickets > 0 && (
                            [...Array(childTickets)].map((_, index) => (
                                <TicketStub key={index} show={show} type="Child" movie={movie} price={childTicketPrice} />
                            ))
                        )}
                        {seniorTickets > 0 && (
                            [...Array(seniorTickets)].map((_, index) => (
                                <TicketStub key={index} show={show} type="Senior" movie={movie} price={seniorTicketPrice} />
                            ))
                        )}
                        <div className="m-2">
                            <h3> Total Price: ${totalTicketPrice}.00 {promoDiscount > 0 && ` (${promoCode} -$${promoDiscount} applied)`}   </h3>
                        </div>
                    </Row>

                    {/*Payment*/}
                    <div className="mb-5 user-profile-container">
                        <h3 className="mb-2"><i className="material-icons align-middle me-2">payment</i>Choose Payment Card</h3>
                        <Container>
                            {userPaymentCards.length > 0 ? (
                                <Row>
                                    {userPaymentCards.map((card) => (
                                        <Col key={card.paymentCard.id} className={`payment-card-container ${selectedPaymentCard === card.paymentCard.id ? 'selected' : ''}`}
                                            onClick={() => handleCardSelection(card.paymentCard.id)}>
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
                        <Button variant="primary" onClick={addNewPaymentHandler}>Add New Payment Card</Button>
                        <AddPaymentCard show={showAddPaymentModal} handleClose={closeAddNewPaymentHandler} userId={userData.user.id} forceReload={forceReload} />
                    </div>
                    {/* Promo Code Section */}
                    
                    <Row className="mb-5 user-profile-container" style={{ margin: "auto", width: "80%", justifyContent: "space-evenly" }}>
                        <Col md={6}>
                            <Form.Group controlId="promoCode">
                                <Form.Label>Promo Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter promo code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3} className="d-flex align-items-end">
                            <Button onClick={applyPromoCode}>Apply Promo</Button>
                        </Col>
                        {promoError && <Alert variant="danger">{promoError}</Alert>}
                    </Row>
                    <Row>
                    <Col><Button className="btn btn-danger" onClick={cancelHandler}>Cancel Booking</Button></Col>
                    <Col>
                    <Button variant="primary" onClick={confirmBookingHandler} disabled={!selectedPaymentCard}>Confirm Booking</Button>
                    </Col>
                    </Row>
                </Row>
            </Container>
        </div>
    );
}