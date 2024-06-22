import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBt5_gt41KXfxIxS4MyeKh1ND6ZHQbD0DU",
  authDomain: "login-react-15bc0.firebaseapp.com",
  projectId: "login-react-15bc0",
  storageBucket: "login-react-15bc0.appspot.com",
  messagingSenderId: "139501282365",
  appId: "1:139501282365:web:6167d10e210fc1ce287654"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
 
export { auth };
