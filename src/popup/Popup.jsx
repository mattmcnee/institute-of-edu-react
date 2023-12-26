import React, { useEffect } from 'react';
import './ContextMenu.css'; // Import CSS for styling

const Popup = ({ x, y, closeMenu}) => {
  const options = ["Subheading", "Text", "Photo"]; // Add more options as needed

  useEffect(() => {
    // Function to handle click outside the popup
    const handleClickOutside = (event) => {
      if (event.target.closest('.popup-menu') === null) {
        // If the clicked element is not part of the popup menu, close the popup
        closeMenu();
      }
    };

    // Attach the event listener
    document.addEventListener('click', handleClickOutside);

    return () => {
      // Remove the event listener on cleanup
      document.removeEventListener('click', handleClickOutside);
    };
  }, [closeMenu]);

  const handleClick = (event) => {
    // Prevents the click event from closing the popup
    event.stopPropagation();
  };

  console.log("Hu");
  return (
    <ul className="popup-menu" style={{ top: `${y}px`, left: `${x}px` }} onClick={handleClick}>
      {options.map((option, index) => (
        <li key={index} onClick={() => {
          console.log(option);
          closeMenu();
        }}>
        <i className="fas fa-plus"></i>
          {option}
        </li>
      ))}
    </ul>
  );
};

export default Popup;


