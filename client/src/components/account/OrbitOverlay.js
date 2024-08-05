import React from 'react';

import './OrbitOverlay.css';

export default function OrbitOverlay() {
  return (
    <div id="orbit-container">
      <div id="inner-orbit">
        <div className="inner-orbit-cirlces"></div>
      </div>
      <div id="middle-orbit">
        <div className="middle-orbit-cirlces"></div>
      </div>
      <div id="outer-orbit">
        <div className="outer-orbit-cirlces"></div>
      </div>
    </div>
  );
}