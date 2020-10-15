import React from "react";
import "./style.css";

import useRTDatabaseList from "./firebase-hooks/useRTDatabaseList";

export default function App() {
  const [data, loading, error] = useRTDatabaseList();

  return (
    <div>
      <h1>Hello Firebase Hooks</h1>
      {loading ? <div>Loading...</div> : <p>{JSON.stringify(data)}</p>}
    </div>
  );
}
