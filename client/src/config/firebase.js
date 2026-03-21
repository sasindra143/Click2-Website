import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB6Sw2Cco8ETYagSPNgUPhGZCj0EOptVGE",
  authDomain: "click2website-fec34.firebaseapp.com",
  projectId: "click2website-fec34",
  storageBucket: "click2website-fec34.firebasestorage.app",
  messagingSenderId: "575714417547",
  appId: "1:575714417547:web:4c0f373f1531f9e1a62d8e",
  measurementId: "G-ETDPS8ZC3Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
