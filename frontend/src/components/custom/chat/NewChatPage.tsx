import Loading from "@/components/shared/Loading.tsx";
import { createNewChat } from "@/api/chat.ts";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";

/**
 * This component is responsible for creating a new chat and redirecting the user to the chat page.
 */
const NewChatPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Function to create a new chat and handle navigation and errors
    const initiateChat = async () => {
      try {
        const chatId = await createNewChat();
        navigate(`/chat/${chatId}`);
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
      }
    };

    initiateChat();
  }, [navigate]);

  const getErrorMessage = (err: any): string => {
    if (err.response && err.response.data && err.response.data.message) {
      return err.response.data.message;
    }
    if (err.message) {
      return err.message;
    }
    return "An unknown error occurred.";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="flex flex-col items-center space-y-6">
        <Loading />
        {error && (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-red-700">Error: {error}</p>
            <Button
              onClick={() => navigate("/")}>
              Go back to home page
            </Button>
          </div>
        )}
        {!error && (
          <h1>
            Loading chat page. You will be redirected to the chat page any moment now.
          </h1>
        )}
      </div>
    </div>
  );
};

export default NewChatPage;
