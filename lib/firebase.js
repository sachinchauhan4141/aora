import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUC3XpYWZ0AhJpLhTt9PqmT02B-d0tzcM",
  authDomain: "watchnow-1592e.firebaseapp.com",
  projectId: "watchnow-1592e",
  storageBucket: "watchnow-1592e.appspot.com",
  messagingSenderId: "368527557108",
  appId: "1:368527557108:web:9553aae1b38a91399c79a1",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore();
export const storage = getStorage();