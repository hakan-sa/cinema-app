import React from "react";

import NavBar from "./NavBar";
import Splash from "./Splash";
import MainContent from "../movie/MainContent";
import ComingSoonScroller from "../movie/ComingSoonScroller";

export default function Home() {
    return (
        <div className="home">
            <NavBar />
            <Splash />
            <MainContent />
            <ComingSoonScroller />
        </div>
    );
}