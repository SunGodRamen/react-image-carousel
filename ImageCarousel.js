//ImageCarousel.js
import React, { useEffect, useRef } from 'react';
import './ImageCarousel.css';

const ImageCarousel = ({ imagesArray }) => {
  const imageRow = useRef(null);
  const imageElements = useRef([]);
  const position = useRef(0);
  const speed = 1;
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
        let firstImage = imageElements.current[0];
        let firstImageWidth = firstImage.offsetWidth;

        if (position.current <= -firstImageWidth) {
          imageRow.current.appendChild(firstImage);
          imageElements.current.push(imageElements.current.shift());
          position.current += firstImageWidth;
        }

        position.current -= speed;
        imageRow.current.style.left = position.current + 'px';
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
  }, [imagesArray]);

  return (
    <div className="carousel-container">
      <div className="image-row" ref={imageRow}></div>
    </div>
  );
};

export default ImageCarousel;
