export default (state, action) => {
  switch (action.type) {
    case "SET_LOAD":
      return {
        ...state,
        load: action.payload,
      };
    case "SET_ERROR_MSG":
      return {
        ...state,
        errorTitle: action.payload[0],
        errorMsg: action.payload[1],
        isError: true,
      };
    case "SET_NICE_MSG":
      return {
        ...state,
        errorTitle: action.payload[0],
        errorMsg: action.payload[1],
        isError: false,
      };
    case "SET_TOAST":
      return {
        ...state,
        showToast: action.payload,
      };
    default:
      return state;
  }
};
