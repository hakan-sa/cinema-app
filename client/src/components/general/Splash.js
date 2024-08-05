import React from 'react';
import './Splash.css';

export default function Splash() {

    return (
        <div className='splash-container'>
            {/* Video */}
            <video autoPlay muted loop style={{
                position: 'absolute',
                width: '100%',
                left: '50%',
                top: '50%',
                height: '100%',
                objectFit: 'cover',
                transform: 'translate(-50%, -50%)',
                zIndex: '-1',
            }}>
                <source src="./starocean.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="d-flex flex-column">
                <div className="sign sign-body">
                    <span className="fast-flicker">S</span>tar<span className="flicker">G</span>azer
                </div>
            </div>
            <div className="subheader">
                <h4>Cinema E-Booking System Demo</h4>
            </div>

            <div className="transition-overlay"></div>
        </div>
    );
}
