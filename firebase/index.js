// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAMvFQgFgb33K5jnhPSScwUKsUTv7QI0U8',
  authDomain: 'playwave123.firebaseapp.com',
  projectId: 'playwave123',
  storageBucket: 'playwave123.appspot.com',
  messagingSenderId: '8102910222',
  appId: '1:8102910222:web:c11f0af1788820f43b9f5f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app, db, getFirestore, collection, addDoc, getDocs, onSnapshot};
