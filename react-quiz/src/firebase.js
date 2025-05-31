import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD6PtQP8QEMXETIWu-2Kw_J2nUsglxGeds",
  authDomain: "react-quiz-d365e.firebaseapp.com",
  projectId: "react-quiz-d365e",
  storageBucket: "react-quiz-d365e.firebasestorage.app",
  messagingSenderId: "90595098579",
  appId: "1:90595098579:web:d4b233c7bc5b0f9b587926"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); 

export { auth, provider, signInWithPopup, signOut, db };