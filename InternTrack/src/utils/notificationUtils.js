export const getLocalNotifications = () => {
  try {
    const data = localStorage.getItem('interntrack_notifications');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const saveLocalNotifications = (notifications) => {
  localStorage.setItem('interntrack_notifications', JSON.stringify(notifications));
  // Dispatch custom event to notify components globally
  window.dispatchEvent(new Event('notificationsUpdated'));
};

export const addNotification = (title, message, type = 'info') => {
  const notifications = getLocalNotifications();
  const newNotif = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    title,
    message,
    type,
    read: false,
    date: new Date().toISOString()
  };
  
  // Prepend to show newest first, keep max 50 notifications
  const updated = [newNotif, ...notifications].slice(0, 50);
  saveLocalNotifications(updated);
};

export const markAsRead = (id) => {
  const notifications = getLocalNotifications();
  const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  saveLocalNotifications(updated);
};

export const clearAllNotifications = () => {
  saveLocalNotifications([]);
};
