import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MovieCard.css';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ id, imageUrl, title }) {

    const navigate = useNavigate();

    const handleCardClick = (event) => {
        event.preventDefault();
        const titleSlug = title.toLowerCase().replace(/ /g, '-');
        navigate(`/movie/${titleSlug}`, { state: { id: id } });
    }

    return (
        <div className="card movie-card" onClick={handleCardClick}>
            <img
                src={imageUrl}
                className="card-img-top"
                alt={title}
            />
            <h3 className="hover-title p-1">{title}</h3>
        </div>
    );
}