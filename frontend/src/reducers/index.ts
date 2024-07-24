import { combineReducers } from "@reduxjs/toolkit"
import sheetReducer from "@/reducers/sheetReducer.ts"
import authenticationReducer from "@/reducers/authenticationReducer.ts"
import authCardsReducer from "@/reducers/authCardsReducer.ts"
import onlineStatusReducer from "@/reducers/onlineStatusReducer.ts"

const rootReducer = combineReducers({
  sheet: sheetReducer,
  authentication: authenticationReducer,
  authCards: authCardsReducer,
  onlineStatus: onlineStatusReducer,
})

export default rootReducer
