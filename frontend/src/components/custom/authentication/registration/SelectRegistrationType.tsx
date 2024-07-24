import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthPage, RegistrationType } from "@/types/authentication"
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store.ts";
import { setAuthPage, setRegistrationType } from "@/reducers/authCardsReducer.ts";



const SelectRegistrationTypeCard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleGoToLogIn = () => {
    dispatch(setAuthPage(AuthPage.LOGIN));
  }

  const handleRegisterAsClient = () => {
    dispatch(setRegistrationType(RegistrationType.CLIENT));
    dispatch(setAuthPage(AuthPage.REGISTER));
  }

  const handleRegisterAsVeterinarian = () => {
    dispatch(setRegistrationType(RegistrationType.VETERINARIAN));
    dispatch(setAuthPage(AuthPage.REGISTER));
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription className="text-center">Which kind of profile do you want to create?</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={handleRegisterAsClient}>
          Register as Farmer
        </Button>
      </CardContent>
      <CardContent>
        <Button className="w-full" onClick={handleRegisterAsVeterinarian}>
          Register as Veterinarian
        </Button>
        <CardDescription className="text-right pt-2">
          Have an account?
          <a href="#" className="underline" onClick={handleGoToLogIn}>
            Login now
          </a>
        </CardDescription>
      </CardContent>
    </Card>
  )

}

export default SelectRegistrationTypeCard