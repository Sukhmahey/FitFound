import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('muteNotifications');
    if (saved !== null) setIsMuted(saved === 'true');
  }, []);

  const toggleMute = () => {
    const newValue = !isMuted;
    setIsMuted(newValue);
    localStorage.setItem('muteNotifications', newValue);
  };

  return (
    <NotificationContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);