import { JSX, useEffect, useState } from "react"
import { verifyEmail } from "@/api/authentication.ts"
import { Link, useParams } from "react-router-dom"
import Loading from "@/components/shared/Loading.tsx"
import { LuMailCheck, LuMailX } from "react-icons/lu"
import { Button } from "@/components/ui/button.tsx"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store.ts"
import { setEmailVerified } from "@/reducers/authenticationReducer.ts"

const VerifyEmail = () => {
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()

  const [validationSuccess, setValidationSuccess] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>(
    "Validation failed..."
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const challenge = params.emailChallenge
    if (!challenge) {
      setIsLoading(false)
      return
    }

    const handleError = {
      409: () => {
        // Conflict error
        setErrorMessage("Email is already validated!")
      },
      404: () => {
        // Not found error
        setErrorMessage("No account found to validate...")
      },
    }
    verifyEmail(challenge, handleError)
      .then(() => {
        setValidationSuccess(true)
        dispatch(setEmailVerified(true))
      })
      .catch(() => {}) // We already handled the errors above, this is just to avoid the uncaught in promise error from Axios
      .finally(() => setIsLoading(false))
  }, [params.emailChallenge])

  if (isLoading) {
    return (
      <div className="mt-8">
        <Loading className="text-4xl" />
      </div>
    )
  }
  let validationSuccessContent: JSX.Element
  if (validationSuccess) {
    validationSuccessContent = (
      <>
        <LuMailCheck className="text-[10rem]" />

        <p className="font-light text-4xl pt-8 text-green-500">Success</p>

        <p className="text-xl pt-2">Email validation successful</p>
      </>
    )
  } else {
    validationSuccessContent = (
      <>
        <LuMailX className="text-[10rem]" />
        <p className="font-light text-4xl pt-8 text-destructive">
          Failed to validate email
        </p>

        <p className="text-xl pt-2">{errorMessage}</p>
      </>
    )
  }

  return (
    <div className="flex flex-col items-center h-full justify-center pb-32">
      {validationSuccessContent}

      <Link to="/">
        <Button className="mt-8">Go back to Home Page</Button>
      </Link>
    </div>
  )
}

export default VerifyEmail
