import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import heroImg from "../assets/hero.png";
import "../App.css";

export default function Landing() {
    const [showAuth, setShowAuth] = useState(false);
    const navigate = useNavigate();

    return (
        <div>
            <div className="header">
                <div className="project-title">
                    <img src={logo} alt="logo" className="project-logo" />
                    <span>StudentHub</span>
                </div>
            </div>

            <div className="content">
                <div className="hero-text">
                    <h1>Welcome to StudentHub</h1>
                    <p>
                        A state-of-the-art academic collaboration platform for researchers and institutions worldwide. Connect, coordinate, and discover.
                    </p>

                    <div className="button-group">
                        {!showAuth && (
                            <button
                                className="explore-btn"
                                onClick={() => setShowAuth(true)}
                            >
                                Explore Now
                            </button>
                        )}

                        {showAuth && (
                            <>
                                <button
                                    className="login-btn"
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </button>

                                <button className="signup-btn" onClick={() => navigate("/login")}>
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className="hero-image-container">
                    <img src={heroImg} alt="Academic Innovation" className="hero-image" />
                </div>
            </div>

            <div className="footer">
                @ 2026 StudentHub
            </div>
        </div>
    );
}
