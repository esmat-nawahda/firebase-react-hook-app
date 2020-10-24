import { useState, useEffect } from "react";
import firebase from "firebase";

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
