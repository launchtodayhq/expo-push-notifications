// Define the notification payload type
export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

// Define the registered device type
export interface RegisteredDevice {
  id: number;
  device_token: string;
  device_type: string;
  enabled_notifications: boolean;
  created_at: string;
}
