export default (state, action) => {
  switch (action.type) {
    case "SET_LOAD":
      return {
        load: action.payload,
      };
    default:
      return state;
  }
};
