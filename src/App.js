import React from "react";
import "./style.css";

import useRTDatabaseList from "./firebase-hooks/useRTDatabaseList";

export default function App() {
  const [
    data,
    pageData,
    total,
    loading,
    error,
    page,
    prevPage,
    nextPage,
    visitPage
  ] = useRTDatabaseList("conversations/5f81e375e3e2fc177434db9b/messages", {
    limit: 5
  });

  return (
    <div>
      <h1>Hello Firebase Hooks</h1>
      <button onClick={prevPage}>PREV</button>
      <button onClick={nextPage}>NEXT</button>
      <button onClick={() => visitPage(7)}>Go to page</button>
      {loading ? <div>Loading...</div> : <p>{JSON.stringify(pageData)}</p>}
    </div>
  );
}
