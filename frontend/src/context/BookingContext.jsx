import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [selectedHotel, setSelectedHotel] = useState({
    id: 'hotel-1',
    name: 'Aurence Palais Royale',
  });
  const [selectedRoom, setSelectedRoom] = useState({
    id: 'rt-1',
    name: 'Royal Heritage Suite',
    basePrice: 1250,
  });
  const [checkInDate, setCheckInDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
  );
  const [guestCount, setGuestCount] = useState(2);
  const [selectedServices, setSelectedServices] = useState([]);

  const updateSearch = (data) => {
    if (data.selectedHotel) setSelectedHotel(data.selectedHotel);
    if (data.selectedRoom) setSelectedRoom(data.selectedRoom);
    if (data.checkInDate) setCheckInDate(data.checkInDate);
    if (data.checkOutDate) setCheckOutDate(data.checkOutDate);
    if (data.guestCount) setGuestCount(data.guestCount);
  };

  const bookingSummary = {
    hotelName: selectedHotel?.name,
    roomName: selectedRoom?.name,
    pricePerNight: selectedRoom?.basePrice || 1250,
    checkInDate,
    checkOutDate,
    guestCount,
  };

  return (
    <BookingContext.Provider
      value={{
        selectedHotel,
        setSelectedHotel,
        selectedRoom,
        setSelectedRoom,
        checkInDate,
        setCheckInDate,
        checkOutDate,
        setCheckOutDate,
        guestCount,
        setGuestCount,
        selectedServices,
        setSelectedServices,
        bookingSummary,
        updateSearch,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};
