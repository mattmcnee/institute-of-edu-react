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

  return (
    <input
      placeholder="Subheading"
      value={inputValue}
      onChange={(e) => handleInputChange(e.target.value)}
      className="main-input subheading"
    />
  );
};

export default TitleInput;

