import AuthenticationSheet from "@/components/custom/authentication/AuthenticationSheet"
import { AuthPage, RegistrationType } from "@/types/authentication.ts";


/**
 * to display the sheet component, you need to add the content here.
 * and call the openSheet action with the key of the content.
 * Directly passing the payload to the openSheet action is not possible do the Redux limitation of only passing serializable data.
 */
const SheetContents: Record<string, React.ReactNode> = {
  empty: <div></div>,
  login: <AuthenticationSheet  authPage={AuthPage.LOGIN}/>,
  register: <AuthenticationSheet  authPage={AuthPage.SELECT_REGISTRATION_TYPE}/>,
  registerAsClient: <AuthenticationSheet  authPage={AuthPage.REGISTER} registrationType={RegistrationType.CLIENT}/>,
  registerAsVeterinarian: <AuthenticationSheet  authPage={AuthPage.REGISTER} registrationType={RegistrationType.VETERINARIAN}/>,
  // Add more contents as needed
};

export default SheetContents;