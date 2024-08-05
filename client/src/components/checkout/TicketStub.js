import React from 'react';
import { Container, Col } from 'react-bootstrap';
import './TicketStub.css';

const TicketStub = ({ show, type, movie, price }) => {

    // Function to convert duration to hours and minutes
    const formatDuration = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // Format Duration
        const hourString = hours === 1 ? 'h' : 'h';
        const minuteString = minutes === 1 ? 'm' : 'm';

        // Format Duration
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

    const formattedDuration = formatDuration(movie.duration);

    return (
        <figure className="ticket-stub">
            <div className="ticket-stub-poster">
                <img src={movie.poster_link} className="ticket-stub-img" />
            </div>
            <div className="ticket-stub-content p-2">
                <div className="ticket-stub-title">
                    <h1 className="heading-primary">{movie.title} <i className="fas fa-fire"></i></h1>
                </div>
                <p className="ticket-stub-description">
                    {movie.synopsis.length > 150 ? `${movie.synopsis.substring(0, 150)}...` : movie.synopsis}
                </p>
                <div className="ticket-stub-details">
                    <p className="ticket-stub-detail"><span className="icons icons-red"> </span>{show.showTime.show_time} |</p>
                    <p className="ticket-stub-detail"><span className="icons icons-grey"><i className="fas fa-clock"></i> </span>{formattedDuration} |</p>
                    <p className="ticket-stub-detail"><span className="icons icons-yellow"><i className="fas fa-file-invoice-dollar"></i>
                    </span>{show.showroom.name} Showroom</p>
                </div>
            </div>
            <div className="ticket-stub-price">{type}: ${price}.00</div>
        </figure>
    );
};

export default TicketStub;
