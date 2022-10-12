import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyC9flDVvt8lzZrvbTSeygI_aql6iMtMbvI",
  authDomain: "mymovielist-f6014.firebaseapp.com",
  projectId: "mymovielist-f6014",
  storageBucket: "mymovielist-f6014.appspot.com",
  messagingSenderId: "426694518695",
  appId: "1:426694518695:web:07db0c171c8f60d6d9f882",
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
