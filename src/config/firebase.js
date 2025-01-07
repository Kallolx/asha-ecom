import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC_nBrswixDYyknjlDzfpRwkLhcK0QHp6w",
  authDomain: "asha-ecom.firebaseapp.com",
  projectId: "asha-ecom",
  storageBucket: "asha-ecom.appspot.com",
  messagingSenderId: "110681663788",
  appId: "1:110681663788:web:61d7a17e7e5754fa1f6489"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 