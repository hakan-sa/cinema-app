import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useUserData from '../../hooks/useUserData';

import { Container, Button } from 'react-bootstrap';
import LoadingScreen from '../general/LoadingScreen';
import ShowDay from './ShowDay';
import './Showtimes.css';
import WarpSpeed from '../general/WarpSpeed';

import NavBar from '../general/NavBar';

export default function Showtimes() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = useUserData();

    const movie = (location.state && location.state.movie) || '';

    const [showsByDay, setShowsByDay] = useState({});
    const [loading, setLoading] = useState(true);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (!location.state || !movie) {
            navigate('/home');
        }

        const fetchShows = async () => {
            setLoading(true);
            try {
                const response = await axiosPrivate.get(`/shows/movies/${movie.id}`);
                const groupedByDay = response.data.reduce((acc, show) => {
                    const showDate = new Date(show.show_date).toDateString();
                    if (!acc[showDate]) {
                        acc[showDate] = [];
                    }
                    acc[showDate].push(show);
                    return acc;
                }, {});

                setShowsByDay(groupedByDay);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching shows:', error);
                setLoading(false);
            }
        };

        if (movie.id) {
            fetchShows();
        }
    }, [movie.id]);

    if (loading) {
        return <div className="loading-screen"><LoadingScreen /></div>;
    }

    const areShowsAvailable = Object.keys(showsByDay).length > 0;

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
        <div className="showtime-page-container mt-5">
            <NavBar />
            <WarpSpeed speedMultiplier={0.0001} />
            <h1>Select Showtime</h1>
            <hr />
            <Container>
                {areShowsAvailable ? (
                    // Display ShowDay components if any shows are available
                    Object.entries(showsByDay).map(([day, shows], idx) => (
                        <ShowDay key={idx} day={day} shows={shows} movie={movie} />
                    ))
                ) : (
                    // Message if no shows are available
                    <div className="showtimes-not-available">
                        No Showtimes Available
                        <img className="floating-astronaut" src='/astronaut-float.png'></img>
                    </div>
                )}
                <Button className="btn btn-danger" onClick={cancelHandler}>Cancel Booking</Button>
            </Container>
        </div>
    );
}
