import React, { useState } from 'react';
const TitleInput = ({ onJsonData, blockId }) => {
  const [inputValue, setInputValue] = useState("");

  // Define the handleChange function
  const handleInputChange = (value) => {
    setInputValue(value);
    console.log("Editor value:", value);

    const jsonData = {
      "id": blockId,
      "data": value
    };

    console.log(jsonData)
    onJsonData(jsonData);
  };

  const adjustHeight = (element) => {
    if (element) {
      element.style.height = 'auto';
      // console.log(element.scrollHeight)
      element.style.height = `${element.scrollHeight}px`;       

    }
  };

  return (
    <textarea
      placeholder="Text"
      value={inputValue}
      rows="1"
      onChange={(e) => {
        handleInputChange(e.target.value);
        adjustHeight(e.target);
      }}                        
      className="main-input"
    />
  );
};

export default TitleInput;

