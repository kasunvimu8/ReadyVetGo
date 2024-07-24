import React, { useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import SelectRegistrationTypeCard from "@/components/custom/authentication/registration/SelectRegistrationType";
import RegisterCard from "@/components/custom/authentication/registration/RegisterForm";
import UploadDocuments from "@/components/custom/authentication/registration/UploadDocuments";
import './RegisterSheet.css';
import LogInSheet from "@/components/custom/authentication/Login";
import ForgotPasswordSheet from "@/components/custom/authentication/ForgotPassword";
import { AuthCardsState, AuthPage } from "@/types/authentication";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store.ts";
import { setAuthPage, setRegistrationType } from "@/reducers/authCardsReducer.ts";

// Create refs for each page
// Encountered Warning: findDOMNode is deprecated in StrictMode.
// use refs to ensure CSSTransition is using ref instead of findDOMNode
// see: https://github.com/reactjs/react-transition-group/issues/668
const nodeRefs: Record<AuthPage, React.RefObject<HTMLDivElement>> = {
  [AuthPage.LOGIN]: React.createRef(),
  [AuthPage.SELECT_REGISTRATION_TYPE]: React.createRef(),
  [AuthPage.REGISTER]: React.createRef(),
  [AuthPage.UPLOAD_DOCUMENTS]: React.createRef(),
  [AuthPage.FORGOTPASSWORD]: React.createRef(),
};


const AuthenticationSheet: React.FC<AuthCardsState> = ({
                                                         authPage = AuthPage.LOGIN,
                                                         registrationType = undefined
                                                       }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setRegistrationType(registrationType));
    dispatch(setAuthPage(authPage));
  }, [dispatch, authPage, registrationType]);

  const { authPage: currentAuthPage } = useSelector((state: RootState) => state.authCards);


  const pages = {
    [AuthPage.LOGIN]: <LogInSheet key="LogInSheet"/>,
    [AuthPage.SELECT_REGISTRATION_TYPE]: <SelectRegistrationTypeCard key="SelectRegistrationTypeCard"/>,
    [AuthPage.REGISTER]: <RegisterCard key="RegisterCard"/>,
    [AuthPage.UPLOAD_DOCUMENTS]: <UploadDocuments key="UploadDocuments"/>,
    [AuthPage.FORGOTPASSWORD]: <ForgotPasswordSheet key="ForgotPasswordSheet"/>
  };

  if (!currentAuthPage) return null; // this should never happen because of the useEffect above

  return (
      <div className="h-full w-full absolute p-4 flex items-center justify-center">
        <img src="Logo.png" alt="ReadyVetGo Logo" className="h-10 mr-4 absolute top-4 left-4 block sm:hidden"/>
        <div className="h-full w-full relative">
          <TransitionGroup>
            <CSSTransition
              key={currentAuthPage}
              nodeRef={nodeRefs[currentAuthPage]}
              timeout={300}
              classNames="fade"
            >
              <div ref={nodeRefs[currentAuthPage]} className="w-full h-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4">
                {pages[currentAuthPage]}
              </div>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
  );
};

export default AuthenticationSheet;
