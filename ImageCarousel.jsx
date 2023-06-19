// ImageCarousel.jsx
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './ImageCarousel.css';

function ImageCarousel({ imagesArray, speed }) {
  const imageRow = useRef(null);
  const imageElements = useRef([]);
  const position = useRef(0);
  const shouldMove = useRef(true);

  useEffect(() => {
    imageElements.current = imagesArray.map((src, index) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Image ${index + 1}`;
      imageRow.current.appendChild(img);
      return img;
    });

    const handleMouseEnter = () => {
      shouldMove.current = false;
    };

    const handleMouseLeave = () => {
      shouldMove.current = true;
    };

    imageRow.current.addEventListener('mouseenter', handleMouseEnter);
    imageRow.current.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId;

    const moveImages = () => {
      if (shouldMove.current && imageRow.current) {
        const firstImage = imageElements.current[0];
        const firstImageWidth = firstImage.offsetWidth;

        if (position.current <= -firstImageWidth) {
          imageRow.current.appendChild(firstImage);
          imageElements.current.push(imageElements.current.shift());
          position.current += firstImageWidth;
        }

        position.current -= speed;
        imageRow.current.style.left = `${position.current}px`;
      }

      animationFrameId = requestAnimationFrame(moveImages);
    };

    moveImages();

    return () => {
      if (imageRow.current) {
        while (imageRow.current.firstChild) {
          imageRow.current.firstChild.remove();
        }
        imageRow.current.removeEventListener('mouseenter', handleMouseEnter);
        imageRow.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [imagesArray, speed]);

  return (
    <div className="carousel-container">
      <div className="image-row" ref={imageRow} />
    </div>
  );
}

ImageCarousel.propTypes = {
  imagesArray: PropTypes.arrayOf(PropTypes.string).isRequired,
  speed: PropTypes.number.isRequired,
};

export default ImageCarousel;
