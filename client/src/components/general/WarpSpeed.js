import React, { useEffect, useRef } from 'react';
import './WarpSpeed.css';

export default function WarpSpeed({ speedMultiplier }) {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    const stars = useRef([]);
    const warpSpeed = useRef(0);
    const xMod = useRef(0);
    const yMod = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        function handleResize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', handleResize);

        class Star {
            constructor() {
                this.myX = Math.random() * canvas.width;
                this.myY = Math.random() * canvas.height;
                this.myColor = 0;
            }

            updatePos() {
                let speedMult = speedMultiplier; //0.02
                if (warpSpeed.current) {
                    speedMult = speedMultiplier * 5; //0.28
                }
                this.myX += xMod.current + (this.myX - (window.innerWidth / 2)) * speedMult;
                this.myY += yMod.current + (this.myY - (window.innerHeight / 2)) * speedMult;
                this.updateColor();

                if (this.myX > window.innerWidth || this.myX < 0) {
                    this.myX = Math.random() * window.innerWidth;
                    this.myColor = 0;
                }
                if (this.myY > window.innerHeight || this.myY < 0) {
                    this.myY = Math.random() * window.innerHeight;
                    this.myColor = 0;
                }
            }

            updateColor() {
                if (this.myX > canvas.width || this.myX < 0 || this.myY > canvas.height || this.myY < 0) {
                    this.myX = Math.random() * canvas.width;
                    this.myY = Math.random() * canvas.height;
                    this.myColor = 0;
                } else {
                    this.myColor = Math.min(this.myColor + 5, 255);
                }
            }
        }

        for (let i = 0; i < 200; i++) {
            stars.current.push(new Star());
        }

        function draw() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            stars.current.forEach(star => {
                ctx.fillStyle = `rgb(${star.myColor}, ${star.myColor}, ${star.myColor})`;
                ctx.fillRect(star.myX, star.myY, star.myColor / 128, star.myColor / 128);
                star.updatePos();
            });
            requestRef.current = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(requestRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [speedMultiplier]);

    useEffect(() => {
        const canvas = canvasRef.current;

        const handleMouseDown = () => {
            warpSpeed.current = 1;
        };

        const handleMouseUp = () => {
            warpSpeed.current = 0;
            xMod.current = 0;
            yMod.current = 0;
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} id="myCanvas"></canvas>
        </div>
    );
}
