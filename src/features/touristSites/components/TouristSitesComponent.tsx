import React, { useState } from 'react';
import facebookIcon from '../../../assets/facebook.svg';
import xIcon from '../../../assets/x.svg';
import instagramIcon from '../../../assets/instagram.svg';

interface ImageSliderProps {
  images: string[];
  title: string;
  description: string;
  facebookUrl?: string;
  xUrl?: string;
  instagramUrl?: string;
  liked?: boolean;
}

const CardComponent: React.FC<ImageSliderProps> = ({ images, title, description, facebookUrl, xUrl, instagramUrl, liked: initialLiked }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(initialLiked || false);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="relative max-w-xs mx-auto mt-4 flex flex-col h-full">
      <div className="relative w-full h-64 overflow-hidden rounded-lg">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          ◀
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          ▶
        </button>
        <button
          onClick={toggleLike}
          className={`absolute top-2 right-2 bg-white p-2 rounded-full shadow ${liked ? 'text-red-500' : 'text-gray-500'}`}
        >
          {liked ? '❤️' : '♡'}
        </button>
      </div>
      <div className="mt-2 p-2 bg-white rounded-lg shadow flex-grow">
        <h2 className="text-lg text-black font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="mt-2 p-2 bg-white rounded-lg shadow flex items-center justify-center space-x-4">
        <a
          href={facebookUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-blue-500 hover:text-blue-700 ${!facebookUrl && 'opacity-50 cursor-not-allowed'}`}
        >
          <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
        </a>
        <a
          href={xUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-blue-500 hover:text-blue-700 ${!xUrl && 'opacity-50 cursor-not-allowed'}`}
        >
          <img src={xIcon} alt="X" className="w-6 h-6" />
        </a>
        <a
          href={instagramUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-blue-500 hover:text-blue-700 ${!instagramUrl && 'opacity-50 cursor-not-allowed'}`}
        >
          <img src={instagramIcon} alt="Instagram" className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};

export default CardComponent;