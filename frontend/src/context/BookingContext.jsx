import React, { createContext, useContext, useState } from 'react';
import { normalizePrice } from '../services/api';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [selectedHotel, setSelectedHotel] = useState({
    id: 1,
    name: 'Aurence Palais Royale',
  });
  const [selectedRoom, setSelectedRoom] = useState({
    id: 1,
    name: 'Phòng Deluxe Hướng Biển',
    basePrice: 2800000,
    pricePerNight: 2800000,
  });
  const [checkInDate, setCheckInDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
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

  const currentPrice = normalizePrice(selectedRoom?.basePrice || selectedRoom?.pricePerNight || selectedRoom?.price) || 2800000;

  const bookingSummary = {
    selectedHotel,
    selectedRoom,
    hotelName: selectedHotel?.name,
    roomName: selectedRoom?.name,
    pricePerNight: currentPrice,
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
