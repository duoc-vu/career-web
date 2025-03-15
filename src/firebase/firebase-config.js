import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDckYnUP-0os-hdaUFzD3APb8iTsmrWeX4",
  authDomain: "careersfinal-3dd5f.firebaseapp.com",
  projectId: "careersfinal-3dd5f",
  storageBucket: "careersfinal-3dd5f.appspot.com",
  messagingSenderId: "301528011328",
  appId: "1:301528011328:web:f101d405adcde4b1fbc5a5",
  measurementId: "G-NM6N4K7FVC"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase); 
const analytics = getAnalytics(firebase);

export { db };
export default firebase;