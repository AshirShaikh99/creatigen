import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  reaction?: "thumbsUp" | "thumbsDown" | null; // Add the reaction field here
  isComplete?: boolean; // Mark if the message is complete
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
      state.messages.push(action.payload);
    },

    // Action to set a reaction on a message
    setReaction: (
      state,
      action: PayloadAction<{
        messageId: number;
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
