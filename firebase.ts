import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrwHnRXJijLC8dWgmfSt-aI_BQU6BEXJs",
  authDomain: "mycleancityapp-b7108.firebaseapp.com",
  projectId: "mycleancityapp-b7108",
  storageBucket: "mycleancityapp-b7108.firebasestorage.app",
  messagingSenderId: "697309619297",
  appId: "1:697309619297:web:7973ba768b7f5c4c913620",
  measurementId: "G-S3GDKP0122",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export { auth, googleAuthProvider };
export default app;
