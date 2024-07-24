import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "@/components/custom/chat/ChatContext.tsx";
import { getAnswerSuggestions } from "@/api/aiAssistant.ts";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store.ts";

interface AiAnswerSuggestionProps {
  onSuggestion: () => void;
}

const AiAnswerSuggestion: React.FC<AiAnswerSuggestionProps> = (
  { onSuggestion }
) => {

  const {CurrentChat, sendMessage} = useContext(ChatContext);

  const {user} = useSelector((state: RootState) => state.authentication)

  // dynamic suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const messages = CurrentChat?.chatMessages;
  // when the messages change, get new suggestions
  useEffect(() => {
    if (!CurrentChat || !messages) {
      return;
    }
    if (messages[messages.length - 1]?.sendBy !== user?.id) {
      getAnswerSuggestions(CurrentChat.id)
        .then((suggestions) => {
          setSuggestions(suggestions);
          // Having some trouble with this because the page needs to be updated before scrolling to the bottom.
          // So for now, just sleep for 0.05 seconds. // TODO fix this
          setTimeout(() => {
            onSuggestion();
          }, 50);
        });
    } else {
      setSuggestions([]);
    }
  }, [messages]);

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2 pb-2">
        {suggestions.map((suggestion) => (
          // make the button can be multiple lines and is a outline button
          <button className="text-left border border-gray-300 p-2 rounded-lg"
                  // ensure a unique key for each suggestion
                  key={suggestion}
                  onClick={() => {
                    setSuggestions([]);
                    sendMessage(suggestion);
                  }}>{suggestion}</button>
        ))}
      </div>
    </>
  );
}

export default AiAnswerSuggestion;
