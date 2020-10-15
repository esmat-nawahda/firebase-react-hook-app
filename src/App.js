import React from "react";
import "./style.css";

import useRTDatabaseList from "./firebase-hooks/useRTDatabaseList";

export default function App() {
  const [data, pageData, loading, error] = useRTDatabaseList(
    "conversations/5f81e375e3e2fc177434db9b/messages",
    { page: 1, limit: 5 }
  );

  return (
    <div>
      <h1>Hello Firebase Hooks</h1>
      {loading ? <div>Loading...</div> : <p>{JSON.stringify(pageData)}</p>}
    </div>
  );
}
