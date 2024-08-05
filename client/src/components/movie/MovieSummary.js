import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MovieSummary.css';

export default function MovieSummary({ title, duration, ratingCode, releaseDate }) {
    return (
        <div className="movie-summary">
            <h4 className="movie-summary-title">{title}</h4>
            <p>{duration} | <span className="rating-box">{ratingCode}</span></p>
            <p>{releaseDate}</p>
        </div>
    );
}