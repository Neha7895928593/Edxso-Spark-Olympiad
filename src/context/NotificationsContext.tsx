// context/NotificationsContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

export interface Notification {
  id: string;
  type: string;
  content: string;
  status: "read" | "unread";
  timestamp: string;
  link: string;
}

interface NotificationsContextProps {
  notifications: Notification[];
  markAsRead: (id: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

export const NotificationsContext = createContext<NotificationsContextProps>({
  notifications: [],
  markAsRead: async () => {},
  fetchNotifications: async () => {},
});

let socket: Socket;

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const userId = "USER_ID_HERE"; // Replace with your real user id

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/api/notifications/${userId}`);
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    socket = io("http://localhost:5000"); // Backend URL here
    socket.emit("join", userId);

    socket.on("new_notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, markAsRead, fetchNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
