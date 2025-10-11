import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBguAiVfmdGkuPL4NISczI_wCyTBtEP2so",
  authDomain: "clinisys-d7863.firebaseapp.com",
  projectId: "clinisys-d7863",
  storageBucket: "clinisys-d7863.firebasestorage.app",
  messagingSenderId: "893500678799",
  appId: "1:893500678799:web:6b5f9ec846ddc0762b06fa",
  measurementId: "G-DHDRH4QWQW"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
