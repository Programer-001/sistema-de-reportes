import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, get, onValue } from "firebase/database"; // Si usas Realtime Database
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANawOTR26N6Qbgia_PuFKoZkSpa6XfxoU",
  authDomain: "entorno-raff.firebaseapp.com",
  databaseURL: "https://entorno-raff-default-rtdb.firebaseio.com",
  projectId: "entorno-raff",
  storageBucket: "entorno-raff.firebasestorage.app",
  messagingSenderId: "359499848371",
  appId: "1:359499848371:web:f2e7d858ae90e345dfaec6",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };
