import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
    const [open, setOpen] = useState(false);
    const toggleReview = () => setOpen(!open);

    const { content, rating, author, avatar_link } = review;
    const MAX_LENGTH = 100;

    function getRatingColor(rating) {
        if (rating === null) return "black";
        switch (Math.floor(rating)) {
            case 0:
            case 1:
            case 2:
                return "red";
            case 3:
            case 4:
                return "orange";
            case 5:
            case 6:
                return "yellow";
            case 7:
            case 8:
                return "green";
            case 9:
                return "blue";
            case 10:
                return "rainbow";
            default:
                return "black";
        }
    }


    return (
        <div className="review-card-container" style={{ width: '18rem', position: 'relative', marginBottom: '2rem', textAlign: 'center' }}>
            <img
                src={avatar_link || '/default-avatar.png'}
                alt={`${author}'s avatar`}
                className="review-avatar"
            />
            <Card className="review-card-body">
                <Card.Body>
                    <Card.Title>{author}</Card.Title>
                    <div className="review-rating">
                        <Card.Subtitle style={{ fontSize: '1.5rem', borderRadius: '5px', width: '50%', margin: '0 auto' }} className={`mb-2 p-1 ${rating !== null ? "bold " + getRatingColor(rating) : "no-rating"}`}>
                            {rating !== null ? `${rating}/10` : "No Rating"}
                        </Card.Subtitle>
                    </div>
                    <Card.Text>
                        {content.length > MAX_LENGTH ?
                            <>
                                {open ? content : `${content.substring(0, MAX_LENGTH)}... `}
                                <Button variant="link" onClick={toggleReview}>
                                    {open ? 'Show less' : 'Read more'}
                                </Button>
                            </>
                            :
                            content
                        }
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ReviewCard;
