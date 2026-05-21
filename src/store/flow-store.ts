import { create } from "zustand";

type FlowState = {
  email: string;
  setEmail: (email: string) => void;
};

export const useFlowStore = create<FlowState>((set) => ({
  email: "",
  setEmail: (email) => set({ email }),
}));
