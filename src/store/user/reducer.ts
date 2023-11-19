import { User } from "@/types";
import { LOGIN, LOGOUT, SUBSCRIBE } from "./actions";

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

export const userReducer = (state = initialState, action: any): UserState => {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem("user", JSON.stringify(action.payload));
      console.log(action.payload);
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT:
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
      };
    case SUBSCRIBE:
      console.log("SUBSCRIBE");
      return {
        ...state,
        user: {
          ...state.user,
          isSubscribed: true,
        },
      };
    default:
      return state;
  }
};
