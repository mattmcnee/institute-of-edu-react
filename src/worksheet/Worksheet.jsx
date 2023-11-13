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

  console.log("Home!!!");
  console.log(worksheetData);
  return (
    <div className="home-page">
      <Nav title={"New Worksheet"} user={currentUser}/>
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

