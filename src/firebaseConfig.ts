import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: `https://${import.meta.env.VITE_DATABASE_URL}.firebasedatabase.app/`

};

// signInAnonymously(auth)
//   .then(() => {
  //     console.log("Signed in anonymously:", auth.currentUser?.uid);
  //   })
  //   .catch((error) => {
    //     console.error("Anonymous sign-in error:", error);
    //   });
    
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth();
  export const db = getDatabase(app)
// export const db = getFirestore(app);