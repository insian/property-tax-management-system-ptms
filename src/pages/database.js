// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB11HpewJlsXlnOI_5egt90R60YmBB0Idw",
  authDomain: "ptms-fafe5.firebaseapp.com",
  projectId: "ptms-fafe5",
  storageBucket: "ptms-fafe5.appspot.com",
  messagingSenderId: "663266698294",
  appId: "1:663266698294:web:0aec631670fe469f9de497",
  databaseURL: "https://ptms-fafe5-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export { database};

const admindb = "AdminLogin/";
const lbdb = "LbLogin/";
const publicdb = "PublicLogin/";
const taxdb = "TaxRates/";

export { admindb, lbdb, publicdb, taxdb};