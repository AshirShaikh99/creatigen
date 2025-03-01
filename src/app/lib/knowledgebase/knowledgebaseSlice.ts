import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Knowledgebase {
  id: string;
  name: string;
  description: string;
  dateCreated: string;
  documentCount: number;
  collection_name: string;
  uuid: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface KnowledgebaseState {
  repositories: Knowledgebase[]; // Changed from 'knowledgebases' to 'repositories'
}

const initialState: KnowledgebaseState = {
  repositories: [], // Changed from 'knowledgebases' to 'repositories'
};

const knowledgebaseSlice = createSlice({
  name: "knowledgebase",
  initialState,
  reducers: {
    addKnowledgebase: (state, action: PayloadAction<Knowledgebase>) => {
      state.repositories.push(action.payload); // Changed from 'knowledgebases' to 'repositories'
    },
  },
});

export const { addKnowledgebase } = knowledgebaseSlice.actions;
export default knowledgebaseSlice.reducer;
