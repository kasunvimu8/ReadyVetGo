import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import FormCard from "@/components/custom/authentication/FormCard"
import { CardDescription } from "@/components/ui/card"
import { AuthPage } from "@/types/authentication"
import { setAuthPage } from "@/reducers/authCardsReducer"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { sendResetPasswordEmail } from "@/api/authentication"
import { closeSheet } from "@/types/sheetAction"
import { useState } from "react"

const ForgotPasswordSheet = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)

  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const handleSendResetPasswordEmail = async (
    values: z.infer<typeof formSchema>
  ) => {
    setLoading(true)
    try {
      await sendResetPasswordEmail({ email: values.email })
      dispatch(closeSheet())
    } catch (error) {
      console.error("Unexpected error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoToLogin = () => {
    dispatch(setAuthPage(AuthPage.LOGIN))
  }

  return (
    <FormCard
      form={form}
      onSubmit={handleSendResetPasswordEmail}
      title="Reset Password"
      description="Please enter your email address"
      fields={[
        {
          name: "email",
          label: "Email",
          autoComplete: "email",
          id: "email_forgot_password",
          ariaRequired: true,
        },
      ]}
      footer={
        <CardDescription className="text-right pt-2">
          Remember your password? {""}
          <a href="#" className="underline" onClick={handleGoToLogin}>
            Login now
          </a>
        </CardDescription>
      }
      isLoading={loading}
    />
  )
}

export default ForgotPasswordSheet
