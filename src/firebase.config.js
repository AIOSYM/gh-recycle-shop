import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANrQKmaWPlleEkBeFnUS4_bnBGh0pNVKg",
  authDomain: "gh-recycling-event-site.firebaseapp.com",
  projectId: "gh-recycling-event-site",
  storageBucket: "gh-recycling-event-site.appspot.com",
  messagingSenderId: "428180237643",
  appId: "1:428180237643:web:f534bb38e5973c64394cce",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
