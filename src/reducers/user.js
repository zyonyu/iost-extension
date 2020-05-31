import {
  SET_USER_INFO,
  RESET_USER_INFO,
  CREATE_ACCOUNT,
  SET_CREATER_LIST,
} from 'actions/actionTypes'

const initialState = {
  userInfo: null,
  createAccountInfo: {},
  createrList: [],
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CREATER_LIST:
      return {
        ...state,
        createrList: action.payload.createrList,
      }
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload.userInfo,
      }
    case RESET_USER_INFO:
      return {
        ...state,
        userInfo: null,
      }
    case CREATE_ACCOUNT:
      return {
        ...state,
        createAccountInfo: {...state.createAccountInfo, ...action.payload.data}
      }
    default:
      return state
  }
}

export default userReducer
