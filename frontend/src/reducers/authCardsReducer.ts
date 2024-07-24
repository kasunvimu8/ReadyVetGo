import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AuthCardsState, AuthPage, RegistrationType } from "@/types/authentication.ts";

const initialState: AuthCardsState = {
  authPage: undefined,
  registrationType: undefined,
}

const authCardsSlice = createSlice({
  name: "authCardsState",
  initialState,
  reducers: {
    setAuthPage: (state, action: PayloadAction<AuthPage>) => {
      if (action.payload === AuthPage.REGISTER && !state.registrationType) {
        state.authPage = AuthPage.SELECT_REGISTRATION_TYPE
      } else {
        state.authPage = action.payload
      }
    },
    setRegistrationType: (state, action: PayloadAction<RegistrationType | undefined>) => {
      state.registrationType = action.payload
    }
  },
})

export const {setRegistrationType, setAuthPage} = authCardsSlice.actions
export default authCardsSlice.reducer
