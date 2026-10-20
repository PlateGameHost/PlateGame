// src/firebase/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyaPGEsEGgKlnxi5LvZ333E8sIYjmYT-k",
  authDomain: "plate-game-f1495.firebaseapp.com",
  projectId: "plate-game-f1495",
  storageBucket: "plate-game-f1495.firebasestorage.app",
  messagingSenderId: "454655605995",
  appId: "1:454655605995:web:9afe471eeb8ecb8b6652ae",
  measurementId: "G-20D6KVSEJG",
};

class Firebase {
  constructor() {
    // Ensure app is initialized only once
    this.app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    this.auth = getAuth(this.app);
    this.googleProvider = new GoogleAuthProvider();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    createUserWithEmailAndPassword(this.auth, email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(this.auth, email, password);

  doSignInWithGoogle = () => signInWithPopup(this.auth, this.googleProvider);

  doSignOut = () => signOut(this.auth);

  doPasswordReset = (email) => sendPasswordResetEmail(this.auth, email);

  doPasswordUpdate = (password) =>
    updatePassword(this.auth.currentUser, password);

  doGetIdToken = async () => {
    const user = this.auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    throw new Error("No user is signed in.");
  };
}

export default Firebase;
