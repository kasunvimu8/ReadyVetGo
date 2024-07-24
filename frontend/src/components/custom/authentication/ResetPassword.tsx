import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { resetPassword } from "@/api/authentication.ts"

const ResetPasswordPage = () => {
  const { resetPasswordToken } = useParams<{ resetPasswordToken: string }>()
  const navigate = useNavigate()

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(/.*[a-z].*/, {
          message: "Password must contain at least one lowercase letter.",
        })
        .regex(/.*\d.*/, {
          message: "Password must contain at least one digit.",
        })
        .regex(/.*[A-Z].*/, {
          message: "Password must contain at least one uppercase letter.",
        })
        .regex(/.*[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]+.*/, {
          message:
            "Password must contain at least one special character such as !@#$%^&*.",
        }),
      confirmnewpassword: z.string(),
    })
    .refine((data) => data.password === data.confirmnewpassword, {
      message: "Passwords do not match",
      path: ["confirmnewpassword"],
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmnewpassword: "",
    },
  })

  const handleResetPassword = async (values: z.infer<typeof formSchema>) => {
    try {
      if (resetPasswordToken) {
        await resetPassword(resetPasswordToken, values.password)
        navigate("/")
      } else {
        console.error("Reset password token is undefined.")
      }
    } catch (error) {
      console.error("Error resetting password:", error)
    }
  }

  return (
    <div className="flex justify-center items-center mt-36">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleResetPassword)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmnewpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button type="submit">Reset Password</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswordPage
