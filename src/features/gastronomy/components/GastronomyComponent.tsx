import React, { useState } from 'react';
import facebookIcon from '../../../assets/facebook.svg';
import xIcon from '../../../assets/x.svg';
import instagramIcon from '../../../assets/instagram.svg';

interface RestaurantProps {
  images: string[];
  name: string;
  rating: number;
  cuisine: string;
  hours: string;
  summary: string;
  facebookUrl?: string;
  xUrl?: string;
  instagramUrl?: string;
}

const GastronomyComponent: React.FC<RestaurantProps> = ({ images, name, rating, cuisine, hours, summary, facebookUrl, xUrl, instagramUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

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

  const handleRating = (newRating: number) => {
    setCurrentRating(newRating);
  };

  // Imagen de respaldo en caso de que la URL no sea válida
  const fallbackImage = "https://via.placeholder.com/400x300/cccccc/666666?text=Imagen+no+disponible";

  return (
    <div className="flex flex-col md:flex-row mx-auto mt-4 shadow-lg rounded-lg overflow-hidden h-64">
      <div className="relative w-full md:w-1/2 h-full">
        <img
          src={images[currentIndex] || fallbackImage}
          alt={`${name} - Imagen ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage;
          }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
              ◀
            </button>
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
              ▶
            </button>
          </>
        )}
      </div>
      <div className="w-full md:w-1/2 p-4 bg-white h-full flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < currentRating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => handleRating(i + 1)}
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-gray-600">{cuisine}</p>
          <p className="text-sm text-gray-600">{hours}</p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{summary}</p>
        </div>
        <div className="mt-2 flex items-center justify-center space-x-4">
          <a
            href={facebookUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-blue-500 hover:text-blue-700 ${!facebookUrl && 'opacity-50 cursor-not-allowed'}`}
            onClick={(e) => !facebookUrl && e.preventDefault()}
          >
            <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
          </a>
          <a
            href={xUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-blue-500 hover:text-blue-700 ${!xUrl && 'opacity-50 cursor-not-allowed'}`}
            onClick={(e) => !xUrl && e.preventDefault()}
          >
            <img src={xIcon} alt="X" className="w-6 h-6" />
          </a>
          <a
            href={instagramUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-blue-500 hover:text-blue-700 ${!instagramUrl && 'opacity-50 cursor-not-allowed'}`}
            onClick={(e) => !instagramUrl && e.preventDefault()}
          >
            <img src={instagramIcon} alt="Instagram" className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default GastronomyComponent;