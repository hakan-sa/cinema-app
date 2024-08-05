import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import './ShowDay.css';

const timeMapping = {
    1: '10:00 AM',
    2: '1:00 PM',
    3: '5:00 PM',
    4: '8:00 PM'
};

const ShowDay = ({ day, shows, movie }) => {
    const navigate = useNavigate();

    const handleSelectShow = (show) => {
        // Generating a URL-friendly title slug from the movie title
        const titleSlug = movie.title.toLowerCase().replace(/ /g, '-');
        navigate(`/movie/${titleSlug}/seating`, { state: { show, movie } });
    };

    return (
        <Card className="mb-3 showday-card">
            <Card.Header className="showday-card-header">
                {new Date(day).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                
            </Card.Header>
            <Card.Body className="d-flex flex-wrap justify-content-center gap-5">
                {shows.map((show, index) => (
                    <Button key={index} className="rainbow-on-hover" onClick={() => handleSelectShow(show)} style={{ cursor: 'pointer' }}>
                        {timeMapping[show.show_times_id] || 'Unknown time'}
                    </Button>
                ))}
            </Card.Body>
        </Card>
    );
};

export default ShowDay;
