// src/store/knowledgebaseSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Knowledgebase {
  id: string;
  name: string;
  description: string;
  dateCreated: string;
  documentCount: number;
}

interface KnowledgebaseState {
  repositories: Knowledgebase[];
}

const initialState: KnowledgebaseState = {
  repositories: [],
};

const knowledgebaseSlice = createSlice({
  name: "knowledgebase",
  initialState,
  reducers: {
    addKnowledgebase: (state, action: PayloadAction<Knowledgebase>) => {
      state.repositories.push(action.payload);
    },
    // Add other reducers as needed
  },
});

export const { addKnowledgebase } = knowledgebaseSlice.actions;
export default knowledgebaseSlice.reducer;
