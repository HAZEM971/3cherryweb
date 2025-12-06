// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXmn71eLfY3V1GYjKpeuF4Y30Pe4eOvGw",
  authDomain: "cherryweb-4443f.firebaseapp.com",
  projectId: "cherryweb-4443f",
  storageBucket: "cherryweb-4443f.firebasestorage.app",
  messagingSenderId: "546478479998",
  appId: "1:546478479998:web:1e82841757c89366a7962f",
  measurementId: "G-2GBLDZREKK"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
