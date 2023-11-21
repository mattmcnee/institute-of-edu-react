import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push } from 'firebase/database';
import { getAuth, onAuthStateChanged  } from 'firebase/auth';
import PairsInput from './PairsInput.jsx';
import MediaInput from './MediaInput.jsx';
import worksheetData from '/src/worksheet/worksheetData.json';
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

const Form = () => {
  const [selectedOption, setSelectedOption] = useState("subheading");
  const [inputs, setInputs] = useState([]);
  const [jsonData, setJsonData] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);


  function convertToFirebaseFormat(data) {
    const firebaseFormat = {};
    data.sections.forEach((section, index) => {
      // Adding an 'order' property to each section
      const sectionWithOrder = { ...section, order: index };
      firebaseFormat[section.id] = sectionWithOrder;
    });
    return firebaseFormat;
  }

  // Listen for changes in the user's authentication state
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

  const writeUserData = (data) => {
    if(currentUserId){
      const sheetData = {
        title: "My New Sheet",
        data: convertToFirebaseFormat(worksheetData)
      };
      console.log(currentUser);
      console.log(convertToFirebaseFormat(worksheetData))
    const newSheetRef = push(ref(database, 'sheets/'));
    set(newSheetRef, sheetData)    
    }
  };

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
  writeUserData(updatedFormValues);
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
