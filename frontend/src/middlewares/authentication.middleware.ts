import { RootState } from "@/lib/store"
import { Middleware } from "@reduxjs/toolkit"
import {
  setCurrentUser,
  clearCurrentUser,
  fetchCurrentUser,
} from "@/reducers/authenticationReducer"
import { disconnectSocket, initializeSocket } from "@/api/socket.ts"

/**
 * Middleware to handle authentication actions like connecting and disconnecting the socket when the user logs in or out
 * @param store The redux store
 */
const authMiddleware: Middleware<any, RootState> =
  (store) => (next) => (action) => {
    const result = next(action)

    if (
      setCurrentUser.match(action) ||
      clearCurrentUser.match(action) ||
      fetchCurrentUser.fulfilled.match(action) ||
      fetchCurrentUser.rejected.match(action)
    ) {
      const state = store.getState()
      const currentUser = state.authentication.user

      if (
        setCurrentUser.match(action) ||
        fetchCurrentUser.fulfilled.match(action)
      ) {
        // the current user is set
        initializeSocket()
        console.log(`User ${currentUser?.email} connected to the socket`)
      } else if (
        clearCurrentUser.match(action) ||
        fetchCurrentUser.rejected.match(action)
      ) {
        // the current user is cleared
        disconnectSocket()
      }
    }

    return result
  }

export default authMiddleware
