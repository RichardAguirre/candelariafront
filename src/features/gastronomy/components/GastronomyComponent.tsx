import React, { useState } from "react";
import facebookIcon from "../../../assets/facebook.svg";
import xIcon from "../../../assets/x.svg";
import instagramIcon from "../../../assets/instagram.svg";

interface GastronomyComponentProps {
  gastcodi: number;
  images: string[];
  name: string;
  rating: number;
  cuisine: string;
  hours: string;
  summary: string;
  facebookUrl?: string;
  xUrl?: string;
  instagramUrl?: string;
  userDocumento: number | null;
  alreadyRated: boolean;
  onSubmitRating: (gastcodi: number, rating: number, comment: string) => Promise<boolean>;
}

const GastronomyComponent: React.FC<GastronomyComponentProps> = ({
  gastcodi,
  images,
  name,
  rating,
  cuisine,
  hours,
  summary,
  facebookUrl,
  xUrl,
  instagramUrl,
  userDocumento,
  alreadyRated,
  onSubmitRating
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localRatingSuccess, setLocalRatingSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

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

  const handleStarClick = async (newRating: number) => {
    if (alreadyRated || localRatingSuccess || !userDocumento || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const commentOptions = [
        "No me gustó", 
        "Regular", 
        "Aceptable", 
        "Bueno", 
        "Excelente"
      ];
      const comment = commentOptions[newRating-1] || "Buena experiencia";
      
      const success = await onSubmitRating(gastcodi, newRating, comment);
      if (success) {
        setLocalRatingSuccess(true);
      }
    } catch (error) {
      console.error("Error al calificar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fallbackImage =
    "https://via.placeholder.com/400x300/cccccc/666666?text=Imagen+no+disponible";

  return (
    <div className="flex flex-col shadow-lg rounded-lg overflow-hidden w-full bg-white">
      <div className="relative h-48 w-full overflow-hidden">
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
            >
              ◀
            </button>
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
            >
              ▶
            </button>
          </>
        )}
      </div>

      <div className="flex-grow p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {name}
          </h2>
          
          {/* Sección de calificación */}
          <div className="mb-2">
            <span className="mr-2 text-sm">Calificación:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < rating ? "text-yellow-400" : "text-gray-300"
                  } ${
                    !(alreadyRated || localRatingSuccess) && userDocumento ? 
                    "cursor-pointer hover:scale-110 transition-transform" : ""
                  } ${
                    !alreadyRated && !localRatingSuccess && userDocumento && i < hoverRating ? 
                    "text-yellow-500" : ""
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => handleStarClick(i + 1)}
                  onMouseEnter={() => !alreadyRated && !localRatingSuccess && userDocumento && setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              
              {isSubmitting && (
                <span className="ml-2 text-xs text-gray-500 animate-pulse">
                  Enviando...
                </span>
              )}
            </div>
          </div>

          {(alreadyRated || localRatingSuccess) && userDocumento && (
            <div className="text-green-600 text-xs font-medium mb-1">
              ✓ Ya has calificado este lugar
            </div>
          )}

          {!userDocumento && (
            <div className="text-gray-500 text-xs mb-1">
              Inicia sesión para calificar
            </div>
          )}
          
          <p className="text-sm text-gray-600 line-clamp-1">{cuisine}</p>
          <p className="text-sm text-gray-600 line-clamp-1">{hours}</p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{summary}</p>
        </div>

        <div className="mt-3 flex items-center justify-center space-x-4 border-t pt-2">
          <a
            href={facebookUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-blue-500 hover:text-blue-700 ${
              !facebookUrl && "opacity-50 cursor-not-allowed"
            }`}
            onClick={(e) => !facebookUrl && e.preventDefault()}
          >
            <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
          </a>
          <a
            href={xUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-blue-500 hover:text-blue-700 ${
              !xUrl && "opacity-50 cursor-not-allowed"
            }`}
            onClick={(e) => !xUrl && e.preventDefault()}
          >
            <img src={xIcon} alt="X" className="w-6 h-6" />
          </a>
          <a
            href={instagramUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-blue-500 hover:text-blue-700 ${
              !instagramUrl && "opacity-50 cursor-not-allowed"
            }`}
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