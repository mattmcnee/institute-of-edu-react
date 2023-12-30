import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Game from '/src/three/Game';
import { getDatabase, ref, get } from 'firebase/database';
import Nav from '/src/Nav';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import './worksheet.css';

const Worksheet = ({ setTitle }) => {
  const [worksheetData, setWorksheetData] = useState([]);
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  let { id } = useParams();

  useEffect(() => {
    setTitle("Game Worksheet");
    
    // Firebase database reference to the specific location
    const db = getDatabase();
    const worksheetRef = ref(db, `/sheets/${id}`);
    const cardsRef = ref(db, `/cards/-Nmv2UvDw3pJHy1Z2nwG`);

    
    // Fetch the data from Firebase
    get(worksheetRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const firebaseData = snapshot.val().data;
          const cleanedSections = convertToJsonArray(firebaseData);
          setWorksheetData(cleanedSections);
          console.log(cleanedSections);
        } else {
          console.log('No data available');
        }
        setLoading(false); // Mark loading as complete
      })
      .catch((error) => {
        console.error('Error getting data:', error);
        setLoading(false); // Mark loading as complete, even in case of an error
      });

    get(cardsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const firebaseData = snapshot.val().data;
          const cleanedSections = convertToJsonArray(firebaseData);
          setCardsData(cleanedSections);
          console.log(cleanedSections);
        } else {
          console.log('No data available');
        }
        setLoading(false); // Mark loading as complete
      })
      .catch((error) => {
        console.error('Error getting data:', error);
        setLoading(false); // Mark loading as complete, even in case of an error
      });
  }, [setTitle]);

  function convertToJsonArray(firebaseData) {
    if (!firebaseData) return []; // Handle empty data gracefully

    // Convert the object into an array of its values
    const sectionsArray = Object.values(firebaseData);
    sectionsArray.sort((a, b) => a.order - b.order);

    // Remove the 'order' property from each section
    const cleanedSections = sectionsArray.map(section => {
      const { order, ...cleanSection } = section;
      return cleanSection;
    });
    return cleanedSections;
  }

  if (loading) {
    // Display a loading indicator while fetching data
    return (
      <div className="home-page">
        <Nav title={"New Worksheet"}/>
        <div className="worksheet-container">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Nav title={"New Worksheet"}/>
      <div className="worksheet-container">
        {worksheetData.map((section) => (
          <div key={section.id} className="worksheet-section">
            <div className="content-container">
            {section.label === 'subheading' && <p className="subheading">{section.data}</p>}
            {section.label === 'paragraph' && <p>{section.data}</p>}
            {section.label === 'game' && (
              <div className="game-container">
                <div className="game-window">
                  <Game gameType={"bird"} src={""} />
                </div>
              </div>
            )}
            {section.label === 'slideshow' || section.label === 'photo' || section.label === 'video' && (
              <iframe src={section.data.embedUrl} id="media-display" frameBorder="0" className="media-display"></iframe>
            )}
            {section.label === 'code' && (
              <CodeMirror
                value={section.data}
                height="200px"
                extensions={[javascript()]}
                readOnly={true}
              />
            )}
          </div>
          </div>
        ))}
        <div className="worksheet-section">
          <div className="content-container">
            {cardsData.map((section, index) => (
              <div key={index}> {/* Add key prop here */}
                {section.textarea1} {section.textarea2}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Worksheet;

