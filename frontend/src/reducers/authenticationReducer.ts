import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { isUser, User } from "@/types/user"
import { getCurrentUser } from "@/api/user"
import { getUserProfile } from "@/api/profile.ts"
import { Profile } from "@/types/profile.ts"

interface AuthState {
  user: User | null
  profile: Profile | null
  authUserLoadedStatus: boolean
}

const initialState: AuthState = {
  user: null,
  profile: null,
  authUserLoadedStatus: false,
}

export const fetchCurrentUser = createAsyncThunk(
  "authentication/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getCurrentUser()
      if (isUser(user)) {
        return user as User
      } else {
        return rejectWithValue("Invalid user")
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchCurrentUserProfile = createAsyncThunk(
  "profile/fetchCurrentUserProfile",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { authentication: AuthState }
    const { user } = state.authentication

    if (!user) {
      return rejectWithValue("User must be logged in to load profile")
    }

    try {
      const profile = await getUserProfile()
      if (profile) {
        return profile as Profile
      } else {
        return rejectWithValue("Profile not found")
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

const userSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setCurrentUser: (state: AuthState, action: PayloadAction<User>): void => {
      state.user = action.payload
    },
    setCurrentProfile: (
      state: AuthState,
      action: PayloadAction<Profile>
    ): void => {
      state.profile = action.payload
    },
    setAuthUserLoadingStatus: (
      state: AuthState,
      action: PayloadAction<boolean>
    ): void => {
      state.authUserLoadedStatus = action.payload
    },
    clearCurrentUser: (state: AuthState): void => {
      state.user = null
    },
    clearCurrentProfile: (state: AuthState): void => {
      state.profile = null
    },
    setEmailVerified: (state: AuthState, action: PayloadAction<boolean>) => {
      if (!state.user) return

      state.user.isEmailVerified = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.authUserLoadedStatus = false
      })
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload
          state.authUserLoadedStatus = true
        }
      )
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.authUserLoadedStatus = false
        console.error("Failed to fetch user:", action.payload)
      })
      .addCase(
        fetchCurrentUserProfile.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.profile = action.payload
        }
      )
      .addCase(fetchCurrentUserProfile.rejected, (_, action) => {
        console.error("Failed to load user profile:", action.payload)
      })
  },
})

export const {
  setCurrentUser,
  setAuthUserLoadingStatus,
  clearCurrentUser,
  clearCurrentProfile,
  setEmailVerified,
  setCurrentProfile,
} = userSlice.actions

export default userSlice.reducer
