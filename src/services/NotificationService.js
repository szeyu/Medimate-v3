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

    PushNotification.createChannel(
      {
        channelId: "health-alerts", // (required)
        channelName: "Health Alerts", // (required)
        channelDescription: "Urgent alerts about your health metrics", // (optional)
        playSound: true,
        soundName: "default", // Different sound for alerts
        importance: Importance.HIGH,
        vibrate: true,
        vibration: 1000, // Longer vibration for alerts
      },
      (created) => console.log(`Health alerts channel created: '${created}'`)
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

  // Function to schedule a local notification
  scheduleHealthAlert = (title, message, delay = 10) => {
    PushNotification.localNotificationSchedule({
      channelId: "health-alerts",
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
  showHealthAlerts = (title, message) => {
    PushNotification.localNotification({
      channelId: "health-alerts",
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

  // sendHealthAlert = (metric, value, severity = 'moderate', advice = '') => {
  //   const titles = {
  //     heartRate: 'Heart Rate Alert',
  //     bloodPressure: 'Blood Pressure Alert',
  //     mentalHealth: 'Mental Health Alert',
  //     glucose: 'Blood Glucose Alert',
  //     oxygen: 'Blood Oxygen Alert'
  //   };
    
  //   const severityIcons = {
  //     mild: '⚠️',
  //     moderate: '🔔',
  //     severe: '🚨'
  //   };
    
  //   const icon = severityIcons[severity] || severityIcons.moderate;
  //   const title = `${icon} ${titles[metric] || 'Health Alert'}`;
  //   let message = `Your ${metric} reading of ${value} requires attention.`;
    
  //   if (advice) {
  //     message += ` ${advice}`;
  //   }
    
  //   PushNotification.localNotification({
  //     channelId: "health-alerts",
  //     title: title,
  //     message: message,
  //     playSound: true,
  //     soundName: severity === 'severe' ? 'alarm' : 'default',
  //     importance: Importance.HIGH,
  //     vibrate: true,
  //     vibration: severity === 'severe' ? 1000 : 500,
  //     // Add a special color for alerts
  //     color: severity === 'severe' ? '#FF0000' : '#FFA500',
  //     // Make it sticky for severe alerts
  //     ongoing: severity === 'severe',
  //     // Add a big text style for more details
  //     bigText: message,
  //     subText: 'Health Alert',
  //   });
  // }
  
  // // Function to check and alert for abnormal heart rate
  // alertAbnormalHeartRate = (heartRate, restingHeartRate = 70) => {
  //   let severity = 'mild';
  //   let advice = '';
    
  //   if (heartRate > 120) {
  //     severity = 'severe';
  //     advice = 'Please sit down, take deep breaths, and contact your doctor if it persists.';
  //   } else if (heartRate > 100) {
  //     severity = 'moderate';
  //     advice = 'Consider resting and monitoring your heart rate.';
  //   } else if (heartRate < 50 && restingHeartRate >= 60) {
  //     severity = 'moderate';
  //     advice = 'Your heart rate is unusually low. Monitor and consult a doctor if you feel dizzy.';
  //   }
    
  //   if (severity !== 'mild' || heartRate > 100 || heartRate < 50) {
  //     this.sendHealthAlert('heartRate', `${heartRate} BPM`, severity, advice);
  //     return true;
  //   }
  //   return false;
  // }
  
  // // Function to check and alert for abnormal blood pressure
  // alertAbnormalBloodPressure = (systolic, diastolic) => {
  //   let severity = 'mild';
  //   let advice = '';
  //   let value = `${systolic}/${diastolic} mmHg`;
    
  //   if (systolic >= 180 || diastolic >= 120) {
  //     severity = 'severe';
  //     advice = 'Hypertensive crisis! Seek emergency medical attention immediately.';
  //   } else if (systolic >= 140 || diastolic >= 90) {
  //     severity = 'moderate';
  //     advice = 'High blood pressure detected. Rest and consider contacting your doctor.';
  //   } else if (systolic < 90 || diastolic < 60) {
  //     severity = 'moderate';
  //     advice = 'Low blood pressure detected. Sit or lie down and monitor how you feel.';
  //   }
    
  //   if (severity !== 'mild') {
  //     this.sendHealthAlert('bloodPressure', value, severity, advice);
  //     return true;
  //   }
  //   return false;
  // }
  
}

export default new NotificationService(); 