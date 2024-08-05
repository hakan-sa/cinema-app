import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useUserData from '../../hooks/useUserData';
import WarpSpeed from '../general/WarpSpeed';
import NavBar from '../general/NavBar';
import TicketStub from '../checkout/TicketStub'; // Ensure this is imported correctly

function BookingHistory() {
    const [bookings, setBookings] = useState([]);
    const [ticketsByBooking, setTicketsByBooking] = useState({});
    const axiosPrivate = useAxiosPrivate();
    const { userData } = useUserData();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axiosPrivate.get(`/bookings/history/${userData.user.id}`);
                setBookings(response.data);
                response.data.forEach(booking => {
                    fetchTicketsForBooking(booking.id);
                });
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };
        fetchBookings();
    }, [userData.user.id, axiosPrivate]);

    const fetchTicketsForBooking = async (bookingId) => {
        try {
            const response = await axiosPrivate.get(`/bookings/tickets/${bookingId}`);
            setTicketsByBooking(prev => ({ ...prev, [bookingId]: response.data }));
        } catch (error) {
            console.error(`Error fetching tickets for booking ${bookingId}:`, error);
        }
    };

    return (
        <Container className="showtime-page-container mt-5">
            <NavBar/>
            <WarpSpeed speedMultiplier={0.0001} />
            <h1>Booking History</h1>
            <hr/>
            {bookings.length > 0 ? (
                bookings.map(booking => (
                    <div key={booking.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                        <p>Booking ID: {booking.id}</p>
                        <p>Total Price: ${booking.total_price.toFixed(2)}</p>
                        <p>Date: {new Date(booking.created_at).toLocaleDateString()}</p>
                        {ticketsByBooking[booking.id]?.map((ticket, index) => (
                            <TicketStub key={index} ticket={ticket} />  
                        ))}
                    </div>
                ))
            ) : (
                <p>No bookings found.</p>
            )}
        </Container>
    );
}

export default BookingHistory;
