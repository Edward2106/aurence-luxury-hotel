import React, { createContext, useContext, useState } from 'react';
import { normalizePrice } from '../services/api';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [guestCount, setGuestCount] = useState(2);
  const [selectedServices, setSelectedServices] = useState([]);

  const updateSearch = (data) => {
    if (data.selectedHotel !== undefined) setSelectedHotel(data.selectedHotel);
    if (data.selectedRoom !== undefined) setSelectedRoom(data.selectedRoom);
    if (data.checkInDate !== undefined) setCheckInDate(data.checkInDate);
    if (data.checkOutDate !== undefined) setCheckOutDate(data.checkOutDate);
    if (data.guestCount !== undefined) setGuestCount(data.guestCount);
  };

  const currentPrice = normalizePrice(selectedRoom?.basePrice || selectedRoom?.pricePerNight || selectedRoom?.price) || 0;

  const bookingSummary = {
    selectedHotel,
    selectedRoom,
    hotelId: selectedHotel?.id,
    roomId: selectedRoom?.roomId || selectedRoom?.id,
    roomTypeId: selectedRoom?.roomTypeId || selectedRoom?.id,
    hotelName: selectedHotel?.name || 'Aurence Luxury Hotel',
    roomName: selectedRoom?.name || 'Phòng Khách Sạn Cao Cấp',
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
