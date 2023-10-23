import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PairsInput from './PairsInput.jsx';
import MediaInput from './MediaInput.jsx';
import './form.css';


const Form = () => {
  const [selectedOption, setSelectedOption] = useState("subheading");
  const [inputs, setInputs] = useState([]);
  const [jsonData, setJsonData] = useState([]);

  const handleJsonData = (data) => {
    var updatedJson;
    const newJson = [...jsonData];
    const isIdExists = newJson.some(item => item.id === data.id);
    if (isIdExists) {
      updatedJson = newJson.map(item => {
        if (item.id === data.id) {
          return data; // Replace existing object with the same id
        }
        return item;
      });
    }
    else{
      updatedJson = [...jsonData, data];
    }
    setJsonData(updatedJson);
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleAddButtonClick = () => {
    const newInputs = [...inputs];
    newInputs.push({
      id: new Date().getTime(),
      label: selectedOption,
      value: "",
    });
    setInputs(newInputs);
    console.log("Selected Option:", selectedOption);
  };

  const handleInputChange = (id, value) => {
    const updatedInputs = inputs.map((input) =>
      input.id === id ? { ...input, value } : input
    );
    setInputs(updatedInputs);
  };

  const handleDeleteButtonClick = (id) => {
    const updatedInputs = inputs.filter((input) => input.id !== id);
    setInputs(updatedInputs);
  };

const handleSubmit = () => {
  const updatedFormValues = inputs.map((input) => {
    // Find all objects in jsonData where id matches input.id
    const matchedObjects = jsonData.filter((item) => item.id === input.id);

    // Extract data from the matched objects
    const matchedData = matchedObjects.map((matchedItem) => matchedItem.data);
    const newData = (matchedData.length > 0) ? matchedData[0] : null;

    return {
      label: input.label,
      value: {"title": input.value, "data": newData},
      id: input.id
    };
  });

  console.log("Form Values:", updatedFormValues);
};

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const redirectToGoogleDrive = () => {
    window.open("https://drive.google.com", "_blank"); // Opens Google Drive in a new tab
  };

  const redirectToGoogleSlides = () => {
    window.open("https://slides.google.com", "_blank"); // Opens Google Slides in a new tab
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedInputs = Array.from(inputs);
    const [removed] = reorderedInputs.splice(result.source.index, 1);
    reorderedInputs.splice(result.destination.index, 0, removed);

    setInputs(reorderedInputs);
  };

  return (
    <div className="react-form">
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="inputs">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {inputs.map((input, index) => (
              <Draggable key={input.id} draggableId={input.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="input-area"
                  >
                    <div className="top-input">
                    <label>{capitalizeFirstLetter(input.label)}</label>
                    {input.label === "paragraph" && (
                      <textarea
                        placeholder="Enter Paragraph"
                        value={input.value}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                        className="main-input"
                      />
                    )}
                  {input.label === "media" && (

                    <MediaInput inputValue={"media"} onJsonData={handleJsonData} blockId={input.id}/>
                    )}
                  {input.label === "cards" && (
                    <PairsInput inputValue={"cards"} onJsonData={handleJsonData} blockId={input.id}/>
                  )}
                    </div>
                      {input.label === "photo" && (
                        <button className="top-input" onClick={redirectToGoogleDrive}>
                          <i className="fas fa-external-link-alt"></i>
                        </button>
                      )}
                      {input.label === "slide" && (
                        <button className="top-input" onClick={redirectToGoogleSlides}>
                          <i className="fas fa-external-link-alt"></i>
                        </button>
                      )}
                      
                      <div className="drag-handle" {...provided.dragHandleProps}>
                        <i className="fas fa-bars"></i>
                      </div>
                      <button className="top-input" onClick={() => handleDeleteButtonClick(input.id)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>

                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="add-input">
        <select value={selectedOption} onChange={handleSelectChange}>
          <option value="subheading">Subheading</option>
          <option value="paragraph">Paragraph</option>
          <option value="media">Photo</option>
          <option value="media">Slideshow</option>
          <option value="cards">Flashcards/Quiz</option>
        </select>
        <button onClick={handleAddButtonClick}><i className="fas fa-plus"></i></button>
      </div>
      <div className="submit-form">
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </DragDropContext>
    </div>
  );
};


export default Form;
