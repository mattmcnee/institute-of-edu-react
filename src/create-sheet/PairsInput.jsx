import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push } from 'firebase/database';
import { getAuth, onAuthStateChanged  } from 'firebase/auth';
import './form.css';

// Configure and initialize firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);


const PairsInput = ({ inputValue, onJsonData, blockId }) => {
  const [inputs, setInputs] = useState([{ id: 0, key: 0, textarea1: "", textarea2: "", }]);
  const [rotatedButtons, setRotatedButtons] = useState({});
  const [jsonData, setJsonData] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, update the current user state
        setCurrentUser(user.displayName || user.email);
        setCurrentUserId(user.uid);
      } else {
        // User is signed out, set currentUser to null
        setCurrentUser(null);
        setCurrentUserId(null);
      }
      console.log(currentUser);
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

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
    textarea.style.height = textarea.scrollHeight + 'px';

    setInputs(updatedInputs);
    // returnJsonData(updatedInputs);
  };

  const handleSubmit = () => {
    console.log(inputs)
    const updatedFormValues = inputs.map((input, index) => {
      // Find all objects in jsonData where id matches input.id
      const matchedObjects = jsonData.filter((item) => item.id === input.id);

      // Extract data from the matched objects
      const matchedData = matchedObjects.map((matchedItem) => matchedItem.data);
      const newData = (matchedData.length > 0) ? matchedData[0] : null;

      return {
        "textarea1": input.textarea1,
        "textarea2": input.textarea2,
        id: input.id,
        order: index
      };
    });
    console.log(updatedFormValues)
    writeUserData(updatedFormValues);
    // console.log("Form Values:", updatedFormValues);
  };

  const writeUserData = (data) => {
    if(currentUserId){
      console.log(data)
      const sheetData = {
        title: "title",
        data: data
      };
      console.log(currentUser);
      
    const newSheetRef = push(ref(database, 'cards/'));
    set(newSheetRef, sheetData)    
    }
  };

  const returnJsonData = (newInputs) => {
    const sendBack = {
      "id": blockId,
      "data": newInputs
    }
    // onJsonData(sendBack);
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
    // returnJsonData(updatedInputs);

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
    // returnJsonData(updatedInputs);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedInputs = Array.from(inputs);
    const [removed] = reorderedInputs.splice(result.source.index, 1);
    reorderedInputs.splice(result.destination.index, 0, removed);

    setInputs(reorderedInputs);
    // returnJsonData(reorderedInputs);
  };

  return (
    <div className="pairs-input">
      <div className="form-title">
        <input
          placeholder="Title"
          className="main-input"
        />
      </div>
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
      <div className="form-options">
        <div className="submit-form">
          <button>Save Draft</button>
        </div>
      <div className="submit-form">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </DragDropContext>
    </div>
  );
};

export default PairsInput;