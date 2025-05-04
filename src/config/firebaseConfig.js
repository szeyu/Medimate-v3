// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GOOGLE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_APP_ID } from "@env";

const firebaseConfig = {
  apiKey: GOOGLE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  appId: FIREBASE_APP_ID,
  // etc.
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
