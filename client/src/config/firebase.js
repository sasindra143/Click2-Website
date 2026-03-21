import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB6Sw2Cco8ETYagSPNgUPhGZCj0EOptVGE",
  authDomain: "click2website-fec34.firebaseapp.com",
  projectId: "click2website-fec34",
  storageBucket: "click2website-fec34.appspot.com",
  messagingSenderId: "1234567890", // placeholder
  appId: "1:1234567890:web:abcdef1234567890" // placeholder
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
