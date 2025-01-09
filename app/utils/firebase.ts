// utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCrOfXVD9lG5rVon36EhPBkR4U5h-jWBUM",
    authDomain: "orientador-inteligente.firebaseapp.com",
    projectId: "orientador-inteligente",
    storageBucket: "orientador-inteligente.firebasestorage.app",
    messagingSenderId: "384869995082",
    appId: "1:384869995082:web:e79c919a7a34b299398cb3",
    measurementId: "G-BSCJP03SGW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
