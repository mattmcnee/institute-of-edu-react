import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const CodeInput = ({ onJsonData, blockId }) => {
  const [inputValue, setInputValue] = useState("");

  // Define the handleChange function
  const handleChange = (value) => {
    setInputValue(value);

    const jsonData = {
      "id": blockId,
      "data": value
    };

    onJsonData(jsonData);
  };

  return (
    <CodeMirror
      value={inputValue}
      height="200px"
      extensions={[javascript()]}
      onChange={handleChange}
    />
  );
};

export default CodeInput;

