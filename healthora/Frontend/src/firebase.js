import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoLtpEMM0HLGLby1aihi_k8fG6begugGE",
  authDomain: "healthora-f1203.firebaseapp.com",
  projectId: "healthora-f1203",
  storageBucket: "healthora-f1203.firebasestorage.app",
  messagingSenderId: "865577996729",
  appId: "1:865577996729:web:7fa6bbeb4fa5425858e668",
  measurementId: "G-JKSR2Z6X6L"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);