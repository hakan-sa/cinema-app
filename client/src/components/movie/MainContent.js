import React, { useEffect, useState } from 'react';
import axios from '../../apis/axios';
import { Container, Carousel } from 'react-bootstrap';
import './MainContent.css';

import MovieElement from './MovieElement';

export default function MainContent() {
    const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
    const [opacity, setOpacity] = useState(0);
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const changeBackgroundImage = (newImageUrl) => {
        setOpacity(0); // Start fade out
        setBackgroundImageUrl(newImageUrl);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setOpacity(1); // Fade in after the next paint
            });
        });
    };

    useEffect(() => {
        const fetchFeaturedMovies = async () => {
            try {
                const response = await axios.get(`/movies/featured`);
                setFeaturedMovies(response.data);
            } catch (err) {
                console.error("Error fetching featured movies:", err);
            }
        };

        fetchFeaturedMovies();
    }, []);

    const handleMouseEnter = (poster) => changeBackgroundImage(poster);
    const handleMouseLeave = () => setOpacity(0);

    return (
        <Container fluid className="main-content-container">
            <div className="background-image" style={{ opacity, backgroundImage: `url(${backgroundImageUrl})` }}></div>
            <div>
                <h2 className="mb-5">Featured Movies</h2>
                <Carousel className="carousel-container" activeIndex={index} onSelect={handleSelect} interval={null}>
                    {Array.from({ length: Math.ceil(featuredMovies.length / 5) }, (_, idx) => ( // Display 5 movies max
                        <Carousel.Item key={idx} className="carousel-item">
                            <div className="d-flex flex-row justify-content-evenly flex-wrap">
                                {featuredMovies.slice(idx * 5, (idx + 1) * 5).map((movie, index) => (
                                    <div key={movie.id} onMouseEnter={() => handleMouseEnter(movie.poster_link)} onMouseLeave={handleMouseLeave}>
                                        <MovieElement
                                            id={movie.id}
                                            title={movie.title}
                                            duration={movie.duration}
                                            imageUrl={movie.poster_link}
                                            ratingCode={movie.filmRating.rating}
                                            releaseDate={movie.release_date}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </Container>
    );
}
