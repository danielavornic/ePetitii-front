import { User } from "@/types";
import { LOGIN, LOGOUT } from "./actions";

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

export const userReducer = (state = initialState, action: any): UserState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};
