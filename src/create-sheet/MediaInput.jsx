import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import './form.css';

const MediaInput = ({ onJsonData, blockId }) => {
  const [inputValue, setInputValue] = useState("");
  const [iframeSrc, setIframeSrc] = useState("");

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    const newData = extractIds(newValue);

    url = "https://docs.google.com/presentation/d/"+newData.mainId+"/embed?start=false&slide=id."+newData.slideId;

    const jsonData = {
      "id": blockId,
      "data": newData
    };
    onJsonData(jsonData);
    setIframeSrc(newData.embedUrl);
  }

  function extractIds(url) {
    const regex = /\/d\/([a-zA-Z0-9_-]+)(?:\/edit(?:\?|#)slide=id\.([a-zA-Z0-9_]+))?|\/file\/d\/([a-zA-Z0-9_-]+)\//;
    const match = url.match(regex);

    const slidesRegex = /\/presentation\/d\/([a-zA-Z0-9_-]+)/;
    const driveRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;

    var type = null;
    if(url.match(slidesRegex)){
      type = "slide";
    }else if(url.match(driveRegex)){
      type = "photo";
    }

    if (match) {
        const mainId = match[1] || match[3];
        const slideId = match[2] || null;
        var embedUrl;
        if(type == "slide"){
          embedUrl = "https://docs.google.com/presentation/d/"+mainId+"/embed?start=false&slide=id."+slideId;
        }
        else if (type == "photo"){
          embedUrl = "https://drive.google.com/file/d/"+mainId+"/preview";
        }
        return { mainId, slideId, type, embedUrl };
    } else {
        return null;
    }
}

  return (
    <div className="top-input">
    <input
      type="text"
      placeholder={"https://drive.google.com/file/..."}
      className="main-input"
      value={inputValue}
      onChange={handleInputChange}
    />
    <iframe src={iframeSrc} id="media-display" frameBorder="0" width="100%" height="300px" className="media-display"></iframe>
  </div> 
  );
};

export default MediaInput;
