import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { Modal, Button, Form, Row, Col, FloatingLabel } from 'react-bootstrap';
import './AddMovieModal.css';


export default function AddMovieModal({ manageMoviesViews, setManageMoviesViews }) {

    const initialPoster = 'https://i.imgur.com/Z2MYNbj.png/large_movie_poster.png';
    const initialTrailer = 'https://www.youtube.com/watch?v=u31qwQUeGuM';

    const categoriesList = [
        'Action', 'Adventure', 'Animation', 'Biography',
        'Comedy', 'Crime', 'Documentary', 'Drama', 'Family',
        'Fantasy', 'History', 'Horror', 'Music', 'Musical', 'Mystery',
        'Romance', 'Sci-Fi', 'Thriller', 'War', 'Sport',
    ];

    const ratingsList = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'NR'];

    const addMovieRef = useRef(null);

    const axiosPrivate = useAxiosPrivate();

    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([]);
    const [casts, setCasts] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [producers, setProducers] = useState([]);
    const [synopsis, setSynopsis] = useState('');
    const [duration, setDuration] = useState(0);
    const [poster, setPoster] = useState('');
    const [trailer, setTrailer] = useState(initialTrailer);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [ratingCode, setRatingCode] = useState('NR');
    const [releaseDate, setReleaseDate] = useState('');
    const [showDates, setShowDates] = useState('');

    const [castsInput, setCastsInput] = useState('');
    const [directorsInput, setDirectorsInput] = useState('');
    const [producersInput, setProducersInput] = useState('');
    const [reviewsInput, setReviewsInput] = useState('');

    const [tmdbId, setTmdbId] = useState('');

    const importMovie = async (tmdbId) => {
        try {
            // Fetch the movie data from TMDB API
            const apiKey = '2c1ba54d303e6834a83256b75e85611a';
            const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&append_to_response=release_dates,videos,credits,reviews`;
            const tmdbResponse = await axios.get(url);
            const movie = tmdbResponse.data;

            // Extract and set movie details
            setTitle(movie.title);
            setDuration(movie.runtime);
            setReleaseDate(movie.release_date);
            setPoster(`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
            setSynopsis(movie.overview);
            setRating(movie.vote_average);

            // Extract Trailer
            const trailer = movie.videos.results.find(video => video.type === "Trailer");
            if (trailer) {
                setTrailer(`https://www.youtube.com/watch?v=${trailer.key}`);
            } else {
                console.log("No trailer found.");
            }

            // Extract Categories
            const extractedCategories = movie.genres.map(genre => genre.name);
            setCategories(extractedCategories);

            // Extract Cast Members (up to 10)
            const extractedCastMembers = movie.credits.cast
                .filter(actor => actor.known_for_department === 'Acting')
                .slice(0, 10)
                .map(actor => actor.name);
            setCasts([...new Set(extractedCastMembers)]);

            // Extract Directors (up to 5)
            const extractedDirectors = movie.credits.crew
                .filter(crew => crew.known_for_department === 'Directing')
                .slice(0, 5)
                .map(crew => crew.name);
            setDirectors([...new Set(extractedDirectors)]);

            // Extract Producers (up to 5)
            const extractedProducers = movie.credits.crew
                .filter(crew => crew.known_for_department === 'Production')
                .slice(0, 5)
                .map(crew => crew.name);
            setProducers([...new Set(extractedProducers)]);

            // Extract and set the US MPAA rating
            const usReleaseData = movie.release_dates.results.find(entry => entry.iso_3166_1 === "US");
            if (usReleaseData) {
                const usRatingCodes = usReleaseData.release_dates.filter(release => release.certification);
                if (usRatingCodes.length > 0) {
                    setRatingCode(usRatingCodes[0].certification);
                } else {
                    console.log("No MPAAA rating found");
                }
            } else {
                console.log("No US release for this movie to obtain the MPAA rating");
            }

            // Extract first 12 random reviews
            const extractedReviews = movie.reviews.results;
            if (extractedReviews) {
                const randomizedReviews = randomizeArray([...extractedReviews]);
                const selectedReviews = randomizedReviews.slice(0, 12).map(review => ({
                    movie_id: tmdbId,
                    author: review.author,
                    rating: review.author_details.rating,
                    content: review.content,
                    avatar_link: review.author_details.avatar_path ? `https://image.tmdb.org/t/p/w500${review.author_details.avatar_path}` : null
                }));
                setReviews(selectedReviews);
            }

        } catch (error) {
            console.error("Client: Error fetching movie from TMDB API: " + error);
        }
    }

    // TODO : Implement show dates

    const toEmbedUrl = (url) => {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    function randomizeArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    const closeHandler = () => {
        setManageMoviesViews((prevContext) => ({
            ...prevContext,
            showAddMovieModal: false
        }));
    }

    const areAllFieldsValid = () => {
        return title && categories.length > 0 && casts.length > 0 && directors.length > 0 && producers.length > 0 &&
            synopsis && poster !== initialPoster && trailer !== initialTrailer && releaseDate;
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
        setReviews([]); setRating(0); setRatingCode(''); setReleaseDate('');
    };

    const buildNewMovie = () => {
        const filmRatingId = ratingsList.indexOf(ratingCode) + 1;
        if (!filmRatingId) {
            console.log('Invalid rating code');
        }

        let newMovie = {
            tmdbId, title, categories, castMembers: casts, directors, producers, synopsis, duration,
            posterLink: poster, trailerLink: trailer, reviews, rating, filmRatingId, releaseDate
        };

        return newMovie;
    }

    const submitHandler = async (event) => {
        event.preventDefault();

        console.log('Submitting new movie...');

        const newMovie = buildNewMovie();

        try {
            let response = await axiosPrivate.post(`/movies/add-movie`, newMovie);

            if (response.status === 201) {
                addMovieRef.current.reset();
                alert("Movie successfully added!");
            } else {
                throw new Error("Failed to add movie. Status code: " + response)
            }
        } catch (error) {
            if (!error?.response) {
                console.log("No server response.");
                alert("Failed to submit the movie. Please try again later.");
            } else {
                console.log("Client: Error inserting movie in AddMovieModal.js: " + error);
                alert("An error occurred while submitting the movie. Please try again later.");
            }
        } finally {
            closeHandler();
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
            {manageMoviesViews.showAddMovieModal && (
                <React.Fragment>

                    <Modal data-bs-theme="dark" className="addmovie-modal text-white" show={manageMoviesViews.showAddMovieModal} onHide={closeHandler} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Movie</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row className="align-items-center mb-3">
                                {trailer && <iframe title="Movie Trailer" width="100%" height="600px" src={toEmbedUrl(trailer)} allowFullScreen></iframe>}
                            </Row>

                            {/* Import Movie Data */}
                            <Row className="align-items-center mb-3">
                                <Col>
                                    <FloatingLabel className="mb-3" label="TMDB ID">
                                        <Form.Control
                                            type="number"
                                            name="tmdbId"
                                            value={tmdbId}
                                            onChange={(event) => setTmdbId(event.target.value)}
                                            autoFocus="on"
                                            autoComplete="off"
                                            required
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <Button type="primary" onClick={() => importMovie(tmdbId)}>Import Movie Data</Button>
                                </Col>
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
                                {/*
                    <FloatingLabel className="mb-3" label="Reviews">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="reviews"
                            placeholder="Reviews (vertical bar ('|') separated)"
                            value={reviewsInput}
                            onChange={(event) => setReviewsInput(event.target.value)}
                            onBlur={() => verticalBarSeparatedInputBlurHandler(setReviews, reviewsInput)}
                            autoComplete="off"
                            required
                        />
                    </FloatingLabel>
                        */}
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
                                Add Movie
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </React.Fragment>
            )}
        </div>
    );
}