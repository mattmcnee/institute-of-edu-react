import React, { useState, useEffect } from 'react';
import Game from '/src/three/Game';
import { getDatabase, ref, get } from 'firebase/database';
import Nav from '/src/Nav';

const Worksheet = ({ setTitle }) => {
  const [worksheetData, setWorksheetData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle("Game Worksheet");
    
    // Firebase database reference to the specific location
    const db = getDatabase();
    const worksheetRef = ref(db, '/sheets/-Njm55Y-cUGYAlZb5R4u');
    
    // Fetch the data from Firebase
    get(worksheetRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const firebaseData = snapshot.val().data;
          const cleanedSections = convertToJsonArray(firebaseData);
          setWorksheetData(cleanedSections);
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
            {section.label === 'subheading' && <h2>{section.value.text}</h2>}
            {section.label === 'paragraph' && <p>{section.value.text}</p>}
            {section.label === 'game' && (
              <div className="game-container">
                <div className="game-window">
                  <Game gameType={section.value.data.gameType} src={section.value.data.src} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Worksheet;

