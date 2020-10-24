import { useState, useEffect, useCallback, useReducer } from "react";
import firebase from "firebase";

// Firebase Config
const config = {
  apiKey: "AIzaSyAr9ICuLA34b9HYXX_QihIqR7iUTl5ihoo",
  authDomain: "forex-16c8a.firebaseapp.com",
  databaseURL: "https://forex-16c8a.firebaseio.com",
  projectId: "forex-16c8a",
  storageBucket: "forex-16c8a.appspot.com",
  messagingSenderId: "747165846668",
  appId: "1:747165846668:web:29f34828ce77b5d29dffa9",
  measurementId: "G-VNJZD35VCV"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const useRTDatabaseValue = path => {
  const [rtValue, setRTValue] = useState(null);

  useEffect(() => {
    const ref = firebase.database().ref(path);
    ref.once(
      "value",
      snapshot => {
        if (snapshot) {
          setRTValue(snapshot.val());
        }
      },
      err => {
        setError(err);
        console.log("The read failed: " + errorObject.code);
      }
    );
  }, []);

  return [rtValue];
};

export default useRTDatabaseValue;