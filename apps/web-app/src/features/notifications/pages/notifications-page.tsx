import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function NotificationsPage() {
  const notifications = useQuery(
    api.notifications.queries.listMyNotifications
  );

  const markAsRead = useMutation(
    api.notifications.mutations.markAsRead
  );

  if (!notifications) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">
        Notifications
      </h1>

      {notifications.map((notification) => (
        <div
          key={notification._id}
          className={`rounded-xl border p-4 ${
            notification.isRead
              ? "bg-white"
              : "bg-blue-50"
          }`}
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">
                {notification.title}
              </h3>

              <p className="text-sm text-gray-600">
                {notification.message}
              </p>
            </div>

            {!notification.isRead && (
              <button
                onClick={() =>
                  markAsRead({
                    notificationId:
                      notification._id,
                  })
                }
                className="text-sm text-blue-600"
              >
                Mark Read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}