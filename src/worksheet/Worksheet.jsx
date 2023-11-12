import React, { useState, useEffect } from 'react';
import Game from '/src/three/Game';
import worksheetData from './worksheetData.json';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Worksheet = ({ setTitle }) => {
  setTitle("Game Worksheet");
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

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // User has been signed out
        setCurrentUser(null); // Clear the currentUser state
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  console.log("Home!!!");
  console.log(worksheetData);
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
            {currentUser ? currentUser : "Guest"}
          </div>
          <i className="fas fa-user hover-div" onClick={handleLogout}></i>
        </div>
      </nav>
      <div className="worksheet-conatiner">
        {worksheetData.sections.map((section) => (
          <div key={section.id} className="worksheet-section">
            {section.label === 'subheading' && <h2>{section.value.text}</h2>}
            {section.label === 'paragraph' && <p>{section.value.text}</p>}
            {section.label === 'game' && (
              <div className="game-container">
                <div className="game-window">
                  {/* You can pass the gameType and src as props if needed */}
                  <Game gameType={section.value.data.gameType} src={section.value.data.src} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Worksheet;

