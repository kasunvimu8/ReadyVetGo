import { Routes, Route } from "react-router-dom"
import HomePage from "@/components/custom/home/HomePage"
import CmsEditor from "@/components/custom/cms/components/cms-editor/CmsEditor.tsx"
import VerifyVet from "@/components/custom/verify-vet/VerifyVet"
import Chat from "@/components/custom/chat/Chat"
import CmsDisplayPage from "@/components/custom/cms/components/cms-display-page/CmsDisplayPage.tsx"
import ChatOverview from "@/components/custom/chat-list/ChatOverview"
import ApproveBlogpost from "@/components/custom/cms/components/approve-blogpost/ApproveBlogpost"
import SubscriptionOverview from "@/components/custom/subscriptions/SubscriptionOverview"
import CmsOverview from "@/components/custom/cms/components/cms-overview/CmsOverview.tsx"
import ProfilePage from "@/components/custom/profile-page/ProfilePage"
import VerifyEmail from "@/components/custom/authentication/VerifyEmail.tsx"
import MedicalRecordCreate from "@/components/custom/medical-record/MedicalRecordCreate"
import MedicalRecords from "@/components/custom/medical-record/MedicalRecords"
import MedicalRecordView from "@/components/custom/medical-record/MedicalRecordView"
import ResetPassword from "@/components/custom/authentication/ResetPassword"
import NewChatPage from "@/components/custom/chat/NewChatPage.tsx"
import ChatHistory from "@/components/custom/chat-list/ChatHistory.tsx"
import { NotFound } from "@/components/shared/NotFound.tsx"
import { Unauthorized } from "@/components/shared/UnAuthorized"
import ProtectedRoute from "@/components/shared/ProtectedRoute"
import { FARMER, VET } from "@/constants"
import PayedRoute from "@/components/shared/PayedRoute"
import AllSubscriptions from "@/components/custom/subscriptions/all-subscriptions/AllSubscriptions"
import VerifiedRoute from "@/components/shared/VerifiedRoute.tsx";

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Admin Verification Routes */}
      <Route
        path="/verify-vet"
        element={
          <ProtectedRoute roles={[]}>
            <VerifyVet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/approve-blogpost"
        element={
          <ProtectedRoute roles={[]}>
            <ApproveBlogpost />
          </ProtectedRoute>
        }
      />

      {/* CMS Routes */}
      <Route path="/blog/:cmsUrl" element={<CmsDisplayPage />} />
      <Route
        path="/cms-editor/overview"
        element={
          <ProtectedRoute roles={[VET]}>
            <CmsOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cms-editor/:id"
        element={
          <ProtectedRoute roles={[VET]}>
            <CmsEditor />
          </ProtectedRoute>
        }
      />

      {/* Subscription Routes */}
      <Route path="/subscriptions" element={<SubscriptionOverview />} />
      <Route
        path="/allSubscriptions"
        element={
          <ProtectedRoute roles={[]}>
            <AllSubscriptions />
          </ProtectedRoute>
        }
      />

      {/* User/Profile Routes */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/verify-email/:emailChallenge" element={<VerifyEmail />} />

      {/* Medical Records Routes */}
      <Route
        path="/reset-password/:resetPasswordToken"
        element={<ResetPassword />}
      />
      <Route
        path="/medical-records/create/:chatId"
        element={
          <ProtectedRoute roles={[VET]}>
            <MedicalRecordCreate />
          </ProtectedRoute>
        }
      />
      <Route path="/medical-records" element={<MedicalRecords />} />
      <Route
        path="/medical-records/:recordId"
        element={<MedicalRecordView />}
      />

      {/* Chats Routes */}
      <Route path="/chat/:chatID?" element={<Chat />} />
      <Route
        path="/chat-overview"
        element={
          <ProtectedRoute roles={[VET]}>
            <VerifiedRoute>
              <ChatOverview />
            </VerifiedRoute>
          </ProtectedRoute>
        }
      />
      <Route path="/chat-history" element={<ChatHistory />} />
      <Route
        path="/new-chat"
        element={
          <ProtectedRoute roles={[FARMER]}>
            <PayedRoute>
              <NewChatPage />
            </PayedRoute>
          </ProtectedRoute>
        }
      />

      {/* Other Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default RoutesComponent
