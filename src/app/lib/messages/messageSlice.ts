import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  type?: "text" | "diagram";
  diagramData?: string;
  reaction?: "thumbsUp" | "thumbsDown" | null;
  isComplete?: boolean;
}

interface ChatState {
  messages: Message[];
  isDeepSearch: boolean;
}

const initialState: ChatState = {
  messages: [],
  isDeepSearch: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChat: (state) => {
      state.messages = [];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = {
        ...action.payload,
        type: action.payload.type || "text",
      };
      state.messages.push(message);
    },

    // Action to set a reaction on a message
    setReaction: (
      state,
      action: PayloadAction<{
        messageId: string;
        reaction: "thumbsUp" | "thumbsDown" | null;
      }>
    ) => {
      const { messageId, reaction } = action.payload;
      const message = state.messages.find((msg) => msg.id === messageId);
      if (message) {
        message.reaction = reaction; // Set the reaction
      }
    },
    setDeepSearch: (state, action: PayloadAction<boolean>) => {
      state.isDeepSearch = action.payload;
    },
  },
});

export const { addMessage, resetChat, setDeepSearch } = chatSlice.actions;
export default chatSlice.reducer;
