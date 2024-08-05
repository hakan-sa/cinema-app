import React from 'react';
import "./NavBar.css";
import NavBar from './NavBar';
import "./LoadingScreen.css";
import WarpSpeed from './WarpSpeed';


export default function LoadingScreen({ speedMultiplier }) {
    return (
        <div className="loading-screen">
            <NavBar />
            <WarpSpeed speedMultiplier={speedMultiplier}/>
            <div id="loading-wrapper">
                <div id="loading-text">LOADING</div>
                <div id="loading-content"></div>
            </div>
        </div>
    );
}