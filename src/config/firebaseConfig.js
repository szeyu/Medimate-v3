// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCLnatqpUXXny-66JVmJRguPGkFUoAVArI",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "medimate-adfdf",
  appId: "1:336819940127:android:8a65ac169ec550e38bde2a",
  // etc.
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
