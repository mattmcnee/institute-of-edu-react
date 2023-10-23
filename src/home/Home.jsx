import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
        <nav className="video-nav flex-div">
                    <div className="nav-left flex-div">
                        <i className="fas fa-bars menu-icon hover-div"></i>
                        <div className="hover-div">New Worksheet</div>
                    </div>
                    <div className="nav-middle flex-div">
                        <div className="bar-content">
                            <div className="progress-container" id="main-bar"></div>
                        </div>
                    </div>
                    <div className="nav-right flex-div">
                        <div className="hover-div" id="nav-week">
                            MarginalRabbit45
                        </div>
                        <i className="fas fa-user hover-div"></i>
                    </div>
                </nav>
      <div className="hero-section">
        <h1>Welcome to Edu</h1>
        <p>Empowering Education, One Click at a Time</p>
        <Link to="/create">
          <button className="cta-button">Create Your Worksheet</button>
        </Link>
      </div>
      <div className="featured-courses">
        <h2>Featured Courses</h2>
        {/* Display featured courses here */}
      </div>
      <div className="about-section">
        <h2>About Edu</h2>
        <p>
          Edu is an online learning platform that offers a wide range of courses for students of all ages.
          Whether you want to learn programming, improve your math skills, or explore creative arts, we have a course for you.
          Join Edu today and start your learning journey!
        </p>
      </div>
    </div>
  );
};

export default Home;
