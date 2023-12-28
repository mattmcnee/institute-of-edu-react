import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import './form.css';

const MediaInput = ({ inputType, onJsonData, blockId }) => {
  const [inputValue, setInputValue] = useState("");
  const [iframeSrc, setIframeSrc] = useState("");

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    const newData = extractIds(newValue);

    // url = "https://docs.google.com/presentation/d/"+newData.mainId+"/embed?start=false&slide=id."+newData.slideId;

    const jsonData = {
      "id": blockId,
      "data": newData
    };
    onJsonData(jsonData);
    setIframeSrc(newData.embedUrl);
  }

  function extractIds(url) {
    const slidesRegex = /\/presentation\/d\/([a-zA-Z0-9_-]+)/;
    const driveRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const videoRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;


    const slidesMatch = url.match(slidesRegex);
    const driveMatch = url.match(driveRegex);
    const videoMatch = url.match(videoRegex);

    if (slidesMatch) {
      return { mainId: slidesMatch[1], type: "media", embedUrl: "https://docs.google.com/presentation/d/" + slidesMatch[1] + "/embed" };
    } else if (driveMatch) {
      return { mainId: driveMatch[1], type: "media", embedUrl: "https://drive.google.com/file/d/" + driveMatch[1] + "/preview" };
    } else if (videoMatch) {
      return { mainId: videoMatch[1], type: "media", embedUrl: "https://www.youtube.com/embed/" + videoMatch[1] };
    }

    return { embedUrl: "" };
  }

  const getPlaceholderText = (inputType) => {
    switch (inputType) {
      case "photo":
        return "https://drive.google.com/...";
      case "video":
        return "https://youtube.com/...";
      default:
        return "https://docs.google.com/...";
    }
  };


  return (
  <div className="input-container">
  {
    iframeSrc !== "" ?
    <iframe src={iframeSrc} id="media-display" frameBorder="0" className="media-display"></iframe> :
    <div className="media-display"></div>
  }
   <input
      type="text"
      placeholder={getPlaceholderText(inputType)}
      className="main-input"
      value={inputValue}
      onChange={handleInputChange}
    />
  </div> 
  );
};

export default MediaInput;
