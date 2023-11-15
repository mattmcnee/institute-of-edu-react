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
  { "content": "Fundamentals of Mathematics", "link": "/worksheet" },
  { "content": "Algebra Basics", "link": "/worksheet" },
  { "content": "Geometry Essentials", "link": "/worksheet" },
  { "content": "Trigonometry Fundamentals", "link": "/worksheet" },
  { "content": "Calculus Concepts", "link": "/worksheet" },
  { "content": "Statistics for Beginners", "link": "/worksheet" }
];

var cardData2 = [
  { "content": "Epic Trivia Challenge", "link": "/quiz" },
  { "content": "Science Brain Teasers", "link": "/quiz" },
  { "content": "History Masters Quiz", "link": "/quiz" },
  { "content": "Literary Puzzlers", "link": "/quiz" },
  { "content": "GeoQuest Adventure", "link": "/quiz" },
  { "content": "Artistic Enigma", "link": "/quiz" }
];



  return (
    <div className="home-page">
      <Nav title={"Edu"} user={currentUser}/>

      <div className="hero-section">
        {/*<div className="hero-img"></div>*/}
        <img src="src/assets/shapes.png" className="hero-img"></img>
        <div className="hero-text">
          <h2>Edu</h2>
          Edu is an online learning platform that offers a wide range of courses for students of all ages.
          Whether you want to learn programming, improve your math skills, or explore creative arts, we have a course for you.
          Join Edu today and start your learning journey!          
        </div>
      </div>
{/*      <div className="hero-section">
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
      </div>*/}
      
      <CardScroll title="Featured Games" cards={cardData2} />
{/*      <div className="fact-section">
        <h2>Fact of the day</h2>
        <span>Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!</span>
      </div>*/}
      <CardScroll title="Featured Worksheets" cards={cardData} />

    </div>
  );
};

export default Home;
