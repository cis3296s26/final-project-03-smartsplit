import React from "react";
import { useNavigate } from "react-router-dom";
import aboutIcon from "../images/about.jpeg";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <button className="info-button" onClick={() => navigate("/about")}>
          <img src={aboutIcon} alt="About" className="info-icon" />
        </button>

        <div className="hero-card">
          <div className="brand-badge">SmartSplit</div>
          <h1 className="hero-title">Split expenses without the stress</h1>
          <p className="hero-subtitle">
            Manage shared household costs, create groups, and keep roommate finances organized
            in one place.
          </p>

          <div className="button-stack">
            <button className="primary-button" onClick={() => navigate("/create")}>
              Create Household
            </button>

            <button className="primary-button" onClick={() => navigate("/join")}>
              Join Household
            </button>

            <button className="primary-button" onClick={() => navigate("/households")}>
              My Households
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default HomePage;
