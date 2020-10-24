import { useEffect, useCallback, useReducer } from "react";
import firebase from "firebase";

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
      const paginatedList = getPaginatedList(state.allData);
      dispatch({
        type: constants.SET_PAGINATION_DATA,
        payload: {
          total: state.allData.length,
          numberOfPages: Math.ceil(state.allData.length / pagination.limit),
          pageData: paginatedList
        }
      });
    }
  }, [state.allData, state.page]);

  const getPaginatedList = arr => {
    const { limit } = pagination;
    const fromIndex = (page - 1) * limit;
    const toIndex = page * limit;
    return arr.slice(fromIndex, toIndex);
  };

  const prevPage = useCallback(() => {
    if (page > 1) {
      dispatch({
        type: constants.SET_PAGE_NUMBER,
        payload: { page: state.page - 1 }
      });
    }
  });

  const nextPage = useCallback(() => {
    if (page < numberOfPages) {
      dispatch({
        type: constants.SET_PAGE_NUMBER,
        payload: { page: state.page + 1 }
      });
    }
  });

  const visitPage = useCallback(pageNumber => {
    if (page > 0 && pageNumber <= numberOfPages) {
      dispatch({
        type: constants.SET_PAGE_NUMBER,
        payload: { page: pageNumber }
      });
    }
  });

  const addRecord = useCallback(record => {
    firebase
      .database()
      .ref(path)
      .set(record, error => {
        if (error) {
          // The write failed...
          console.log("Failure on adding new record");
        } else {
          // Data saved successfully!
          console.log("Record added successfully");
        }
      });
  });

  const {
    allData,
    pageData,
    total,
    numberOfPages,
    loading,
    error,
    page
  } = state;

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
    visitPage,
    addRecord
  ];
};

export default useRTDatabaseList;
