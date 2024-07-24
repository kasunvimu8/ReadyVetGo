import { GET, POST } from "@/lib/http.ts"
import {
  EmailVerificationResponse,
  LoginUser,
  RegisterUser,
} from "@/types/authentication.ts"
import { User } from "@/types/user.ts"
import axios, { AxiosError } from "axios"

export const register = async (userInfo: RegisterUser) =>
  POST<User, RegisterUser>("/auth/register", userInfo)

export const login = async (userInfo: LoginUser) => {
  if (window.location.href.startsWith("http://localhost:3000")) {
    // Used for file service, or other services that use a shared state on the deployed dev stage
    void axios.post("https://api.dev.readyvetgo.de/auth/login", userInfo, {
      baseURL: "https://api.dev.readyvetgo.de",
      withCredentials: true,
    })
  }
  return POST<User, LoginUser>("/auth/login", userInfo)
}

export const logout = async () => {
  if (window.location.href.startsWith("http://localhost:3000")) {
    // Used for file service, or other services that use a shared state on the deployed dev stage
    void axios.post("https://api.dev.readyvetgo.de/auth/logout", {
      baseURL: "https://api.dev.readyvetgo.de",
      withCredentials: true,
    })
  }

  POST<string, object>("/auth/logout", {})
}

export const verifyEmail = async (
  challenge: string,
  expectedHTTPErrors?: Record<number, (err: AxiosError) => void>
) =>
  POST<EmailVerificationResponse, undefined>(
    `/auth/verify-email/${challenge}`,
    undefined,
    undefined,
    expectedHTTPErrors
  )

export const resendVerificationEmail = async () =>
  GET<string>("/auth/resend-verify-email")

export const sendResetPasswordEmail = async (data: { email: string }) =>
  POST<string, { email: string }>("/auth/send-reset-password-email", data)

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await POST<{ message: string }, { password: string }>(
      `/auth/reset-password/${token}`,
      { password }
    )
    return response
  } catch (error) {
    throw new Error("Failed to reset password")
  }
}
