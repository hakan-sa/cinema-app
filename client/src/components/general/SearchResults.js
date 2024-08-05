import React, { useEffect, useState } from 'react';
import axios from '../../apis/axios';

import { Container } from 'react-bootstrap';
import './SearchResults.css';

import { useSearchQuery } from '../../contexts/SearchQueryProvider';

import NavBar from './NavBar';
import MovieElement from '../movie/MovieElement';

export default function SearchResults() {

    const [searchedMovies, setSearchedMovies] = useState([]);

    const { query } = useSearchQuery();

    useEffect(() => {
        console.log("Query has updated to:", query);
        const fetchSearchedMovies = async () => {
            try {
                const response = await axios.get(`/movies/search?query=${query}`);
                if (response.data) {
                    setSearchedMovies(response.data);
                } else {
                    setSearchedMovies([]);
                }
            } catch (err) {
                console.log("Error fetching searched movies: ", err);
            }
        };

        if (query.length > 2) {
            fetchSearchedMovies();
        } else {
            setSearchedMovies([]);
        }

    }, [query]);

    return (
        <div className="search-results-container">
            <NavBar />
            <Container>
                <div className="search-results-header">
                    <h2>Search Results</h2>
                </div>
                {(query.length < 3) ? (
                    <div>
                        <h3>Sorry</h3>
                        <h5>Please enter a query longer than 2 characters.</h5>
                    </div>
                ) : null}
                {(searchedMovies.length === 0 && query.length >= 3) ? (
                    <div>
                        <h3>Sorry</h3>
                        <h5>Your search for "{query}" did not have any matches.</h5>
                    </div>
                ) : null}
                {(searchedMovies.length !== 0 && query.length >= 3) ? (
                    <div className="movie-grid">
                        {searchedMovies.map((movie, index) => (
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
                ) : null}
            </Container>
        </div>
    );
}
