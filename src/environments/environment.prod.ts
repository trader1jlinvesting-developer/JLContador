import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// export const environment = {
//   production: true
// };

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebase = {
//   apiKey: "AIzaSyB6J2FAPTpRZua4kRdCIUnf22pTrcZOAq4",
//   authDomain: "jlcontador-177f1.firebaseapp.com",
//   projectId: "jlcontador-177f1",
//   storageBucket: "jlcontador-177f1.firebasestorage.app",
//   messagingSenderId: "656899263644",
//   appId: "1:656899263644:web:a1b6479e43c64a775a3159",
//   measurementId: "G-XNHXZCE2WS"
// };

// // Initialize Firebase
// const app = initializeApp(firebase);
// const analytics = getAnalytics(app);

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyB6J2FAPTpRZua4kRdCIUnf22pTrcZOAq4",
    authDomain: "jlcontador-177f1.firebaseapp.com",
    projectId: "jlcontador-177f1",
    storageBucket: "jlcontador-177f1.appspot.com",
    messagingSenderId: "656899263644",
    appId: "1:656899263644:web:a1b6479e43c64a775a3159",
    measurementId: "G-XNHXZCE2WS"
  }
};
