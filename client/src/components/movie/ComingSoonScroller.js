import React, { useState, useEffect, useRef } from 'react';
import axios from '../../apis/axios';

import { Container } from 'react-bootstrap';
import './ComingSoonScroller.css';

import MovieElement from './MovieElement';

export default function ComingSoonScoller() {

    const [comingSoonMovies, setComingSoonMovies] = useState([]);


    useEffect(() => {
        const fetchComingSoondMovies = async () => {
            try {
                const response = await axios.get(`/movies/coming-soon`);
                setComingSoonMovies(response.data);
            } catch (err) {
                console.error("Error fetching coming soon movies:", err);
            }
        };

        fetchComingSoondMovies();
    }, []);

    const scrollerRef = useRef(null);

    // Duplicates Coming Soon movies array for infinite scrolling
    useEffect(() => {
        const scroller = scrollerRef.current;
        if (scroller) {
            scroller.setAttribute("data-animated", true);
            const scrollerInner = scroller.querySelector('.scroller__inner');
            const scrollerContent = Array.from(scrollerInner.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute("aria-hidden", true);
                scrollerInner.appendChild(duplicatedItem);
            });
        }
    }, []);

    return (
        <Container fluid className="main-content-container animated-reel border-top-bottom">
            <div>
                <h2>Coming Soon...</h2>
                <div className="scroller" ref={scrollerRef}>
                    <div className="d-flex scroller__inner">
                        {comingSoonMovies.map((movie, index) => (
                            <div key={index}>
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
                </div>
            </div>
        </Container>
    );
}
