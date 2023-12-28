import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push } from 'firebase/database';
import { getAuth, onAuthStateChanged  } from 'firebase/auth';
import PairsInput from './PairsInput.jsx';
import MediaInput from './MediaInput.jsx';
import CodeInput from './CodeInput.jsx';
import TitleInput from './TitleInput.jsx';
import ParagraphInput from './ParagraphInput.jsx';
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
  const [title, setTitle] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [addNew, setAddNew] = useState(false);

  const [popupState, setPopupState] = useState({ isVisible: false, x: 0, y: 0 });

    const codeRefs = useRef({});

  // Highlight code whenever inputs change
 useEffect(() => {
    Object.values(codeRefs.current).forEach(element => {
      if (element) {
        element.removeAttribute('data-highlighted'); // Unset the highlighted attribute
        hljs.highlightElement(element);
      }
    });
  }, [inputs]);
  function convertToFirebaseFormat(data) {
    const firebaseFormat = {};
    data.sections.forEach((section, index) => {
      // Adding an 'order' property to each section
      const sectionWithOrder = { ...section, order: index };
      firebaseFormat[section.id] = sectionWithOrder;
    });
    return firebaseFormat;
  }

  function convertToFirebaseFormat2(data) {
    const firebaseFormat = {};
    data.forEach((section, index) => {
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
      console.log(data)
      const sheetData = {
        title: title,
        data: convertToFirebaseFormat2(data)
      };
      console.log(currentUser);
      
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
    console.log(updatedJson)
    setJsonData(updatedJson);
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleAddButtonClick = () => {
    // const newInputs = inputs.map(input => ({ ...input, isHovered: false }));
    const newInputs = [...inputs];
    newInputs.push({
      id: new Date().getTime(),
      label: selectedOption,
      value: { text: "" },
      isHovered: false,
    });
    setInputs(newInputs);
    console.log("Selected Option:", selectedOption);
    setAddNew(false);
  };

  const handleDeleteButtonClick = (id) => {
    const updatedInputs = inputs.filter((input) => input.id !== id);
    setInputs(updatedInputs);
  };

  const handleSubmit = () => {
    const updatedFormValues = inputs.map((input, index) => {
      // Find all objects in jsonData where id matches input.id
      const matchedObjects = jsonData.filter((item) => item.id === input.id);

      // Extract data from the matched objects
      const matchedData = matchedObjects.map((matchedItem) => matchedItem.data);
      const newData = (matchedData.length > 0) ? matchedData[0] : null;

      return {
        label: input.label,
        data: newData,
        id: input.id,
        order: index
      };
    });
    writeUserData(updatedFormValues);
    console.log("Form Values:", updatedFormValues);
  };

  const handleMouseEnter = (id) => {
    setInputs(inputs.map(input => 
      ({ ...input, isHovered: input.id === id })
    ));
  };

  const handleMouseLeave = (id) => {
    setInputs(inputs.map(input => 
      input.id === id ? { ...input, isHovered: false } : input
    ));
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

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination) {
      return;
    }

    const reorderedInputs = Array.from(inputs);
    const [removed] = reorderedInputs.splice(result.source.index, 1);
    reorderedInputs.splice(result.destination.index, 0, removed);

    setInputs(reorderedInputs);
  };

  const addNewInput = () => {
    setAddNew(true);
    console.log(addNew)
    console.log("HIII")
  };

  return (
    <div className="new-worksheet-form">
{/*    <label>Title</label>
    <input
      placeholder="Enter Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="main-input"
    />*/}

    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Droppable droppableId="inputs">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {inputs.map((input, index) => (
              <Draggable key={input.id} draggableId={input.id.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={snapshot.isDragging ? "worksheet-section drag" : "worksheet-section"}
                    onMouseEnter={() => handleMouseEnter(input.id)}
                    onMouseLeave={() => handleMouseLeave(input.id)}
                  >
                    <div 
                      className={(input.isHovered && !isDragging) || snapshot.isDragging ? "button-options" : "button-options transparent"}
                    >
                      <div className="drag-handle" {...provided.dragHandleProps}>
                        <i className="fas fa-bars"></i>
                      </div>
                    </div>

               
                    {/* This div will be filled with content corresponding to its label */}
                    <div className="input-container">
                      {/* <label>{capitalizeFirstLetter(input.label)}</label>*/}

                      {/* Paragraph entry */}
                      {input.label === "paragraph" && (
                        <ParagraphInput onJsonData={handleJsonData} blockId={input.id}/>
                      )}

                      {/* Code entry */}
                      {input.label === "code" && (
                        <CodeInput onJsonData={handleJsonData} blockId={input.id}/>
                      )}
                      {/* Subheading entry */}
                      {input.label === "subheading" && (
                        <TitleInput onJsonData={handleJsonData} blockId={input.id}/>
                      )}

                      {/* Presentation entry */}
                      {input.label === "media" && (
                        <MediaInput inputValue={"media"} onJsonData={handleJsonData} blockId={input.id}/>
                      )}

                      {/* Photo entry */}
                      {input.label === "photo"  && (
                        <MediaInput inputValue={"media"} onJsonData={handleJsonData} blockId={input.id}/>
                      )}

                      {/* Card set entry */}
                      {input.label === "cards" && (
                        <PairsInput inputValue={"cards"} onJsonData={handleJsonData} blockId={input.id}/>
                      )}
                    </div>
                    <div 
                      className={(input.isHovered && !isDragging) || snapshot.isDragging ? "button-options" : "button-options transparent"}
                    >
                      <button className="edit-button">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteButtonClick(input.id)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                    {/* <div className="bottom-box">
                      ----- + -----
                    </div>*/}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="new-input-select">
      {!addNew ? (
          <button onClick={addNewInput}><i className="fas fa-plus"></i></button>
      ) : (
        <div className="add-input">
          <select value={selectedOption} onChange={handleSelectChange}>
            {/*<option value="heading">Heading</option>*/}
            <option value="subheading">Subheading</option>
            <option value="paragraph">Paragraph</option>
            <option value="media">Photo</option>
            <option value="media">Slideshow</option>
            <option value="cards">Flashcards/Quiz</option>
            <option value="code">Code</option>
          </select>
          <button onClick={handleAddButtonClick}><i className="fas fa-plus"></i></button>
        </div>
      )}
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


export default Form;
