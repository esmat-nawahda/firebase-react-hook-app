import React from "react";
import "./style.css";

import useRTDatabaseList from "./firebase-hooks/useRTDatabaseList";
import useRTDatabaseValue from "./firebase-hooks/useRTDatabaseValue";

export default function App() {
  const [
    allData,
    pageData,
    total,
    loading,
    error,
    numberOfPages,
    page,
    prevPage,
    nextPage,
    visitPage
  ] = useRTDatabaseList("conversations/5f81e375e3e2fc177434db9b/messages", {
    limit: 5
  });
  const [rtValue] = useRTDatabaseValue(
    "/conversations/5f5d2dcf7cf1e510c882a3ec/createdAt"
  );

  return (
    <div>
      <h1>
        Hello Firebase Hooks ({page}/{numberOfPages})
      </h1>
      <button onClick={prevPage}>PREV</button>
      <button onClick={nextPage}>NEXT</button>
      <button onClick={() => visitPage(7)}>Go to page</button>
      {loading ? <div>Loading...</div> : <p>{JSON.stringify(pageData)}</p>}
      <hr />
      <h3>{rtValue}</h3>
    </div>
  );
}
