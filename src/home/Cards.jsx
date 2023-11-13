import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const CardScroll = ({ cards }) => {
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
  );
};

export default CardScroll;
