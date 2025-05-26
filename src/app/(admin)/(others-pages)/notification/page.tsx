// pages/notifications.tsx
import React, { useContext } from "react";
import { NotificationsContext } from "@/context/NotificationsContext";
import { useRouter } from "next/router";

const NotificationsPage = () => {
  const { notifications, markAsRead } = useContext(NotificationsContext);
  const router = useRouter();

  const onNotificationClick = async (id: string, link: string) => {
    await markAsRead(id);
    router.push(link);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications to show</p>
      ) : (
        <ul>
          {notifications.map(({ id, content, status, timestamp, link }) => (
            <li
              key={id}
              onClick={() => onNotificationClick(id, link)}
              className={`cursor-pointer p-4 border-b ${
                status === "unread" ? "bg-blue-50 font-semibold" : "bg-white"
              }`}
            >
              <p>{content}</p>
              <small className="text-gray-500">
                {new Date(timestamp).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
