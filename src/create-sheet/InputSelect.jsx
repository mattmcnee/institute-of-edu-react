import React from 'react';

const InputSelect = ({ selectedOption, handleSelectChange, handleAddButtonClick, cancelNewInput, index }) => {
  return (
      <div className="add-input">
        <select value={selectedOption} onChange={handleSelectChange}>
          {/* <option value="heading">Heading</option> */}
          <option value="subheading">Subheading</option>
          <option value="paragraph">Paragraph</option>
          <option value="photo">Photo</option>
          <option value="slideshow">Slideshow</option>
          <option value="video">Video</option>
          <option value="cards">Flashcards/Quiz</option>
          <option value="game">Game</option>
          <option value="code">Code</option>
        </select>
        <button onClick={() => handleAddButtonClick(index)}><i className="fas fa-check"></i></button>
        <button onClick={() => cancelNewInput(index)}><i className="fas fa-times"></i></button>
      </div>
  );
};

export default InputSelect;
