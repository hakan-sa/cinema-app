import React, { useState } from 'react';
import { Form, FloatingLabel, Card, Row, Button, Collapse } from 'react-bootstrap';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import './SearchMovieForm.css';

export default function SearchMoviesForm({ onIdSelected }) {
    const [searchType, setSearchType] = useState('title');
    const [searchInput, setSearchInput] = useState('');
    const [movies, setMovies] = useState([]);
    const [showSearchForm, setShowSearchForm] = useState(true); // Control the visibility of the form

    const axiosPrivate = useAxiosPrivate();

    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
        setSearchInput('');
        setMovies([]);
    };

    const handleInputChange = (e) => {
        const input = e.target.value;
        setSearchInput(input);
        if (input.length >= 3 && searchType === 'title') {
            searchMoviesByTitle(input);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (searchInput && searchType === 'tmdbId') {
            onIdSelected(searchInput); // Pass back ID directly
            setShowSearchForm(false); // Collapse the form after selection
        }
    };

    const searchMoviesByTitle = async (title) => {
        try {
            const response = await axiosPrivate.get(`movies/search?query=${title}`);
            if (response.data && response.data.length > 0) {
                setMovies(response.data.slice(0, 3));
            } else {
                setMovies([]);
            }
        } catch (error) {
            console.error("Search error:", error);
            alert("Failed to search for movies. Please try again.");
        }
    };

    const handleMovieClick = (movie) => {
        onIdSelected({ id: movie.id, poster_link: movie.poster_link || 'default-placeholder.png' });
        setShowSearchForm(false);
    };


    return (
        <div>
            <h5 className='toggle-header' onClick={() => setShowSearchForm(!showSearchForm)}>
                Search Movies
                <span className="material-icons">
                    {showSearchForm ? 'expand_less' : 'expand_more'}
                </span>
            </h5>
            <Collapse in={showSearchForm}>
                <div>
                    <Form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <Form.Check
                                inline
                                type="radio"
                                label="TMDB ID"
                                name="searchType"
                                value="tmdbId"
                                checked={searchType === 'tmdbId'}
                                onChange={handleSearchTypeChange}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                label="Title"
                                name="searchType"
                                value="title"
                                checked={searchType === 'title'}
                                onChange={handleSearchTypeChange}
                            />
                        </div>
                        <FloatingLabel label={`Search by ${searchType}`}>
                            <Form.Control
                                type="text"
                                value={searchInput}
                                onChange={handleInputChange}
                                placeholder={`Enter ${searchType === 'tmdbId' ? 'TMDB ID' : 'Title'}`}
                            />
                        </FloatingLabel>
                        {searchType === 'tmdbId' && <Button variant="primary" type="submit">Search</Button>}
                    </Form>
                    {searchType === 'title' && movies.length > 0 && (
                        <Row xs={1} md={3} className="g-4 mt-3">
                            {movies.map(movie => (
                                <Card key={movie.id} onClick={() => handleMovieClick(movie)}>
                                    <Card.Img variant="top" src={movie.poster_link || 'default-placeholder.png'} />
                                    <Card.Body>
                                        <Card.Title>{movie.title}</Card.Title>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Row>
                    )}
                </div>
            </Collapse>
        </div>
    );
}
