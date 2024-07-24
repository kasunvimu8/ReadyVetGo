import { CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input.tsx"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import FormCard from "@/components/custom/authentication/FormCard"
import { useState } from "react"
import {
  AuthPage,
  RegisterUser,
  RegistrationType,
  registrationTypeToUserRole,
} from "@/types/authentication"
import { register } from "@/api/authentication.ts"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store.ts"
import {
  fetchCurrentUserProfile,
  setAuthUserLoadingStatus,
  setCurrentUser,
} from "@/reducers/authenticationReducer.ts"
import { closeSheet } from "@/types/sheetAction.ts"
import { AxiosError } from "axios"
import {
  setAuthPage,
  setRegistrationType,
} from "@/reducers/authCardsReducer.ts"
import { useNavigate } from "react-router-dom"
import { Checkbox } from "@/components/ui/checkbox.tsx"

const RegisterCard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { registrationType } = useSelector(
    (state: RootState) => state.authCards
  )
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Add a function to handle the click event
  const handleRegistration = (values: z.infer<typeof formSchema>) => {
    if (!registrationType)
      return dispatch(setAuthPage(AuthPage.SELECT_REGISTRATION_TYPE))
    const newUser: RegisterUser = {
      email: values.email,
      role: registrationTypeToUserRole(registrationType),
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
    }
    setLoading(true)
    void registration(newUser)
  }

  const registration = async (newUser: RegisterUser): Promise<void> => {
    try {
      const user = await register(newUser)
      dispatch(setCurrentUser(user))
      dispatch(setAuthUserLoadingStatus(true))
      dispatch(fetchCurrentUserProfile())
      if (registrationType === RegistrationType.VETERINARIAN) {
        dispatch(setAuthPage(AuthPage.UPLOAD_DOCUMENTS))
      }
      if (registrationType === RegistrationType.CLIENT) {
        navigate("/profile")
        dispatch(closeSheet())
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          form.setError("email", {
            type: "manual",
            message: "User already exists",
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

  const formSchema = z.object({
    firstName: z.string().min(2, {
      message: "First Name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(/.*[a-z].*/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/.*\d.*/, {
        message: "Password must contain at least one digit.",
      })
      .regex(/.*[A-Z].*/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+.*/, {
        message: "Password must contain at least one special character.",
      }),
    terms: z.boolean().refine((value) => value, {
      message: "Please accept the terms and conditions.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      terms: false,
    },
  })

  const handleSwitchRegistrationType = () => {
    if (registrationType === RegistrationType.VETERINARIAN) {
      dispatch(setRegistrationType(RegistrationType.CLIENT))
    } else {
      dispatch(setRegistrationType(RegistrationType.VETERINARIAN))
    }
  }

  const submitButtonText = `Register as ${
    registrationType === RegistrationType.VETERINARIAN
      ? "Veterinarian"
      : "Farmer"
  }`

  const switchRegistrationTypeText1 = `You are a ${
    registrationType === RegistrationType.VETERINARIAN
      ? "Farmer"
      : "Veterinarian"
  }?`
  const switchRegistrationTypeText2 = `Register as ${
    registrationType === RegistrationType.VETERINARIAN
      ? "Farmer"
      : "Veterinarian"
  }`

  return (
    <>
      <FormCard
        form={form}
        onSubmit={handleRegistration}
        title="Register"
        description="Please enter your details for the Registration"
        header={
          <CardContent key="header">
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        id="firstName"
                        autoComplete="given-name"
                        {...field}
                        aria-required="true"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        id="lastName"
                        autoComplete="family-name"
                        {...field}
                        aria-required="true"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        }
        fields={[
          {
            name: "email",
            label: "Email",
            autoComplete: "email",
            id: "email",
            ariaRequired: true,
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            autoComplete: "new-password",
            id: "password",
            ariaRequired: true,
            fieldFooter: (
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2 rounded-md border p-4">
                    <div className="flex flex-row items-start space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none text-sm">
                        Accept&nbsp;
                        <a
                          href="/blog/terms-and-conditions"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "underline" }}
                        >
                          terms and conditions
                        </a>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ),
          },
        ]}
        submitButtonText={submitButtonText}
        footer={
          <CardDescription className="text-right pt-2">
            {switchRegistrationTypeText1}
            <a
              href="#"
              className="underline"
              onClick={handleSwitchRegistrationType}
            >
              {switchRegistrationTypeText2}
            </a>
          </CardDescription>
        }
        isLoading={loading}
      />
    </>
  )
}

export default RegisterCard
