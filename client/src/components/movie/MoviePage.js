import React, { useEffect, useState } from 'react';
import axios from '../../apis/axios';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Container, Row, Col, Badge, Carousel } from 'react-bootstrap';
import ReviewCard from './ReviewCard';
import './MoviePage.css';
import LoadingScreen from '../general/LoadingScreen';

import NavBar from '../general/NavBar';
import WarpSpeed from '../general/WarpSpeed';

export default function MoviePage() {
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState();

    const navigate = useNavigate();

    const location = useLocation();
    const { id } = (location.state) || { id: '' };

    useEffect(() => {
        if (!location.state || !id) {
            navigate('/home');
        }

        const fetchMoviePageDetails = async () => {
            try {
                const response = await axios.get(`/movies/${id}`);
                if (response.data) {
                    setMovie(response.data);
                }
            } catch (err) {
                console.log("Error fetching movie data: ", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMoviePageDetails();

        // eslint-disable-next-line
    }, [id]);


    const bookTicketsHandler = () => {
        const titleSlug = movie.title.toLowerCase().replace(/ /g, '-');
        navigate(`/movie/${titleSlug}/showtimes`, {
            state: {
                movie: movie
            }
        });
    };

    const formatList = (items, key) => items.length > 0 ? items.map(item => item[key]).join(', ') : 'No information available.';

    const chunkArray = (array, size) => {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    };

    function getRatingImage(rating) {
        switch (rating) {
            case 'PG-13':
                return '/rating-pg-13.png';
            case 'G':
                return '/rating-g.png';
            case 'R':
                return '/rating-r.png';
            case 'PG':
                return '/rating-pg.png';
            default:
                return '/rating-default.png';
        }
    }


    // Adjust youtube url to embed version        
    const convertToEmbedUrl = (url) => {
        const match = url.match(/[?&]v=([^?&]+)/);
        if (match) {
            const videoId = match[1];
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&aspect_ratio=16:9&controls=1&modestbranding&rel=0`;
        }
        return null;
    };

    if (loading) {
        return <div className="loading-screen"><LoadingScreen speedMultiplier={0.015} /></div>;
    }

    return (
        <div className="movie-page">
            <NavBar />
            <WarpSpeed speedMultiplier={0.0001} />
            <div className="trailer-section">
                <Container className="trailer-container">
                    <iframe src={convertToEmbedUrl(movie.trailer_link)} title="Movie Trailer" allowFullScreen></iframe>
                </Container>

                {/*Animated Wave*/}
                <svg className="editorial"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 24 150 28"
                    preserveAspectRatio="none">
                    <defs>
                        <path id="gentle-wave"
                            d="M-160 44c30 0 
                        58-18 88-18s
                        58 18 88 18 
                        58-18 88-18 
                        58 18 88 18
                        v44h-352z" />
                    </defs>
                    <g className="parallax1">
                        <use href="#gentle-wave" x="50" y="3" fill="#b4c9f3" />
                    </g>
                    <g className="parallax2">
                        <use href="#gentle-wave" x="50" y="0" fill="#4579e2" />
                    </g>
                    <g className="parallax3">
                        <use href="#gentle-wave" x="50" y="9" fill="#3461c1" />
                    </g>
                    <g className="parallax4">
                        <use href="#gentle-wave" x="50" y="12" fill="#000" />
                    </g>
                </svg>
            </div>

            <Container fluid className="movie-details-container">
                <div className="space-background"></div>
                <Row>
                    <Col xs={4} className="col-md-4 movie-poster-container">
                        <div>
                            <img className="img-fluid movie-poster-image" src={movie.poster_link} alt="Movie Poster" />
                        </div>
                        <div className="book-tickets-container">
                            <div>
                                <img src={getRatingImage(movie.filmRating.rating)} alt="Rating" />
                            </div>
                            <div>
                                <h4>
                                    {movie.categories.length > 0 ? (
                                        movie.categories.map((category, index) => (
                                            <Badge key={index} pill bg="secondary" className="me-1">
                                                {category.genre}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p>No category information available.</p>
                                    )}
                                </h4>
                            </div>
                            <div>
                                <p><strong>Duration:</strong> {movie.duration} minutes</p>
                                <p><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <Button className="glow-on-hover" onClick={bookTicketsHandler} style={{ fontSize: '3rem' }}>Book Tickets</Button>
                            </div>
                        </div>
                    </Col>
                    <Col xs={8} className="col-md-8 movie-info">
                        <div className="movie-title">{movie.title}</div>
                        <div className="movie-synopsis">"{movie.synopsis}"</div>
                        <hr />
                        <div className="additional-info">
                            <div className="vertical-autoscroll">
                                <div className="vertical-scroll-content">
                                    <div className="vertical-scroll-element">
                                        <h4>Cast Members</h4>
                                        <p>{formatList(movie.castMembers, 'cast_member')}</p>
                                    </div>
                                    <div className="vertical-scroll-element">
                                        <h4>Directors</h4>
                                        <p>{formatList(movie.directors, 'director_name')}</p>
                                    </div>
                                    <div className="vertical-scroll-element">
                                        <h4>Producers</h4>
                                        <p>{formatList(movie.producers, 'producer_name')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="movie-reviews">

                                {movie.reviews.length > 0 ? (
                                    <Carousel interval={3000} wrap={true} indicators={false} pause='hover'>
                                        {chunkArray(movie.reviews, 2).map((chunk, idx) => (
                                            <Carousel.Item key={idx}>
                                                <div className="d-flex justify-content-around">
                                                    {chunk.map((review, index) => (
                                                        <ReviewCard key={index} review={review} />
                                                    ))}
                                                </div>
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                ) : (
                                    <p>No review information available.</p>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>



    );
}
