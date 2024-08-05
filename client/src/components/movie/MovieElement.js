import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure to import Bootstrap CSS

import MovieCard from './MovieCard';
import MovieSummary from './MovieSummary';

export default function MovieElement({ id, title, imageUrl, duration, ratingCode, releaseDate }) {
    // Function to convert duration to hours and minutes
    const formatDuration = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // Handle pluralization
        const hourString = hours === 1 ? 'hr' : 'hrs';
        const minuteString = minutes === 1 ? 'min' : 'mins';

        // Construct the formatted duration string
        let formattedString = '';
        if (hours > 0 && minutes > 0) {
            formattedString = `${hours} ${hourString} ${minutes} ${minuteString}`;
        } else if (hours > 0) {
            formattedString = `${hours} ${hourString}`;
        } else if (minutes > 0) {
            formattedString = `${minutes} ${minuteString}`;
        }

        return formattedString;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div>
            <MovieCard
                id={id}
                imageUrl={imageUrl}
                title={title} />
            <MovieSummary
                title={title}
                duration={formatDuration(duration)}
                ratingCode={ratingCode}
                releaseDate={formatDate(releaseDate)}
            />
        </div>
    );
}