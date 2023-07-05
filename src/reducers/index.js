export const ADD_STREAM = "ADD_STREAM";
export const REMOVE_STREAM = "REMOVE_STREAM";

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_STREAM:
        console.log(action)
      return { ...state, ...action.payload };
    case REMOVE_STREAM:
      const { [action.payload]: deleted, ...rest } = state;
      return rest;
    default:
      return state;
  }
};

export default reducer;
