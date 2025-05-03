// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GOOGLE_API_KEY } from "@env";

const firebaseConfig = {
  apiKey: GOOGLE_API_KEY,
  authDomain: "medimate.firebaseapp.com",
  projectId: "medimate-adfdf",
  appId: "1:336819940127:android:8a65ac169ec550e38bde2a",
  // etc.
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
