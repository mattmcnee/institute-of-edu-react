import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const Signup = ({ setTitle }) => {
  setTitle('Create Account');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Get access to the history object

  useEffect(() => {
    // Check if a user is already signed in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to '/worksheet' or another authenticated route
        navigate('/worksheet');
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [auth, navigate]);

  // Function to write user data
  const writeUserData = (userId, name, email) => {
    set(ref(database, 'users/' + userId), {
      username: name,
      email: email
    });
  };

  // Function to handle account creation
  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Account created successfully
        const user = userCredential.user;
        writeUserData(user.uid, 'New User', email);
        setError(null);
        
        // Redirect to '/worksheet'
        navigate('/worksheet')
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div>
      <Link to="/login">
        <button className="cta-button">Already have an account? Log In</button>
      </Link>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleCreateAccount}>Create Account</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Signup;
