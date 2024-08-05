import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { Button, Container, Row, Col } from 'react-bootstrap';
import './SeatSelection.css';
import WarpSpeed from '../general/WarpSpeed';

import NavBar from '../general/NavBar';

export default function SeatSelection() {
    const [seats, setSeats] = useState([]);
    const [selectedSeatIds, setSelectedSeatIds] = useState([]);
    const [selectedSeatNumbers, setSelectedSeatNumbers] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const movie = (location.state && location.state.movie) || '';
    const show = (location.state && location.state.show) || '';

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (!location.state || !movie || !show) {
            navigate('/home');
        }

        const fetchSeats = async () => {
            try {
                const response = await axiosPrivate.get(`/seats/${show.id}`);
                const fetchedSeats = response.data;

                const seatMap = [];
                fetchedSeats.forEach(seat => {
                    const row = seat.seat.seat_number.substring(0, 1);
                    const number = parseInt(seat.seat.seat_number.substring(1), 10);
                    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
                    if (!seatMap[rowIndex]) {
                        seatMap[rowIndex] = Array(12).fill(null);
                    }
                    seatMap[rowIndex][number - 1] = seat;
                });
                setSeats(seatMap);
            } catch (error) {
                console.error('Failed to fetch seats:', error);
            }
        };

        if (show && show.id) {
            fetchSeats();
        }
    }, [show]);

    const toggleSeatSelection = (seat) => {
        if (seat.status === 'booked') return; // Prevent selection of booked seats
        const seatId = seat.seat_id;
        const seatNumber = seat.seat.seat_number;
        setSelectedSeatIds(prev => {
            const index = prev.indexOf(seatId);
            if (index > -1) {
                return prev.filter(id => id !== seatId);
            } else {
                return [...prev, seatId];
            }
        });
        setSelectedSeatNumbers(prev => {
            const index = prev.indexOf(seatNumber);
            if (index > -1) {
                return prev.filter(number => number !== seatNumber);
            } else {
                return [...prev, seatNumber];
            }
        });
    };

    const continueHandler = (event) => {
        event.preventDefault();
        const titleSlug = movie.title.toLowerCase().replace(/ /g, '-');
        if (selectedSeatNumbers.length) {
            navigate(`/movie/${titleSlug}/tickets`, {
                state: {
                    selectedSeatIds: selectedSeatIds, // Pass seat IDs for backend operations
                    selectedSeatNumbers: selectedSeatNumbers, // Pass seat numbers for display
                    movie: movie,
                    show: show
                }
            });
        }
    };

    const cancelHandler = (event) => {
        event.preventDefault();
        const titleSlug = movie.title.toLowerCase().replace(/ /g, '-');
        if (window.confirm("Are you sure you want to cancel your booking?")) {
            navigate(`/movie/${titleSlug}`, {
                state: {
                    id: movie.id
                }
            });
        }
    }

    return (
        <div className="seat-selection-container">
            <NavBar />
            <WarpSpeed speedMultiplier={0.0001} />
            <h1>Select Your Seats for {movie.title}</h1>
            <hr/>
            <Container>
                <div className="seat-grid p-3">
                {seats.map((row, rowIndex) => (
                    <Row key={rowIndex} className={`seat-row ${rowIndex === 4 ? 'gap-below' : ''}`}>
                        {row.map((seat, index) => (
                            <Col xs={1} key={index} className={`seat ${selectedSeatNumbers.includes(seat.seat.seat_number) ? 'selected' : ''} ${seat && seat.status === 'booked' ? 'booked' : ''}`} onClick={() => seat && seat.status !== 'booked' ? toggleSeatSelection(seat) : null}>
                                <i className="material-icons">{seat ? 'chair' : 'block'}</i>
                            </Col>
                        ))}
                    </Row>
                ))}
                </div>
                <div className="selected-seats"><h2>Booking Seats: {selectedSeatNumbers.join(' | ')}</h2></div>
                <Button className="btn btn-danger" onClick={cancelHandler}>Cancel Booking</Button>
                <Button className="btn btn-primary" onClick={continueHandler}>Continue Booking</Button>
            </Container>
        </div>
    );
}