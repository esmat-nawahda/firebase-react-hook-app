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

const constants = {
  DATA_LOADED: "data-loaded",
  SET_PAGINATION_DATA: "set-pagination-data",
  SET_PAGE_NUMBER: "set-page-number"
};

const reducer = (state, action) => {
  switch (action.type) {
    case constants.DATA_LOADED:
    case constants.SET_PAGINATION_DATA:
    case constants.SET_PAGE_NUMBER:
      return { ...state, ...action.payload };
  }
};

const initialState = {
  loading: true,
  allData: [],
  pageData: [],
  total: 0,
  numberOfPages: 1,
  error: null,
  page: 1
};

const useRTDatabaseList = (path, pagination) => {
  const [loading, setLoading] = useState(true);
  const [allData, setData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [total, setTotal] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const ref = firebase.database().ref(path);
    ref.on(
      "value",
      snapshot => {
        if (snapshot) {
          const list = [];
          snapshot.forEach((item, i) => {
            item = item.val();
            list.push({
              key: item.id,
              ...item
            });
          });
          // setData(list);
          // setLoading(false);

          dispatch({
            type: constants.DATA_LOADED,
            payload: { allData: list, loading: false }
          });
        }
      },
      err => {
        setError(err);
        console.log("The read failed: " + errorObject.code);
      }
    );
  }, []);

  useEffect(() => {
    if (pagination) {
      const paginatedList = getPaginatedList(allData);
      // setTotal(allData.length);
      // setNumberOfPages(Math.ceil(allData.length / pagination.limit));
      // setPageData(paginatedList);
      dispatch({
        type: constants.SET_PAGINATION_DATA,
        payload: {
          total: allData.length,
          numberOfPages: Math.ceil(allData.length / pagination.limit),
          pageData: paginatedList
        }
      });
    }
  }, [allData, page]);

  const getPaginatedList = arr => {
    const { limit } = pagination;
    const fromIndex = (page - 1) * limit;
    const toIndex = page * limit;
    return arr.slice(fromIndex, toIndex);
  };

  const prevPage = useCallback(() => {
    if (page > 1) {
      // setPage(oldPage => oldPage - 1);
      dispatch({
        type: constants.SET_PAGE_NUMBER,
        payload: { page: state.page - 1 }
      });
    }
  });

  const nextPage = useCallback(() => {
    if (page < numberOfPages) {
      // setPage(oldPage => oldPage + 1);
      dispatch({
        type: constants.SET_PAGE_NUMBER,
        payload: { page: state.page + 1 }
      });
    }
  });

  const visitPage = useCallback(pageNumber => {
    if (page > 0 && pageNumber <= numberOfPages) {
      // setPage(pageNumber);
      dispatch({
        type: constants.SET_PAGE_NUMBER,
        payload: { page: pageNumber }
      });
    }
  });

  console.log([allData, pageData, total, numberOfPages, loading, error, page]);
  return [
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
  ];
};

export default useRTDatabaseList;
