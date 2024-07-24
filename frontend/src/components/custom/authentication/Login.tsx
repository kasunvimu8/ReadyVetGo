import { CardDescription } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import FormCard from "@/components/custom/authentication/FormCard"
import { useState } from "react"
import { AuthPage, LoginUser } from "@/types/authentication"
import { login } from "@/api/authentication.ts"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store.ts"
import {
  fetchCurrentUserProfile,
  setAuthUserLoadingStatus,
  setCurrentUser,
} from "@/reducers/authenticationReducer.ts"
import { closeSheet } from "@/types/sheetAction.ts"
import { AxiosError } from "axios"
import { setAuthPage } from "@/reducers/authCardsReducer.ts"

const LogInSheet = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)

  const loginAuthentication = async (newUser: LoginUser): Promise<void> => {
    try {
      const user = await login(newUser)
      dispatch(setCurrentUser(user))
      dispatch(setAuthUserLoadingStatus(true))
      dispatch(closeSheet())
      dispatch(fetchCurrentUserProfile())
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          form.setError("email", {
            type: "manual",
            message: "User not found - click on Register now",
          })
        } else if (error.response?.status === 401) {
          form.setError("password", {
            type: "manual",
            message: "Invalid password",
          })
        } else {
          throw error
        }
      } else {
        throw error
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    const currentUser: LoginUser = {
      email: values.email,
      password: values.password,
    }
    loginAuthentication(currentUser)
  }

  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleGoToRegistration = () => {
    dispatch(setAuthPage(AuthPage.SELECT_REGISTRATION_TYPE))
  }

  const handlePasswordForgot = () => {
    dispatch(setAuthPage(AuthPage.FORGOTPASSWORD))
  }

  return (
    <>
      <FormCard
        form={form}
        onSubmit={handleLogin}
        title="Log In"
        description="Welcome Back! Please enter your credentials"
        fields={[
          {
            name: "email",
            label: "Email",
            autoComplete: "email",
            id: "email_login",
            ariaRequired: true,
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            autoComplete: "current-password",
            id: "password_login",
            ariaRequired: true,
            fieldFooter: (
              <CardDescription className="text-right">
                <a
                  href="#"
                  className="underline"
                  onClick={handlePasswordForgot}
                >
                  Forgot Password?
                </a>
              </CardDescription>
            ),
          },
        ]}
        footer={
          <CardDescription className="text-right pt-2">
            Don't have an account yet? {""}
            <a href="#" className="underline" onClick={handleGoToRegistration}>
              Register now
            </a>
          </CardDescription>
        }
        isLoading={loading}
      />
    </>
  )
}

export default LogInSheet
