import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
    this.createChannels();
  }

  configure = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        
        // process the notification
        if (Platform.OS === 'ios') {
          // required on iOS only
          notification.finish('backgroundFetchResultNoData');
        }
      },

      // Should the initial notification be popped automatically
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will be requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }

  createChannels = () => {
    PushNotification.createChannel(
      {
        channelId: "medication-reminders", // (required)
        channelName: "Medication Reminders", // (required)
        channelDescription: "Reminders to take your medication", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  // Function to schedule a local notification
  scheduleNotification = (title, message, delay = 10) => {
    PushNotification.localNotificationSchedule({
      channelId: "medication-reminders",
      title: title,
      message: message,
      date: new Date(Date.now() + delay * 1000), // in 10 seconds
      allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
      playSound: true,
      soundName: 'default',
      importance: Importance.HIGH,
      vibrate: true,
      vibration: 300,
    });
  }

  // Function to show an immediate notification
  showNotification = (title, message) => {
    PushNotification.localNotification({
      channelId: "medication-reminders",
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
      importance: Importance.HIGH,
      vibrate: true,
      vibration: 300,
    });
  }

  // Cancel all scheduled notifications
  cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  }
}

export default new NotificationService(); 