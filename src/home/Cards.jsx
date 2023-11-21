import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const CardScroll = ({ title, cards }) => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    const scrollContainer = scrollContainerRef.current;
    const containerWidth = scrollContainer.clientWidth;
    scrollContainer.scrollBy({ left: -containerWidth, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const scrollContainer = scrollContainerRef.current;
    const containerWidth = scrollContainer.clientWidth;
    scrollContainer.scrollBy({ left: containerWidth, behavior: 'smooth' });
  };

  return (
    <div className="card-container">
      <div className="card-header">
        <h2>{title}</h2>
        <div className="search-box">
          <input className="search-card"></input>
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <Link to="/create">
        <button className="add-card">+</button>
        </Link>
      </div>
{/*      <div className="title-box">
        <span className="card-title">Worksheets</span>

      </div>*/}
      <div className="scroll-box">
        <div className="scroll-button" id="scroll-left" onClick={scrollLeft}>
          ❮
        </div>
        <div id="scroll-container" className="scroll-menu" ref={scrollContainerRef}>
          {cards.map((card, index) => (
            <Link to={card.link} key={index} className="card-link">
              <div className="card">
                <div className="card-img"></div>
                <div className="card-bottom">{card.content}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="scroll-button" id="scroll-right" onClick={scrollRight}>
          ❯
        </div>
      </div>
    </div>
  );
};

export default CardScroll;