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
  ongoingMessage: Partial<Message> | null; // For accumulating chunks
}

const initialState: ChatState = {
  messages: [],
  ongoingMessage: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChat: (state) => {
      state.messages = [];
      state.ongoingMessage = null; // Reset ongoing message
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
  },
});

export const { resetChat, addMessage, setReaction } = chatSlice.actions;
export default chatSlice.reducer;
