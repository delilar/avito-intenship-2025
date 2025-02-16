import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../types';

interface DraftState {
  currentDraft: Partial<Item> | null;
  step: number;
}

const DRAFT_STORAGE_KEY = 'itemFormDraft';

const loadDraftFromStorage = (): DraftState => {
  try {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      return JSON.parse(savedDraft);
    }
  } catch (error) {
    console.error('Error loading draft:', error);
  }
  return { currentDraft: null, step: 0 };
};

const initialState: DraftState = loadDraftFromStorage();

const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {
    saveDraft: (state, action: PayloadAction<Partial<Item>>) => {
      state.currentDraft = { ...state.currentDraft, ...action.payload };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state));
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state));
    },
    clearDraft: (state) => {
      state.currentDraft = null;
      state.step = 0;
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    },
  },
});

export const { saveDraft, setStep, clearDraft } = draftSlice.actions;
export default draftSlice.reducer;