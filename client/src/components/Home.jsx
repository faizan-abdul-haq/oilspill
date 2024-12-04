import React from "react";
import { Link } from "react-router-dom";
import '../styles/home.css';
import  CarousePage  from "./CarouselPage";
function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Platform</h1>
          <p>Experience advanced oil spill detection at your fingertips.</p>
          <div className="hero-buttons">
            <Link to="/register" className="hero-button primary">Join Us</Link>
            <Link to="/about" className="hero-button secondary">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="carousel-section">
        <CarousePage />
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Our Features</h2>
        <div className="features-container">
          <div className="feature-card">
            <h3>Identifying oil spill regions in SAR images</h3>
            <p>You can benifit from our powerful Semantic segmentation model.</p>
          </div>
          <div className="feature-card">
            <h3>Keep track of your work</h3>
            <p>Gain insights through in-depth reports and analytics.</p>
          </div>
          <div className="feature-card">
            <h3>Admin Control</h3>
            <p>Manage detection and response with powerful tools.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta">
        <h2>Start Your Journey</h2>
        <p>Join a community dedicated to environmental protection.</p>
        <Link to="/register" className="cta-button">Get Started</Link>
      </section>
    </div>
  );
}

export default Home;
