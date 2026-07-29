import React, { useState, useEffect } from 'react';

const FALLBACK_MAP = {
  hotel: '/images/hotels/hotel-default.jpg',
  room: '/images/rooms/room-default.jpg',
  service: '/images/services/service-default.jpg',
};

export const SafeImage = ({
  src,
  alt = 'Luxury Hotel',
  className = '',
  fallbackCategory = 'hotel',
  fallbackSrc,
  loading = 'lazy',
  ...props
}) => {
  const defaultFallback = fallbackSrc || FALLBACK_MAP[fallbackCategory] || FALLBACK_MAP.hotel;
  const [imgSrc, setImgSrc] = useState(src || defaultFallback);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || defaultFallback);
    setHasError(false);
  }, [src, defaultFallback]);

  const handleError = () => {
    if (!hasError && imgSrc !== defaultFallback) {
      setImgSrc(defaultFallback);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      {...props}
    />
  );
};

export default SafeImage;
