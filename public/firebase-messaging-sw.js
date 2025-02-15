
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDhbxnEzdo8CiNkprQMqPXtNDxVnyyQtM0",
  authDomain: "appli-web1.firebaseapp.com",
  projectId: "appli-web1",
  storageBucket: "appli-web1.firebasestorage.app",
  messagingSenderId: "586705547873",
  appId: "1:586705547873:web:257ee6476ae31b3081f020"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Message en arrière-plan reçu :", payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: 'food-planner-notification',
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
