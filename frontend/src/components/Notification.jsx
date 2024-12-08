import { useGetAllNotificationsQuery, useMarkAsReadMutation } from '../provider/queries/Notification.query';
import { TiTick } from "react-icons/ti";

const Notifications = () => {
  const { data: notifications, error, isLoading } = useGetAllNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  // Helper function to determine the notification's status
  const getNotificationStyle = (notification) => {
    if (notification.type === "low_stock" || notification.type === "near_expiry") {
      return "bg-yellow-100 text-black border-2 border-yellow-300";
    }
    if (notification.type === "expired" || notification.type === "zero_stock") {
      return "bg-rose-100 text-black border-2 border-rose-300";
    }
    return "bg-white text-black"; // Default style for other notifications
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading notifications</div>;

  return (
    <div className="space-y-4">
      <ul className=" ">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`p-4 rounded-lg shadow-md my-5 ${getNotificationStyle(notification)}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <strong className="block text-base">{notification.title}</strong>
                <p className="text-sm mt-2">{notification.message}</p>
              </div>
              <button
                onClick={() => handleMarkAsRead(notification.id)}
                title="Mark as read"
                className="text-green-500 "
              >
                <TiTick   className=" text-2xl"/>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
