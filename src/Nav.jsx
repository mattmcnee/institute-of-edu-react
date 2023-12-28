import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

function Nav({ title}) {
  const [currentUser, setCurrentUser] = useState(null);

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

  return (
    <nav className="video-nav flex-div">
      <div className="nav-left flex-div">
        <Link to="/">
        <div className="hover-div">Lexicon+</div>
        </Link>
      </div>

{/*      <div className="nav-middle flex-div">
        <div className="bar-content">
          <div className="progress-container" id="main-bar"></div>
        </div>
      </div>*/}
      <div className="nav-right flex-div">
        {currentUser ? (
          <>
            <Link to="/">
              <div className="hover-div" id="nav-week">
                {currentUser}
              </div>
            </Link>
            <i className="fas fa-user hover-div" onClick={handleLogout}></i>
          </>
        ) : (
          <Link to="/login">
            <div className="hover-div" id="nav-week">
              Login
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Nav;
