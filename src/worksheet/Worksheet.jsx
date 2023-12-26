import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Game from '/src/three/Game';
import { getDatabase, ref, get } from 'firebase/database';
import Nav from '/src/Nav';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';

const Worksheet = ({ setTitle }) => {
  const [worksheetData, setWorksheetData] = useState([]);
  const [loading, setLoading] = useState(true);
  let { id } = useParams();

  useEffect(() => {
    hljs.highlightAll();
  }, [worksheetData]);

  useEffect(() => {
    setTitle("Game Worksheet");
    
    // Firebase database reference to the specific location
    const db = getDatabase();
    const worksheetRef = ref(db, `/sheets/${id}`);
    
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

  const tweenCode = `
const tween = KUTE.fromTo(
  '#blob1',
  { path: '#blob1' },
  { path: '#blob2' },
  { repeat: 999, duration: 3000, yoyo: true }
).start();
`;

  return (
    <div className="home-page">
      <Nav title={"New Worksheet"}/>
      <div className="worksheet-container">
{/*      <iframe className="sink"
       frameBorder="0"
       height="300px"  src="https://onecompiler.com/embed/python" 
       width="80%"
       ></iframe>*/}
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
      <pre><code className="language-javascript">
        {tweenCode}
      </code></pre>
    </div>
  );
};

export default Worksheet;

