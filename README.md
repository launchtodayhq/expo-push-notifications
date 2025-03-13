# Expo Push Notifications Demo

A simple demonstration app showing how to implement push notifications in an Expo React Native application with a Supabase backend.

## Overview

This project demonstrates a complete push notification system using:

- **Expo** for the mobile app frontend
- **Supabase** for the backend database and Edge Functions
- **Apple Push Notification service (APNs)** for iOS notifications

The app showcases:

- Requesting notification permissions
- Registering device tokens in a database
- Sending push notifications from a server
- Receiving and displaying notifications on devices
- Enabling/disabling notifications via a user toggle

## Project Structure

```
expo-push-notifications/
├── mobile/                  # Expo React Native app
│   ├── app/                 # App screens using Expo Router
│   │   ├── _layout.tsx      # App layout with navigation setup
│   │   └── index.tsx        # Main screen with device token and toggle
│   ├── hooks/               # Custom React hooks
│   │   ├── useColorScheme.ts # Hook for dark/light mode
│   │   └── usePushNotifications.ts # Hook for notification permissions
│   ├── providers/           # React context providers
│   │   ├── index.ts         # Provider exports
│   │   └── NotificationsProvider.tsx # Notification handling provider
│   └── services/            # Service connections
│       └── supabase/        # Supabase client setup
├── backend/                 # Backend code
│   └── supabase/            # Supabase configuration
│       ├── functions/       # Supabase Edge Functions
│       │   └── notifications-push/ # Push notification function
│       │       ├── index.ts        # Function entry point
│       │       ├── notifications.ts # Notification sending logic
│       │       ├── apns.ts         # Apple Push Notification service integration
│       │       ├── db.ts           # Database operations
│       │       └── types.ts        # TypeScript type definitions
```

## Features

- **Dark Mode Support**: The app automatically adapts to the device's color scheme
- **Device Token Display**: Shows the device's push notification token
- **Enable/Disable Toggle**: Allows users to enable or disable notifications
- **Database Integration**: Stores device tokens and preferences in Supabase
- **Server-Side Notifications**: Sends notifications via Supabase Edge Functions

## Setup Instructions

### Prerequisites

- Node.js and npm
- Expo CLI
- Supabase account
- Apple Developer account (for iOS push notifications)

### Mobile App Setup

1. Install dependencies:

   ```
   cd mobile
   npm install
   ```

2. Start the Expo development server:
   ```
   npx expo start
   ```

### Supabase Setup

1. Create a Supabase project and set up the following table:

   ```sql
   CREATE TABLE registered_devices_table (
     id SERIAL PRIMARY KEY,
     device_token VARCHAR NOT NULL UNIQUE,
     enabled_notifications BOOLEAN DEFAULT TRUE,
     device_type VARCHAR NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. Deploy the Edge Function:

   ```
   cd backend/supabase
   supabase functions deploy notifications-push
   ```

3. Set the required environment variables in Supabase:
   - `APNS_AUTH_KEY_BASE64`: Your Apple Push Notification service key (base64 encoded)
   - `APNS_KEY_ID`: Your Apple Developer Key ID
   - `APNS_TEAM_ID`: Your Apple Developer Team ID
   - `APNS_BUNDLE_ID`: Your app's bundle identifier

## How It Works

1. **Permission Request**: When the app starts, it requests notification permissions from the user.
2. **Token Registration**: If permission is granted, the app registers the device token in the Supabase database.
3. **Notification Listening**: The NotificationsProvider sets up listeners for incoming notifications.
4. **Sending Notifications**: The Supabase Edge Function can be triggered to send notifications to all registered devices.
5. **User Control**: Users can enable/disable notifications using the toggle, which updates their preference in the database.

## iOS Specific Setup

For iOS push notifications:

1. Create an App ID in the Apple Developer portal
2. Enable Push Notifications capability
3. Create an APNs Authentication Key
4. Configure your Expo app with the correct bundle identifier
5. Add the push notification entitlement to your app

## Testing Push Notifications

You can test sending push notifications by calling the Edge Function:

```bash
curl -i --location --request POST 'https://[YOUR-PROJECT-REF].supabase.co/functions/v1/notifications-push' \
  --header 'Authorization: Bearer [YOUR-ANON-KEY]' \
  --header 'Content-Type: application/json' \
  --data '{"title":"Test Notification","body":"Hello from Supabase!"}'
```

## License

MIT
