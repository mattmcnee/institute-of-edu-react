import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import './form.css';

const PairsInput = ({ inputValue, onJsonData, blockId }) => {
  const [inputs, setInputs] = useState([{ id: 0, key: 0, textarea1: "", textarea2: "", }]);
  const [rotatedButtons, setRotatedButtons] = useState({});

  const handleInput = (event, id, textareaNumber) => {
    const updatedInputs = inputs.map((input) => {
      if (input.id === id) {
        return {
          ...input,
          [textareaNumber === 1 ? "textarea1" : "textarea2"]: event.target.value,
        };
      }
      return input;
    });

    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 5 + 'px';

    setInputs(updatedInputs);
    returnJsonData(updatedInputs);
  };

  const returnJsonData = (newInputs) => {
    const sendBack = {
      "id": blockId,
      "data": newInputs
    }
    onJsonData(sendBack);
  }

  const handleSwapButtonClick = (id) => {
    const updatedInputs = inputs.map((input) => {
      if (input.id === id) {
        return {
          ...input,
          textarea1: input.textarea2,
          textarea2: input.textarea1,
        };
      }
      return input;
    });

    setInputs(updatedInputs);
    returnJsonData(updatedInputs);

    setRotatedButtons(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const addInput = () => {
    const newIndex = inputs.length;
    const newInput = {
      id: new Date().getTime(),
      key: newIndex,
      textarea1: "",
      textarea2: "",
    };
    setInputs([...inputs, newInput]);
    var div = document.getElementById('set-scroll');

    setTimeout(function() {    
      div.scrollTo({
        top: div.scrollHeight - div.clientHeight,
        behavior: 'smooth'
      });
    },100); 

  };

  const handleDeleteButtonClick = (id) => {
    const updatedInputs = inputs.filter((input) => input.id !== id);
    setInputs(updatedInputs);
    returnJsonData(updatedInputs);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedInputs = Array.from(inputs);
    const [removed] = reorderedInputs.splice(result.source.index, 1);
    reorderedInputs.splice(result.destination.index, 0, removed);

    setInputs(reorderedInputs);
    returnJsonData(reorderedInputs);
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <Droppable droppableId="droppable" >
        {(provided) => (
          <div className="drop-scroll" id="set-scroll" {...provided.droppableProps} ref={provided.innerRef}>
            {inputs.map((input, index) => (
              <Draggable key={input.id} draggableId={input.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="extra-input-holder"
                  >
                    <div className="textarea">
                      <textarea
                        type="text"
                        onInput={(event) => handleInput(event, input.id, 1)}
                        value={input.textarea1}
                        className="extra-input"
                      ></textarea>
                    </div>
                    <div className="extra-input-gap" >
                      <button
                        onClick={() => handleSwapButtonClick(input.id)}
                        className={`rotate-button ${rotatedButtons[input.id] ? 'rotated' : ''}`}
                      >
                        <i className="fas fa-exchange-alt"></i>
                      </button>
                      <div className="drag-handle" {...provided.dragHandleProps}>
                        <i className="fas fa-bars"></i>
                      </div>
                      <button onClick={() => handleDeleteButtonClick(input.id)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                    <div className="textarea">
                      <textarea
                        type="text"
                        onInput={(event) => handleInput(event, input.id, 2)}
                        value={input.textarea2}
                        className="extra-input"
                      ></textarea>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="extra-input-add">
        <button onClick={addInput}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </DragDropContext>
  );
};

export default PairsInput;