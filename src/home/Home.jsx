import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Our Worksheet App!</h1>
      <p>
        This is a simple React application demonstrating the usage of the Worksheet component.
      </p>
      <p>Click the button below to view the worksheet:</p>
      <Link to="/worksheet">
        <button>View Worksheet</button>
      </Link>
    </div>
  );
};

export default Home;
