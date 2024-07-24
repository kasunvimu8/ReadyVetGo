import { createSlice } from "@reduxjs/toolkit";

interface OnlineStatusState {
  isOnline: boolean;
}

const initialState: OnlineStatusState = {
  isOnline: false,
};

const onlineStatusSlice = createSlice({
  name: "onlineStatus",
  initialState,
  reducers: {
    setOnline(state) {
      state.isOnline = true;
    },
    setOffline(state) {
      state.isOnline = false;
    },
  },
});

export const { setOnline, setOffline } = onlineStatusSlice.actions;
export default onlineStatusSlice.reducer;