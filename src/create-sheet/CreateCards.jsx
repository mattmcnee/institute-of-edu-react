import React from 'react';
import Form from './Form.jsx';
import Nav from '/src/Nav';
import PairsInput from './PairsInput.jsx';

const CreateCards = ({setTitle}) => {
    setTitle("New Question Set");

  return (
    <div className="create-page">
      <Nav title={"Create Worksheet"}/>
      <div className="container play-container" id="main-box">
        <div id="form-entry" className="form-container">
          <PairsInput/>
        </div>
      </div>
    </div>
  );
};

export default CreateCards;