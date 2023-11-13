import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import CardScroll from './Cards';
import Nav from '/src/Nav';

const Home = ({setTitle}) => {
  setTitle("Edu Homepage");

  const [currentUser, setCurrentUser] = useState(null);

  // Listen for changes in the user's authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, update the current user state
        setCurrentUser(user.displayName || user.email);
      } else {
        // User is signed out, set currentUser to null
        setCurrentUser(null);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  var cardData = [
  { "content": "Card 1 Content", "link": "/worksheet" },
  { "content": "Card 2 Content", "link": "/worksheet" },
  { "content": "Card 3 Content", "link": "/worksheet" },
  { "content": "Card 4 Content", "link": "/worksheet" },
  { "content": "Card 5 Content", "link": "/worksheet" },
  { "content": "Card 6 Content", "link": "/worksheet" }
];


  return (
    <div className="home-page">
      <Nav title={"Edu"} user={currentUser}/>
      <div className="hero-section">
        <h1>Welcome to Edu</h1>
        <p>Empowering Education, One Click at a Time</p>
        <Link to="/create">
          <button className="cta-button">Create Your Worksheet</button>
        </Link>
        <Link to="/chart">
          <button className="cta-button">View Chart Demo</button>
        </Link>
        <Link to="/quiz">
          <button className="cta-button">View Quiz Demo</button>
        </Link>
        <Link to="/bird">
          <button className="cta-button">View Bird Demo</button>
        </Link>
        <Link to="/worksheet">
          <button className="cta-button">View Worksheet Demo</button>
        </Link>
        <Link to="/login">
          <button className="cta-button">Login</button>
        </Link>
      </div>
      <h2>Worksheets</h2>
      <CardScroll cards={cardData} />
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
