import { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  load: false,
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

  return (
    <GlobalContext.Provider
      value={{
        load: state.load,
        setLoad,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
