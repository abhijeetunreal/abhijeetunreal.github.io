import React, { useState } from 'react';

interface MediaDisplayProps {
  src?: string;
  videoUrl?: string;
  alt?: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => void;
  draggable?: boolean;
  controls?: boolean; // For video controls
  autoPlay?: boolean; // For video autoplay
  loop?: boolean; // For video loop
  muted?: boolean; // For video muted
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({
  src,
  videoUrl,
  alt = '',
  className = '',
  onError,
  draggable = false,
  controls = false,
  autoPlay = true,
  loop = true,
  muted = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  // If there's a video URL and no error, show video
  if (videoUrl && !hasError) {
    return (
      <>
        <video
          src={videoUrl}
          alt={alt}
          className={className}
          onError={handleError}
          onLoadedData={handleVideoLoad}
          draggable={draggable}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          style={{ display: videoLoaded ? 'block' : 'none' }}
        />
        {/* Show fallback image while video is loading or if video fails */}
        {(!videoLoaded || hasError) && src && (
          <img
            src={src}
            alt={alt}
            className={className}
            onError={handleError}
            draggable={draggable}
            style={{ display: videoLoaded ? 'none' : 'block' }}
          />
        )}
      </>
    );
  }

  // Fallback to image if no video URL
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleError}
        draggable={draggable}
      />
    );
  }

  // If neither src nor videoUrl provided, show placeholder
  return (
    <div className={`${className} bg-gray-200 flex items-center justify-center text-gray-500`}>
      No media available
    </div>
  );
};

export default MediaDisplay;
