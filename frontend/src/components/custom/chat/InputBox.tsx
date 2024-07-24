import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatContext } from "./ChatContext";
import { Input } from "@/components/ui/input";
import { MdSend } from "react-icons/md";

/// Input text field with send button
function InputBox() {
  const [message, setMessage] = useState('');
  const { sendMessage, CurrentChat } = useContext(ChatContext);

  // checks if the message is not empty
  const isValidMessage = () => {
    return message.trim() !== '';
  };

  // sends the message and clears the input field
  const handleSend = () => {
    if (isValidMessage()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex items-center p-2">
      <Input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        placeholder="Type a message..."
        disabled={CurrentChat?.chatStatus === "CLOSED"}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
      />
      <div className="w-2" />
      <Button onClick={handleSend} disabled={!isValidMessage()}><MdSend /></Button>
    </div>
  );
}

export default InputBox;
