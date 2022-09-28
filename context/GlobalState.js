import { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  load: false,
  errorTitle: "",
  errorMsg: "",
  showToast: false,
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  function setLoad(isLoad) {
    dispatch({
      type: "SET_LOAD",
      payload: isLoad,
    });
  }

  function setErrorMsg(errorTitle, errorMsg) {
    dispatch({
      type: "SET_ERROR_MSG",
      payload: [errorTitle, errorMsg],
    });
  }

  function setToast(isShow) {
    dispatch({
      type: "SET_TOAST",
      payload: isShow,
    });
  }

  function unknownError() {
    dispatch({
      type: "SET_ERROR_MSG",
      payload: ["An unknown error occurred 😵‍💫", ""],
    });
    dispatch({
      type: "SET_TOAST",
      payload: true,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        load: state.load,
        errorMsg: state.errorMsg,
        showToast: state.showToast,
        errorTitle: state.errorTitle,
        setLoad,
        setErrorMsg,
        setToast,
        unknownError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
