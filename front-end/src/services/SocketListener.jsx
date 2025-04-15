// In any component where you listen for socket notifications
import { useNotifications } from '../contexts/NotificationContext';

const { addNotification } = useNotifications();

useEffect(() => {
  socket.on("Donation-Update", (data) => {
    addNotification({
      id: Date.now(), // Unique ID
      type: 'info', // or 'success', 'error', etc.
      title: data.message,
      message: JSON.stringify(data.metadata),
      time: new Date().toLocaleTimeString()
    });
  });
  socket.on("Request-Update", (data) => {
    addNotification({
      id: Date.now(), // Unique ID
      type: 'info', // or 'success', 'error', etc.
      title: data.message,
      message: JSON.stringify(data.metadata),
      time: new Date().toLocaleTimeString()
    });
  });
  
  return () => {
    socket.off("Donation-Update");
    socket.off("Request-Update");
    
  };
}, [addNotification]);

