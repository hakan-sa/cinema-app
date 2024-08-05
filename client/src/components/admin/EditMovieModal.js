import React, { useState, useRef, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { Modal, Button, Form, Row, FloatingLabel } from 'react-bootstrap';
import SearchMoviesForm from './SearchMovieForm';
import './AddMovieModal.css';


export default function EditMovieModal({ manageMoviesViews, setManageMoviesViews }) {

    const initialPoster = 'https://i.imgur.com/Z2MYNbj.png/large_movie_poster.png';
    const initialTrailer = 'https://www.youtube.com/watch?v=u31qwQUeGuM';

    const categoriesList = [
        'Action', 'Adventure', 'Animation', 'Biography',
        'Comedy', 'Crime', 'Documentary', 'Drama', 'Family',
        'Fantasy', 'History', 'Horror', 'Music', 'Musical', 'Mystery',
        'Romance', 'Sci-Fi', 'Thriller', 'War', 'Sport',
    ];

    const ratingsList = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

    const addMovieRef = useRef(null);

    const axiosPrivate = useAxiosPrivate();

    const [showSearchForm, setShowSearchForm] = useState(true);

    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([]);
    const [casts, setCasts] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [producers, setProducers] = useState([]);
    const [synopsis, setSynopsis] = useState('');
    const [duration, setDuration] = useState(0);
    const [poster, setPoster] = useState(initialPoster);
    const [trailer, setTrailer] = useState(initialTrailer);
    const [rating, setRating] = useState(0);
    const [ratingCode, setRatingCode] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [showDates, setShowDates] = useState('');

    const [castsInput, setCastsInput] = useState('');
    const [directorsInput, setDirectorsInput] = useState('');
    const [producersInput, setProducersInput] = useState('');

    const [tmdbId, setTmdbId] = useState('');

    const fetchMovieById = async (movie) => {
        const tmdbId = movie.id;

        try {
            const response = await axiosPrivate.get(`movies/${tmdbId}`);
            const foundMovie = response.data;

            if (foundMovie) {
                setTmdbId(foundMovie.id);
                setTitle(foundMovie.title);
                setCategories(foundMovie.categories.map(category => category.genre));
                setCasts(foundMovie.castMembers.map(castMember => castMember.cast_member));
                setDirectors(foundMovie.directors.map(director => director.director_name));
                setProducers(foundMovie.producers.map(producer => producer.producer_name));
                setSynopsis(foundMovie.synopsis);
                setDuration(foundMovie.duration);
                setPoster(foundMovie.poster_link);
                setTrailer(foundMovie.trailer_link);
                setRating(foundMovie.rating);
                setRatingCode(foundMovie.filmRating.rating);
                setReleaseDate(foundMovie.release_date);
                setShowSearchForm(false);
            }
        } catch (error) {
            if (error.response.status === 404) {
                alert("Movie with that ID not found. Please try again.");
            }
            console.error(error.message);
            setShowSearchForm(true);
            setTmdbId('');
        }

    }

    const toEmbedUrl = (url) => {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    const closeHandler = () => {
        setManageMoviesViews((prevContext) => ({
            ...prevContext,
            showEditMovieModal: false
        }));
    }

    const areAllFieldsValid = () => {
        return title && categories.length > 0 && casts.length > 0 && directors.length > 0 && producers.length > 0 &&
            synopsis && duration > 0 && poster !== initialPoster && trailer !== initialTrailer &&
            rating > 0 && ratingCode && releaseDate;
    };

    const commaSeparatedInputBlurHandler = (setter, input) => {
        setter(input.split(',').map(item => item.trim()).filter(item => item !== ''));
    };

    const verticalBarSeparatedInputBlurHandler = (setter, input) => {
        setter(input.split('|').map(item => item.trim()).filter(item => item !== ''));
    }

    const clearHandler = (event) => {
        event.preventDefault();
        setTitle(''); setCategories([]); setCasts([]); setDirectors([]); setProducers([]);
        setSynopsis(''); setDuration(0); setPoster(initialPoster); setTrailer(initialTrailer);
        setRating(0); setRatingCode(''); setReleaseDate('');
    };

    // TODO: Build Update Request
    const buildUpdatedMovie = () => {
        const filmRatingId = ratingsList.indexOf(ratingCode) + 1;
        if (!filmRatingId) {
            console.log('Invalid rating code');
        }

        let updatedMovie = {
            title, categories, castMembers: casts, directors, producers, synopsis, duration,
            posterLink: poster, trailerLink: trailer, rating, filmRatingId, releaseDate
        };
        return updatedMovie;
    }

    // TODO: Change to UPDATE MOVIE
    const submitHandler = async (event) => {
        event.preventDefault();

        console.log('Updating movie...');

        const updatedMovie = buildUpdatedMovie();

        try {
            let response = await axiosPrivate.put(`movies/${tmdbId}`, updatedMovie);

            if (response.status === 201) {
                alert("Movie successfully updated");
            } else {
                throw new Error("Failed to add movie. Status code: " + response)
            }
        } catch (error) {
            if (!error?.response) {
                console.log("No server response.");
                alert("Failed to submit the movie. Please try again later.");
            } else {
                console.log("Client: Error inserting movie in EditMovieModal.js: " + error);
                alert("An error occurred while submitting the movie. Please try again later.");
            }
        }

    };

    useEffect(() => {
        setCastsInput(casts.join(', '));
        setDirectorsInput(directors.join(', '));
        setProducersInput(producers.join(', '));
    }, [casts, directors, producers]);

    // TODO : Add "is-valid" and "is-invalid" classes to form control when field is valid

    return (
        <div>
            {manageMoviesViews.showEditMovieModal && (
                <React.Fragment>
                    <Modal data-bs-theme="dark" className="addmovie-modal text-white" show={manageMoviesViews.showEditMovieModal} onHide={closeHandler} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Movie</Modal.Title>
                        </Modal.Header>

                        {/* Search Section */}
                        <Modal.Body className="p-3">
                            {showSearchForm && <SearchMoviesForm setShowSearchForm={setShowSearchForm} onIdSelected={fetchMovieById} />}
                        </Modal.Body>
                        {tmdbId && (
                            <Modal.Body>
                                <Row className="align-items-center mb-3">
                                    {trailer && <iframe title="Movie Trailer" width="100%" height="600px" src={toEmbedUrl(trailer)} allowFullScreen></iframe>}
                                </Row>
                                <div style={{ display: "flex", justifyContent: "center", padding: "2em" }}>
                                    {poster && <img className="img-fluid" src={poster} alt="Movie Poster" style={{ width: "50%" }} />}
                                </div>
                                <Form ref={addMovieRef} onSubmit={submitHandler}>
                                    <FloatingLabel className="mb-3" label="Title">
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            placeholder="Title"
                                            value={title}
                                            onChange={(event) => setTitle(event.target.value)}
                                            autoCapitalize="on"
                                            autoFocus="on"
                                            autoComplete="off"
                                            required
                                        />
                                    </FloatingLabel>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Release Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="releaseDate"
                                            value={releaseDate}
                                            onChange={(event) => setReleaseDate(event.target.value)}
                                            autoComplete="off"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Duration (in minutes)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="duration"
                                            value={duration}
                                            onChange={(event) => setDuration(event.target.value)}
                                            autoComplete="off"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Choose Film Rating</Form.Label>
                                        <div className="row row-cols-5 gy-2">
                                            {ratingsList.map((rating, index) => (
                                                <div className="col" key={rating}>
                                                    <React.Fragment>
                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            id={`btn-check-rating-${index}`}
                                                            autoComplete="off"
                                                            name="ratingCode"
                                                            value={rating}
                                                            checked={ratingCode === rating}
                                                            onChange={(event) => setRatingCode(event.target.value)}
                                                            required
                                                        />
                                                        <label
                                                            className="btn btn-outline-primary"
                                                            htmlFor={`btn-check-rating-${index}`}
                                                        >
                                                            {rating}
                                                        </label>
                                                    </React.Fragment>
                                                </div>
                                            ))}
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Choose Categories</Form.Label>
                                        <div className="row row-cols-5 gy-2">
                                            {categoriesList.map((category, index) => (
                                                <div className="col" key={category}>
                                                    <React.Fragment>
                                                        <input
                                                            type="checkbox"
                                                            className="btn-check"
                                                            id={`btn-check-${index}`}
                                                            autoComplete="off"
                                                            name="categories"
                                                            value={category}
                                                            checked={categories.includes(category)}
                                                            onChange={(event) => {
                                                                const newCategories = categories.includes(event.target.value)
                                                                    ? categories.filter((c) => c !== event.target.value)
                                                                    : [...categories, event.target.value];
                                                                setCategories(newCategories);
                                                            }}
                                                            required
                                                        />
                                                        <label
                                                            className="btn btn-outline-primary"
                                                            htmlFor={`btn-check-${index}`}
                                                        >
                                                            {category}
                                                        </label>
                                                    </React.Fragment>
                                                </div>
                                            ))}
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="cast"
                                            placeholder="Add Cast Members (comma separated)"
                                            value={castsInput}
                                            onChange={(event) => setCastsInput(event.target.value)}
                                            onBlur={() => commaSeparatedInputBlurHandler(setCasts, castsInput)}
                                            autoComplete="off"
                                            autoCapitalize="on"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="director"
                                            value={directorsInput}
                                            placeholder="Add Directors (comma separated)"
                                            onChange={(event) => setDirectorsInput(event.target.value)}
                                            onBlur={() => commaSeparatedInputBlurHandler(setDirectors, directorsInput)}
                                            autoComplete="off"
                                            autoCapitalize="on"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="producer"
                                            value={producersInput}
                                            placeholder="Add Producers (comma separated)"
                                            onChange={(event) => setProducersInput(event.target.value)}
                                            onBlur={() => commaSeparatedInputBlurHandler(setProducers, producersInput)}
                                            autoComplete="off"
                                            autoCapitalize="on"
                                            required
                                        />
                                    </Form.Group>
                                    <FloatingLabel className="mb-3" label="Movie Synopsis">
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            name="synopsis"
                                            value={synopsis}
                                            placeholder="Synopsis"
                                            onChange={(event) => setSynopsis(event.target.value)}
                                            autoComplete="off"
                                            required
                                            style={{ height: "30vh" }}
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel className="mb-3" label="Poster Image (URL)">
                                        <Form.Control
                                            type="url"
                                            name="poster"
                                            value={poster}
                                            placeholder="Poster Image (URL)"
                                            onChange={(event) => setPoster(event.target.value)}
                                            autoComplete="off"
                                            required
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel className="mb-3" label="Trailer Video (Youtube URL)">
                                        <Form.Control
                                            type="url"
                                            name="trailer"
                                            value={trailer}
                                            placeholder="Trailer Video (Youtube URL)"
                                            onChange={(event) => setTrailer(event.target.value)}
                                            pattern="https?://www.youtube.com/watch?.+"
                                            autoComplete="off"
                                            required
                                        />
                                    </FloatingLabel>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Rating</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.1"
                                            name="rating"
                                            value={rating}
                                            onChange={(event) => setRating(event.target.value)}
                                            autoComplete="off"
                                            required
                                            min="0"
                                            max="10"
                                        />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                        )}
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={closeHandler}
                            >
                                Close
                            </Button>
                            <Button
                                variant="light"
                                onClick={clearHandler}
                            >
                                Clear
                            </Button>
                            <Button
                                variant="primary"
                                onClick={(event) => submitHandler(event)}
                                disabled={!areAllFieldsValid()}
                            >
                                Update Movie
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </React.Fragment>
            )}
        </div>
    );
}