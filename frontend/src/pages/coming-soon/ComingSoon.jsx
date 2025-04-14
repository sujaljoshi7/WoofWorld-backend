import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ComingSoon.css";
import logo from "../../assets/images/logo/logo1.png";

function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <h1 className="title">Coming Soon</h1>
        <p className="subtitle">We're working on something amazing!</p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Enhanced Features</h3>
            <p>New and improved functionality coming your way</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Better Experience</h3>
            <p>Improved user interface and navigation</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Innovative Solutions</h3>
            <p>Cutting-edge technology for better service</p>
          </div>
        </div>

        <div className="countdown-container">
          <div className="countdown-item">
            <span className="countdown-number">30</span>
            <span className="countdown-label">Days</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">12</span>
            <span className="countdown-label">Hours</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">45</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">30</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>

        <div className="cta-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
