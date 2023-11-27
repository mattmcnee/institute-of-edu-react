import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import CardScroll from './Cards';
import Nav from '/src/Nav';
import { getDatabase, ref, onValue } from 'firebase/database';
import shapesImage from '/src/assets/shapes.png';

const Home = ({setTitle}) => {
  setTitle("Edu Homepage");

  const [currentUser, setCurrentUser] = useState(null);
  const [cardData, setCardData] = useState([]);
  const [cardData2, setCardData2] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen for changes in the user's authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.displayName || user.email);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const worksheetRef = ref(db, '/sheets');

    // Fetch worksheet data
    onValue(worksheetRef, (snapshot) => {
      const sheetsData = snapshot.val();
      // Assuming the structure of your data
      setCardData(sheetsData || []);
      setCardData2(sheetsData || []);
    }, (error) => {
      console.error("Error reading sheets: ", error);
    });
  }, [setTitle]);

  return (
    <div className="home-page">
      <Nav title={"Edu"} user={currentUser} />

      <div className="hero-section">
        <img src={shapesImage} className="hero-img" alt="Shapes" />
        <div className="hero-text">
          <h2>Edu</h2>
          Edu is an online learning platform that offers a wide range of courses for students of all ages.
          Whether you want to learn programming, improve your math skills, or explore creative arts, we have a course for you.
          Join Edu today and start your learning journey!
        </div>
      </div>
      
      <CardScroll title="Featured Games" data={cardData2} />
      <CardScroll title="Featured Worksheets" data={cardData} />
    </div>
  );
};

export default Home;

