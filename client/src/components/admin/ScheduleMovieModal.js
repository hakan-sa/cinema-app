import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, FloatingLabel } from 'react-bootstrap';
import SearchMovieForm from './SearchMovieForm';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

export default function ScheduleMovieModal({ manageScheduleMovieViews, setManageScheduleMovieViews }) {
    const [selectedMovieId, setSelectedMovieId] = useState('');
    const [selectedMoviePosterLink, setSelectedMoviePosterLink] = useState('');
    const [showrooms, setShowrooms] = useState([]);
    const [selectedShowroomId, setSelectedShowroomId] = useState('');
    const [showDate, setShowDate] = useState('');
    const [showTimeId, setShowTimeId] = useState('');

    const axiosPrivate = useAxiosPrivate();

    const closeHandler = () => {
        setManageScheduleMovieViews((prevContext) => ({
            ...prevContext,
            showScheduleMovieModal: false
        }));
        resetForm();
    };

    const handleMovieIdSelected = ({ id, poster_link }) => {
        setSelectedMovieId(id);
        setSelectedMoviePosterLink(poster_link);
    };

    useEffect(() => {
        const fetchShowrooms = async () => {
            try {
                const { data } = await axiosPrivate.get('/showrooms');
                setShowrooms(data);
            } catch (error) {
                console.error('Failed to fetch showrooms:', error);
            }
        };

        fetchShowrooms();
    }, []);

    const resetForm = () => {
        setSelectedMovieId('');
        setSelectedMoviePosterLink('');
        setSelectedShowroomId('');
        setShowDate('');
        setShowTimeId('');
    };

    const buildNewShow = () => {
        let newShow = {
            movieId: selectedMovieId,
            showroomId: selectedShowroomId,
            showDate: showDate,
            showTimesId: showTimeId
        };
        return newShow;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newShow = buildNewShow();

        try {
            console.log(newShow);
            let response = await axiosPrivate.post(`/shows`, newShow);

            if (response.status === 201) {
                const showId = response.data.id;

                // Make Seats Available
                try {
                    const availableSeats = {
                        showId: showId,
                        showroomId: selectedShowroomId
                    }
                    let seatAvailabilityResponse = await axiosPrivate.post('/seats/create-availability', availableSeats);

                    if (seatAvailabilityResponse.status === 201) {
                        alert("Seats successfully added!");
                    } else {
                        throw new Error("Failed to create seat availability: " + seatAvailabilityResponse.status);
                    }
                } catch (error) {
                    console.error("Error creating seat availability:", error);
                    await axiosPrivate.delete(`/shows/${showId}`);
                    alert("An error occurred while creating seat availability. Please try again later.");
                }
            } else {
                throw new Error("Failed to add show. Status code: " + response)
            }
        } catch (error) {
            if (!error?.response) {
                console.log("No server response.");
                alert("Failed to schedule the show. Please try again later.");
            } else {
                console.log(error);
                alert("An error occurred while scheduling the show. Please try again later.");
            }
        }
    };


    return (
        <Modal data-bs-theme="dark" className="text-white" show={manageScheduleMovieViews.showScheduleMovieModal} onHide={closeHandler} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Schedule Movies</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3">
                <SearchMovieForm onIdSelected={handleMovieIdSelected} />
            </Modal.Body>
            {selectedMovieId && (
                <Modal.Body className="p-3">
                    <Row className="mb-3">
                        <Col md={4}>
                            <img src={selectedMoviePosterLink} alt="Movie Poster" className="img-fluid" />
                        </Col>
                        <Col md={8}>
                            <Form onSubmit={handleSubmit}>
                                <FloatingLabel controlId="showroomSelect" label="Showroom" className="mb-3">
                                    <Form.Select value={selectedShowroomId} onChange={e => setSelectedShowroomId(e.target.value)} required>
                                        <option value="">Select a showroom</option>
                                        {showrooms.map(showroom => (
                                            <option key={showroom.id} value={showroom.id}>{showroom.name}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                                <FloatingLabel controlId="showDate" label="Show Date" className="mb-3">
                                    <Form.Control type="date" value={showDate} onChange={e => setShowDate(e.target.value)} required />
                                </FloatingLabel>
                                <FloatingLabel controlId="showTimeSelect" label="Show Time" className="mb-3">
                                    <Form.Select value={showTimeId} onChange={e => setShowTimeId(e.target.value)} required>
                                        <option value="">Select a time</option>
                                        <option value="1">Morning (10:00 AM)</option>
                                        <option value="2">Afternoon (1:00 PM)</option>
                                        <option value="3">Evening (5:00 PM)</option>
                                        <option value="4">Night (10:00 PM)</option>
                                    </Form.Select>
                                </FloatingLabel>
                                <Button variant="primary" type="submit">Schedule Movie</Button>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
            )}
        </Modal>
    );
}
